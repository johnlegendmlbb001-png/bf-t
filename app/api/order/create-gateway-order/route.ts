import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import PricingConfig from "@/models/PricingConfig";
import crypto from "crypto";

/* =====================================================
   TYPES
===================================================== */

type MembershipConfig = {
  items: Record<string, number>;
};

type OTTConfig = Record<string, number>;

/* =====================================================
   STATIC PRICING (SERVER TRUSTED)
===================================================== */

const MEMBERSHIPS: Record<string, MembershipConfig> = {
  "silver-membership": {
    items: {
      "silver-1m": 99,
      "silver-3m": 299,
    },
  },
  "reseller-membership": {
    items: {
      "reseller-1m": 199,
      "reseller-3m": 699,
    },
  },
};

const OTTS: Record<string, OTTConfig> = {
  "youtube-premium": {
    "yt-1m": 129,
    "yt-3m": 349,
  },
  netflix: {
    "nf-1m": 199,
    "nf-3m": 549,
  },
  instagram: {
    "ig-1k": 299,
    "ig-5k": 1299,
  },
};

/* =====================================================
   PRICE RESOLVER (CRITICAL SECURITY)
===================================================== */

async function resolvePrice(
  gameSlug: string,
  itemSlug: string,
  userType: string
): Promise<number> {
  // 1️⃣ MEMBERSHIPS
  if (MEMBERSHIPS[gameSlug]) {
    const price = MEMBERSHIPS[gameSlug].items[itemSlug];
    if (!price) throw new Error("Invalid membership item");
    return price;
  }

  // 2️⃣ OTTS
  if (OTTS[gameSlug]) {
    const price = OTTS[gameSlug][itemSlug];
    if (!price) throw new Error("Invalid OTT item");
    return price;
  }

  // 3️⃣ GAMES (API + PRICING CONFIG)
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/game/${gameSlug}`,
    {
      headers: {
        "x-api-key": process.env.API_SECRET_KEY!,
      },
    }
  );

  const data = await resp.json();
  if (!data?.data?.itemId) throw new Error("Game not found");

  const baseItem = data.data.itemId.find(
    (i: any) => i.itemSlug === itemSlug
  );

  if (!baseItem) throw new Error("Invalid game item");

  let price = Number(baseItem.sellingPrice);

  await connectDB();

  if (userType !== "owner") {
    const pricingConfig = await PricingConfig.findOne({ userType }).lean();

    if (pricingConfig) {
      const fixed = pricingConfig.overrides?.find(
        (o: any) =>
          o.gameSlug === gameSlug && o.itemSlug === itemSlug
      );

      if (fixed?.fixedPrice != null) {
        price = Number(fixed.fixedPrice);
      } else if (pricingConfig.slabs?.length) {
        const slab = pricingConfig.slabs.find(
          (s: any) => price >= s.min && price < s.max
        );
        if (slab) {
          price = price * (1 + slab.percent / 100);
        }
      }
    }
  }

  return Math.ceil(price);
}

/* =====================================================
   CREATE ORDER API
===================================================== */

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      gameSlug,
      itemSlug,
      itemName,
      playerId,
      zoneId,
      paymentMethod,
      email,
      phone,
      userId,
      currency = "INR",
    } = body;

    /* ---------- VALIDATION ---------- */
    if (
      !gameSlug ||
      !itemSlug ||
      !playerId ||
      !zoneId ||
      !paymentMethod
    ) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!email && !phone) {
      return NextResponse.json({
        success: false,
        message: "Provide email or phone",
      });
    }

    /* ---------- USER TYPE ---------- */
    let userType = "user";
    if (userId) {
      const user = await User.findOne({ userId }).lean();
      if (user?.userType) userType = user.userType;
    }

    /* ---------- 🔒 SERVER PRICE (THE FIX) ---------- */
    const price = await resolvePrice(gameSlug, itemSlug, userType);

    /* ---------- ORDER ID ---------- */
    const orderId =
      "TOPUP_" +
      Date.now().toString(36) +
      "_" +
      crypto.randomBytes(8).toString("hex");

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    /* ---------- CREATE ORDER ---------- */
    const newOrder = await Order.create({
      orderId,
      userId: userId || null,
      gameSlug,
      itemSlug,
      itemName,
      playerId,
      zoneId,
      paymentMethod,
      price, // ✅ TRUSTED
      email: email || null,
      phone: phone || null,
      currency,
      status: "pending",
      paymentStatus: "pending",
      topupStatus: "pending",
      expiresAt,
    });

    if (userId) {
      await User.findOneAndUpdate(
        { userId },
        { $inc: { order: 1 } }
      );
    }

    /* ---------- PAYMENT GATEWAY ---------- */
    const formData = new URLSearchParams();
    if (phone) formData.append("customer_mobile", phone);
    formData.append("user_token", process.env.XTRA_USER_TOKEN!);
    formData.append("amount", String(price)); // 🔒 SAFE
    formData.append("order_id", orderId);
    formData.append(
      "redirect_url",
      `${process.env.NEXT_PUBLIC_BASE_URLU}/payment/topup-complete`
    );

    const resp = await fetch("https://xtragateway.site/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await resp.json();

    if (!data?.status) {
      return NextResponse.json({
        success: false,
        message: "Payment gateway error",
      });
    }

    newOrder.gatewayOrderId = data.result.orderId;
    await newOrder.save();

    return NextResponse.json({
      success: true,
      orderId,
      paymentUrl: data.result.payment_url,
    });
  } catch (err: any) {
    console.error("CREATE ORDER ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

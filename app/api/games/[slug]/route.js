import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import PricingConfig from "@/models/PricingConfig";

export async function GET(req, context) {
  const { slug } = await context.params;

  try {
    /* ================= OPTIONAL JWT ================= */
    let userType = "user"; // default

    const authHeader = req.headers.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded?.userType) {
          userType = decoded.userType;
        }
      } catch {
        // invalid token → fallback to user pricing
      }
    }

    /* ================= FETCH GAME ================= */
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/game/${slug}`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.API_SECRET_KEY,
        },
      }
    );

    const data = await response.json();

    if (!data?.data?.itemId) {
      return NextResponse.json(data);
    }

    /* ================= DB PRICING ================= */
    await connectDB();

    let pricingConfig = null;

    // Owner always sees base price
    if (userType !== "owner") {
      pricingConfig = await PricingConfig.findOne({ userType }).lean();
    }

    /* ================= APPLY DYNAMIC MARKUP ================= */
    data.data.itemId = data.data.itemId.map((item) => {
      const basePrice = Number(item.sellingPrice);
      let markupPercent = 0;

      if (pricingConfig?.slabs?.length) {
        const slab = pricingConfig.slabs.find(
          (s) => basePrice >= s.min && basePrice < s.max
        );

        if (slab) {
          markupPercent = slab.percent;
        }
      }

const finalPrice =
  markupPercent === 0
    ? Number(basePrice.toFixed(2))
    : Number((basePrice * (1 + markupPercent / 100)).toFixed(2));


      return {
        ...item,
        sellingPrice: finalPrice,

        // optional debug (remove in prod)
        _pricing: {
          basePrice,
          markupPercent,
          userType,
        },
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Game Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

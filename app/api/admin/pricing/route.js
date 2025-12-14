import { connectDB } from "@/lib/mongodb";
import PricingConfig from "@/models/PricingConfig";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/* ================= AUTH HELPER ================= */
const requireAdminOrOwner = (req) => {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!["owner", "admin"].includes(decoded.userType)) {
      return { error: "Forbidden", status: 403 };
    }

    return { decoded };
  } catch {
    return { error: "Invalid token", status: 401 };
  }
};

/* =================================================
   GET → Fetch pricing (used by fetchPricing)
   ================================================= */
export async function GET(req) {
  try {
    await connectDB();

    const authCheck = requireAdminOrOwner(req);
    if (authCheck.error) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const { searchParams } = new URL(req.url);
    const userType = searchParams.get("userType");

    if (!userType) {
      return NextResponse.json(
        { success: false, message: "userType is required" },
        { status: 400 }
      );
    }

    const pricing = await PricingConfig.findOne({ userType }).lean();

    return NextResponse.json({
      success: true,
      data: pricing || null,
    });
  } catch (err) {
    console.error("GET pricing error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* =================================================
   PATCH → Save pricing (used by savePricing)
   ================================================= */
export async function PATCH(req) {
  try {
    await connectDB();

    const authCheck = requireAdminOrOwner(req);
    if (authCheck.error) {
      return NextResponse.json(
        { success: false, message: authCheck.error },
        { status: authCheck.status }
      );
    }

    const { userType, slabs } = await req.json();

    if (!userType || !Array.isArray(slabs)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    // Basic validation (safety)
    for (const s of slabs) {
      if (
        typeof s.min !== "number" ||
        typeof s.max !== "number" ||
        typeof s.percent !== "number"
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid slab format" },
          { status: 400 }
        );
      }
    }

    const updated = await PricingConfig.findOneAndUpdate(
      { userType },
      { slabs },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("PATCH pricing error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

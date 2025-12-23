import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    console.log("🔵 [VERIFY] Incoming request");

    await connectDB();
    console.log("🟢 [DB] Connected");

    const { orderId } = await req.json();

    console.log("🔍 [VERIFY] Order ID received:", orderId);

    if (!orderId) {
      console.warn("🟠 [VERIFY] Missing orderId");
      return NextResponse.json({
        success: false,
        message: "Missing orderId",
      });
    }

    // ----------------------------------
    // FETCH LOCAL ORDER
    // ----------------------------------
    const order = await Order.findOne({ orderId });

    console.log("📦 [ORDER] Fetched:", {
      orderId: order?.orderId,
      status: order?.status,
      paymentStatus: order?.paymentStatus,
      topupStatus: order?.topupStatus,
      price: order?.price,
    });

    if (!order) {
      console.warn("🟥 [ORDER] Not found:", orderId);
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent duplicate processing
    if (order.status === "success") {
      console.info("🔁 [ORDER] Already processed:", orderId);
      return NextResponse.json({
        success: true,
        message: "Already processed",
        topupResponse: order.externalResponse,
      });
    }

    // ----------------------------------
    // CHECK PAYMENT STATUS VIA GATEWAY
    // ----------------------------------
    console.log("🌐 [GATEWAY] Checking payment status");

    const formData = new URLSearchParams();
    formData.append("user_token", process.env.XTRA_USER_TOKEN!);
    formData.append("order_id", orderId);

    const resp = await fetch("https://xtragateway.site/api/check-order-status", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await resp.json();

    console.log("📨 [GATEWAY] Response:", {
      status: data?.status,
      txnStatus: data?.result?.txnStatus,
      amount:
        data?.result?.amount ||
        data?.result?.txnAmount ||
        data?.result?.orderAmount,
    });

    // ----------------------------------
    // CHECK GATEWAY SUCCESS
    // ----------------------------------
    const isSuccess =
      data?.status == true ||
      data?.result?.txnStatus == "COMPLETED" ||
      data?.result?.txnStatus == "SUCCESS";

    if (!isSuccess) {
      console.warn("🟥 [PAYMENT] Failed or pending");

      order.status = "failed";
      order.paymentStatus = "failed";
      order.gatewayResponse = data;
      await order.save();

      return NextResponse.json({
        success: false,
        message: "Payment Failed or Pending",
      });
    }

    // ----------------------------------
    // 🔒 STRICT PRICE MATCH CHECK
    // ----------------------------------
    const paidAmount = Number(
      data?.result?.amount ||
      data?.result?.txnAmount ||
      data?.result?.orderAmount
    );

    console.log("💰 [PAYMENT] Amount check", {
      expected: order.price,
      paid: paidAmount,
    });

    if (!paidAmount) {
      console.error("🟥 [PAYMENT] Paid amount missing");

      order.status = "failed";
      order.paymentStatus = "failed";
      order.gatewayResponse = data;
      await order.save();

      return NextResponse.json({
        success: false,
        message: "Unable to verify paid amount",
      });
    }

    if (paidAmount !== Number(order.price)) {
      console.error("🚨 [FRAUD] Price mismatch detected", {
        orderId,
        expected: order.price,
        paid: paidAmount,
      });

      order.status = "fraud";
      order.paymentStatus = "failed";
      order.topupStatus = "failed";
      order.gatewayResponse = data;
      await order.save();

      return NextResponse.json({
        success: false,
        message: "Payment amount mismatch detected",
      });
    }

    // ----------------------------------
    // PAYMENT VERIFIED
    // ----------------------------------
    console.log("✅ [PAYMENT] Verified successfully");

    order.paymentStatus = "success";
    order.gatewayResponse = data;
    await order.save();

    // ----------------------------------
    // PREPARE TOPUP PAYLOAD
    // ----------------------------------
    const externalPayload = {
      playerId: String(order.playerId),
      zoneId: String(order.zoneId),
      productId: `${order.gameSlug}_${order.itemSlug}`,
      currency: "USD",
    };

    console.log("🎮 [TOPUP] Sending payload:", externalPayload);

    // ----------------------------------
    // CALL GAME API
    // ----------------------------------
    const gameResp = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api-service/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_SECRET_KEY!,
        },
        body: JSON.stringify(externalPayload),
      }
    );

    const gameData = await gameResp.json();

    console.log("🎯 [TOPUP] Response:", {
      ok: gameResp.ok,
      status: gameData?.status,
      success: gameData?.success,
    });

    // ----------------------------------
    // SAVE TOPUP RESULT
    // ----------------------------------
    const topupSuccess =
      gameResp.ok &&
      (gameData?.success === true ||
        gameData?.status === true ||
        gameData?.result?.status === "SUCCESS");

    order.externalResponse = gameData;

    if (topupSuccess) {
      console.log("🏁 [ORDER] Topup SUCCESS:", orderId);
      order.topupStatus = "success";
      order.status = "success";
    } else {
      console.warn("🟥 [ORDER] Topup FAILED:", orderId);
      order.topupStatus = "failed";
      order.status = "failed";
    }

    await order.save();

    console.log(
      `⏱️ [VERIFY] Completed in ${Date.now() - startTime}ms`
    );

    return NextResponse.json({
      success: true,
      message: "Topup successful",
      topupResponse: gameData,
    });
  } catch (error: any) {
    console.error("🔥 [VERIFY] Fatal error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

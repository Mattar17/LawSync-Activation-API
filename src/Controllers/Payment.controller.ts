import type { Request, Response } from "express";
import CreateIntention from "../Services/CreatePaymentIntention.js";
import supabase from "../Services/supabaseClient.js";
import logger from "../utils/logger.js";
import crypto from "crypto";
import { lookup } from "dns";

export async function PaymentIntention(req: Request, res: Response) {
  try {
    const { id } = req.params;
    console.log(id);
    const response = await CreateIntention(id as string);
    console.log(response);
    const clientSecret = response.client_secret;
    return res.json({
      response,
      link: `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`,
    });
  } catch (err: any) {
    return res.status(500).json(`${err.message}: Failed to create payment`);
  }
}
//https://accept.paymob.com/unifiedcheckout/?publicKey={your_public_key}&clientSecret={the_client_secret}'

export async function handlePaymentWebhook(req: Request, res: Response) {
  try {
    console.log("Webhook received");
    logger.log("info", req.query);
    logger.log("info", req.params);

    // 1. Validate body exists
    if (!req.body || !req.body.obj) {
      console.log("Invalid payload");
      return res.status(400).json({ error: "Invalid payload" });
    }

    const data = req.body.obj;

    // 2. Extract important fields
    const { id, success, amount_cents, order, is_capture, integration_id } =
      data;

    console.log("Payment ID:", id);
    console.log("Success:", success);

    // 3. (IMPORTANT) Verify HMAC signature
    const receivedHmac = req.query.hmac as string;

    const calculatedHmac = crypto
      .createHmac("sha512", process.env.PAYMOB_HMAC_SECRET!)
      .update(
        `${data.amount_cents}${data.created_at}${data.currency}${data.error_occured}${data.has_parent_transaction}${data.id}${data.integration_id}${data.is_3d_secure}${data.is_auth}${data.is_capture}${data.is_refunded}${data.is_standalone_payment}${data.is_voided}${data.order.id}${data.owner}${data.pending}${data.source_data.pan}${data.source_data.sub_type}${data.source_data.type}${data.success}`,
      )
      .digest("hex");

    if (receivedHmac !== calculatedHmac) {
      console.log("Invalid HMAC ❌");
      return res.status(403).json({ error: "Invalid signature" });
    }

    console.log("HMAC verified ✅");

    // 4. Update your database
    if (success && is_capture) {
      // mark order as paid
      console.log("Payment SUCCESS → update DB");
    } else {
      console.log("Payment FAILED");
    }

    // 5. Always respond quickly
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

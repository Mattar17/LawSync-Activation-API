import type { Request, Response } from "express";
import CreateIntention from "../Services/CreatePaymentIntention.js";
import supabase from "../Services/supabaseClient.js";
import logger from "../utils/logger.js";

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
  console.log(req.body);
  const { success } = req.body?.obj;
  if (success) {
    logger.log("warn", "successfulPayement");
  }
  res.status(200).json();
}

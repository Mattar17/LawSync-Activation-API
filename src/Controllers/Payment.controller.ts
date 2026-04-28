import type { Request, Response } from "express";
import CreateIntention from "../Services/CreatePaymentIntention.js";

export async function PaymentIntention(req: Request, res: Response) {
  try {
    const response = await CreateIntention();
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

  res.sendStatus(200);
}

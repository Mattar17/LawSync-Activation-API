import type { Request, Response } from "express";
import CreateIntention from "../Services/CreatePaymentIntention.js";

export async function PaymentIntention(req: Request, res: Response) {
  try {
    const response = await CreateIntention();
    return res.json(response);
  } catch (err: any) {
    return res.status(500).json(`${err.message}: Failed to create payment`);
  }
}

export async function handlePaymentWebhook(req: Request, res: Response) {
  console.log(req.body);

  res.sendStatus(200);
}

import express from "express";
import { PaymentIntention } from "@/Controllers/Payment.controller.js";

const router = express.Router();

router.post("/payment/:id", PaymentIntention);

export default router;

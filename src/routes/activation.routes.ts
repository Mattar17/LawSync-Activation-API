import express from "express";
import { rateLimit } from "express-rate-limit";

import ValidateLicense from "@/Controllers/ValidateLicense.js";
import ActivateLicense from "@/Controllers/ActivateLicense.js";
import StartTrial from "@/Controllers/StartTrial.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "too many requests" },
});

router.post("/licenses/validate", limiter, ValidateLicense);
router.post("/licenses/activate", limiter, ActivateLicense);
router.post("/licenses/trial/start", limiter, StartTrial);

export default router;

import express from "express";
import APIKeyValidation from "./middlewares/APIKeyValidator.js";
import ValidateLicense from "./Controllers/ValidateLicense.js";
import ActivateLicense from "./Controllers/ActivateLicense.js";
import StartTrial from "./Controllers/StartTrial.js";
import AdminOnly from "./middlewares/adminOnly.js";
import verifyToken from "./middlewares/verifyToken.js";
import { handleDownloads } from "./Controllers/analytics.controller.js";
import * as LawyerController from "./Controllers/lawyers.controller.js";
import { Login } from "./Controllers/Login.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { getLawyerCases, syncCases } from "./Controllers/case.controller.js";
import { UploadImage } from "./Services/UploadImage.js";
import {
  handlePaymentWebhook,
  PaymentIntention,
} from "./Controllers/Payment.controller.js";

import { rateLimit } from "express-rate-limit";
import AccessPortal from "./Controllers/AccessPortal.js";

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "too many requests" },
});

const router = express.Router();
router.use(APIKeyValidation);
router.use(requestLogger);
//Payment
router.post("/api/payment/:id", PaymentIntention);
//Activation
router.post("/api/licenses/validate", limiter, ValidateLicense);
router.post("/api/licenses/activate", limiter, ActivateLicense);
router.post("/api/licenses/trial/start", limiter, StartTrial);

//Analytics
router.post("/api/analytics/downloads", handleDownloads);

//Lawyers
router.get(
  "/api/lawyers/admin",
  verifyToken,
  LawyerController.getAllLawyersAdmin,
);
router.get("/api/lawyers/", LawyerController.getAllLawyersPublic);
router.get("/api/lawyers/:token", LawyerController.getLawyerByToken);
router.get("/api/lawyers/id/:id", LawyerController.getLawyerById);
router.post(
  "/api/lawyers/",
  verifyToken,
  AdminOnly,
  LawyerController.createLawyer,
);
router.put("/api/lawyers/:id", verifyToken, LawyerController.updateLawyer);
router.delete(
  "/api/lawyers/:id",
  verifyToken,
  AdminOnly,
  LawyerController.deleteLawyer,
);
router.post(
  "/api/lawyers/:id/update-profile-password",
  verifyToken,
  LawyerController.updateProfilePassword,
);

router.post(
  "/api/lawyers/:id/update-portal-password",
  verifyToken,
  LawyerController.updatePortalPassword,
);

router.post(
  "/api/lawyers/avatar/:id",
  UploadImage.single("file"),
  LawyerController.setProfilePicture,
);

//Cases
router.get("/api/cases/:id", getLawyerCases);
router.post("/api/sync", syncCases);

//Login
router.post("/api/login", Login);
router.post("/api/portal-access", AccessPortal);

export default router;

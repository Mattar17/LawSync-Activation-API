import express from "express";
import APIKeyValidation from "./middlewares/APIKeyValidator.js";
import ValidateLicense from "./Controllers/ValidateLicense.js";
import ActivateLicense from "./Controllers/ActivateLicense.js";
import StartTrial from "./Controllers/StartTrial.js";
import AdminOnly from "./middlewares/adminOnly.js";
import verifyToken from "./middlewares/verifyToken.js";
import {
  numberOfDownloads,
  increamentDownloads,
} from "./Controllers/Analytics.js";
import * as LaweryController from "./Controllers/Lawyer.controller.js";
import { getLawyerCases } from "./Controllers/getCases.js";
import { Login } from "./Controllers/Login.js";
import SyncCases from "./Controllers/SyncCases.js";
import { requestLogger } from "./middlewares/requestLogger.js";

import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  message: { success: false, message: "too many requests" },
});

const router = express.Router();
router.use(APIKeyValidation);
router.use(requestLogger);

//Activation
router.post("/api/licenses/validate", limiter, ValidateLicense);
router.post("/api/licenses/activate", limiter, ActivateLicense);
router.post("/api/licenses/trial/start", limiter, StartTrial);

//Analytics
router.get("/api/analytics/downloads", numberOfDownloads);
router.patch("/api/analytics/downloads", increamentDownloads);

//Lawyers
router.get(
  "/api/lawyers/",
  verifyToken,
  AdminOnly,
  LaweryController.getAllLawyers,
);
router.get("/api/lawyers/:token", LaweryController.getLawyerByToken);
router.post(
  "/api/lawyers/",
  verifyToken,
  AdminOnly,
  LaweryController.createLawyer,
);
router.put("/api/lawyers/:id", verifyToken, LaweryController.updateLawyer);
router.delete(
  "/api/lawyers/:id",
  verifyToken,
  AdminOnly,
  LaweryController.deleteLawyer,
);
router.post(
  "/api/lawyers/:id/update-profile-password",
  verifyToken,
  LaweryController.updateProfilePassword,
);

router.post(
  "/api/lawyers/:id/update-portal-password",
  verifyToken,
  LaweryController.updatePortalPassword,
);

//Cases
router.get("/api/cases/:token", getLawyerCases);
router.post("/api/sync", SyncCases);

//Login
router.post("/api/login", Login);

export default router;

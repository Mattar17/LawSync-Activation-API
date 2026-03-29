import express from "express";
import APIKeyValidation from "./middlewares/APIKeyValidator.js";
import ValidateLicense from "./Controllers/ValidateLicense.js";
import ActivateLicense from "./Controllers/ActivateLicense.js";
import StartTrial from "./Controllers/BeginTrial.js";
import AdminOnly from "./middlewares/adminOnly.js";
import verifyToken from "./middlewares/verifyToken.js";
import {
  numberOfDownloads,
  increamentDownloads,
} from "./Controllers/Analytics.js";
import * as LaweryController from "./Controllers/Lawyer.controller.js";
import { getLawyerCases } from "./Controllers/getCases.js";
import { Login } from "./Controllers/Login.js";

const router = express.Router();
router.use(APIKeyValidation);

//Activation
router.post("/api/licenses/validate", ValidateLicense);
router.post("/api/licenses/activate", ActivateLicense);
router.post("/api/licenses/trial/start", StartTrial);

//Analytics
router.get("/api/analytics/downloads", numberOfDownloads);
router.patch("/api/analytics/downloads", increamentDownloads);

//Lawyers
router.get("/api/lawyers/", LaweryController.getAllLawyers);
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

//Lawyers
router.get("/api/cases/:token", getLawyerCases);

//Login
router.post("/api/login", Login);

export default router;

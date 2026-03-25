import express from "express";
import APIKeyValidation from "./middlewares/APIKeyValidator.js";
import ValidateLicense from "./Controllers/ValidateLicense.js";
import ActivateLicense from "./Controllers/ActivateLicense.js";
import StartTrial from "./Controllers/BeginTrial.js";
import CaseModel from "./Models/Case.js";
import {
  numberOfDownloads,
  increamentDownloads,
} from "./Controllers/Analytics.js";

const router = express.Router();

router.post("/api/licenses/validate", APIKeyValidation, ValidateLicense);
router.post("/api/licenses/activate", APIKeyValidation, ActivateLicense);
router.post("/api/licenses/trial/start", APIKeyValidation, StartTrial);
router.get("/api/analytics/downloads", numberOfDownloads);
router.patch("/api/analytics/downloads", APIKeyValidation, increamentDownloads);

export default router;

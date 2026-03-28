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
import * as LaweryController from "./Controllers/Lawyer.controller.js";
import { getLawyerCases } from "./Controllers/getCases.js";

const router = express.Router();

//Activation
router.post("/api/licenses/validate", APIKeyValidation, ValidateLicense);
router.post("/api/licenses/activate", APIKeyValidation, ActivateLicense);
router.post("/api/licenses/trial/start", APIKeyValidation, StartTrial);

//Analytics
router.get("/api/analytics/downloads", numberOfDownloads);
router.patch("/api/analytics/downloads", APIKeyValidation, increamentDownloads);

//Lawyers
router.get("/api/lawyers/", LaweryController.getAllLawyers);
router.get("/api/lawyers/:token", LaweryController.getLawyerByToken);
router.post("/api/lawyers/", LaweryController.createLawyer); //Admin only
router.put("/api/lawyers/:id", LaweryController.updateLawyer); //Lawyer profile (token required)
router.delete("/api/lawyers/:id", LaweryController.deleteLawyer); //Admin only

//Lawyers
router.get("/api/cases/:token", getLawyerCases);

export default router;

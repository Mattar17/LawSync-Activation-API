import express from "express";

import verifyToken from "@/middlewares/verifyToken.js";
import validateRequestBody from "@/middlewares/validateRequestBody.js";

import { createCaseSchema } from "@/ValidationSchemas/CaseSchema.js";

import * as CasesController from "@/Controllers/case.controller.js";

const router = express.Router();

router.post(
  "/offices/:officeId/cases",
  verifyToken,
  validateRequestBody(createCaseSchema),
  CasesController.createCase,
);

router.get(
  "/offices/:officeId/cases",
  verifyToken,
  CasesController.getOfficeCases,
);

router.patch(
  "/offices/:officeId/cases/:caseId/assign",
  verifyToken,
  CasesController.assignLawyerToCase,
);

router.get(
  "/offices/:officeId/cases/:caseId",
  verifyToken,
  CasesController.getCaseDetails,
);

router.patch(
  "/offices/:officeId/cases/:caseId",
  verifyToken,
  CasesController.updateCase,
);

router.delete(
  "/offices/:officeId/cases/:caseId",
  verifyToken,
  CasesController.deleteCase,
);

export default router;

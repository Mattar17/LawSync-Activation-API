import express from "express";

import verifyToken from "../middlewares/verifyToken.js";
import * as OfficesController from "../Controllers/office.controller.js";

const router = express.Router();

router.post("/", OfficesController.CreateOffice);

router.get("/me", verifyToken, OfficesController.getMyOffices);
router.get("/:id", OfficesController.getOfficeById);

router.put("/:id", verifyToken, OfficesController.updateOffice);

router.post("/:officeId/leave", verifyToken, OfficesController.leaveOffice);

router.get(
  "/:officeId/members",
  verifyToken,
  OfficesController.getOfficeMembers,
);

router.delete(
  "/:officeId/members/:memberId",
  verifyToken,
  OfficesController.kickMember,
);

export default router;

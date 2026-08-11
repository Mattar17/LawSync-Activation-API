import express from "express";

import verifyToken from "../middlewares/verifyToken.js";
import * as InvitesController from "../Controllers/invites.controller.js";

const router = express.Router();

router.post(
  "/offices/:officeId/invites",
  verifyToken,
  InvitesController.CreateInvite,
);

router.get(
  "/offices/:officeId/invites",
  verifyToken,
  InvitesController.getOfficeInvites,
);

router.get("/invites/me", verifyToken, InvitesController.getMyInvites);

router.post(
  "/invites/:inviteId/respond",
  verifyToken,
  InvitesController.respondToInvite,
);

router.delete("/invites/:id", verifyToken, InvitesController.cancelInvite);

export default router;

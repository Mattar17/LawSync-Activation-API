import express from "express";

import APIKeyValidation from "@/middlewares/APIKeyValidator.js";
import { requestLogger } from "@/middlewares/requestLogger.js";

import paymentRoutes from "@/routes/payment.routes.js";
import activationRoutes from "@/routes/activation.routes.js";
import analyticsRoutes from "@/routes/analytics.routes.js";
import authRoutes from "@/routes/auth.routes.js";
import lawyerRoutes from "@/routes/lawyers.routes.js";
import officeRoutes from "@/routes/offices.routes.js";
import inviteRoutes from "@/routes/invites.routes.js";
import caseRoutes from "@/routes/cases.routes.js";
import taskRoutes from "@/routes/tasks.routes.js";
import booksRoutes from "@/routes/books.routes.js";

const router = express.Router();

router.use(APIKeyValidation);
router.use(requestLogger);

router.get("/test", (_, res) => {
  res.status(200).json("This lawsync api testing");
});

router.use(paymentRoutes);
router.use(activationRoutes);
router.use(analyticsRoutes);
router.use(authRoutes);

router.use("/lawyers", lawyerRoutes);
router.use("/offices", officeRoutes);

router.use(inviteRoutes);
router.use(caseRoutes);
router.use(taskRoutes);
router.use(booksRoutes);

export default router;

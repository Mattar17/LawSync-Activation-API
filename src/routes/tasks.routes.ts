import express from "express";

import verifyToken from "@/middlewares/verifyToken.js";

import * as TasksController from "@/Controllers/tasks.controller.js";

const router = express.Router();

router.post(
  "/offices/:officeId/tasks",
  verifyToken,
  TasksController.createTask,
);

router.get(
  "/offices/:officeId/tasks",
  verifyToken,
  TasksController.getOfficeTasks,
);

router.get(
  "/offices/:officeId/tasks/:taskId",
  verifyToken,
  TasksController.getTaskDetails,
);

router.patch(
  "/offices/:officeId/tasks/:taskId",
  verifyToken,
  TasksController.updateTask,
);

router.patch(
  "/offices/:officeId/tasks/:taskId/assign",
  verifyToken,
  TasksController.assignLawyerToTask,
);

router.delete(
  "/offices/:officeId/tasks/:taskId",
  verifyToken,
  TasksController.deleteTask,
);

export default router;

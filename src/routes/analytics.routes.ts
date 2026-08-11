import express from "express";
import { handleDownloads } from "../Controllers/analytics.controller.js";

const router = express.Router();

router.post("/analytics/downloads", handleDownloads);

export default router;

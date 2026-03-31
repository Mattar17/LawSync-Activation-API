import { type Request, type Response } from "express";
import Trial from "../Models/Trial.js";
import signLicense from "../Services/signLicense.js";
import logger from "../utils/logger.js";

export default async function BeginTrial(req: Request, res: Response) {
  try {
    const { machineId } = req.body;
    if (!machineId) {
      logger.warn("BeginTrial called without machineId");
      return res.status(400).json({
        success: false,
        message: "Machine ID is required",
      });
    }

    let trial = await Trial.findOne({ machineId });
    let newTrial;

    if (!trial) {
      newTrial = new Trial({
        machineId,
        type: "trial",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await newTrial.save();
      logger.info(`Trial started for machineId: ${machineId}`);
    } else {
      logger.info(`Existing trial found for machineId: ${machineId}`);
    }

    return res.status(201).json({
      success: true,
      message: "Trial started successfully",
      data: signLicense(trial! || newTrial!),
    });
  } catch (err) {
    logger.error(`BeginTrial error: ${err}`);
    return res.status(500).json({ success: false, message: "server error" });
  }
}

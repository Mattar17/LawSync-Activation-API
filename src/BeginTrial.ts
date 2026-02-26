import { type Request, type Response } from "express";
import Trial from "./Trial.js";
import signLicense from "./helpers/signLicense.js";

export default async function BeginTrial(req: Request, res: Response) {
  try {
    const { machineId } = req.body;
    let newTrial;
    const trial = await Trial.findOne({ machineId });
    if (!trial) {
      newTrial = new Trial({
        machineId,
        type: "trial",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await newTrial.save();
    }

    return res.status(201).json({
      success: true,
      message: "Trial started successfully",
      data: signLicense(trial! || newTrial!),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "server error" });
  }
}

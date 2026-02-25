import { type Request, type Response } from "express";
import Trial from "./Trial.js";
import signLicense from "./helpers/signLicense.js";

export default async function BeginTrial(req: Request, res: Response) {
  try {
    const { machineId } = req.body;
    const trial = await Trial.findOne({ machineId });
    if (!trial) {
      let newTrial = new Trial({ machineId });
      await newTrial.save();
    }

    console.log("Trial started for machineId:", machineId);
    console.log("Trial details:", trial);
    console.log("License signed for trial:", signLicense(trial!));

    return res.status(201).json({
      success: true,
      message: "Trial started successfully",
      data: signLicense(trial!),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "server error" });
  }
}

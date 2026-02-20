import { type Request, type Response } from "express";
import Trial from "./Trial";
import signLicense from "./helpers/signLicense";
export default async function StartTrial(req: Request, res: Response) {
  try {
    const { machineId } = req.body;
    const trialExists = await Trial.findOne({ machineId });
    if (trialExists) {
      return res.status(206).json({
        success: true,
        message: "Trial already exists",
        data: trialExists,
      });
    }
    let newTrial = new Trial({ machineId });
    await newTrial.save();
    const signedTrial = signLicense(newTrial);
    return res.status(201).json({
      success: true,
      message: "Trial started successfully",
      data: signedTrial,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "server error" });
  }
}

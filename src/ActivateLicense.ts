import { type Request, type Response } from "express";
import License from "./License.js";
import signLicense from "./helpers/signLicense.js";

export default async function ActivateLicense(req: Request, res: Response) {
  try {
    const { key, machineId } = req.body;
    const license = await License.findOne({ key });
    if (!license) return res.status(404).json("License doesn't exist");

    license.usedDevices.push({
      machineId,
      activatedAt: new Date(),
      lastSeenAt: new Date(),
    });

    await license.save();
    const signedLicense = signLicense(license);
    return res.status(201).json({ success: "true", data: signedLicense });
  } catch (err) {
    return res.json("server error");
  }
}

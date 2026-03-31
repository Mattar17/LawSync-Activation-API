import { type Request, type Response } from "express";
import License from "../Models/License.js";
import signLicense from "../Services/signLicense.js";
import logger from "../utils/logger.js";

export default async function ActivateLicense(req: Request, res: Response) {
  try {
    const { key, machineId } = req.body;

    logger.info("ActivateLicense request received", {
      key: key?.slice(0, 5) + "***",
      machineId,
    });

    const license = await License.findOne({ key });

    if (!license) {
      logger.warn("License not found", {
        key: key?.slice(0, 5) + "***",
      });
      return res.status(404).json("License doesn't exist");
    }

    license.usedDevices.push({
      machineId,
      activatedAt: new Date(),
      lastSeenAt: new Date(),
    });

    await license.save();

    logger.info("License activated", {
      licenseId: license._id,
      machineId,
      totalDevices: license.usedDevices.length,
    });

    const signedLicense = signLicense(license);

    return res.status(201).json({
      success: true,
      data: signedLicense,
    });
  } catch (err: any) {
    logger.error("ActivateLicense error", {
      message: err.message,
      stack: err.stack,
    });

    return res.status(500).json("server error");
  }
}

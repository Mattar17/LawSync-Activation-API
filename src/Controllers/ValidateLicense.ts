import License from "../Models/License.js";
import signLicense from "../Services/signLicense.js";
import { type Request, type Response } from "express";
import logger from "../utils/logger.js"; // Winston logger

export default async function ValidateLicense(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { key } = req.body;

    if (!key) {
      logger.warn("ValidateLicense called without a key");
      return res
        .status(400)
        .json({ success: false, message: "Key is required" });
    }

    const licenseDoc = await License.findOne({ key });

    if (!licenseDoc) {
      logger.warn(`License key not found: ${key}`);
      return res
        .status(404)
        .json({ success: false, message: "Key isn't valid" });
    }

    if (licenseDoc.usedDevices?.length >= licenseDoc.maxDevices) {
      logger.warn(`Max devices limit reached for key: ${key}`);
      return res
        .status(403)
        .json({ success: false, message: "Max devices limit reached" });
    }

    logger.info(
      `License validated for key: ${key}, usedDevices: ${licenseDoc.usedDevices?.length || 0}`,
    );

    const signedLicense = signLicense(licenseDoc);

    return res
      .status(200)
      .json({ success: true, message: "Valid license", data: signedLicense });
  } catch (err) {
    logger.error(`ValidateLicense error: ${err}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

import License from "./License";
import signLicense from "./helpers/signLicense";
import { type Request, type Response } from "express";

export default async function ValidateLicense(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { key } = req.body;

    const licenseDoc = await License.findOne({ key });

    if (!licenseDoc)
      return res
        .status(404)
        .json({ success: false, message: "Key isn't valid" });

    if (licenseDoc.usedDevices?.length >= licenseDoc.maxDevices)
      return res
        .status(403)
        .json({ success: false, message: "max devices limit reached" });

    const signedLicense = signLicense(licenseDoc);

    return res
      .status(200)
      .json({ success: "true", message: "valid license", data: signedLicense });
  } catch (err) {
    return res.json(`${err} : server error`);
  }
}

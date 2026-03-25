import AnalyticsModel from "../Models/Analytics";
import { type Response, type Request } from "express";

async function numberOfDownloads(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const analytics = await AnalyticsModel.findOneAndUpdate(
      { key: "global" },
      { $inc: { numberOfDownloads: 0 } },
      { upsert: true },
    );

    console.log(analytics);
    return res.status(200).json(analytics?.numberOfDownloads);
  } catch (err) {
    return res.status(500).json(`${err}: server error`);
  }
}

async function increamentDownloads(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    await AnalyticsModel.updateOne(
      { key: "global" },
      { $inc: { numberOfDownloads: 1 } },
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json(`${err}: server error`);
  }
}

export { numberOfDownloads, increamentDownloads };

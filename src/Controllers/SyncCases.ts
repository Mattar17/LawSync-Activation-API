import { type Request, type Response } from "express";
import CaseModel from "../Models/Case.js";
import LawyerModel from "../Models/Lawyer.js";
import logger from "../utils/logger.js";

const SyncCases = async (req: Request, res: Response) => {
  try {
    const { token, cases } = req.body;

    logger.info("SyncCases request received", {
      token: token?.slice(0, 5) + "***",
      casesCount: cases?.length,
    });

    const lawyer = await LawyerModel.findOne({ token });

    if (!lawyer) {
      logger.warn("Invalid lawyer token in SyncCases", {
        token: token?.slice(0, 5) + "***",
      });

      return res.status(403).json({
        success: false,
        message: "Invalid lawyer token",
      });
    }

    if (!Array.isArray(cases) || cases.length === 0) {
      logger.warn("Empty or invalid cases payload", {
        token: token?.slice(0, 5) + "***",
      });

      return res.status(400).json({
        success: false,
        message: "Cases array is required",
      });
    }

    const operations = cases.map((c: any) => ({
      updateOne: {
        filter: {
          case_number: c.case_number,
          case_year: c.case_year,
        },
        update: {
          $set: {
            ...c,
            lawyer_token: token,
          },
        },
        upsert: true,
      },
    }));

    const result = await CaseModel.bulkWrite(operations);

    logger.info("SyncCases completed", {
      token: token?.slice(0, 5) + "***",
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount,
    });

    return res.status(200).json({
      success: true,
      message: "Sync completed",
      stats: {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
      },
    });
  } catch (err: any) {
    logger.error("SyncCases error", {
      message: err.message,
      stack: err.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default SyncCases;

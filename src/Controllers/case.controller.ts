import type { Request, Response } from "express";
import supabase from "../Services/supabaseClient.js"; // make sure you have this
import logger from "../utils/logger.js";

/**
 * Sync Cases (UPSERT)
 */
export const syncCases = async (req: Request, res: Response) => {
  try {
    const { token, cases } = req.body;

    logger.info("SyncCases request received", {
      id: token?.slice(0, 5) + "***",
      casesCount: cases?.length,
    });

    // 1. Check lawyer exists
    const { data: lawyer, error: lawyerError } = await supabase
      .from("lawyers")
      .select("*")
      .eq("token", token)
      .single();

    if (lawyerError || !lawyer) {
      logger.warn("Invalid lawyer token in SyncCases", {
        id: token?.slice(0, 5) + "***",
      });

      return res.status(403).json({
        success: false,
        message: "Invalid lawyer token",
      });
    }

    // 2. Validate cases
    if (!Array.isArray(cases) || cases.length === 0) {
      logger.warn("Empty or invalid cases payload", {
        id: token?.slice(0, 5) + "***",
      });

      return res.status(400).json({
        success: false,
        message: "Cases array is required",
      });
    }

    // 3. Prepare data
    const payload = cases.map((c: any) => ({
      ...c,
      lawyer_id: lawyer.id,
      case_mongo_id: c._id,
    }));

    // 4. UPSERT (based on unique constraint)
    const { data, error } = await supabase
      .from("cases")
      .upsert(payload, {
        onConflict: "case_number,case_year",
      })
      .select();

    if (error) {
      throw error;
    }

    logger.info("SyncCases completed", {
      token: token?.slice(0, 5) + "***",
      count: data?.length,
    });

    return res.status(200).json({
      success: true,
      message: "Sync completed",
      count: data?.length,
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

/**
 * Get Lawyer Cases
 */
export const getLawyerCases = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id } = req.params;

    logger.info("Get lawyer cases request", {
      token: id?.slice(0, 5) + "***",
    });

    const { data: cases, error } = await supabase
      .from("cases")
      .select(
        `
        case_number,
        case_year,
        client_name,
        client_opponent_name,
        client_role,
        client_opponent_role,
        client_national_id,
        client_opponent_national_id,
        latest_court_session_date,
        next_court_session_date,
        case_status
      `,
      )
      .eq("lawyer_id", id);

    if (error) {
      throw error;
    }

    if (!cases || cases.length === 0) {
      logger.warn("No cases found for lawyer", {
        id: id?.slice(0, 5) + "***",
      });

      return res.status(404).json({
        success: false,
        message: "No cases found for this lawyer",
      });
    }

    logger.info("Lawyer cases fetched", {
      id: id?.slice(0, 5) + "***",
      count: cases.length,
    });

    return res.status(200).json({
      success: true,
      data: cases,
    });
  } catch (err: any) {
    logger.error("Get lawyer cases error", {
      message: err.message,
      stack: err.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

import { type Request, type Response } from "express";
import supabase from "../Services/supabaseClient.js";
import { generateLawyerId } from "../utils/generateLawyerId.js";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";

interface AuthRequest extends Request {
  token?: {
    admin?: boolean;
    lawyer_token?: string;
  };
}

// 🔹 Helper: get lawyer by id
const getLawyerById = async (id: string) => {
  const { data, error } = await supabase
    .from("lawyers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// 🔹 GET ALL LAWYERS
export const getAllLawyers = async (req: AuthRequest, res: Response) => {
  try {
    logger.info("Fetching all lawyers", {
      user: req.token?.lawyer_token,
    });

    const { data, error } = await supabase.from("lawyers").select("*");

    if (error) throw error;

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err: any) {
    logger.error("Error fetching lawyers", { message: err.message });

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// 🔹 GET LAWYER BY TOKEN
export const getLawyerByToken = async (req: AuthRequest, res: Response) => {
  try {
    const tokenParam = req.params.token;

    const { data, error } = await supabase
      .from("lawyers")
      .select("*")
      .eq("token", tokenParam)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    logger.error("Error fetching lawyer by token", {
      message: err.message,
    });

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// 🔹 CREATE LAWYER (ADMIN ONLY)
export const createLawyer = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.token?.admin) {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }

    const { name } = req.body;

    const token = await generateLawyerId();
    if (!token) throw new Error("Token generation failed");

    const hashedProfilePassword = await bcrypt.hash("000000", 10);
    const hashedPortalPassword = await bcrypt.hash("000000", 10);

    const { data, error } = await supabase
      .from("lawyers")
      .insert([
        {
          name,
          token,
          profile_password: hashedProfilePassword,
          portal_password: hashedPortalPassword,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    logger.info("Lawyer created", {
      token: token.slice(0, 5) + "***",
    });

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (err: any) {
    logger.error("Error creating lawyer", { message: err.message });

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// 🔹 UPDATE LAWYER
export const updateLawyer = async (req: AuthRequest, res: Response) => {
  try {
    const lawyer = await getLawyerById(req.params.id as string);

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    if (req.token?.lawyer_token !== lawyer.token) {
      logger.warn("Unauthorized update attempt", {
        user: req.token?.lawyer_token,
      });

      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { data, error } = await supabase
      .from("lawyers")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    logger.error("Error updating lawyer", { message: err.message });

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// 🔹 DELETE LAWYER (ADMIN ONLY)
export const deleteLawyer = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.token?.admin) {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }

    const { error } = await supabase
      .from("lawyers")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Lawyer deleted successfully",
    });
  } catch (err: any) {
    logger.error("Error deleting lawyer", { message: err.message });

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// 🔹 UPDATE PROFILE PASSWORD
export const updateProfilePassword = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const lawyer = await getLawyerById(req.params.id as string);

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    if (req.token?.lawyer_token !== lawyer.token) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      lawyer.profile_password,
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
      .from("lawyers")
      .update({ profile_password: hashed })
      .eq("id", req.params.id);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Profile password updated successfully",
    });
  } catch (err: any) {
    logger.error("Error updating profile password", {
      message: err.message,
    });

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// 🔹 UPDATE PORTAL PASSWORD
export const updatePortalPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { profilePassword, newPortalPassword } = req.body;

    const lawyer = await getLawyerById(req.params.id as string);

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    if (req.token?.lawyer_token !== lawyer.token) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const isMatch = await bcrypt.compare(
      profilePassword,
      lawyer.profile_password,
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Profile password is incorrect",
      });
    }

    const hashed = await bcrypt.hash(newPortalPassword, 10);

    const { error } = await supabase
      .from("lawyers")
      .update({ portal_password: hashed })
      .eq("id", req.params.id);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Portal password updated successfully",
    });
  } catch (err: any) {
    logger.error("Error updating portal password", {
      message: err.message,
    });

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

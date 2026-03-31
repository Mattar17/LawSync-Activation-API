import { type Request, type Response } from "express";
import LawyerModel from "../Models/Lawyer";
import { generateLawyerId } from "../utils/generateLawyerId.js";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";

interface AuthRequest extends Request {
  token?: {
    admin?: boolean;
    lawyer_token?: string;
  };
}

// GET ALL LAWYERS
export const getAllLawyers = async (req: AuthRequest, res: Response) => {
  try {
    logger.info("Fetching all lawyers", { user: req.token?.lawyer_token });
    const lawyers = await LawyerModel.find();

    return res.status(200).json({
      success: true,
      count: lawyers.length,
      data: lawyers,
    });
  } catch (err: any) {
    logger.error("Error fetching lawyers", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET LAWYER BY TOKEN
export const getLawyerByToken = async (req: AuthRequest, res: Response) => {
  try {
    const tokenParam = req.params.token;
    logger.info("Fetching lawyer by token", {
      token: tokenParam?.slice(0, 5) + "***",
    });

    const lawyer = await LawyerModel.findOne({ token: `${tokenParam}` });

    if (!lawyer) {
      logger.warn("Lawyer not found", {
        token: tokenParam?.slice(0, 5) + "***",
      });
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: lawyer,
    });
  } catch (err: any) {
    logger.error("Error fetching lawyer by token", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// CREATE LAWYER (ADMIN ONLY)
export const createLawyer = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.token?.admin) {
      logger.warn("Access denied to create lawyer", {
        user: req.token?.lawyer_token,
      });
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }

    const { name } = req.body;
    const token: string = await generateLawyerId();
    if (!token) throw new Error("Token generation failed");

    const hashedProfilePassword = await bcrypt.hash("000000", 10);
    const hashedPortalPassword = await bcrypt.hash("000000", 10);

    const lawyer = await LawyerModel.create({
      token,
      name,
      profile_password: hashedProfilePassword,
      portal_password: hashedPortalPassword,
    });

    logger.info("Lawyer created successfully", {
      token: token.slice(0, 5) + "***",
    });

    return res.status(201).json({
      success: true,
      data: lawyer,
    });
  } catch (err: any) {
    logger.error("Error creating lawyer", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE LAWYER
export const updateLawyer = async (req: AuthRequest, res: Response) => {
  try {
    const lawyer = await LawyerModel.findById(req.params.id);
    if (!lawyer)
      return res
        .status(404)
        .json({ success: false, message: "Lawyer not found" });

    if (req.token?.lawyer_token !== lawyer.token) {
      logger.warn("Unauthorized lawyer update attempt", {
        user: req.token?.lawyer_token,
      });
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    Object.assign(lawyer, req.body);
    await lawyer.save();

    logger.info("Lawyer updated successfully", { lawyerId: lawyer._id });

    return res.status(200).json({ success: true, data: lawyer });
  } catch (err: any) {
    logger.error("Error updating lawyer", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE LAWYER (ADMIN ONLY)
export const deleteLawyer = async (req: AuthRequest, res: Response) => {
  try {
    const lawyer = await LawyerModel.findById(req.params.id);
    if (!lawyer)
      return res
        .status(404)
        .json({ success: false, message: "Lawyer not found" });

    if (!req.token?.admin) {
      logger.warn("Unauthorized lawyer delete attempt", {
        user: req.token?.lawyer_token,
      });
      return res
        .status(403)
        .json({ success: false, message: "Access denied, admin only" });
    }

    await lawyer.deleteOne();
    logger.info("Lawyer deleted successfully", { lawyerId: lawyer._id });

    return res
      .status(200)
      .json({ success: true, message: "Lawyer deleted successfully" });
  } catch (err: any) {
    logger.error("Error deleting lawyer", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE PROFILE PASSWORD
export const updateProfilePassword = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const lawyer = await LawyerModel.findById(req.params.id);
    if (!lawyer)
      return res
        .status(404)
        .json({ success: false, message: "Lawyer not found" });

    if (req.token?.lawyer_token !== lawyer.token) {
      logger.warn("Unauthorized profile password update", {
        user: req.token?.lawyer_token,
      });
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      lawyer.profile_password,
    );
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });

    lawyer.profile_password = await bcrypt.hash(newPassword, 10);
    await lawyer.save();

    logger.info("Profile password updated", { lawyerId: lawyer._id });

    return res.status(200).json({
      success: true,
      message: "Profile password updated successfully",
    });
  } catch (err: any) {
    logger.error("Error updating profile password", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE PORTAL PASSWORD
export const updatePortalPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { profilePassword, newPortalPassword } = req.body;
    const lawyer = await LawyerModel.findById(req.params.id);
    if (!lawyer)
      return res
        .status(404)
        .json({ success: false, message: "Lawyer not found" });

    if (req.token?.lawyer_token !== lawyer.token) {
      logger.warn("Unauthorized portal password update", {
        user: req.token?.lawyer_token,
      });
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(
      profilePassword,
      lawyer.profile_password,
    );
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Profile password is incorrect" });

    lawyer.portal_password = await bcrypt.hash(newPortalPassword, 10);
    await lawyer.save();

    logger.info("Portal password updated", { lawyerId: lawyer._id });

    return res
      .status(200)
      .json({ success: true, message: "Portal password updated successfully" });
  } catch (err: any) {
    logger.error("Error updating portal password", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(400).json({ success: false, message: err.message });
  }
};

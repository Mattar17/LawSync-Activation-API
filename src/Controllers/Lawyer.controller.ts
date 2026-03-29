import LawyerModel from "../Models/Lawyer";
import { type Request, type Response } from "express";
import { generateLawyerId } from "../utils/generateLawyerId.js";
import bcrypt from "bcrypt";

interface AuthRequest extends Request {
  token?: {
    admin?: boolean;
    lawyer_token?: string;
  };
}

export const getAllLawyers = async (req: AuthRequest, res: Response) => {
  try {
    const lawyers = await LawyerModel.find();

    return res.status(200).json({
      success: true,
      count: lawyers.length,
      data: lawyers,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getLawyerByToken = async (req: AuthRequest, res: Response) => {
  try {
    const lawyer = await LawyerModel.find({ token: `${req.params.token}` });

    if (!lawyer.length) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: lawyer,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const createLawyer = async (req: AuthRequest, res: Response) => {
  try {
    console.log(req.token);
    if (!req.token?.admin) {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }

    const { name } = req.body;

    const token: string = await generateLawyerId();
    if (!token) throw new Error("token generation failed");

    const hashedProfilePassword = await bcrypt.hash("000000", 10);
    const hashedPortalPassword = await bcrypt.hash("000000", 10);

    const lawyer = await LawyerModel.create({
      token,
      name,
      profile_password: hashedProfilePassword,
      portal_password: hashedPortalPassword,
    });

    return res.status(201).json({
      success: true,
      data: lawyer,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateLawyer = async (req: AuthRequest, res: Response) => {
  try {
    const lawyer = await LawyerModel.findById(req.params.id);

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

    Object.assign(lawyer, req.body);
    await lawyer.save();

    return res.status(200).json({
      success: true,
      data: lawyer,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteLawyer = async (req: AuthRequest, res: Response) => {
  try {
    const lawyer = await LawyerModel.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    if (!req.token?.admin) {
      return res.status(403).json({
        success: false,
        message: "Access denied,Admin only",
      });
    }

    await lawyer.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Lawyer deleted successfully",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateProfilePassword = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const lawyer = await LawyerModel.findById(req.params.id);

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

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    lawyer.profile_password = hashedPassword;

    await lawyer.save();

    return res.status(200).json({
      success: true,
      message: "Profile password updated successfully",
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const updatePortalPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { profilePassword, newPortalPassword } = req.body;

    const lawyer = await LawyerModel.findById(req.params.id);

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

    const hashedPortalPassword = await bcrypt.hash(newPortalPassword, 10);
    lawyer.portal_password = hashedPortalPassword;

    await lawyer.save();

    return res.status(200).json({
      success: true,
      message: "Portal password updated successfully",
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

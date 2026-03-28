import LawyerModel from "../Models/Lawyer";
import { type Request, type Response } from "express";
import { generateLawyerId } from "../utils/generateLawyerId.js";

/**
 * @desc Get all lawyers
 */
export const getAllLawyers = async (req: Request, res: Response) => {
  try {
    const lawyers = await LawyerModel.find();

    return res.status(200).json({
      success: true,
      count: lawyers.length,
      data: lawyers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * @desc Get single lawyer by Token
 */
export const getLawyerByToken = async (req: Request, res: Response) => {
  try {
    const lawyer = await LawyerModel.find({ token: `${req.params.token}` });
    console.log(lawyer);

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
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * @desc Create new lawyer
 */
export const createLawyer = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const token: string = await generateLawyerId();
    console.log(token);
    if (!token) throw new Error("token generation failed");
    const lawyer = await LawyerModel.create({
      token,
      name,
    });
    console.log(lawyer);

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

/**
 * @desc Update lawyer
 */
export const updateLawyer = async (req: Request, res: Response) => {
  try {
    const lawyer = await LawyerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!lawyer) {
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
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * @desc Delete lawyer
 */
export const deleteLawyer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lawyer = await LawyerModel.findByIdAndDelete(id);

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lawyer deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `${err} Server Error`,
    });
  }
};

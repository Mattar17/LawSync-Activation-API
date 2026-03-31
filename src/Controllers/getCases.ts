import CaseModel from "../Models/Case";
import { type Request, type Response } from "express";

export const getLawyerCases = async function (
  req: Request,
  res: Response,
): Promise<Response> {
  const { token } = req.params;
  const cases = await CaseModel.find({ lawyer_token: `${token}` }).select(
    "-lawyer_token",
  );
  if (cases.length === 0) return res.json("no cases found for this lawyer");
  return res.status(200).json({ success: true, data: cases });
};

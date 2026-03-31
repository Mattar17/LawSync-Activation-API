import { type Request, type Response } from "express";
import CaseModel, { type ICase } from "../Models/Case";
import LawyerModel from "../Models/Lawyer";

const SyncCases = async (req: Request, res: Response) => {
  try {
    const { token, cases } = req.body;

    const Lawyer = await LawyerModel.find({ token });

    if (!Lawyer)
      return res
        .status(403)
        .json({ success: false, message: "Invalid lawyer token" });

    await CaseModel.bulkWrite(
      cases.map((c: any) => ({
        updateOne: {
          filter: { case_number: c.case_number, case_year: c.case_year },
          update: { $set: { lawyer_token: token, ...c } },
          upsert: true,
        },
      })),
    );

    return res.json("sync completed");
  } catch (err) {
    return res.status(500).json(`${err} , server error`);
  }
};

export default SyncCases;

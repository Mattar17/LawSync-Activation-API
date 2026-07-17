import type { Request, Response } from "express";
import supabase from "../Services/supabaseClient.js";
import logger from "../utils/logger.js";
import { success } from "zod";

interface AuthRequest extends Request {
  token?: {
    admin?: boolean;
    lawyer_token?: string;
    lawyer_id?: string;
  };
}
//POST /offices/:officeId/cases (owner only)
export async function CreateCase(req: AuthRequest, res: Response) {
  try {
    const { officeId } = req.params;
    const lawyerId = req.token?.lawyer_id;

    const { data: office, error: officeError } = await supabase
      .from("offices")
      .select("owner_id")
      .eq("id", officeId)
      .single();

    if (officeError || !office)
      return res
        .status(404)
        .json({ success: false, message: "Office doesn't exist" });

    if (office.owner_id !== lawyerId)
      return res.status(403).json({
        success: false,
        message: "Only owner can add cases to this office ",
      });

    const caseData = {
      ...req.body,
      office_id: officeId,
    };

    const { data: createdCase, error: caseError } = await supabase
      .from("cases")
      .insert(caseData)
      .select("*")
      .single();

    if (caseError) {
      if (caseError?.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "يوجد قضية بنفس الرقم والسنة داخل هذا المكتب",
        });
      }
      logger.error(`Error creating the case : ${caseError.message}`);
      return res
        .status(500)
        .json({ success: false, message: "خطأ أثناء إضافة قضية" });
    }

    return res.status(201).json({
      success: true,
      message: "Case Added Successfully",
      data: createdCase,
    });
  } catch (error: any) {
    logger.error(`Error creating the case : ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "خطأ أثناء إضافة قضية" });
  }
}

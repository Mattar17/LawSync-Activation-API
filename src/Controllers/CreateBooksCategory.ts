import type { Request, Response } from "express";
import logger from "../utils/logger.js";
import supabase from "../Services/supabaseClient.js";
import type { AuthRequest } from "../types/AuthRequest.js";
export default async function CreateCategory(req: AuthRequest, res: Response) {
  try {
    if (!req.token?.is_admin) {
      return res
        .status(403)
        .json({ success: false, message: "لا يمكنك إضافة تصنيف" });
    }

    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "اسم التصنيف غير صحيح" });
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({ name: name.trim() })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res
          .status(409)
          .json({ success: false, message: "هذا التصنيف موجود بالفعل" });
      }
      logger.error(`error creating category: ${error.message}`);
      return res
        .status(500)
        .json({ success: false, message: "حدث خطأ أثناء إنشاء التصنيف" });
    }

    return res.status(200).json({ success: true, category: data });
  } catch (err: any) {
    logger.error(`error creating category: ${err.message}`);
    return res
      .status(500)
      .json({ success: false, message: "حدث خطأ أثناء إنشاء التصنيف" });
  }
}

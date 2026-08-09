import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";
import supabase from "../Services/supabaseClient.js";
import { type AuthRequest } from "../types/AuthRequest.js";

interface IFileRequest extends AuthRequest {
  file?: Express.Multer.File;
}

export type FileRequest = IFileRequest;

export async function UploadBook(req: AuthRequest, res: Response) {
  try {
    const { title, description, category } = req.body;

    if (!title || typeof title !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "عنوان الكتاب مطلوب" });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({ success: false, message: "التصنيف مطلوب" });
    }

    const uploadedBy = req.token?.lawyer_id;
    if (!uploadedBy) {
      return res.status(401).json({ success: false, message: "غير مصرح" });
    }

    const { data: fetchedCategory, error: catError } = await supabase
      .from("categories")
      .select("id,name")
      .eq("name", category)
      .single();

    if (!fetchedCategory || catError)
      return res
        .status(404)
        .json({ success: false, message: "التصنيف غير صحيح أو تم حذفه" });

    const file = req.file;
    if (!file)
      return res
        .status(403)
        .json({ success: false, message: "لا يوجد ملف لإضافته" });

    const ext = path.extname(req.file!.originalname);
    const bookId = crypto.randomUUID();
    const supabasePath = `${fetchedCategory.id}/${bookId}${ext}`;

    const fileBuffer = fs.readFileSync(req.file!.path);

    const { error } = await supabase.storage
      .from("books")
      .upload(supabasePath, fileBuffer, { contentType: req.file!.mimetype });

    fs.unlinkSync(req.file!.path);

    if (error) {
      logger.error(`[upload error] ${error.message}`);
      return res
        .status(500)
        .json({ success: false, message: "حدث خطأ أثناء رفع الملف" });
    }

    const { data: insertedBook, error: insertError } = await supabase
      .from("books")
      .insert({
        id: bookId,
        title,
        description: description ?? null,
        category_id: fetchedCategory.id,
        uploaded_by: uploadedBy,
        storage_path: supabasePath,
        file_ext: ext,
        file_size_bytes: req.file?.size,
      })
      .select()
      .single();

    if (insertError) {
      logger.error(insertError.message);
      await supabase.storage.from("books").remove([supabasePath]);
      return res
        .status(500)
        .json({ success: false, message: "حدث خطأ أثناء حفظ بيانات الكتاب" });
    }

    return res
      .status(200)
      .json({ success: true, message: "تم رفع الكتاب بنجاح" });
  } catch (err: any) {
    logger.error(`UploadBookController error: ${err.message}`);
    return res
      .status(500)
      .json({ success: false, message: "حدث خطأ في الخادم" });
  } finally {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
}

export async function GetAllBooksInCategory(req: AuthRequest, res: Response) {
  try {
    const { categoryId } = req.params;

    const { data: fetchedCategory, error: catError } = await supabase
      .from("categories")
      .select("id,name")
      .eq("id", categoryId)
      .single();

    if (!fetchedCategory || catError)
      return res
        .status(404)
        .json({ success: false, message: "التصنيف غير صحيح أو تم حذفه" });

    const { data: books, error: fetchError } = await supabase
      .from("books")
      .select("*")
      .eq("category_id", categoryId);

    if (fetchError) {
      logger.error(`[fetch books error]: ${fetchError.message}`);
      return res
        .status(500)
        .json({ success: false, message: "حدث خطأ أثناء تحميل الكتب" });
    }

    return res.status(200).json({ success: true, data: books });
  } catch (err: any) {
    logger.error(`GET all books error: ${err.message}`);
    return res
      .status(500)
      .json({ success: false, message: "حدث خطأ في الخادم" });
  }
}

export async function GetFileUrl(req: AuthRequest, res: Response) {
  let { filePath } = req.body;
  const { data } = await supabase.storage
    .from("books")
    .createSignedUrl(filePath, 60 * 5);

  return res.json(data);
}

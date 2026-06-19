import type { Request, Response } from "express";
import bycrypt from "bcrypt";
import supabase from "../Services/supabaseClient.js";
import logger from "../utils/logger.js";
export default async function Register(req: Request, res: Response) {
  const { name, email, password, phone } = req.body;
  const hashedPassword = await bycrypt.hash(password, 12);
  console.log(hashedPassword);
  const { error } = await supabase
    .from("lawyers")
    .insert({ name, email, phone, password_hash: hashedPassword });
  if (error) {
    logger.error(`${error.message}:خطأ`);
    return res.status(500).json("حدث خطأ أثناء التسجيل");
  }

  return res.status(200).json({ success: true, message: "تم التسجيل بنجاح" });
}

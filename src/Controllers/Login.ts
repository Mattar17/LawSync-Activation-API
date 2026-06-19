import { type Response, type Request } from "express";
import bcrypt from "bcrypt";
import generateToken from "../Services/generateToken.js";
import logger from "../utils/logger.js";
import supabase from "../Services/supabaseClient.js";

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Admin login
    if (
      email === process.env.ADMIN_TOKEN &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const generatedToken = await generateToken({ admin: true });
      logger.info(`Admin login successful`);
      return res.status(200).json({ success: true, data: generatedToken });
    }

    // Lawyer login
    logger.info(`Lawyer login attempt with email: ${email}`);

    const { data: lawyer, error } = await supabase
      .from("lawyers")
      .select()
      .eq("email", email)
      .single();

    if (error || !lawyer) {
      logger.warn(`Lawyer not found for email: ${email}`);
      return res.status(404).json({
        success: false,
        message: "المستخدم غير موجود",
      });
    }

    const isMatch = await bcrypt.compare(password, lawyer.password_hash);
    if (!isMatch) {
      logger.warn(`Invalid password attempt for email: ${email}`);
      return res.status(401).json({
        success: false,
        message: "كلمة المرور غير صحيحة",
      });
    }

    const generatedToken = await generateToken({
      lawyer_email: email,
      lawyer_id: lawyer.id,
    });

    logger.info(`Lawyer login successful for email: ${email}`);
    return res.status(200).json({
      success: true,
      data: generatedToken,
    });
  } catch (err) {
    logger.error(`Login error: ${err}`);
    return res
      .status(500)
      .json({ success: false, message: `${err} server error` });
  }
};

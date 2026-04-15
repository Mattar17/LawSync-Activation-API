import { type Response, type Request } from "express";
import bcrypt from "bcrypt";
import generateToken from "../Services/generateToken.js";
import logger from "../utils/logger.js";
import supabase from "../Services/supabaseClient.js";

export const Login = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (
      token === process.env.ADMIN_TOKEN &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const generatedToken = await generateToken({ admin: true });
      logger.info(`Admin login successful`);
      return res.status(200).json({ success: true, data: generatedToken });
    } else {
      logger.info(`Lawyer login attempt with token: ${token}`);
      const { data: lawyer, error } = await supabase
        .from("lawyers")
        .select()
        .eq("token", token)
        .single();

      if (error) {
        return res.status(404).json({
          success: false,
          message: "المستخدم غير موجود",
        });
      }

      if (!lawyer) {
        logger.warn(`Lawyer not found for token: ${token}`);
        return res.status(404).json({
          success: false,
          message: "المستخدم غير موجود",
        });
      }

      const isMatch = bcrypt.compareSync(password, lawyer.profile_password);
      if (!isMatch) {
        logger.warn(`Invalid password attempt for lawyer token: ${token}`);
        return res.status(401).json({
          success: false,
          message: "كلمة المرور غير صحيحة",
        });
      }

      const generatedToken = await generateToken({
        lawyer_token: token,
        lawyer_id: lawyer.id,
      });
      logger.info(`Lawyer login successful for token: ${token}`);
      return res.status(200).json({
        success: true,
        data: generatedToken,
      });
    }
  } catch (err) {
    logger.error(`Login error: ${err}`);
    return res
      .status(500)
      .json({ success: false, message: `${err} server error` });
  }
};

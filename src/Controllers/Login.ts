import { type Response, type Request } from "express";
import bcrypt from "bcrypt";
import generateToken from "../Services/generateToken.js";
import LawyerModel from "../Models/Lawyer.js";
import logger from "../utils/logger.js";

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
      const lawyer = await LawyerModel.findOne({ token: `${token}` });

      if (!lawyer) {
        logger.warn(`Lawyer not found for token: ${token}`);
        return res.status(404).json({
          success: false,
          message: "Lawyer not found",
        });
      }

      const isMatch = bcrypt.compareSync(password, lawyer.profile_password);
      if (!isMatch) {
        logger.warn(`Invalid password attempt for lawyer token: ${token}`);
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }

      const generatedToken = await generateToken({ lawyer_token: token });
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

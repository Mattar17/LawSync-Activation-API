import { type Response, type Request } from "express";
import bcrypt from "bcrypt";
import generateToken from "../Services/generateToken.js";
import LawyerModel from "../Models/Lawyer.js";
export const Login = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (
      token === process.env.ADMIN_TOKEN &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const generatedToken = await generateToken({ admin: true });
      return res.status(200).json({ success: true, data: generatedToken });
    } else {
      console.log(token);
      const lawyer = await LawyerModel.findOne({ token: `${token}` });
      if (!lawyer) {
        return res.status(404).json({
          success: false,
          message: "Lawyer not found",
        });
      }
      const isMatch = bcrypt.compareSync(password, lawyer.profile_password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }
      const generatedToken = await generateToken({ lawyer_token: token });
      return res.status(200).json({
        success: true,
        data: generatedToken,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `${err} server error` });
  }
};

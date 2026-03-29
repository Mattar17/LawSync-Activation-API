import jwt from "jsonwebtoken";

export default function adminOnly(req: any, res: any, next: any) {
  if (!req.token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  console.log("Token in adminOnly middleware:", req.token);
  // jwt.verify(
  //   req.token as string,
  //   process.env.JWT_SECRET as string,
  //   (err: any, decoded: any) => {
  //     if (err) {
  //       console.error("Token verification error:", err);
  //       return res
  //         .status(401)
  //         .json({ success: false, message: "Invalid token" });
  //     }
  //     if (!decoded.admin) {
  //       return res
  //         .status(403)
  //         .json({ success: false, message: "Access denied. Admin only." });
  //     }
  //     next();
  //   },
  // );
  if (!req.token.admin) {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Admin only." });
  }
  next();
}

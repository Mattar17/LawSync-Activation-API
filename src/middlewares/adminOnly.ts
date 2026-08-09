export default function adminOnly(req: any, res: any, next: any) {
  if (!req.token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  if (!req.token.is_admin) {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Admin only." });
  }
  next();
}

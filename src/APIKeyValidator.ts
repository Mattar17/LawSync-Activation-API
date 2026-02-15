import { type Request, type Response, type NextFunction } from "express";

export default async function apiKeyValidation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const apiKey = req.get("apiKey");

  if (!apiKey) return res.status(403).json("api key must be provided");

  if (apiKey !== process.env.API_KEY)
    return res.status(403).json("api key isn't valid");

  next();
}

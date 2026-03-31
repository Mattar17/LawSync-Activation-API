import logger from "../utils/logger";
import type { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info("Request", {
    method: req.method,
    url: req.originalUrl,
  });

  next();
};

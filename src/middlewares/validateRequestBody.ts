import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
export default function validateRequestBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error.flatten());
    }
    req.body = result.data;

    next();
  };
}

import type { Request } from "express";

interface IAuthRequest extends Request {
  token?: {
    admin?: boolean;
    lawyer_token?: string;
    lawyer_id?: string;
  };
}

export type AuthRequest = IAuthRequest;

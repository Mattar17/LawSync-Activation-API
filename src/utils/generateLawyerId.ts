import crypto from "crypto";
export const generateLawyerId = async (): Promise<string> => {
  const randomString = crypto.randomBytes(9).toString("hex").slice(0, 12);
  return randomString;
};

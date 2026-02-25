import crypto from "crypto";

export default function signLicense(payload: object) {
  const privateKey = process.env.LICENSE_SECRET!;
  const data = JSON.stringify(payload);

  const sign = crypto.createSign("SHA256");
  sign.update(data);
  sign.end();

  const signature = sign.sign(privateKey, "base64");

  return { payload, signature };
}

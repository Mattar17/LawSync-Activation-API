import crypto from "crypto";

export default function signLicense(payload: object) {
  const rawKey = process.env.LICENSE_SECRET!;
  const privateKey = rawKey.includes("\\n")
    ? rawKey.replace(/\\n/g, "\n")
    : rawKey;
  const data = JSON.stringify(payload);
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(data);
  sign.end();

  const signature = sign.sign(privateKey, "base64");

  return { payload, signature };
}

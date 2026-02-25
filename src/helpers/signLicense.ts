import crypto from "crypto";

export default function signLicense(payload: object) {
  const privateKey = process.env.LICENSE_SECRET!.replace(/\\n/g, "\n");
  const data = JSON.stringify(payload);
  console.log("Data to be signed:", data);
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(data);
  sign.end();

  const signature = sign.sign(privateKey, "base64");

  return { payload, signature };
}

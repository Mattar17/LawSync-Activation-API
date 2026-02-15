import crypto from "crypto";
import { readFileSync } from "fs";

export default function signLicense(payload: object) {
  const privateKey = readFileSync(
    new URL("../../private.pem", import.meta.url),
    "utf8",
  );
  const data = JSON.stringify(payload);

  const sign = crypto.createSign("SHA256");
  sign.update(data);
  sign.end();

  const signature = sign.sign(privateKey, "base64");

  return { payload, signature };
}

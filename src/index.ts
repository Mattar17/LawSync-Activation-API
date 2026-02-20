import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
const app = express();
import License from "./License.js";
import ValidateLicense from "./ValidateLicense.js";
import APIKeyValidation from "./APIKeyValidator.js";
import ActivateLicense from "./ActivateLicense.js";
import StartTrial from "./BeginTrial.js";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("mongodDB Connected✅"))
  .catch((err) =>
    console.log(`${err} to ${process.env.MONGO_URI} mongodDB didn't connect☹`),
  );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  const licenses = await License.find({});
  if (!licenses) return res.json("Not found");

  return res.json(licenses);
});

app.post("/api/licenses/validate", APIKeyValidation, ValidateLicense);
app.post("/api/licenses/activate", APIKeyValidation, ActivateLicense);
app.post("/api/licenses/trial/start", APIKeyValidation, StartTrial);

app.listen(8000, () => {
  console.log("typescript + express api is running on :8000");
});

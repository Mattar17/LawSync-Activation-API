import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import router from "./router.js";
import cors from "cors";

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  }),
);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("mongodDB Connected✅"))
  .catch((err) =>
    console.log(`${err} to ${process.env.MONGO_URI} mongodDB didn't connect☹`),
  );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  res.json("Welcome to the License Management API 💙");
});

app.use("/", router);

app.listen(8000, () => {
  console.log("typescript + express api is running on :8000");
});

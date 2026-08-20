import express from "express";
import supertest from "supertest";
import { describe, it, expect } from "@jest/globals";
import router from "@/routes/index.js";

const app = express();
app.use(router);

describe("Testing integration", () => {
  it("should return 200", async () => {
    await supertest(app)
      .get("/test")
      .expect(200)
      .then((res) => expect(res.body.ok).toBe(true));
  });
});

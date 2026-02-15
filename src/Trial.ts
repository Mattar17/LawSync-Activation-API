import { Schema, model } from "mongoose";

const trialSchema = new Schema({
  machineId: { type: String, required: true },
  type: {
    type: String,
    default: "trial",
  },
  startedAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});

export default model("Trial", trialSchema);

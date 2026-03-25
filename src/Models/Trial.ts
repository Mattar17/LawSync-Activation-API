import { Schema, model } from "mongoose";

interface ITrial {
  machineId: string;
  type: string;
  startedAt: Date;
  expiresAt: Date;
}

const trialSchema = new Schema<ITrial>({
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

export default model<ITrial>("Trial", trialSchema);

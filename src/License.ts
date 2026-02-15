import { Schema, model } from "mongoose";

interface IUsedDevices {
  machineId: string;
  activatedAt: Date;
  lastSeenAt: Date;
}

interface ILicense {
  key: string;
  plan: string;
  maxDevices: number;
  usedDevices: IUsedDevices[];
  expiresAt: Date;
  isRevoked: boolean;
}

const UsedDeviceSchema = new Schema(
  {
    machineId: { type: String, required: true },
    activatedAt: { type: Date, required: true },
    lastSeenAt: { type: Date, required: true },
  },
  { _id: false },
);

const licenseSchema = new Schema<ILicense>({
  key: { type: String, unique: true },

  plan: {
    type: String,
    enum: ["trial", "basic", "pro"],
    default: "pro",
  },

  maxDevices: { type: Number, default: 1 },

  usedDevices: {
    type: [UsedDeviceSchema],
    default: [],
  },

  expiresAt: Date,

  isRevoked: { type: Boolean, default: false },
});

const License = model<ILicense>("License", licenseSchema);
export default License;

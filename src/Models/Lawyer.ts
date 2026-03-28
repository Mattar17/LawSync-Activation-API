import mongoose, { Schema } from "mongoose";

export interface ILawyer extends Document {
  token: string;
  name: string;
  avatarUrl: string;
  portal_password: string;
  profile_password: string;
  description: string;
}

const LawyerSchema: Schema<ILawyer> = new Schema(
  {
    token: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    portal_password: {
      type: String,
      required: true,
      default: "0000",
    },
    profile_password: {
      type: String,
      required: true,
      default: "0000",
    },
    description: {
      type: String,
      required: true,
      default: "LawySync lawyer",
    },
  },
  {
    timestamps: true,
  },
);

// 3. Model
const LawyerModel = mongoose.model<ILawyer>("Lawyer", LawyerSchema);

export default LawyerModel;

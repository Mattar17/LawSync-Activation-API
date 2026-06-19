import mongoose, { Schema, Document } from "mongoose";

export interface ILawyer extends Document {
  email: string;
  passwordHash: string;
  name: string;
  pictureUrl?: string;
  bio?: string;
  phone?: string;
}

const LawyerSchema: Schema<ILawyer> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pictureUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const LawyerModel = mongoose.model<ILawyer>("Lawyer", LawyerSchema);

export default LawyerModel;

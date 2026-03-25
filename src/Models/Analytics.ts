import { Schema, model } from "mongoose";
interface Analytics {
  numberOfDownloads: number;
}

const AnalyticsSchema = new Schema({
  key: {
    type: String,
    default: "global",
  },
  numberOfDownloads: {
    type: Number,
    required: true,
    default: 0,
  },
});

const AnalyticsModel = model<Analytics>("Analytics", AnalyticsSchema);
export default AnalyticsModel;

import { Schema, model } from "mongoose";

export interface VidInterface {
  _id: string;
  vidName: string;
  channelName: string;
  duration: string;
}
const videoSchema = new Schema<VidInterface>(
  {
    _id: {
      type: String,
      required: true,
    },
    vidName: {
      type: String,
      required: true,
    },
    channelName: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const VidModel = model<VidInterface>("VidModel", videoSchema);
export default VidModel;

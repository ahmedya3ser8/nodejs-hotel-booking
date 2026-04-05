import mongoose, { Document, Schema, Types } from "mongoose";

export interface IHotel extends Document {
  name: string;
  address: string;
  contact: string;
  city: string;
  user: Types.ObjectId;
}

const hotelSchema: Schema<IHotel> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User'
    },
  },
  { timestamps: true }
);

const Hotel = mongoose.model<IHotel>('Hotel', hotelSchema);

export default Hotel;

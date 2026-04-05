import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRoom extends Document {
  roomType: string;
  pricePerNight: number;
  amenities: string[];
  images: { url: string; publicId: string }[];
  hotel: Types.ObjectId;
  isAvailable: boolean;
}

const roomSchema: Schema<IRoom> = new mongoose.Schema(
  {
    roomType: {
      type: String,
      required: true
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    amenities: [
      {
        type: String,
        required: true,
      }
    ],
    images: [
      {
        url: { type: String },
        publicId: { type: String },
        _id: false
      }
    ],
    isAvailable: {
      type: Boolean,
      default: true
    },
    hotel: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Hotel'
    },
  },
  { timestamps: true }
);

const Room = mongoose.model<IRoom>('Room', roomSchema);

export default Room;

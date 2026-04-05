import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBooking extends Document {
  room: Types.ObjectId;
  user: Types.ObjectId;
  hotel: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  guests: number;
  status: string;
  paymentMethod: string;
  isPaid: boolean;
}

const bookingSchema: Schema<IBooking> = new mongoose.Schema(
  {
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      default: 'Pay At Hotel'
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    hotel: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Hotel'
    },
    room: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Room'
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User'
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;

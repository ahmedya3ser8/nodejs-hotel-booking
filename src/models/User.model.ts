import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'admin';
  passwordChangeAt: Date;
  profileImage?: string | null;
  profileImagePublicId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    phone: {
      type: String,
      required: true,
      minlength: 11,
      maxlength: 11
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    profileImage: {
      type: String,
      default: null
    },
    profileImagePublicId: {
      type: String,
      default: null
    },
    passwordChangeAt: {
      type: Date
    }
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;

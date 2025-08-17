import mongoose from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  paymentDone: boolean;
  password: string;
  credits: number;
  package: string;
  createdAt: Date;
  updatedAt: Date;

}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter Email"],
      validate: {
        validator: (email: string) => /\S+@\S+\.\S+/.test(email),
        message: "Please enter a valid Email",
      },
    },
    paymentDone: {
      type: Boolean,
      default: false,
    },
    package: {
      type: String,
      default: "none",
    },
    credits: {
      type: Number,
      default: 30,
      },
    password: { 
        type: String, 
        required: false, 
        minlength: 6, 
        },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", schema);

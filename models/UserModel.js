import mongoose from "mongoose";
import validator from "validator";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: Number,
      required: true,
    },
    address: [
      {
        city: {
          type: String,
          required: true,
        },
        street: {
          type: String,
          required: true,
        },
        building: {
          type: String,
          required: true,
        },
      },
    ],
    role: {
      type: String,
      enum: ["Business", "Organization"],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const User = model("User", UserSchema);

export default User;

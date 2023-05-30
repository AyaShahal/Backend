import mongoose from "mongoose";
import validator from "validator";

const { Schema, model } = mongoose;

const ContactSchema = new Schema(
  {
    FirstName: {
      type: String,
      required: [true, "Please enter a name"],
      unique: true,
    },
    LastName: {
    type: String,
    required: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      validate: [validator.isEmail, "Please enter a valid email"],
    },
  
    phone: {
      type: Number,
      required: true,
    },
    message: {
        type: String,
        required: true,
        },
   
  },
  {
    collection: "contacts",
    timestamps: true,
  }
);

const Contact = model("Contact", ContactSchema);

export default Contact;

import mongoose from "mongoose";
const { Schema, model } = mongoose;
import validator from "validator";

const AdminSchema = new Schema(
    {
        username: {
            type: "string",
            required: [true, "Please enter an username"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Please enter an email"],
            validate: [validator.isEmail, "Please enter a valid email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please enter an Password"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
    },
    {
        collection: "admins",
        timestamps: true,
    }
);
const Admin = model("Admin", AdminSchema);
export default Admin;

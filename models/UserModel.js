import mongoose from "mongoose";
const { Schema, model } = mongoose;
import validator from "validator";

const UserSchema = new Schema(
    {
        username: {
            type: String,
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
        phone: {
            type: Number,
            required: true,
        },
        Address: [{
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
            }
        }],
     role:{
        type: String,
        enum: ["Business", "Organization"]
     }
    },
    {
        collection: "users",
        timestamps: true,
    }
);
const User = model("User", UserSchema);
export default User;

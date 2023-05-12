import Model from "../models/UserModel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const handleErrors = (err) => {
    console.log(err.message);
    let errors = { email: "", password: "" };

    if (err.message.includes("User validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

// register user
export const Register = async (req, res, next) => {
    const saltRounds = 16;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const user = new Model({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
        role: req.body.role,
        address: [
            {
                city: req.body.city,
                building: req.body.building,
                street: req.body.street
            }
        ]

    });
    try {
        await user.validate();
        await user.save();
        res.status(200).send({
            message: "user created successfully",
            user: user,
        });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ message: error.message });
    }
};
// login  user
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await Model.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email does not exist" });
        }
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { _id: user._id, role:user.role , type: "user"},
            process.env.TOKEN_SECRET,
            { expiresIn: "2h" }
        );
        // res.cookie("jwt", token, {
        //     httpOnly: true,
        // });
        res.status(200).json({
            message: "User successfully logged in",
            user: {
                id: user._id,
                email: user.email,
                token: token,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// edit user
export const editUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, phone, city,building,street, password } = req.body;
    try {
        let hashedPassword;
        if (password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        const updatedUser = await Model.findByIdAndUpdate(
            id,
            {
                $set: {
                    username,
                    email,
                    phone,
                    Address: [
                        {
                            city,
                            building,
                            street,
                        }
                    ],
            
                    password: hashedPassword,
                },
            },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res
            .status(200)
            .json({ message: "User updated", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ status: 500, error: error.message });
    }
};

// delete user
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await Model.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res
            .status(200)
            .json({ message: "User deleted", user: deletedUser });
    } catch (error) {
        return res.status(500).json({ status: 500, error: error.message });
    }
};

// logout user
export const logOut = (req, res) => {
    res.clearCookie("jwt");
    return res.send("Log out successfully");
};

const Controller = {
    Register,
    login,
    logOut,
    editUser,
    deleteUser,
};

export default Controller;

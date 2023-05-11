import Model from "../models/AdminModel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const handleErrors = (err) => {
    console.log(err.message);
    let errors = { email: "", password: "" };

    if (err.message.includes("Admin validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

// get all admin

export const getAll = async (req, res, next) => {
    try {
        const response = await Model.find({});
        res.status(200).send({ success: true, response });
    } catch (err) {
        return next(err);
    }
};

// get admin by id

export const get = async (req, res, next) => {
    try {
        let id = req.params.id;
        const response = await Model.findOne({ _id: id });
        if (!response) {
            return res.status(404).send({ message: "admin not found" });
        }
        res.status(200).send({ success: true, response });
    } catch (err) {
        return next(err);
    }
};

// new admin Register

export const Register = async (req, res, next) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const admin = new Model({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        isSuper: req.body.isSuper,
    });
    try {
        await admin.validate();
        await admin.save();
        res.status(200).send({
            message: "admin created successfully",
            admin: admin,
        });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const admin = await Model.findOne({ email });
        if (!admin) {
            return res.status(400).send("Email does not exist");
        }
        const validPass = await bcrypt.compare(password, admin.password);
        if (!validPass) {
            return res.status(400).send("Invalid password");
        }

        // Create and send JWT token
        const token = jwt.sign(
            { _id: admin._id, isSuper: admin.isSuper, type: "admin" },
            process.env.TOKEN_SECRET,
            { expiresIn: "2h" }
        );
        res.cookie("jwt", token, {
            httpOnly: true,
        });
        res.status(200).json({
            message: "User successfully logged in",
            admin: {
                id: admin._id,
                email: admin.email,
                token: token,
                type:"admin"
            },
        });
    } catch (error) {
        next(error);
    }
};
// logout
export const logOut = (req, res) => {
    res.clearCookie("jwt");
    return res.send("Log out successfully");
};
// edit
export const edit = async (req, res, next) => {
    const { id } = req.params;
    
    // Check if password exists in req.body
    if (req.body.password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hashedPassword;
    }
    
    try {
        const response = await Model.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
        });
        if (!response) {
            return res.status(404).send({ message: "admin not found" });
        }
        res.status(200).send({
            message: "admin updated successfully",
            success: true,
            response,
        });
    } catch (err) {
        console.log(err);
    }
};

// delete admin

export const deleteadmin = async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid admin ID" });
    }

    try {
        const response = await Model.findOneAndDelete({ _id: id });
        if (!response) {
            return res.status(404).send({ message: "admin not found" });
        }
        res.status(200).send({ message: "admin deleted successfully" });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

const Controller = {
    getAll,
    get,
    Register,
    login,
    edit,
    deleteadmin,
    logOut,
};
export default Controller;

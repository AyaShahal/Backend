import jwt from "jsonwebtoken";
import Admin from "../models/AdminModel.js";
import User from "../models/UserModel.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Token Unavailable" });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decoded.type === "user") {
      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(403).json({ message: "Access denied. User not found." });
      }
      req.user = user;
    } else if (decoded.type === "admin") {
      const admin = await Admin.findById(decoded._id);
      if (!admin) {
        return res.status(403).json({ message: "Access denied. Admin not found." });
      }
      req.admin = admin;
    }
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Token is invalid", error: error.message });
  }
};

export default verifyToken;

export const authenticateBusiness = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Access denied. User not found." });
    }

    if (req.user.role !== "Business") {
      return res.status(403).json({
        message: "Access denied. Only business users can perform this action.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(403).json({ message: "Not an Admin" });
    }

    req.admin = await Admin.findById(req.admin._id);
    next();
  } catch (error) {
    next(error);
  }
};

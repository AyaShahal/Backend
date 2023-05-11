import jwt from "jsonwebtoken";
// import Admin from "../models/AdminModel.js";

const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Token Unavailable" });
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req[decoded.type] = decoded;
        next();
    } catch (error) {
        return res
            .status(400)
            .json({ message: "Token is invalid", error: error.message });
    }
};

export default verifyToken;



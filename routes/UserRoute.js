import express from "express";
import Controller from "../controllers/UserController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/",Controller.getAll);
router.post("/register", Controller.Register);
router.post("/login", Controller.login);
router.post("/logout", Controller.logOut);
router.put("/edit/:id", verifyToken, Controller.editUser);
router.delete("/delete/:id", verifyToken,Controller.deleteUser);

export default router;

import express from "express";
const router = express.Router();
import controller from "../controllers/AdminController.js";
import verifyToken, { verifyAdmin } from "../middleware/auth.js";

router.get("/", verifyToken, verifyAdmin, controller.getAll);
router.get("/:id", verifyToken, verifyAdmin, controller.get);
router.post(
    "/register",
    verifyToken,
    verifyAdmin,
    controller.Register
);
router.post("/login", controller.login);
router.post("/logout", controller.logOut);
router.patch("/:id", verifyToken, verifyAdmin, controller.edit);
router.delete(
    "/:id",
    verifyToken,
    verifyAdmin,
    controller.deleteadmin
);

export default router;

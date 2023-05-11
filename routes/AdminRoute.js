import express from "express";
const router = express.Router();
import controller from "../controllers/AdminController.js";
import verifyToken from "../middleware/auth.js";

router.get("/", verifyToken, controller.getAll);
router.get("/:id", verifyToken,  controller.get);
router.post(
    "/register",
  
    controller.Register
);
router.post("/login", controller.login);
router.post("/logout", controller.logOut);
router.patch("/:id", verifyToken,  controller.edit);
router.delete(
    "/:id",
    verifyToken,
    controller.deleteadmin
);

export default router;

import express from "express";
import Controller from "../controllers/CategoryController.js";
import imageHandle from "../middleware/imageHandle.js";
import verifyToken, { verifyAdmin } from "../middleware/auth.js";
const router = express.Router();

router.get("/", Controller.getAll);
router.get("/:id", Controller.get);
router.post(
    "/",
    verifyToken,
    verifyAdmin,
    imageHandle,
    Controller.addCategories
);
router.patch(
    "/:id",
    verifyToken,
    verifyAdmin,
    imageHandle,
    Controller.updateCategories
);
router.delete("/:id", verifyToken, verifyAdmin, Controller.deleteCategories);

export default router;



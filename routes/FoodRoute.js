import express from "express";
import FoodController from "../controllers/FoodController.js";
import verifyToken, { authenticateBusiness } from "../middleware/auth.js";
import imageHandle from "../middleware/imageHandle.js";

const router = express.Router();

router.get("/", FoodController.getAllFoods);
router.get("/:id", FoodController.getAllFoodsByUserId);
router.get("/:id", FoodController.getFoodById);

router.post(
  "/",
  verifyToken,
  authenticateBusiness,
  imageHandle,
  FoodController.addFood
);

router.patch(
  "/:id",
  verifyToken,
  authenticateBusiness,
  imageHandle,
  FoodController.editFood
);

router.delete("/:id", verifyToken, authenticateBusiness, FoodController.deleteFood);

export default router;

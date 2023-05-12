import Food from "../models/ FoodModel.js"
import fs from "fs";
// Get all Foods
const getAllFoods = async (req, res) => {
  try {
    const Foods = await Food.find();
    console.log(Foods);
    res.json(Foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Food by ID
const getFoodById = async (req, res) => {
  try {
    const Food = await Food.findById(req.params.id);
    if (!Food) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.json(Food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new Food
const addFood = async (req, res) => {
  const { description, User, Category, image, expirydate, quantity } = req.body;
  const newFood = new Food({
    description,
    Category,
    User,
    image,
    expirydate,
    quantity,
  });

  try {
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit an Food
const editFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // Update the description field if it exists in the request body
    if (req.body.description) {
      food.description = req.body.description;
    }

    if (req.file) {
      if (food.image) {
        fs.unlinkSync(food.image);
      }

      food.image = req.file.path;
    }

    if (req.body.User) {
      food.User = req.body.User;
    }
    if (req.body.Category) {
      food.Category = req.body.Category;
    }
    if (req.body.expirydate) {
      food.expirydate = req.body.expirydate;
    }
    if (req.body.quantity) {
      food.quantity = req.body.quantity;
    }

    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an Food
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    await food.deleteOne();
    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const FoodController = {
  getAllFoods,
  getFoodById,
  addFood,
  editFood,
  deleteFood,
};
export default FoodController;

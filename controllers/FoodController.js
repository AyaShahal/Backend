import Food from "../models/FoodModel.js";
import fs from "fs";
import mongoose from "mongoose";
import { ObjectId } from 'mongoose';

// Get all Foods
const getAllFoods = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const count = await Food.countDocuments();
    const totalPages = Math.ceil(count / limit);

    const city = req.query.city;

    const pipeline = [
      
      {
        $lookup: {
          from: "Donations",
          localField: "_id",
          foreignField: "Food",
          as: "donations",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "Category",
          foreignField: "_id",
          as: "Category",
        },
      },
      {
        $unwind: {
          path: "$Category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "User",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $unwind: {
          path: "$User",
          preserveNullAndEmptyArrays: true,
        },
      },
      
      
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    if (city) {
      pipeline.push({
        $match: {
          "User.address.city": city,
        },
      });
    }
    

    const products = await Food.aggregate(pipeline);

    const result = {
      totalPages: totalPages,
      products,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
const getAllFoodsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const count = await Food.countDocuments({ User: userId });
    const totalPages = Math.ceil(count / limit);

    const foods = await Food.find({ User: userId })
      .skip(skip)
      .limit(limit);

    const result = {
      totalPages: totalPages,
      foods: foods,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
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
  const { description, User, Category, image, expirydate, quantity ,name} = req.body;
  const newFood = new Food({
    description,
    Category,
    User,
    image,
    expirydate,
    quantity,
    name
  });

  try {
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit a Food
const editFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (req.body.description !== undefined) {
      food.description = req.body.description;
    }

    if (req.file && req.file.path) {
      console.log("req.file:", req.file);
      if (food.image) {
        fs.unlinkSync(food.image);
      }
      food.image = req.file.path;
      console.log("food.image:", food.image);
    }

    // Check if the image field exists in the request body
    if (req.body.image === undefined) {
      // If not provided, retain the existing image value
      req.body.image = food.image;
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
    if (req.body.name) {
      food.name = req.body.name;
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
  getAllFoodsByUserId
};
export default FoodController;

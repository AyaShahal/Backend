import mongoose from "mongoose";
const { Schema, model } = mongoose;

const FoodSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    expirydate: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    Category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    User: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "foods",
    timestamps: true,
  }
);

FoodSchema.pre(["find", "findOne"], function () {
  this.populate("Category");
  this.populate("User");
});
const Food = model("Food", FoodSchema);
export default Food;

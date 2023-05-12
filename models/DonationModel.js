import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DonationSchema = new Schema(
  {
   date:{
    type:"Date",
    required: true,
   },
   status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "canceled"],
    default: "pending",
},
    User: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Food:{
        type: Schema.Types.ObjectId,
      ref: "Food",
    }
  },
  {
    collection: "Donations",
    timestamps: true,
  }
);

DonationSchema.pre(["find", "findOne"], function () {
  this.populate("Food");
  this.populate("User");
});
const Donation = model("Donation", DonationSchema);
export default Donation;

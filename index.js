import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import cors from "cors"; 
import UserRouter from "./routes/UserRoute.js";
import AdminRouter from "./routes/AdminRoute.js";
import CategoryRouter from "./routes/CategoryRoute.js";
import FoodRouter from "./routes/FoodRoute.js";
import DonationRouter from "./routes/DonationRoute.js";
import ContactRouter from "./routes/ContactRoute.js";

dotenv.config();

await connectDB();
const PORT = process.env.PORT || 6000;
const app = express();
app.use(cors({
    origin: 'https://surplussavior.onrender.com'
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("API is running ...");
});
app.use("/api/user", UserRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/Food", FoodRouter);
app.use("/api/Donation", DonationRouter);
app.use("/api/Contact", ContactRouter);
app.use("/uploads", express.static("./uploads"));
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

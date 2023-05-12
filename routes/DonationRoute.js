import express from "express";
import DonationController from "../controllers/DonationController.js";
import verifyToken from "../middleware/auth.js";
const router = express.Router();

router.get("/", DonationController.getAllDonations);
router.get("/:id", DonationController.getDonationById);
router.post("/", verifyToken, DonationController.addDonation);
router.put("/edit/:id", verifyToken, DonationController.editDonation);
router.delete("/delete/:id", verifyToken, DonationController.deleteDonation);

export default router;
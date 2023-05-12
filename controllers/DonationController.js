import Donation from "../models/DonationModel.js";

// Get all Donations
const getAllDonations = async (req, res) => {
    try {
        const Donations = await Donation.find();
        console.log(Donations);
        res.json(Donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Donation by ID
const getDonationById = async (req, res) => {
    try {
        const Donation = await Donation.findById(req.params.id);
        if (!Donation) {
            return res.status(404).json({ message: "Donation not found" });
        }
        res.json(Donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new Donation
const addDonation = async (req, res) => {
    const {User, date, status, Food} = req.body;
    const newDonation = new Donation({
        User,
        date,
        status,
        Food
    });

    try {
        const savedDonation = await newDonation.save();
        res.status(201).json(savedDonation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Edit an Donation
const editDonation = async (req, res) => {
    try {
      const donation = await Donation.findById(req.params.id);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      const { User, date, status, Food } = req.body;
      if (User) donation.User = User;
      if (date) donation.date = date;
      if (status) donation.status = status;
      if (Food) donation.Food = Food;
      const savedDonation = await donation.save();
      res.json(savedDonation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Delete an Donation
  const deleteDonation = async (req, res) => {
    try {
      const donation = await Donation.findById(req.params.id);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      await donation.deleteOne();
      res.json({ message: "Donation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const DonationController = {
    getAllDonations,
    getDonationById,
    addDonation,
    editDonation,
    deleteDonation,
  };
  
  export default DonationController;
  
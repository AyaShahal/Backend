import express from "express";
import ContactController from "../controllers/ContactController.js";

const router = express.Router();

router.get("/", ContactController.getAll);
router.get("/:id", ContactController.get);
router.post("/", ContactController.addmessage);
router.delete("/:id", ContactController.deletemessage);

export default router;

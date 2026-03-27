import express from "express";
import { generateWebsiteController } from "../controllers/generateController.js";

const router = express.Router();

router.post("/generate", generateWebsiteController);

export default router;
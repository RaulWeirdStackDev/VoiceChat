import express from "express";
import { registerUser } from "../controllers/authController.js";

export const authRoutes = express.Router();

router.post("/register", registerUser);



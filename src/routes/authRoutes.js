import express from "express";
import { registerUser } from "../controllers/authController.js";

export const authRoutes = express.Router();

authRoutes.post("/register", registerUser);



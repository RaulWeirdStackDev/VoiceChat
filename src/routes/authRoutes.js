import express from "express";
import { registerUserJWT } from "../controllers/authController.js";

export const authRoutes = express.Router();

authRoutes.post("/register", registerUserJWT);



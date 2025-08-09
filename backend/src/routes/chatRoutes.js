import { Router } from "express";
import { iniciarChat } from "../controllers/chatController.js";

export const chatRoutes = Router()

chatRoutes.post("/", iniciarChat)
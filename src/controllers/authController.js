import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/authModel.js";

export const registerUserJWT = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ message: "Usuario creado", token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


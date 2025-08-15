import { User } from "../models/authModel.js";

// POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, googleId } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Usuario ya existe" });

    const newUser = await User.create({ name, email, googleId });
    res.status(201).json({ message: "Usuario creado", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

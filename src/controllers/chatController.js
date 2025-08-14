import { model } from '../config/gemini.js';

export const iniciarChat = async (req, res) => {
  const { message } = req.body;
  try {
    const result = await model.generateContent(message);
    res.json({ reply: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }}

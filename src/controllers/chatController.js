import { model } from '../config/gemini.js';

export const iniciarChat = async (req, res) => {
  const { message } = req.body;
  try {
    const result = await model.generateContent(message);
    const textoCompleto = result.response.text();

    // Ahora confiamos en la IA para respetar el límite de 100 palabras
    res.json({ reply: textoCompleto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

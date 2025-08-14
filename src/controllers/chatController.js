import { model } from '../config/gemini.js';
import { cortarAlFinalDeOracion } from '../utils/cortarTexto.js';

export const iniciarChat = async (req, res) => {
  const { message } = req.body;
  try {
    const result = await model.generateContent(message);
    const textoCompleto = result.response.text();
    const textoCortado = cortarAlFinalDeOracion(textoCompleto, 200); 
    res.json({ reply: textoCortado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

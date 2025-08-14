import { model } from '../config/gemini.js';

function cortarAlFinalDeOracion(texto, limite) {
  if (texto.length <= limite) return texto;

  // Cortamos inicialmente al límite
  const subTexto = texto.slice(limite);

  // Regex de fin de oración (latín, japonés, chino)
  const regex = /[.?!。！？](?=\s|$)/;
  const match = regex.exec(subTexto);

  if (match) {
    // +1 para incluir el signo de puntuación
    return texto.slice(0, limite + match.index + 1);
  } else {
    // Si no hay fin de oración después, devolvemos todo
    return texto;
  }
}

export const iniciarChat = async (req, res) => {
  const { message } = req.body;
  try {
    const result = await model.generateContent(message);
    const textoCompleto = result.response.text();
    const textoCortado = cortarAlFinalDeOracion(textoCompleto, 200); // límite ajustable
    res.json({ reply: textoCortado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

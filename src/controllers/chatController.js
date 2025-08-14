import { model } from '../config/gemini.js';

function cortarAlFinalDeOracion(texto, limite) {
  if (texto.length <= limite) return texto;

  const subTexto = texto.slice(0, limite);
  const regex = /[.?!](?=\s|$)/g;
  let ultimaCoincidencia = -1;
  let match;

  while ((match = regex.exec(subTexto)) !== null) {
    ultimaCoincidencia = match.index + 1; // incluir el signo
  }

  return ultimaCoincidencia !== -1
    ? subTexto.slice(0, ultimaCoincidencia)
    : subTexto;
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

export const iniciarChat = async (req, res) => {
  const { message, lang = 'es-CL' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'El mensaje es requerido' });
  }

  try {
    // Mapa de idiomas para Web Speech API y parámetros por idioma
    const langMap = {
      'es-CL': { stopSequence: ['.'], langSpeech: 'es-CL', maxTokens: 100 },
      'en-US': { stopSequence: ['.'], langSpeech: 'en-US', maxTokens: 100 },
      'fr-FR': { stopSequence: ['.'], langSpeech: 'fr-FR', maxTokens: 100 },
      'pt-BR': { stopSequence: ['.'], langSpeech: 'pt-BR', maxTokens: 100 },
      'de-DE': { stopSequence: ['.'], langSpeech: 'de-DE', maxTokens: 100 },
      'it-IT': { stopSequence: ['.'], langSpeech: 'it-IT', maxTokens: 100 },
      'ja-JP': { stopSequence: ['。'], langSpeech: 'ja-JP', maxTokens: 80 },
    };

    const langConfig = langMap[lang] || langMap['es-CL'];
    if (!langMap[lang]) {
      console.warn(`Idioma no soportado: ${lang}. Usando es-CL como fallback.`);
    }

    // Prompt sin especificar idioma, dejando que Gemini lo detecte
    const prompt = `Eres un asistente de voz. Responde en un máximo de 2 oraciones cortas, claras y completas, sin usar formato como negritas, cursivas, listas o emojis: ${message}`;

    // Configuración de la generación
    const result = await model.generateContent(
      prompt,
      {
        generationConfig: {
          maxOutputTokens: langConfig.maxTokens,
          stopSequences: langConfig.stopSequence,
        }
      }
    );

    let responseText = result.response.text();

    // Post-procesamiento para limitar a 2 oraciones
    responseText = limitToSentences(responseText, 2, langConfig.stopSequence);

    // Validar respuesta vacía o corta
    if (!responseText || responseText.length < 5) {
      responseText = langConfig.langSpeech.startsWith('es') ? 'Lo siento, no entendí. ¿Puedes repetir?' : 'Sorry, I didn’t understand. Please repeat.';
    }

    // Devolver respuesta con idioma para Web Speech API
    res.json({ reply: responseText, lang: langConfig.langSpeech });
  } catch (error) {
    console.error('Error en el controlador:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

function limitToSentences(text, maxSentences, stopSequences) {
  const sentenceEnd = stopSequences.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`[^${sentenceEnd}]+[${sentenceEnd}]+`, 'g');
  const sentences = text.match(regex) || [text];
  return sentences.slice(0, maxSentences).join(' ').trim();
}
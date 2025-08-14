import { model } from '../config/gemini.js';

import { franc } from 'franc'; // Opcional, para detección de idioma (requiere `npm install franc franc-min`)

export const iniciarChat = async (req, res) => {
  const { message, lang = 'es-CL' } = req.body; // Idioma por defecto: español (Chile)

  // Validar que se haya enviado un mensaje
  if (!message) {
    return res.status(400).json({ error: 'El mensaje es requerido' });
  }

  try {
    // Mapa de idiomas basado en LanguageSelect del frontend
    const langMap = {
      'es-CL': { code: 'es', stopSequence: ['.'], langSpeech: 'es-CL', maxTokens: 100 },
      'en-US': { code: 'en', stopSequence: ['.'], langSpeech: 'en-US', maxTokens: 100 },
      'fr-FR': { code: 'fr', stopSequence: ['.'], langSpeech: 'fr-FR', maxTokens: 100 },
      'pt-BR': { code: 'pt', stopSequence: ['.'], langSpeech: 'pt-BR', maxTokens: 100 },
      'de-DE': { code: 'de', stopSequence: ['.'], langSpeech: 'de-DE', maxTokens: 100 },
      'it-IT': { code: 'it', stopSequence: ['.'], langSpeech: 'it-IT', maxTokens: 100 },
      'ja-JP': { code: 'ja', stopSequence: ['。'], langSpeech: 'ja-JP', maxTokens: 80 },
    };

    // Detectar idioma del mensaje (usando franc, opcional)
    const detectedLang = franc(message, { minLength: 10 }) || 'es';
    const langConfig = langMap[lang] && langMap[lang].code === detectedLang
      ? langMap[lang]
      : Object.values(langMap).find(l => l.code === detectedLang) || langMap['es-CL'];

    // Prompt optimizado para respuestas breves y completas en el idioma detectado
    const prompt = `Eres un asistente de voz. Responde en ${langConfig.code} en un máximo de 2 oraciones cortas, claras y completas, sin usar formato como negritas, cursivas, listas o emojis: ${message}`;

    // Configuración de la generación con límite de tokens y stopSequences
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

    // Post-procesamiento para limitar a un máximo de 2 oraciones
    responseText = limitToSentences(responseText, 2, langConfig.stopSequence);

    // Validar respuesta vacía o demasiado corta
    if (!responseText || responseText.length < 5) {
      responseText = langConfig.code === 'es' ? 'Lo siento, no entendí. ¿Puedes repetir?' : 'Sorry, I didn’t understand. Please repeat.';
    }

    // Devolver la respuesta con el idioma para Web Speech API
    res.json({ reply: responseText, lang: langConfig.langSpeech });
  } catch (error) {
    console.error('Error en el controlador:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

// Función para limitar la respuesta a un número máximo de oraciones
function limitToSentences(text, maxSentences, stopSequences) {
  const sentenceEnd = stopSequences.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`[^${sentenceEnd}]+[${sentenceEnd}]+`, 'g');
  const sentences = text.match(regex) || [text];
  return sentences.slice(0, maxSentences).join(' ').trim();
}

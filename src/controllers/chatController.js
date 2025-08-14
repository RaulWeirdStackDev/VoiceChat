import { model } from '../config/gemini.js';

import { franc } from 'franc'; // Requiere `npm install franc franc-min`

export const iniciarChat = async (req, res) => {
  const { message, lang = 'es-CL' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'El mensaje es requerido' });
  }

  try {
    // Mapa de idiomas basado en LanguageSelect
    const langMap = {
      'es-CL': { code: 'es', stopSequence: ['.'], langSpeech: 'es-CL', maxTokens: 100 },
      'en-US': { code: 'en', stopSequence: ['.'], langSpeech: 'en-US', maxTokens: 100 },
      'fr-FR': { code: 'fr', stopSequence: ['.'], langSpeech: 'fr-FR', maxTokens: 100 },
      'pt-BR': { code: 'pt', stopSequence: ['.'], langSpeech: 'pt-BR', maxTokens: 100 },
      'de-DE': { code: 'de', stopSequence: ['.'], langSpeech: 'de-DE', maxTokens: 100 },
      'it-IT': { code: 'it', stopSequence: ['.'], langSpeech: 'it-IT', maxTokens: 100 },
      'ja-JP': { code: 'ja', stopSequence: ['。'], langSpeech: 'ja-JP', maxTokens: 80 },
    };

    // Detectar idioma del mensaje
    const detectedLang = franc(message, { 
      minLength: 2, // Reducido para mensajes cortos
      whitelist: Object.values(langMap).map(l => l.code),
      only: ['en', 'es', 'fr', 'pt', 'de', 'it', 'ja'] // Reforzar idiomas soportados
    });

    // Priorizar idioma detectado, con fallback al idioma del frontend
    let langConfig;
    if (detectedLang && Object.values(langMap).some(l => l.code === detectedLang)) {
      langConfig = Object.values(langMap).find(l => l.code === detectedLang);
      console.log(`Idioma detectado: ${detectedLang}, usando ${langConfig.langSpeech}`);
    } else {
      langConfig = langMap[lang] || langMap['es-CL'];
      console.log(`Idioma no detectado o no soportado (${detectedLang}). Usando frontend lang: ${langConfig.langSpeech}`);
    }

    // Prompt optimizado
    const prompt = `Eres un asistente de voz. Responde en ${langConfig.code} en un máximo de 2 oraciones cortas, claras y completas, sin usar formato como negritas, cursivas, listas o emojis: ${message}`;

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
      responseText = langConfig.code === 'es' ? 'Lo siento, no entendí. ¿Puedes repetir?' : 'Sorry, I didn’t understand. Please repeat.';
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
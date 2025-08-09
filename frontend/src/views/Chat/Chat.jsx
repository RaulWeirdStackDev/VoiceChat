import { useEffect, useRef } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { LanguageSelect } from "../../components/LanguageSelect/LanguageSelect";

// eslint-disable-next-line react/prop-types
export const Chat = ({ lang, onLangChange }) => {
  const recognition = useRef(null);
  const chatDiv = useRef(null);

  useEffect(() => {
    recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.current.lang = lang;
    recognition.current.interimResults = false;

    recognition.current.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      if (chatDiv.current) {
        chatDiv.current.innerHTML += `<p><b>Tú:</b> ${transcript}</p>`;
      }

      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: transcript }),
      });
      const data = await res.json();

      if (chatDiv.current) {
        chatDiv.current.innerHTML += `<p><b>Gemini:</b> ${data.reply}</p>`;
      }

      setTimeout(() => {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.reply);
        utterance.lang = lang;
        speechSynthesis.speak(utterance);
      }, 100);
    };

    recognition.current.onerror = (event) => {
      console.error('Error en reconocimiento:', event.error);
    };
  }, [lang]);

  const handleStart = () => {
    recognition.current?.start();
  };

  return (
    <Card
      sx={{
        width: 400,
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <CardContent
        sx={{
          flexGrow: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <LanguageSelect lang={lang} onChange={onLangChange} sx={{ minWidth: 180 }} />
        <Typography variant="h5" component="h1">
          Chat con voz
        </Typography>
        <Button variant="contained" onClick={handleStart}>
          Hablar
        </Button>
      </CardContent>

      <Box
        ref={chatDiv}
        id="chat"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: 1,
          p: 1,
          bgcolor: "#fff",
          fontSize: "0.9rem",
        }}
      />
    </Card>
  );
};


import { Box, Typography } from "@mui/material";

export const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "#f0f0f0",
        px: 3,
        py: 2,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Espacio para logo: reemplaza con tu imagen si quieres */}
<Box
  sx={{
    width: 40,
    height: 40,
    borderRadius: 1,
    mr: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "1rem",
    userSelect: "none",
  }}
>
       <img src="/VoiceChatLogo.png" alt="" width={100} height={100} /> 
      </Box>

      <Typography variant="h6" component="h1" sx={{ fontWeight: "medium", textAlign: "center" }}>
        Aplicación de Chat de Voz con IA
      </Typography>
    </Box>
  );
};

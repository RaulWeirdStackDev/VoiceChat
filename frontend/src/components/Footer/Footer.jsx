import { Box, Typography, Link } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 3,
        bgcolor: "primary.main",
        color: "primary.contrastText",
        textAlign: "center",
        boxShadow: "0 -2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <Typography variant="body1">
        &copy; {new Date().getFullYear()} VoiceChat. Todos los derechos reservados a quien corresponden.
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Creado por{" "}
        <Link href="https://tu-sitio-web.com" target="_blank" rel="noopener" color="inherit" underline="hover">
          Raúl Rodríguez Clavero
        </Link>
      </Typography>
    </Box>
  );
};

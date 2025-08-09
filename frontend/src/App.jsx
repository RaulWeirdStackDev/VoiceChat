/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Chat } from "./views/Chat/Chat";
import { Footer } from "./components/Footer/Footer";
import { Box } from "@mui/material";
import { Header } from "./components/Header/Header";
import { CssBaseline } from "@mui/material";

const App = () => {
  const [lang, setLang] = useState("es-CL");

  return (
    <>
    <CssBaseline />
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
<Header/>

      {/* Main con chat que ocupa todo el espacio disponible */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#fafafa",
          p: 2,
        }}
      >
        <Chat lang={lang} />
      </Box>

      {/* Footer fijo abajo */}
      <Footer />
    </Box>
    </>
  );
};

export default App;

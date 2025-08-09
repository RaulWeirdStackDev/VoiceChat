/* eslint-disable react/prop-types */
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export const LanguageSelect = ({ lang, onChange }) => {
  return (
    <FormControl  variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="language-select-label">Idioma</InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={lang}
        onChange={(e) => onChange(e.target.value)}
        label="Idioma"
      >
        <MenuItem value="es-CL">Español</MenuItem>
        <MenuItem value="en-US">English</MenuItem>
        <MenuItem value="fr-FR">Français</MenuItem>
        <MenuItem value="pt-BR">Português</MenuItem>
        <MenuItem value="de-DE">Deutsch</MenuItem>
        <MenuItem value="it-IT">Italiano</MenuItem>
        <MenuItem value="ja-JP">日本語</MenuItem>
      </Select>
    </FormControl>
  );
};

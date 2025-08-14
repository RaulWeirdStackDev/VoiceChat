export function cortarAlFinalDeOracion(texto, limite) {
  if (texto.length <= limite) return texto;

  const subTexto = texto.slice(0, limite);

  const regex = /(?<!\d)(?<!\(\d)(?<!\([a-zA-Z])([.?!。！？])(?=\s|$)/g;
  let ultimaCoincidencia = -1;
  let match;

  while ((match = regex.exec(subTexto)) !== null) {
    ultimaCoincidencia = match.index + 1; 
  }

  return ultimaCoincidencia !== -1
    ? subTexto.slice(0, ultimaCoincidencia)
    : subTexto;
}
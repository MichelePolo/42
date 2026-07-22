import { Q } from "./data";

// Codifica posizionale delle risposte: un carattere per domanda in ordine Q.
// "0" = senza risposta, "1".."5" = indice 1-based dell'opzione scelta.
// Usata sia per i link di condivisione sia per storicizzare i risultati
// nella classifica remota.

export function encodeAnswers(answers: Record<string, string>): string {
  return Q.map((q) => {
    const optIndex = q.o.findIndex((opt) => opt.id === answers[q.id]);
    return optIndex >= 0 ? String(optIndex + 1) : "0";
  }).join("");
}

export function decodeAnswers(encoded: string): Record<string, string> | null {
  if (encoded.length !== Q.length) return null;
  const decoded: Record<string, string> = {};
  for (let i = 0; i < Q.length; i++) {
    const digit = encoded.charCodeAt(i) - 48; // "0" -> 0
    if (digit === 0) continue;
    const option = Q[i].o[digit - 1];
    if (!option) return null;
    decoded[Q[i].id] = option.id;
  }
  return decoded;
}

import { Question } from "./data";

// Codifica posizionale delle risposte: un carattere per domanda, nell'ordine
// del questionario passato. "0" = senza risposta, "1".."5" = indice 1-based
// dell'opzione scelta. Usata per i link di condivisione e per storicizzare
// i risultati nella classifica remota. La lunghezza della stringa identifica
// implicitamente il questionario (37 = Light, 31 = Completo).

export function encodeAnswers(
  answers: Record<string, string>,
  questions: Question[]
): string {
  return questions
    .map((q) => {
      const optIndex = q.o.findIndex((opt) => opt.id === answers[q.id]);
      return optIndex >= 0 ? String(optIndex + 1) : "0";
    })
    .join("");
}

export function decodeAnswers(
  encoded: string,
  questions: Question[]
): Record<string, string> | null {
  if (encoded.length !== questions.length) return null;
  const decoded: Record<string, string> = {};
  for (let i = 0; i < questions.length; i++) {
    const digit = encoded.charCodeAt(i) - 48; // "0" -> 0
    if (digit === 0) continue;
    const option = questions[i].o[digit - 1];
    if (!option) return null;
    decoded[questions[i].id] = option.id;
  }
  return decoded;
}

import { Question } from "./data";

// Codifica posizionale delle risposte: un carattere per domanda, nell'ordine
// del questionario passato. "0" = senza risposta; per l'opzione scelta si usa
// l'indice 1-based in base36 ("1".."9","a".."z"), così una domanda può avere
// più di nove risposte (necessario nella versione Somma) restando a un carattere.
// Retro-compatibile con la vecchia codifica decimale per le opzioni 1-9.

export function encodeAnswers(
  answers: Record<string, string>,
  questions: Question[]
): string {
  return questions
    .map((q) => {
      const optIndex = q.o.findIndex((opt) => opt.id === answers[q.id]);
      return optIndex >= 0 ? (optIndex + 1).toString(36) : "0";
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
    const digit = parseInt(encoded[i], 36);
    if (Number.isNaN(digit)) return null;
    if (digit === 0) continue;
    const option = questions[i].o[digit - 1];
    if (!option) return null;
    decoded[questions[i].id] = option.id;
  }
  return decoded;
}

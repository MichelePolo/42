// Moderazione nickname: blocklist con normalizzazione anti-elusione.
// Non pretende di essere perfetta (nessuna blocklist lo è): ferma i casi
// evidenti; il resto si gestisce a mano interrogando D1.

const BLOCKLIST = [
  // italiano
  "cazzo", "merda", "stronzo", "stronza", "puttana", "troia", "vaffanculo",
  "fanculo", "minchia", "coglione", "cogliona", "bastardo", "bastarda",
  "porcodio", "porcamadonna", "diocane", "negro", "frocio", "ricchione",
  "mongoloide", "ritardato",
  // inglese
  "fuck", "shit", "bitch", "asshole", "cunt", "nigger", "nigga", "faggot",
  "whore", "slut", "retard",
  // altro
  "hitler", "nazi"
];

// Sostituzioni "leet" comuni prima del confronto: C4zz0 → cazzo.
const LEET: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s",
  "7": "t", "8": "b", "@": "a", "$": "s", "!": "i", "€": "e"
};

function normalize(nickname: string): string {
  return nickname
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // rimuove i segni diacritici (accenti)
    .split("")
    .map((ch) => LEET[ch] ?? ch)
    .join("")
    .replace(/[^a-z]/g, ""); // restano solo lettere: "c-a_z z o" → "cazzo"
}

export function isNicknameAllowed(nickname: string): boolean {
  const normalized = normalize(nickname);
  return !BLOCKLIST.some((word) => normalized.includes(word));
}

import { Profile } from "./data";

export interface Affinity {
  profile: Profile;
  percentage: number;
  hitCount: number;
  compareCount: number;
  totalAnswered: number;
}

// Risonanza con le 8 tradizioni: per ogni profilo conta i match sulle sole
// domande a cui l'utente ha risposto E su cui il profilo prende posizione.
// Funziona con qualunque questionario (Light o Completo) perché profili e
// risposte sono keyed sugli id delle domande del medesimo dataset.
export function computeAffinities(
  answers: Record<string, string>,
  profiles: Profile[]
): Affinity[] {
  const totalAnswered = Object.keys(answers).length;

  return profiles
    .map((profile) => {
      let hitCount = 0;
      let compareCount = 0;

      Object.keys(answers).forEach((qid) => {
        const profileChoice = profile.m[qid];
        if (profileChoice) {
          compareCount++;
          if (profileChoice === answers[qid]) {
            hitCount++;
          }
        }
      });

      const percentage =
        compareCount > 0 ? Math.round((hitCount / compareCount) * 100) : 0;

      return { profile, percentage, hitCount, compareCount, totalAnswered };
    })
    .sort((a, b) => b.percentage - a.percentage || b.compareCount - a.compareCount);
}

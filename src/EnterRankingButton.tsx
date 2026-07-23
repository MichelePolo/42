import { useMemo, useState } from "react";
import { UserPlus, Check, Loader2 } from "lucide-react";
import { getLeaderboardService } from "./leaderboard";
import { useVariant } from "./variants";
import { computeAffinities } from "./affinity";
import { encodeAnswers } from "./answersCodec";

// Pulsante "Entra in classifica" / "Aggiorna il mio 42": registra su D1 il
// profilo dominante calcolato dalle risposte correnti. Autonomo (deriva tutto
// da `answers` + variante attiva), così può stare sia nel tab Classifiche sia
// in fondo all'Albero. onSubmitted permette a chi lo usa (la classifica) di
// ricaricare la tabella dopo un invio riuscito.
export default function EnterRankingButton({
  answers,
  onSubmitted,
  className = ""
}: {
  answers: Record<string, string>;
  onSubmitted?: () => void;
  className?: string;
}) {
  const variant = useVariant();
  const { dataset } = variant;
  const service = getLeaderboardService({
    dataset,
    version: variant.leaderboardVersion
  });

  const [justSubmitted, setJustSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bump, setBump] = useState(0);

  const dominant = useMemo(
    () => computeAffinities(answers, dataset.PROFILES)[0],
    [answers, dataset.PROFILES]
  );
  const dominantProfileName =
    dominant && dominant.compareCount > 0 ? dominant.profile.n : null;
  const answeredCount = Object.keys(answers).length;
  const registeredNickname = useMemo(() => service.myNickname(), [service, bump]);
  const canSubmit = dominantProfileName !== null && answeredCount > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const nickname = window
      .prompt("Scegli un nickname per la classifica (max 24 caratteri):", registeredNickname ?? "")
      ?.trim()
      .slice(0, 24);
    if (!nickname) return;
    setSubmitting(true);
    try {
      await service.submit({
        nickname,
        profileName: dominantProfileName!,
        percentage: dominant.percentage,
        answeredCount,
        responses: encodeAnswers(answers, dataset.Q)
      });
      setJustSubmitted(true);
      setBump((b) => b + 1);
      onSubmitted?.();
      setTimeout(() => setJustSubmitted(false), 2500);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Invio non riuscito. Riprova.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={!canSubmit}
      title={
        canSubmit
          ? "Registra il tuo profilo dominante in classifica"
          : "Rispondi ad alcune domande per poterti iscrivere"
      }
      className={`text-xs font-mono-tech transition flex items-center gap-1.5 uppercase tracking-wider px-3 py-2 rounded-lg border disabled:opacity-40 disabled:pointer-events-none ${
        justSubmitted
          ? "text-nature-teal border-nature-teal/40 bg-nature-teal/5"
          : "text-forest-sage border-stone-border/70 hover:text-forest-dark hover:border-forest-sage/60 bg-white"
      } ${className}`}
    >
      {submitting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Invio…
        </>
      ) : justSubmitted ? (
        <>
          <Check className="w-3.5 h-3.5" /> Registrato
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          {registeredNickname ? "Aggiorna il mio 42" : "Entra in classifica"}
        </>
      )}
    </button>
  );
}

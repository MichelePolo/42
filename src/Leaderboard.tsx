import { useMemo, useState } from "react";
import { Trophy, Medal, UserPlus, Check } from "lucide-react";
import { PROFILES } from "./data";
import {
  createLocalLeaderboard,
  Period,
  PERIOD_LABELS
} from "./leaderboard";

// --- CLASSIFICHE (PoC) ---
// UI dei "Top 10 dell'anno/mese/settimana/giorno", per profilo dominante.
// Alimentata dall'adapter locale simulato (vedi leaderboard.ts): l'unica
// voce reale è quella dell'utente, registrata col pulsante in alto.

const service = createLocalLeaderboard(PROFILES.map((p) => p.n));

interface LeaderboardProps {
  dominantProfileName: string | null;
  dominantPercentage: number;
  answeredCount: number;
}

export default function Leaderboard({
  dominantProfileName,
  dominantPercentage,
  answeredCount
}: LeaderboardProps) {
  const [period, setPeriod] = useState<Period>("week");
  const [profileFilter, setProfileFilter] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);
  // bump forza il ricalcolo dopo submit (il service legge localStorage)
  const [bump, setBump] = useState(0);

  const entries = useMemo(
    () => service.top(period, profileFilter, 10),
    [period, profileFilter, bump]
  );

  const registeredNickname = service.myNickname();
  const canSubmit = dominantProfileName !== null && answeredCount > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const nickname = window.prompt(
      "Scegli un nickname per la classifica:",
      registeredNickname ?? ""
    )?.trim();
    if (!nickname) return;
    service.submit({
      nickname,
      profileName: dominantProfileName!,
      percentage: dominantPercentage,
      answeredCount
    });
    setJustSubmitted(true);
    setBump((b) => b + 1);
    setTimeout(() => setJustSubmitted(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Barra controlli: periodo + filtro profilo + iscrizione */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex bg-stone-accent/60 p-1 rounded-xl border border-stone-border/80 self-start">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg font-sans-ui text-xs font-medium uppercase tracking-wider transition ${
                period === p
                  ? "bg-white text-forest-dark shadow-xs border border-stone-border/40"
                  : "text-forest-sage hover:text-forest-dark"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={profileFilter ?? ""}
            onChange={(e) => setProfileFilter(e.target.value || null)}
            className="text-xs font-sans-ui border border-stone-border bg-white rounded-lg px-3 py-2 text-forest-dark focus:outline-hidden focus:ring-1 focus:ring-forest-sage"
            aria-label="Filtra per profilo dominante"
          >
            <option value="">Tutti i profili</option>
            {PROFILES.map((p) => (
              <option key={p.n} value={p.n}>
                Top {p.n === "Darwinismo" ? "Darwinisti" : p.n}
              </option>
            ))}
          </select>

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
            }`}
          >
            {justSubmitted ? (
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
        </div>
      </div>

      {/* Tabella top 10 */}
      <div className="border border-stone-border/60 rounded-2xl overflow-hidden bg-white shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm font-sans-ui min-w-[560px]">
          <thead>
            <tr className="bg-stone-card/80 border-b border-stone-border/50 text-forest-sage uppercase text-[10px] tracking-wider font-mono-tech">
              <th className="py-3.5 px-5 font-semibold w-14">#</th>
              <th className="py-3.5 px-5 font-semibold">Nickname</th>
              <th className="py-3.5 px-5 font-semibold">Profilo dominante</th>
              <th className="py-3.5 px-5 font-semibold text-right">Risonanza</th>
              <th className="py-3.5 px-5 font-semibold text-right">Risposte</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-border/40 text-forest-dark">
            {entries.map((entry, idx) => (
              <tr
                key={`${entry.nickname}-${entry.timestamp}`}
                className={`transition ${
                  entry.isMe
                    ? "bg-nature-gold/10 hover:bg-nature-gold/15"
                    : "hover:bg-stone-bg/40"
                }`}
              >
                <td className="py-3 px-5 font-mono-tech">
                  {idx === 0 ? (
                    <Trophy className="w-4 h-4 text-nature-gold" />
                  ) : idx <= 2 ? (
                    <Medal className="w-4 h-4 text-forest-light" />
                  ) : (
                    <span className="text-forest-light">{idx + 1}</span>
                  )}
                </td>
                <td className="py-3 px-5 font-display font-semibold">
                  {entry.nickname}
                  {entry.isMe && (
                    <span className="ml-2 text-[9px] font-mono-tech uppercase tracking-widest text-nature-gold">
                      Tu
                    </span>
                  )}
                </td>
                <td className="py-3 px-5 text-forest-medium">{entry.profileName}</td>
                <td className="py-3 px-5 text-right font-mono-tech font-bold">
                  {entry.percentage}%
                </td>
                <td className="py-3 px-5 text-right font-mono-tech text-forest-sage">
                  {entry.answeredCount}
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-forest-light italic font-serif-body">
                  Nessuna voce in questo periodo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-forest-sage font-sans-ui leading-relaxed max-w-3xl">
        <strong>PoC:</strong> le voci in classifica (tranne la tua) sono simulate
        localmente. Il servizio è progettato dietro un&apos;interfaccia
        (<code>LeaderboardService</code>) sostituibile con un backend reale
        — Firebase, Supabase o un Cloudflare Worker — senza modifiche alla UI.
      </p>
    </div>
  );
}

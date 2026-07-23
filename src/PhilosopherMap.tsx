import { useMemo, useState } from "react";
import { Profile } from "./data";
import { Affinity } from "./affinity";

// --- MAPPA DEI FILOSOFI (PoC) ---
// Piano cartesiano interpretativo:
//   asse X: Immanenza (il senso è dentro il mondo) ↔ Trascendenza (il senso è oltre il mondo)
//   asse Y: Ragione (logos, dimostrazione) ↔ Esperienza (vissuto, pratica, contemplazione)
// Le coordinate sono in [-1, 1] e riflettono una lettura storiografica
// standard delle 8 tradizioni: sono dichiaratamente opinabili e fatte
// per essere discusse (e ritoccate) a mano.

const PROFILE_COORDS: Record<string, { x: number; y: number }> = {
  "Platone": { x: 0.85, y: -0.7 },
  "Democrito": { x: -0.85, y: -0.55 },
  "Cartesio": { x: 0.35, y: -0.9 },
  "Spinoza": { x: -0.45, y: -0.75 },
  "Kant": { x: 0.15, y: -0.3 },
  "Darwinismo": { x: -0.9, y: 0.15 },
  "Buddhismo": { x: 0.3, y: 0.8 },
  "Esistenzialismo ateo": { x: -0.55, y: 0.7 }
};

// Baricentro delle tradizioni pesato col quadrato dell'affinità: il
// quadrato accentua i profili dominanti, altrimenti percentuali simili
// schiaccerebbero tutti i punti verso il centro della mappa.
export function affinityPoint(
  affinities: Pick<Affinity, "profile" | "percentage" | "compareCount">[]
): { x: number; y: number } | null {
  let wx = 0;
  let wy = 0;
  let wsum = 0;
  affinities.forEach(({ profile, percentage, compareCount }) => {
    const coords = PROFILE_COORDS[profile.n];
    if (!coords || compareCount === 0) return;
    const w = (percentage / 100) ** 2;
    wx += coords.x * w;
    wy += coords.y * w;
    wsum += w;
  });
  if (wsum === 0) return null;
  return { x: wx / wsum, y: wy / wsum };
}

export interface CommunityPoint {
  nickname: string;
  x: number;
  y: number;
}

interface MapProps {
  profileAffinities: {
    profile: Profile;
    percentage: number;
    compareCount: number;
  }[];
  /** Le ultime compilazioni degli altri utenti, già proiettate sul piano. */
  communityPoints?: CommunityPoint[];
}

const SIZE = 640;
const PAD = 70;

// [-1,1] → coordinate SVG
const px = (v: number) => PAD + ((v + 1) / 2) * (SIZE - 2 * PAD);

export default function PhilosopherMap({ profileAffinities, communityPoints = [] }: MapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const hasData = profileAffinities.some((a) => a.compareCount > 0);

  const userPoint = useMemo(
    () => (hasData ? affinityPoint(profileAffinities) : null),
    [profileAffinities, hasData]
  );

  const dominant = hasData ? profileAffinities[0] : null;

  return (
    <div className="bg-white border border-stone-border/60 rounded-2xl p-4 md:p-6 shadow-xs">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="Mappa delle tradizioni filosofiche con la tua posizione"
      >
        {/* Griglia leggera */}
        {[-0.5, 0, 0.5].map((g) => (
          <g key={g} stroke="var(--color-stone-border, #E3E1D7)" strokeWidth={g === 0 ? 1.4 : 0.6}>
            <line x1={px(-1)} y1={px(g)} x2={px(1)} y2={px(g)} strokeDasharray={g === 0 ? "" : "3 5"} />
            <line x1={px(g)} y1={px(-1)} x2={px(g)} y2={px(1)} strokeDasharray={g === 0 ? "" : "3 5"} />
          </g>
        ))}

        {/* Etichette degli assi */}
        <g className="font-mono-tech" fontSize="11" fill="#8A8F7E" style={{ textTransform: "uppercase", letterSpacing: "0.15em" }}>
          <text x={px(-1)} y={px(0) - 10} textAnchor="start">Immanenza</text>
          <text x={px(1)} y={px(0) - 10} textAnchor="end">Trascendenza</text>
          <text x={px(0) + 10} y={px(-1) + 4} textAnchor="start">Ragione</text>
          <text x={px(0) + 10} y={px(1)} textAnchor="start">Esperienza</text>
        </g>

        {/* Linea che collega l'utente al profilo dominante */}
        {userPoint && dominant && PROFILE_COORDS[dominant.profile.n] && (
          <line
            x1={px(userPoint.x)}
            y1={px(userPoint.y)}
            x2={px(PROFILE_COORDS[dominant.profile.n].x)}
            y2={px(PROFILE_COORDS[dominant.profile.n].y)}
            stroke="var(--color-nature-gold, #C9A227)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
        )}

        {/* Filosofi: raggio proporzionale all'affinità */}
        {profileAffinities.map(({ profile, percentage, compareCount }) => {
          const coords = PROFILE_COORDS[profile.n];
          if (!coords) return null;
          const affinity = compareCount > 0 ? percentage / 100 : 0;
          const r = 8 + affinity * 14;
          const isHover = hovered === profile.n;
          const isDominant = hasData && dominant?.profile.n === profile.n;
          return (
            <g
              key={profile.n}
              onMouseEnter={() => setHovered(profile.n)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "default" }}
            >
              <circle
                cx={px(coords.x)}
                cy={px(coords.y)}
                r={r}
                fill={isDominant ? "var(--color-nature-gold, #C9A227)" : "var(--color-forest-sage, #7C8471)"}
                fillOpacity={isHover ? 0.55 : 0.28}
                stroke={isDominant ? "var(--color-nature-gold, #C9A227)" : "var(--color-forest-sage, #7C8471)"}
                strokeWidth={isHover || isDominant ? 2 : 1}
              />
              <text
                x={px(coords.x)}
                y={px(coords.y) - r - 7}
                textAnchor="middle"
                fontSize="13"
                fontWeight={isDominant ? 700 : 500}
                fill="#3D4238"
                stroke="#fff"
                strokeWidth={3.5}
                strokeLinejoin="round"
                paintOrder="stroke"
                className="font-display"
              >
                {profile.n}
              </text>
              {compareCount > 0 && (
                <text
                  x={px(coords.x)}
                  y={px(coords.y) + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#5C6152"
                  stroke="#fff"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  className="font-mono-tech"
                >
                  {percentage}%
                </text>
              )}
            </g>
          );
        })}

        {/* Le ultime compilazioni degli altri utenti */}
        {communityPoints.map((p, i) => (
          <g key={`${p.nickname}-${i}`}>
            <circle
              cx={px(p.x)}
              cy={px(p.y)}
              r="5"
              fill="var(--color-nature-teal, #4A8A85)"
              fillOpacity="0.55"
              stroke="#fff"
              strokeWidth="1.5"
            />
            <text
              x={px(p.x)}
              y={px(p.y) - 10}
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-nature-teal, #4A8A85)"
              stroke="#fff"
              strokeWidth={2.5}
              strokeLinejoin="round"
              paintOrder="stroke"
              className="font-mono-tech"
            >
              {p.nickname}
            </text>
          </g>
        ))}

        {/* Il punto dell'utente */}
        {userPoint && (
          <g>
            <circle
              cx={px(userPoint.x)}
              cy={px(userPoint.y)}
              r="9"
              fill="var(--color-nature-rose, #B56576)"
              stroke="#fff"
              strokeWidth="2.5"
            />
            {/* Etichetta "TU" a destra del pallino (a sinistra se il punto è
                nella metà destra), fuori dalla colonna verticale dove cadono
                le etichette dei filosofi, con alone bianco per leggibilità. */}
            <text
              x={px(userPoint.x) + (userPoint.x > 0.35 ? -14 : 14)}
              y={px(userPoint.y) + 4}
              textAnchor={userPoint.x > 0.35 ? "end" : "start"}
              fontSize="12"
              fontWeight="700"
              fill="var(--color-nature-rose, #B56576)"
              stroke="#fff"
              strokeWidth={3.5}
              strokeLinejoin="round"
              paintOrder="stroke"
              className="font-display"
            >
              TU
            </text>
          </g>
        )}
      </svg>

      <p className="mt-3 text-xs text-forest-sage font-sans-ui leading-relaxed">
        {hasData
          ? "Il punto rosa è il baricentro del tuo pensiero, calcolato pesando la posizione di ogni tradizione con la tua affinità. La linea tratteggiata lo collega al tuo profilo dominante."
          : "Rispondi ad alcune domande nell'Albero per veder comparire il tuo punto sulla mappa."}
        {communityPoints.length > 0 &&
          ` I punti verde-acqua sono le ultime ${communityPoints.length} compilazioni di altri visitatori.`}
        {" "}Gli assi sono una semplificazione interpretativa: nessun pensatore vive davvero in due sole dimensioni.
      </p>
    </div>
  );
}

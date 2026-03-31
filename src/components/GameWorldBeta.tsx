import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { invokeWithAuth } from "@/lib/invokeWithAuth";
import { Progress } from "@/components/ui/progress";
import {
  WORLD_LEVEL_PROMPTS,
  type WorldNode,
  type WorldStateResponse,
  xpLevel,
  worldNodeTone,
} from "@/lib/gameWorld";

type MovementState = { up: boolean; down: boolean; left: boolean; right: boolean };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function normalizeWorldError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const lower = message.toLowerCase();
  if (lower.includes("failed to fetch") || lower.includes("network")) return "Connessione instabile. Riprova.";
  if (lower.includes("401") || lower.includes("unauthorized")) return "Sessione scaduta. Effettua di nuovo il login.";
  if (lower.includes("409")) return "Azione non valida nello stato corrente della run.";
  return message || "Errore temporaneo modalità mondo.";
}

const WorldMapCanvas = ({
  nodes,
  onNearNode,
  movementRef,
}: {
  nodes: WorldNode[];
  onNearNode: (nodeCode: string | null) => void;
  movementRef: MutableRefObject<MovementState>;
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let disposed = false;
    let game: { destroy: (removeCanvas?: boolean) => void } | null = null;

    void import("phaser").then((Phaser) => {
      if (disposed || !mountRef.current) return;

      const width = 332;
      const height = 404;
      let lastNearNodeCode: string | null = null;
      let player:
        | {
            x: number;
            y: number;
            setFillStyle: (color: number) => void;
          }
        | undefined;
      let nodeSprites: Array<{
        code: string;
        x: number;
        y: number;
        radius: number;
      }> = [];
      let cursors:
        | {
            left: { isDown: boolean };
            right: { isDown: boolean };
            up: { isDown: boolean };
            down: { isDown: boolean };
          }
        | undefined;

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.CANVAS,
        width,
        height,
        parent: mountRef.current,
        transparent: true,
        backgroundColor: "#0b1220",
        scene: {
          create() {
            const scene = this as Phaser.Scene;
            const bg = scene.add.rectangle(width / 2, height / 2, width, height, 0x102038, 1);
            bg.setStrokeStyle(2, 0x334155, 0.6);

            scene.add.text(12, 10, "Zona Alpha", {
              color: "#cbd5e1",
              fontFamily: "system-ui",
              fontSize: "14px",
            });

            scene.add.rectangle(84, 84, 32, 32, 0x1e293b, 0.6).setStrokeStyle(2, 0x475569, 1);
            scene.add.rectangle(250, 130, 32, 32, 0x1e293b, 0.6).setStrokeStyle(2, 0x475569, 1);
            scene.add.rectangle(172, 236, 32, 32, 0x1e293b, 0.6).setStrokeStyle(2, 0x475569, 1);
            scene.add.rectangle(86, 318, 28, 28, 0x0f172a, 0.6).setStrokeStyle(2, 0x22c55e, 0.8);
            scene.add.rectangle(260, 328, 28, 28, 0x0f172a, 0.6).setStrokeStyle(2, 0xf59e0b, 0.8);

            nodeSprites = nodes.map((node) => {
              const tone = worldNodeTone(node.status);
              const color = tone === "done" ? 0x10b981 : tone === "ready" ? 0x60a5fa : 0x64748b;
              scene.add.circle(node.position.x, node.position.y, 12, color, 0.9).setStrokeStyle(2, 0xf8fafc, 0.2);
              scene.add.text(node.position.x - 12, node.position.y + 18, node.title.slice(0, 8), {
                color: "#94a3b8",
                fontFamily: "system-ui",
                fontSize: "9px",
              });
              return { code: node.code, x: node.position.x, y: node.position.y, radius: 26 };
            });

            player = scene.add.circle(34, 370, 10, 0x38bdf8, 1).setStrokeStyle(2, 0xffffff, 0.4);
            cursors = scene.input.keyboard?.createCursorKeys() as typeof cursors;
          },
          update(_, dt) {
            if (!player) return;
            const speed = 0.14 * dt;
            const left = Boolean(cursors?.left.isDown || movementRef.current.left);
            const right = Boolean(cursors?.right.isDown || movementRef.current.right);
            const up = Boolean(cursors?.up.isDown || movementRef.current.up);
            const down = Boolean(cursors?.down.isDown || movementRef.current.down);

            if (left) player.x -= speed;
            if (right) player.x += speed;
            if (up) player.y -= speed;
            if (down) player.y += speed;

            player.x = clamp(player.x, 16, width - 16);
            player.y = clamp(player.y, 30, height - 16);

            let currentNearNodeCode: string | null = null;
            let nearestDistance = Infinity;
            for (const node of nodeSprites) {
              const distance = Math.hypot(player.x - node.x, player.y - node.y);
              if (distance <= node.radius && distance < nearestDistance) {
                nearestDistance = distance;
                currentNearNodeCode = node.code;
              }
            }

            player.setFillStyle(currentNearNodeCode ? 0x22d3ee : 0x38bdf8);
            if (currentNearNodeCode !== lastNearNodeCode) {
              lastNearNodeCode = currentNearNodeCode;
              onNearNode(currentNearNodeCode);
            }
          },
        },
      };

      game = new Phaser.Game(config);
    });

    return () => {
      disposed = true;
      if (game) game.destroy(true);
    };
  }, [movementRef, nodes, onNearNode]);

  return <div ref={mountRef} className="w-full rounded-xl border border-border/50 overflow-hidden" />;
};

const GameWorldBeta = () => {
  const [state, setState] = useState<WorldStateResponse | null>(null);
  const [nearNodeCode, setNearNodeCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [openNodeCode, setOpenNodeCode] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const movementRef = useRef<MovementState>({ up: false, down: false, left: false, right: false });

  const loadState = async () => {
    setLoading(true);
    try {
      const worldState = await invokeWithAuth<WorldStateResponse>("game-world", { body: { action: "get_world_state" } });
      setState(worldState);
      setError(null);
    } catch (err) {
      setError(normalizeWorldError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadState();
  }, []);

  const nearNode = useMemo(() => state?.zone.nodes.find((node) => node.code === nearNodeCode) ?? null, [nearNodeCode, state?.zone.nodes]);
  const prompt = openNodeCode ? WORLD_LEVEL_PROMPTS[openNodeCode] : null;
  const completedLevelCount = useMemo(() => {
    if (!state) return 0;
    return state.zone.nodes.filter((node) => node.type === "level" && node.status === "completed").length;
  }, [state]);

  const startRun = async () => {
    setBusy(true);
    setError(null);
    try {
      await invokeWithAuth("game-world", { body: { action: "start_world_run" } });
      setMessage("Run avviata. Esplora la mappa e interagisci coi nodi.");
      await loadState();
    } catch (err) {
      setError(normalizeWorldError(err));
    } finally {
      setBusy(false);
    }
  };

  const submitNode = async (nodeCode: string, payload: Record<string, unknown>) => {
    if (!state?.activeRun?.id) return;
    setBusy(true);
    setError(null);
    try {
      const durationMs = startedAt ? Math.max(0, Math.round(performance.now() - startedAt)) : undefined;
      const response = await invokeWithAuth<{
        outcome: "success" | "fail" | "invalid";
        reason: string;
        deltas: { coinsDelta: number; energyDelta: number; xpDelta: number };
      }>("game-world", {
        body: {
          action: "submit_level_result",
          runId: state.activeRun.id,
          nodeCode,
          answers: payload,
          durationMs,
        },
      });

      const tone = response.outcome === "success" ? "Successo" : "Fallito";
      setMessage(
        `${tone}: ${response.reason}. Coins ${response.deltas.coinsDelta >= 0 ? "+" : ""}${response.deltas.coinsDelta}, Energy ${response.deltas.energyDelta >= 0 ? "+" : ""}${response.deltas.energyDelta}, XP ${response.deltas.xpDelta >= 0 ? "+" : ""}${response.deltas.xpDelta}.`,
      );
      setOpenNodeCode(null);
      setAnswers({});
      setStartedAt(null);
      await loadState();
    } catch (err) {
      setError(normalizeWorldError(err));
    } finally {
      setBusy(false);
    }
  };

  const finishRun = async () => {
    if (!state?.activeRun?.id) return;
    setBusy(true);
    setError(null);
    try {
      await invokeWithAuth("game-world", { body: { action: "finish_world_run", runId: state.activeRun.id } });
      setMessage("Zona completata. Reward finale assegnata.");
      await loadState();
    } catch (err) {
      setError(normalizeWorldError(err));
    } finally {
      setBusy(false);
    }
  };

  const renderPrompt = () => {
    if (!prompt) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 px-5 py-8 flex items-center justify-center">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-4 space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Mini livello</p>
            <h3 className="text-base font-semibold">{prompt.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{prompt.description}</p>
          </div>

          {prompt.fields.map((field) => {
            if (field.kind === "multi") {
              const selected = Array.isArray(answers[field.id]) ? (answers[field.id] as string[]) : [];
              return (
                <div key={field.id} className="space-y-2">
                  <p className="text-xs font-medium">{field.label}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {field.options.map((option) => {
                      const isSelected = selected.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            const current = new Set(selected);
                            if (current.has(option.value)) current.delete(option.value);
                            else if (current.size < field.maxSelections) current.add(option.value);
                            setAnswers((prev) => ({ ...prev, [field.id]: Array.from(current) }));
                          }}
                          className={`rounded-xl border px-3 py-2 text-left text-sm ${isSelected ? "border-primary bg-primary/10" : "border-border"}`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (field.kind === "number") {
              return (
                <label key={field.id} className="block space-y-1">
                  <span className="text-xs font-medium">{field.label}</span>
                  <input
                    type="number"
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    value={typeof answers[field.id] === "number" || typeof answers[field.id] === "string" ? String(answers[field.id]) : ""}
                    onChange={(event) => {
                      const numeric = Number(event.target.value);
                      setAnswers((prev) => ({ ...prev, [field.id]: Number.isFinite(numeric) ? numeric : event.target.value }));
                    }}
                  />
                </label>
              );
            }

            return (
              <label key={field.id} className="block space-y-1">
                <span className="text-xs font-medium">{field.label}</span>
                <select
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  value={typeof answers[field.id] === "string" ? String(answers[field.id]) : ""}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, [field.id]: event.target.value }))}
                >
                  <option value="">Seleziona...</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setOpenNodeCode(null);
                setStartedAt(null);
                setAnswers({});
              }}
              className="rounded-xl border border-border px-3 py-2 text-sm"
            >
              Chiudi
            </button>
            <button
              type="button"
              onClick={() => void submitNode(prompt.nodeCode, answers)}
              disabled={busy}
              className="rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Invio..." : "Conferma"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-primary">Beta</p>
          <h3 className="text-base font-semibold">Mondo 2D: Quartiere della Finanza</h3>
          <p className="text-xs text-muted-foreground mt-1">Esplora con avatar, entra nei nodi e completa mini-livelli per avanzare.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Caricamento mondo...</p>
      ) : state ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-border/50 p-2.5 bg-muted/30">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">XP</p>
              <p className="text-sm font-semibold">{state.profile.xp}</p>
            </div>
            <div className="rounded-xl border border-border/50 p-2.5 bg-muted/30">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Livello</p>
              <p className="text-sm font-semibold">Lv {xpLevel(state.profile.xp)}</p>
            </div>
            <div className="rounded-xl border border-border/50 p-2.5 bg-muted/30">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Progress</p>
              <p className="text-sm font-semibold">{completedLevelCount}/3</p>
            </div>
          </div>

          <Progress value={(Math.min(3, completedLevelCount) / 3) * 100} className="h-2" />

          {!state.activeRun ? (
            <button
              type="button"
              onClick={() => void startRun()}
              disabled={busy}
              className="w-full rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Avvio..." : state.canClaimMainRewardToday ? "Avvia Run Giornaliera" : "Avvia Replay (reward ridotta)"}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-border/50 bg-muted/20 p-2 text-xs text-muted-foreground">
                Run attiva. Muoviti nella mappa. Usa il D-pad o le frecce tastiera.
              </div>

              <WorldMapCanvas nodes={state.zone.nodes} movementRef={movementRef} onNearNode={setNearNodeCode} />

              <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto">
                <div />
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-2 text-xs"
                  onPointerDown={() => {
                    movementRef.current.up = true;
                  }}
                  onPointerUp={() => {
                    movementRef.current.up = false;
                  }}
                  onPointerLeave={() => {
                    movementRef.current.up = false;
                  }}
                >
                  Up
                </button>
                <div />
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-2 text-xs"
                  onPointerDown={() => {
                    movementRef.current.left = true;
                  }}
                  onPointerUp={() => {
                    movementRef.current.left = false;
                  }}
                  onPointerLeave={() => {
                    movementRef.current.left = false;
                  }}
                >
                  Left
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-2 text-xs"
                  onPointerDown={() => {
                    movementRef.current.down = true;
                  }}
                  onPointerUp={() => {
                    movementRef.current.down = false;
                  }}
                  onPointerLeave={() => {
                    movementRef.current.down = false;
                  }}
                >
                  Down
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-2 text-xs"
                  onPointerDown={() => {
                    movementRef.current.right = true;
                  }}
                  onPointerUp={() => {
                    movementRef.current.right = false;
                  }}
                  onPointerLeave={() => {
                    movementRef.current.right = false;
                  }}
                >
                  Right
                </button>
              </div>

              {nearNode ? (
                <div className="rounded-xl border border-border/60 p-3 bg-background space-y-2">
                  <p className="text-sm font-semibold">Nodo vicino: {nearNode.title}</p>
                  <p className="text-xs text-muted-foreground">{nearNode.description}</p>
                  <p className="text-[11px] text-muted-foreground">Stato: {nearNode.status}</p>
                  {nearNode.type === "level" && nearNode.status === "available" ? (
                    <button
                      type="button"
                      className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
                      onClick={() => {
                        setOpenNodeCode(nearNode.code);
                        setStartedAt(performance.now());
                      }}
                    >
                      Entra nel mini-livello
                    </button>
                  ) : null}
                  {nearNode.type === "checkpoint" && nearNode.status === "available" ? (
                    <button
                      type="button"
                      className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
                      onClick={() => void submitNode(nearNode.code, {})}
                    >
                      Raccogli checkpoint
                    </button>
                  ) : null}
                  {nearNode.type === "exit" && nearNode.status === "available" ? (
                    <button
                      type="button"
                      className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-black"
                      onClick={() => void finishRun()}
                    >
                      Esci dalla zona
                    </button>
                  ) : null}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Avvicinati a un nodo per interagire.</p>
              )}
            </div>
          )}

          {message ? <p className="text-xs text-primary">{message}</p> : null}
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </>
      ) : (
        <p className="text-sm text-destructive">{error ?? "Impossibile caricare il mondo"}</p>
      )}

      {renderPrompt()}
    </div>
  );
};

export default GameWorldBeta;



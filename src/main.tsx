import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  type Actor,
  type Battle,
  empty,
  attack,
  damage,
  hurt,
  next,
  order,
  parseBattle,
  encode,
  integer,
} from "./engine";
import { heroes, monsters, conditions, official } from "./data";
import "./style.css";
const KEY = "stormwreck-battle-v1";
function load() {
  try {
    const s = localStorage.getItem(KEY);
    return s
      ? { battle: parseBattle(s), message: "Saved battle resumed." }
      : { battle: empty, message: "" };
  } catch {
    return {
      battle: empty,
      message:
        "Saved data could not be read. Import a backup to recover it; this session starts empty.",
    };
  }
}
const initial = load();
function App() {
  const [s, set] = useState<Battle>(initial.battle),
    [history, H] = useState<Battle[]>([]),
    [message, M] = useState(initial.message),
    [tab, T] = useState("Battle"),
    [selected, S] = useState(""),
    [editor, E] = useState<Partial<Actor> | null>(null),
    [a, A] = useState(""),
    [b, B] = useState(""),
    [adv, V] = useState(false),
    [dis, D] = useState(false),
    [mod, Q] = useState("0"),
    [target, G] = useState(""),
    [rolls, R] = useState(""),
    [count, C] = useState("1"),
    [size, Z] = useState("6"),
    [dm, DM] = useState("0"),
    [factor, F] = useState("1"),
    [crit, CR] = useState(false),
    [result, RES] = useState<ReturnType<typeof attack> | null>(null),
    [adjust, J] = useState("0");
  useEffect(() => {
    try {
      localStorage.setItem(KEY, encode(s));
    } catch {
      M("Saving failed: browser storage unavailable or full. Export a backup.");
    }
  }, [s]);
  const act = s.actors.find((x) => x.id === selected),
    victim = s.actors.find((x) => x.id === target);
  function commit(n: Battle, text: string) {
    RES(null);
    H((h) => [...h.slice(-49), s]);
    set({ ...n, log: [text, ...n.log].slice(0, 100) });
    M(text);
  }
  function safe(fn: () => void) {
    try {
      fn();
    } catch (e) {
      M((e as Error).message);
    }
  }
  function update(id: string, patch: Partial<Actor>, text: string) {
    commit(
      {
        ...s,
        actors: s.actors.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      },
      text,
    );
  }
  function begin(p: Partial<Actor> = {}) {
    E({
      name: "",
      side: "hero",
      ac: undefined,
      maxHp: undefined,
      dex: 0,
      attack: 0,
      diceCount: 1,
      dieSize: 6,
      damageMod: 0,
      notes: "",
      ...p,
    });
  }
  function choose(id: string) {
    S(id);
    const x = s.actors.find((x) => x.id === id);
    if (x) {
      Q(String(x.attack));
      C(String(x.diceCount));
      Z(String(x.dieSize));
      DM(String(x.damageMod));
    }
    RES(null);
    A("");
    B("");
    R("");
  }
  function exportFile() {
    const url = URL.createObjectURL(
      new Blob([encode(s)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "stormwreck-battle.json";
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <a className="skip-link" href="#adventure">
        Skip to adventure
      </a>
      <header>
        <div className="brand">
          <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" />
          <div>
            <small>TABLETOP FIELD NOTES · 2014 5E</small>
            <h1>
              Stormwreck<span>Combat Companion</span>
            </h1>
          </div>
        </div>
        <div className="save">● Saved on this device</div>
      </header>
      <main id="adventure" tabIndex={-1}>
        <div className="intro">
          <div>
            <small>THE DRAGON’S TABLE · YOUR ADVENTURE AWAITS</small>
            <h2>Your table, in turn.</h2>
            <p>Roll on the table. Enter the numbers. Let the adventure move.</p>
          </div>
          <img
            className="dragon-art"
            src={`${import.meta.env.BASE_URL}dragon.svg`}
            alt=""
            aria-hidden="true"
          />
          <div className="round">
            <small>ROUND</small>
            <strong>{s.round.toString().padStart(2, "0")}</strong>
          </div>
        </div>
        <nav aria-label="Main navigation">
          {["Battle", "Roster & sheets", "Guide & sources"].map((t) => (
            <button
              key={t}
              className={tab === t ? "on" : ""}
              aria-pressed={tab === t}
              onClick={() => T(t)}
            >
              {t}
            </button>
          ))}
        </nav>
        <div role="status" className="notice">
          {message ||
            "Ready when you are. Add your party and opponents to begin."}
        </div>
        {tab === "Battle" && (
          <div className="layout">
            <section>
              <div className="sectionhead">
                <h3>
                  Initiative order <small>{s.actors.length} combatants</small>
                </h3>
                <button
                  onClick={() =>
                    safe(() =>
                      commit(
                        next(s),
                        s.started ? "Turn advanced." : "Battle started.",
                      ),
                    )
                  }
                >
                  {s.started ? "Next turn →" : "Start battle →"}
                </button>
              </div>
              <p className="muted">
                Enter initiative totals, including Dexterity modifiers. Equal
                totals follow list order; use ↑ / ↓ to settle ties before
                starting. Zero-HP combatants stay in order.
              </p>
              {order(s.actors).map((x) => (
                <article
                  key={x.id}
                  data-side={x.side}
                  className={`actor ${s.active === x.id ? "active" : ""} ${selected === x.id ? "selected" : ""}`}
                >
                  <div className="actor-top">
                    <span className="badge">
                      {x.side === "hero" ? "PARTY" : "FOE"}{" "}
                      {s.active === x.id ? " • ACTIVE" : ""}
                    </span>
                    <label>
                      Initiative
                      <input
                        aria-label={`${x.name} initiative`}
                        type="number"
                        value={x.initiative ?? ""}
                        onChange={(e) =>
                          safe(() =>
                            update(
                              x.id,
                              {
                                initiative:
                                  e.target.value === ""
                                    ? null
                                    : integer(
                                        Number(e.target.value),
                                        -100,
                                        100,
                                      ),
                              },
                              `${x.name}: initiative updated.`,
                            ),
                          )
                        }
                      />
                    </label>
                  </div>
                  <h3>{x.name}</h3>
                  <div className="vitals">
                    <strong>
                      {x.hp}
                      <small> / {x.maxHp} HP</small>
                    </strong>
                    <span>AC {x.ac}</span>
                    <span>{x.tempHp} temp HP</span>
                  </div>
                  <meter
                    min="0"
                    max={x.maxHp}
                    value={x.hp}
                    aria-label={`${x.name} hit points`}
                  />
                  <div className="tags">
                    {x.conditions.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                  <div className="actions">
                    <button
                      onClick={() => {
                        choose(x.id);
                        T("Battle");
                      }}
                    >
                      Use / manage
                    </button>
                    <button onClick={() => E(x)}>Edit</button>
                    {["↑", "↓"].map((v, i) => (
                      <button
                        key={v}
                        aria-label={`${v === "↑" ? "Move up" : "Move down"} ${x.name}`}
                        onClick={() => {
                          const list = order(s.actors);
                          const idx = list.findIndex((z) => z.id === x.id);
                          const j = idx + (i ? 1 : -1);
                          if (
                            j >= 0 &&
                            j < list.length &&
                            list[j].initiative === x.initiative
                          ) {
                            [list[idx], list[j]] = [list[j], list[idx]];
                            commit(
                              { ...s, actors: list },
                              "Initiative tie order updated.",
                            );
                          } else
                            M("Only equal-initiative combatants can swap.");
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
              {!s.actors.length && (
                <div className="empty">
                  <span>◇</span>
                  <h3>The battlefield is quiet.</h3>
                  <p>Add the party, then choose your opponents.</p>
                  <button onClick={() => T("Roster & sheets")}>
                    Build your roster →
                  </button>
                </div>
              )}
              <button className="subtle" onClick={() => T("Roster & sheets")}>
                + Add combatant
              </button>
            </section>
            <aside>
              <section className="panel dice-panel">
                <small>PHYSICAL DICE ONLY</small>
                <h3>Resolve an attack</h3>
                <label>
                  Attacker
                  <select
                    aria-label="Attacker"
                    value={selected}
                    onChange={(e) => choose(e.target.value)}
                  >
                    <option value="">Choose combatant</option>
                    {s.actors.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Target
                  <select
                    aria-label="Target"
                    value={target}
                    onChange={(e) => {
                      G(e.target.value);
                      RES(null);
                    }}
                  >
                    <option value="">Choose target</option>
                    {s.actors
                      .filter((x) => x.id !== selected)
                      .map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.name} · AC {x.ac}
                        </option>
                      ))}
                  </select>
                </label>
                <div className="checks">
                  <label>
                    <input
                      type="checkbox"
                      checked={adv}
                      onChange={(e) => {
                        V(e.target.checked);
                        RES(null);
                      }}
                    />{" "}
                    Advantage
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={dis}
                      onChange={(e) => {
                        D(e.target.checked);
                        RES(null);
                      }}
                    />{" "}
                    Disadvantage
                  </label>
                </div>
                <div className="fields">
                  <label>
                    d20
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={a}
                      onChange={(e) => {
                        A(e.target.value);
                        RES(null);
                      }}
                    />
                  </label>
                  {adv !== dis && (
                    <label>
                      Second d20
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={b}
                        onChange={(e) => {
                          B(e.target.value);
                          RES(null);
                        }}
                      />
                    </label>
                  )}
                  <label>
                    Attack bonus
                    <input
                      type="number"
                      value={mod}
                      onChange={(e) => {
                        Q(e.target.value);
                        RES(null);
                      }}
                    />
                  </label>
                </div>
                <button
                  className="primary"
                  onClick={() =>
                    safe(() => {
                      if (!act || !victim)
                        throw Error("Choose attacker and target.");
                      const r = attack(
                        Number(a),
                        Number(b),
                        adv,
                        dis,
                        Number(mod),
                        victim.ac,
                      );
                      CR(r.critical);
                      commit(
                        s,
                        `${act.name} → ${victim.name}: ${r.text} • ${r.hit ? "HIT" : "MISS"}`,
                      );
                      RES(r);
                    })
                  }
                >
                  Check hit
                </button>
                {result && (
                  <output
                    className={`calculation ${result.hit ? "hit" : "miss"}`}
                    aria-live="polite"
                  >
                    {result.hit ? "HIT" : "MISS"} · {result.text}
                  </output>
                )}
                <hr />
                <h3>Damage</h3>
                <div className="fields">
                  <label>
                    Dice count
                    <input
                      type="number"
                      value={count}
                      onChange={(e) => C(e.target.value)}
                    />
                  </label>
                  <label>
                    Die size
                    <input
                      type="number"
                      value={size}
                      onChange={(e) => Z(e.target.value)}
                    />
                  </label>
                  <label>
                    Modifier
                    <input
                      type="number"
                      value={dm}
                      onChange={(e) => DM(e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  <input
                    type="checkbox"
                    checked={crit}
                    onChange={(e) => CR(e.target.checked)}
                  />{" "}
                  Critical: roll twice as many dice
                </label>
                <label>
                  Individual dice results
                  <input
                    placeholder="e.g. 4, 3"
                    value={rolls}
                    onChange={(e) => R(e.target.value)}
                  />
                </label>
                <label>
                  Damage adjustment
                  <select value={factor} onChange={(e) => F(e.target.value)}>
                    <option value="1">Normal ×1</option>
                    <option value="0.5">Resistance ×½ (round down)</option>
                    <option value="2">Vulnerability ×2</option>
                    <option value="0">Immunity ×0</option>
                  </select>
                </label>
                <button
                  disabled={!result?.hit || !victim}
                  onClick={() =>
                    safe(() => {
                      if (!victim) throw Error("Choose a target.");
                      const d = damage(
                        rolls
                          .trim()
                          .split(/[\s,]+/)
                          .map(Number),
                        Number(count),
                        Number(size),
                        Number(dm),
                        crit,
                        Number(factor),
                      );
                      commit(
                        {
                          ...s,
                          actors: s.actors.map((x) =>
                            x.id === victim.id ? hurt(x, d.amount) : x,
                          ),
                        },
                        `${victim.name}: ${d.text}; temp HP absorbed first.`,
                      );
                      R("");
                      RES(null);
                    })
                  }
                >
                  Apply damage
                </button>
                <p className="muted">
                  Set situational modifiers and damage type adjustments
                  manually. Conditions are reminders; their effects are not
                  automatic.
                </p>
              </section>
              {act && (
                <section className="panel">
                  <h3>Manage {act.name}</h3>
                  <p>{act.notes || "No notes."}</p>
                  <label>
                    HP amount
                    <input
                      type="number"
                      min="0"
                      value={adjust}
                      onChange={(e) => J(e.target.value)}
                    />
                  </label>
                  <div className="actions">
                    <button
                      onClick={() =>
                        safe(() =>
                          update(
                            act.id,
                            hurt(act, integer(Number(adjust), 0, 100000)),
                            "Manual damage applied.",
                          ),
                        )
                      }
                    >
                      Damage
                    </button>
                    <button
                      onClick={() =>
                        safe(() =>
                          update(
                            act.id,
                            {
                              hp: Math.min(
                                act.maxHp,
                                act.hp + integer(Number(adjust), 0, 100000),
                              ),
                            },
                            "Healing applied.",
                          ),
                        )
                      }
                    >
                      Heal
                    </button>
                    <button
                      onClick={() =>
                        safe(() =>
                          update(
                            act.id,
                            { tempHp: integer(Number(adjust), 0, 100000) },
                            "Temp HP replaced (never stacks).",
                          ),
                        )
                      }
                    >
                      Set temp HP
                    </button>
                  </div>
                  <label>
                    Toggle condition
                    <select
                      value=""
                      onChange={(e) => {
                        const c = e.target.value;
                        if (c)
                          update(
                            act.id,
                            {
                              conditions: act.conditions.includes(c)
                                ? act.conditions.filter((v) => v !== c)
                                : [
                                    ...act.conditions.filter(
                                      (v) =>
                                        !c.startsWith("Exhaustion") ||
                                        !v.startsWith("Exhaustion"),
                                    ),
                                    c,
                                  ],
                            },
                            `${act.name}: ${c} toggled.`,
                          );
                      }}
                    >
                      <option value="">Choose condition</option>
                      {conditions.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="danger"
                    onClick={() => {
                      if (confirm(`Remove ${act.name}?`)) {
                        commit(
                          {
                            ...s,
                            actors: s.actors.filter((x) => x.id !== act.id),
                            active: s.active === act.id ? null : s.active,
                          },
                          `${act.name} removed.`,
                        );
                        S("");
                      }
                    }}
                  >
                    Remove combatant
                  </button>
                </section>
              )}
            </aside>
          </div>
        )}
        {tab === "Roster & sheets" && (
          <>
            <section className="panel party-panel">
              <small>THE ADVENTURING PARTY</small>
              <h3>Five official premade sheets</h3>
              <p>
                The official PDFs are available for personal use. Their
                character content is not bundled here. Open your sheet, then
                enter its level-1 combat values or import your own backup.
              </p>
              <a href={official} target="_blank" rel="noreferrer">
                Open official five-sheet PDF ↗
              </a>
              <div className="grid">
                {heroes.map((name) => (
                  <article className="card" key={name}>
                    <small>LEVEL 1 · EDITABLE SLOT</small>
                    <h3>{name}</h3>
                    <p>Awaiting values from your official sheet.</p>
                    <button
                      onClick={() =>
                        begin({
                          name,
                          notes:
                            "Personal entry from official Stormwreck level-1 sheet. Verify all values against your PDF.",
                        })
                      }
                    >
                      Enter {name.toLowerCase()}
                    </button>
                  </article>
                ))}
              </div>
            </section>
            <section className="panel encounter-panel">
              <small>MANUAL ENCOUNTER BUILDER</small>
              <h3>Choose your opponents</h3>
              <p>
                Add as many copies as needed. These are SRD combat extracts, not
                adventure-specific stat blocks.
              </p>
              <div className="grid">
                {monsters.map((m) => (
                  <article className="card" key={m.name}>
                    <h3>{m.name}</h3>
                    <p>
                      AC {m.ac} · {m.maxHp} HP · DEX {m.dex >= 0 ? "+" : ""}
                      {m.dex}
                    </p>
                    <details>
                      <summary>Combat notes & source</summary>
                      <p>{m.notes}</p>
                    </details>
                    <button
                      onClick={() => {
                        const n =
                          s.actors.filter((x) => x.name.startsWith(m.name))
                            .length + 1;
                        const x: Actor = {
                          ...m,
                          name: `${m.name} ${n}`,
                          id: crypto.randomUUID(),
                          side: "monster",
                          hp: m.maxHp,
                          tempHp: 0,
                          initiative: null,
                          conditions: [],
                        };
                        commit(
                          { ...s, actors: [...s.actors, x] },
                          `${x.name} added.`,
                        );
                      }}
                    >
                      + Add {m.name}
                    </button>
                  </article>
                ))}
              </div>
              <button onClick={() => begin({ side: "monster" })}>
                + Custom combatant / restricted-stat placeholder
              </button>
            </section>
          </>
        )}
        {tab === "Guide & sources" && (
          <section className="panel prose">
            <h3>A companion for the table</h3>
            <p>
              1. Open the official PDF and enter your party’s level-1 combat
              values. Add monsters manually, including duplicates. Nothing rolls
              dice for you.
            </p>
            <p>
              2. Roll initiative physically, add each Dexterity modifier and
              enter the totals. Resolve ties with ↑ / ↓, then start battle. Next
              turn advances the active marker and round; defeated actors remain
              for death saves or DM decisions.
            </p>
            <p>
              3. Select attacker and target, enter d20 results and the final
              attack bonus. Advantage uses the higher die, disadvantage the
              lower; both cancel. Natural 1 misses and natural 20 hits
              critically. On a critical, physically roll twice the damage dice
              and add the modifier once.
            </p>
            <p>
              4. Enter individual damage dice and choose resistance,
              vulnerability or immunity for that damage type. Use separate
              applications for mixed damage types. Temporary HP absorbs damage
              first; healing cannot exceed maximum HP.
            </p>
            <h3>DM adjudication</h3>
            <p>
              Condition effects, cover, range, concentration, saving throws,
              spells, resources, death saves, massive damage, stable/dying
              state, exhaustion levels and monster traits require manual
              adjudication. Set advantage, disadvantage, bonuses, HP and
              conditions as appropriate. At 0 HP, record Unconscious when
              appropriate and track death saves in notes. This MVP handles
              attack rolls and damage; it is not a complete rules engine.
            </p>
            <h3>Sources & licensing</h3>
            <p>
              <a href="https://www.dndbeyond.com/resources/1779-d-d-character-sheets">
                Official character sheet source
              </a>{" "}
              (verified 16 November 2026) links the five-sheet Stormwreck PDF
              and permits personal printing/photocopying. No PDF, artwork,
              backstory or premade statistics are redistributed. The five class
              slots are editable placeholders, not invented character sheets.
            </p>
            <p>
              This work includes material taken from the System Reference
              Document 5.1 (“SRD 5.1”) by Wizards of the Coast LLC and available
              at{" "}
              <a href="https://dnd.wizards.com/resources/systems-reference-document">
                https://dnd.wizards.com/resources/systems-reference-document
              </a>
              . The SRD 5.1 is licensed under the Creative Commons Attribution
              4.0 International License available at{" "}
              <a href="https://creativecommons.org/licenses/by/4.0/legalcode">
                https://creativecommons.org/licenses/by/4.0/legalcode
              </a>
              .
            </p>
            <p>
              <a href="https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf">
                SRD 5.1 source PDF
              </a>
              . Combat extracts are abridged; rules are paraphrased. This is an
              independent, unofficial tool. No affiliation or endorsement.
            </p>
            <h3>Your data</h3>
            <p>
              One active battle is stored in this browser. No account or server
              sync. Export backups before clearing site data; imports replace
              the current battle and can be undone. Offline use requires a
              successful first visit; install via your browser’s app menu.
            </p>
          </section>
        )}
        <section className="toolbar">
          <button
            disabled={!history.length}
            onClick={() => {
              const previous = history[history.length - 1];
              if (previous) {
                set(previous);
                H(history.slice(0, -1));
                RES(null);
                M("Last change undone.");
              }
            }}
          >
            ↶ Undo {history.length ? `(${history.length})` : ""}
          </button>
          <button onClick={exportFile}>Export backup</button>
          <label className="filebutton">
            Import backup
            <input
              type="file"
              accept="application/json,.json"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  if (f.size > 2000000) {
                    M("Backup exceeds 2 MB limit.");
                    return;
                  }
                  f.text()
                    .then((raw) =>
                      safe(() => {
                        const n = parseBattle(raw);
                        commit(n, "Backup imported.");
                        S("");
                        G("");
                        RES(null);
                      }),
                    )
                    .catch(() => M("Could not read file."));
                }
                e.target.value = "";
              }}
            />
          </label>
          <button
            className="danger"
            onClick={() => {
              if (
                confirm(
                  "End this battle and clear the roster? Export a backup first.",
                )
              ) {
                commit(empty, "New battle created.");
                S("");
                G("");
                RES(null);
              }
            }}
          >
            New battle
          </button>
        </section>
        <section className="panel">
          <h3>Battle journal</h3>
          {!s.log.length ? (
            <p className="muted">
              Your calculations and decisions appear here.
            </p>
          ) : (
            <ol className="journal">
              {s.log.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ol>
          )}
        </section>
        <footer>
          STORMWRECK · Physical dice. Transparent math. Your adventure.
        </footer>
      </main>
      {editor && (
        <div className="overlay">
          <form
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Combatant editor"
            onSubmit={(e) => {
              e.preventDefault();
              safe(() => {
                if (!editor.name?.trim()) throw Error("Enter a name.");
                const maxHp = integer(Number(editor.maxHp), 1, 100000);
                const x: Actor = {
                  id: editor.id || crypto.randomUUID(),
                  name: editor.name.trim().slice(0, 100),
                  side: editor.side || "hero",
                  ac: integer(Number(editor.ac), 0, 100),
                  maxHp,
                  hp: Math.min(editor.hp ?? maxHp, maxHp),
                  tempHp: editor.tempHp ?? 0,
                  dex: integer(Number(editor.dex), -10, 20),
                  initiative: editor.initiative ?? null,
                  conditions: editor.conditions ?? [],
                  notes: editor.notes ?? "",
                  attack: integer(Number(editor.attack), -100, 100),
                  diceCount: integer(Number(editor.diceCount), 1, 30),
                  dieSize: integer(Number(editor.dieSize), 2, 100),
                  damageMod: integer(Number(editor.damageMod), -100, 100),
                };
                commit(
                  {
                    ...s,
                    actors: editor.id
                      ? s.actors.map((a) => (a.id === x.id ? x : a))
                      : [...s.actors, x],
                  },
                  `${x.name} saved.`,
                );
                E(null);
              });
            }}
          >
            <h3>{editor.id ? "Edit combatant" : "Add combatant"}</h3>
            <p>Enter verified sheet values. Blank stats are not defaults.</p>
            <label>
              Name
              <input
                required
                maxLength={100}
                value={editor.name ?? ""}
                onChange={(e) => E({ ...editor, name: e.target.value })}
              />
            </label>
            <label>
              Side
              <select
                value={editor.side}
                onChange={(e) =>
                  E({ ...editor, side: e.target.value as Actor["side"] })
                }
              >
                <option value="hero">Party</option>
                <option value="monster">Monster</option>
              </select>
            </label>
            <div className="fields">
              {(
                [
                  "ac",
                  "maxHp",
                  "dex",
                  "attack",
                  "diceCount",
                  "dieSize",
                  "damageMod",
                ] as const
              ).map((k) => (
                <label key={k}>
                  {
                    {
                      ac: "Armor class",
                      maxHp: "Max HP",
                      dex: "DEX modifier",
                      attack: "Attack bonus",
                      diceCount: "Damage dice",
                      dieSize: "Die size",
                      damageMod: "Damage bonus",
                    }[k]
                  }
                  <input
                    required
                    type="number"
                    value={editor[k] ?? ""}
                    onChange={(e) =>
                      E({
                        ...editor,
                        [k]:
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                      })
                    }
                  />
                </label>
              ))}
            </div>
            <label>
              Sheet notes / abilities / death saves
              <textarea
                value={editor.notes ?? ""}
                onChange={(e) => E({ ...editor, notes: e.target.value })}
              />
            </label>
            <div role="status">{message}</div>
            <div className="actions">
              <button type="submit" className="primary">
                Save combatant
              </button>
              <button type="button" onClick={() => E(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
if ("serviceWorker" in navigator)
  navigator.serviceWorker
    .register(`${import.meta.env.BASE_URL}sw.js`)
    .catch(() => {});

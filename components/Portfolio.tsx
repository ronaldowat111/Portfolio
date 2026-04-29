"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GameEngine } from "@/lib/game/GameEngine";
import { GameState } from "@/lib/game/GameState";
import { MissionManager, SectionId } from "@/lib/game/MissionManager";
import type { RenderConfig } from "@/lib/game/Renderer";

/* ─── Types ─────────────────────────────────────────────────────── */
interface HUDState {
  score: number;
  lives: number;
  coins: number;
  jumps: number;
  blockHits: number;
}

/* ─── Root ───────────────────────────────────────────────────────── */
export default function Portfolio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [hud, setHUD] = useState<HUDState>({ score: 0, lives: 3, coins: 0, jumps: 0, blockHits: 0 });
  const [unlocked, setUnlocked] = useState<Set<SectionId>>(new Set());
  const [toast, setToast] = useState<{ id: SectionId; visible: boolean } | null>(null);
  const [config, setConfig] = useState<RenderConfig>({ showClouds: true, showCoins: true, skyColor: "#5C94FC" });

  const onStateUpdate = useCallback((state: GameState) => {
    setHUD({ score: state.score, lives: state.lives, coins: state.coins, jumps: state.jumps, blockHits: state.blockHits });
  }, []);

  const onSectionUnlocked = useCallback((id: SectionId) => {
    setUnlocked((prev) => new Set([...prev, id]));
    setToast({ id, visible: true });
    setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new GameEngine(canvas, { onStateUpdate, onSectionUnlocked });
    engineRef.current = engine;
    engine.start();
    return () => engine.stop();
  }, [onStateUpdate, onSectionUnlocked]);

  useEffect(() => {
    if (engineRef.current) engineRef.current.config = config;
  }, [config]);

  const cheatUnlockAll = () => engineRef.current?.cheatUnlockAll();

  const sectionNames: Record<SectionId, string> = { about: "ABOUT ME", projects: "PROJECTS", skills: "SKILLS", contact: "CONTACT" };

  return (
    <>
      <style>{`
        @keyframes coinPop { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-60px)} }
        @keyframes lockBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes unlockFlash {
          0%{border-color:#FCD000;background:rgba(252,208,0,0.15)}
          50%{border-color:white;background:rgba(255,255,255,0.05)}
          100%{border-color:#FCD000;background:rgba(252,208,0,0.15)}
        }
        @keyframes panelReveal { from{opacity:0;transform:scale(0.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes toastIn { from{transform:translate(-50%,-50%) scale(0)} to{transform:translate(-50%,-50%) scale(1)} }
      `}</style>

      {/* CANVAS */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-8 h-[52px] bg-[#0a0a28]/97 border-b-4 border-[#FCD000]" style={{ boxShadow: "0 4px 0 #000" }}>
        <div className="text-[#FCD000] text-[10px] tracking-wider" style={{ textShadow: "2px 2px 0 #000" }}>★ ARYA.DEV</div>
        <ul className="flex gap-5 list-none">
          {(["about", "projects", "skills", "contact"] as SectionId[]).map((id) => (
            <li key={id}>
              <a href={`#${id}`} className={`text-[7px] tracking-wider no-underline transition-colors ${unlocked.has(id) ? "text-white hover:text-[#FCD000]" : "text-[#555] cursor-not-allowed pointer-events-none"}`}>
                {!unlocked.has(id) && "🔒 "}{id.toUpperCase() === "ABOUT" ? "ABOUT" : id.toUpperCase() === "PROJECTS" ? "WORK" : id.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* HUD */}
      <div className="fixed top-[52px] left-0 right-0 z-[190] flex justify-center gap-12 items-center py-[5px] bg-[#0a0a28]/75 border-b border-white/10 text-[7px] text-white pointer-events-none">
        <HUDItem label="SCORE" value={String(hud.score).padStart(6, "0")} />
        <HUDItem label="" value={"♥ ".repeat(hud.lives).trim()} />
        <HUDItem label="COINS" value={`×${String(hud.coins).padStart(2, "0")}`} />
        <HUDItem label="JUMPS" value={String(hud.jumps).padStart(2, "0")} />
        <HUDItem label="BLOCKS" value={String(hud.blockHits).padStart(2, "0")} />
      </div>

      {/* MISSIONS PANEL */}
      <MissionsPanel hud={hud} unlocked={unlocked} />

      {/* CONTENT */}
      <div id="content" className="relative z-10 pointer-events-none">
        <HeroSection />
        <AboutSection unlocked={unlocked.has("about")} coins={hud.coins} />
        <ProjectsSection unlocked={unlocked.has("projects")} blocks={hud.blockHits} />
        <SkillsSection unlocked={unlocked.has("skills")} jumps={hud.jumps} />
        <ContactSection unlocked={unlocked.has("contact")} score={hud.score} />
      </div>

      {/* CTRL HINT */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[190] pointer-events-none text-[6px] text-white/70 text-center bg-black/55 px-4 py-[7px] border-2 border-white/20 whitespace-nowrap" style={{ textShadow: "1px 1px 0 #000" }}>
        ← → MOVE &nbsp;|&nbsp; SPACE / ↑ JUMP &nbsp;|&nbsp; Complete missions to unlock sections!
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-1/2 left-1/2 z-[1000] bg-[#10103a] border-[5px] border-[#FCD000] text-center px-12 py-8 pointer-events-none" style={{ boxShadow: "0 0 0 3px #000, 8px 8px 0 #000", animation: "toastIn .25s cubic-bezier(.34,1.56,.64,1) forwards" }}>
          <span className="block text-3xl mb-2">⭐</span>
          <span className="block text-[10px] text-[#FCD000] mb-2" style={{ textShadow: "2px 2px 0 #000" }}>AREA UNLOCKED!</span>
          <span className="block text-[8px] text-white" style={{ textShadow: "1px 1px 0 #000" }}>{sectionNames[toast.id]}</span>
        </div>
      )}

      {/* TWEAKS */}
      <TweaksPanel config={config} setConfig={setConfig} onCheat={cheatUnlockAll} />

      <footer className="relative z-10 text-center p-10 text-[6px] text-white/40 pointer-events-all border-t border-white/10">
        © 2025 ARYA SHEVA SATYATAMA · BUILT WITH NEXT.JS + CANVAS · 1-UP
      </footer>
    </>
  );
}

/* ─── HUD Item ───────────────────────────────────────────────────── */
function HUDItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      {label && <span>{label}</span>}
      <span className="text-[#FCD000] text-[9px]">{value}</span>
    </div>
  );
}

/* ─── Missions Panel ─────────────────────────────────────────────── */
function MissionsPanel({ hud, unlocked }: { hud: HUDState; unlocked: Set<SectionId> }) {
  const missions = [
    { id: "about" as SectionId, label: "ABOUT", detail: "Collect 10 coins", val: hud.coins, max: 10 },
    { id: "projects" as SectionId, label: "PROJECTS", detail: "Hit 4 ? blocks", val: hud.blockHits, max: 4 },
    { id: "skills" as SectionId, label: "SKILLS", detail: "Jump 15 times", val: hud.jumps, max: 15 },
    { id: "contact" as SectionId, label: "CONTACT", detail: "Reach score 3000", val: hud.score, max: 3000 },
  ];
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[180] w-[200px] bg-[#0a0a28]/96 border-[3px] border-[#FCD000] p-3.5 text-[6px] text-white hidden lg:block" style={{ boxShadow: "4px 4px 0 #000" }}>
      <h4 className="text-[#FCD000] text-[8px] mb-3 text-center" style={{ textShadow: "2px 2px 0 #000" }}>📋 MISSIONS</h4>
      {missions.map((m) => {
        const done = unlocked.has(m.id);
        const pct = Math.min(100, (Math.min(m.val, m.max) / m.max) * 100);
        return (
          <div key={m.id} className={`mb-2.5 border-2 p-2 ${done ? "border-[#00A800] bg-[#00A800]/10" : "border-white/10"}`}>
            <div className="flex justify-between items-center mb-1">
              <span>{m.label}</span>
              {done && <span className="text-[#00A800]">✔</span>}
            </div>
            <div className="h-[10px] bg-white/10 border border-white/20">
              <div className="h-full transition-all duration-300" style={{ width: `${pct}%`, background: done ? "#00A800" : "#E52521" }} />
            </div>
            <div className="text-[5px] text-[#888] mt-1">{m.detail} ({Math.min(m.val, m.max)}/{m.max})</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center pointer-events-none" style={{ paddingTop: 52, paddingRight: 240 }}>
      <h1 className="text-white leading-[1.6] mb-3" style={{ fontSize: "clamp(18px,3vw,34px)", textShadow: "4px 4px 0 #000, -2px -2px 0 #1a6ebd" }}>
        ARYA SHEVA<br />SATYATAMA
      </h1>
      <p className="text-[10px] text-[#FCD000] mb-9" style={{ textShadow: "2px 2px 0 #000" }}>FULL-STACK DEVELOPER</p>
      <p className="text-[7px] text-white/70 leading-loose mb-5" style={{ textShadow: "1px 1px 0 #000" }}>Complete missions to unlock<br />each section of this portfolio!</p>
      <p className="text-[9px] text-white animate-pulse" style={{ textShadow: "2px 2px 0 #000" }}>▼ PLAY TO EXPLORE ▼</p>
    </section>
  );
}

/* ─── Locked Panel shell ─────────────────────────────────────────── */
function LockedPanel({ name, challenge, val, max, id }: { name: string; challenge: React.ReactNode; val: number; max: number; id: string }) {
  const pct = Math.min(100, (Math.min(val, max) / max) * 100);
  return (
    <div className="pointer-events-all bg-[#05051440] border-4 border-[#333] relative overflow-hidden flex flex-col items-center justify-center min-h-[320px] text-center p-10 w-full max-w-[860px]" style={{ boxShadow: "6px 6px 0 rgba(0,0,0,.8)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.15) 3px,rgba(0,0,0,.15) 4px)" }} />
      <div className="text-[52px] mb-5" style={{ animation: "lockBob 2s ease-in-out infinite" }}>🔒</div>
      <div className="text-[14px] text-[#555] mb-1.5 uppercase">{name}</div>
      <div className="text-[8px] text-[#888] mb-6 leading-loose">{challenge}</div>
      <div className="w-full max-w-[340px]">
        <div className="flex justify-between text-[7px] text-[#888] mb-2"><span>PROGRESS</span><span>{Math.min(val, max)} / {max}</span></div>
        <div className="h-[18px] bg-white/10 border-[3px] border-[#333] overflow-hidden">
          <div className="h-full bg-[#E52521] transition-all duration-500 relative" style={{ width: `${pct}%` }}>
            <div className="absolute inset-x-0 top-0 h-[35%] bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Panel wrapper ──────────────────────────────────────────────── */
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pointer-events-all bg-[#0a0a28]/93 border-4 border-white text-white p-10 max-w-[860px] w-full" style={{ boxShadow: "inset -3px -3px 0 rgba(0,0,0,.5),6px 6px 0 rgba(0,0,0,.8)", animation: "panelReveal .5s ease-out forwards" }}>
      <div className="text-[13px] text-[#FCD000] mb-8 flex items-center gap-3" style={{ textShadow: "3px 3px 0 #000" }}>
        <span className="text-[#E52521]">▶</span>{title}
      </div>
      {children}
    </div>
  );
}

/* ─── About ──────────────────────────────────────────────────────── */
function AboutSection({ unlocked, coins }: { unlocked: boolean; coins: number }) {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center pointer-events-none" style={{ padding: "110px 240px 60px 60px" }}>
      {unlocked ? (
        <Panel title="ABOUT ME">
          <p className="text-[7px] leading-[2.3] text-[#ccc] mb-5">Hi! I&apos;m Arya — a Full-Stack Developer who loves crafting fast, scalable, and delightful digital experiences. From pixel-perfect frontends to robust backend architectures, I build things end-to-end with care and precision.</p>
          <p className="text-[7px] leading-[2.3] text-[#ccc] mb-5">When I&apos;m not writing code, you&apos;ll probably find me exploring retro games, contributing to open source, or diving deep into new tech rabbit holes.</p>
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[["5+", "YEARS EXP"], ["30+", "PROJECTS"], ["12+", "TECHNOLOGIES"], ["∞", "CURIOSITY"]].map(([n, l]) => (
              <div key={l} className="border-2 border-white/20 p-3.5 text-center">
                <span className="block text-[18px] text-[#FCD000] mb-1.5" style={{ textShadow: "2px 2px 0 #000" }}>{n}</span>
                <span className="text-[5px] text-[#999]">{l}</span>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <LockedPanel id="about" name="ABOUT ME" challenge={<>Collect <span className="text-[#FCD000]">10 coins</span> to unlock</>} val={coins} max={10} />
      )}
    </section>
  );
}

/* ─── Projects ───────────────────────────────────────────────────── */
const PROJECTS = [
  { num: "01", name: "NEXUS PLATFORM", desc: "Real-time collaborative workspace with live document editing, task boards, and video calls for distributed teams.", tags: ["REACT", "NODE.JS", "WEBSOCKETS", "POSTGRES"] },
  { num: "02", name: "DATAFLOW ENGINE", desc: "Visual ETL pipeline builder with drag-and-drop nodes, scheduling, and real-time monitoring of data transformations.", tags: ["PYTHON", "FASTAPI", "VUE.JS", "REDIS"] },
  { num: "03", name: "SHOPFORGE", desc: "E-commerce platform with AI-powered recommendations, inventory management, and multi-currency checkout.", tags: ["NEXT.JS", "STRIPE", "PRISMA", "AI"] },
  { num: "04", name: "CLOUDWATCH CLI", desc: "Developer tool for monitoring, querying, and alerting on cloud infrastructure metrics — from the terminal.", tags: ["GO", "AWS SDK", "CLI", "GRAFANA"] },
];

function ProjectsSection({ unlocked, blocks }: { unlocked: boolean; blocks: number }) {
  return (
    <section id="projects" className="min-h-screen flex items-center justify-center pointer-events-none" style={{ padding: "110px 240px 60px 60px" }}>
      {unlocked ? (
        <Panel title="PROJECTS">
          <div className="grid grid-cols-2 gap-4">
            {PROJECTS.map((p) => (
              <div key={p.num} className="border-[3px] border-white/20 p-5 cursor-pointer transition-all hover:border-[#FCD000] hover:-translate-x-1 hover:-translate-y-1 pointer-events-all" style={{ transition: "border-color .1s, transform .1s, box-shadow .1s" }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "5px 5px 0 #FCD000")} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}>
                <div className="text-[18px] text-[#E52521] mb-2" style={{ textShadow: "2px 2px 0 #000" }}>{p.num}</div>
                <div className="text-[8px] text-[#FCD000] mb-2">{p.name}</div>
                <div className="text-[6px] text-[#bbb] leading-[1.9]">{p.desc}</div>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {p.tags.map((t) => <span key={t} className="text-[5px] bg-[#E52521] text-white px-1.5 py-0.5 border-2 border-white/15">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <LockedPanel id="projects" name="PROJECTS" challenge={<>Hit <span className="text-[#FCD000]">4 question blocks</span> to unlock</>} val={blocks} max={4} />
      )}
    </section>
  );
}

/* ─── Skills ─────────────────────────────────────────────────────── */
const SKILLS = [
  [["REACT / NEXT", 92], ["NODE.JS", 88], ["TYPESCRIPT", 85], ["PYTHON", 80], ["GO", 70], ["SQL / POSTGRES", 88]],
  [["DOCKER / K8S", 78], ["AWS / GCP", 75], ["GRAPHQL", 82], ["REDIS", 74], ["CI/CD", 83], ["UI / CSS", 90]],
] as [string, number][][];

function SkillsSection({ unlocked, jumps }: { unlocked: boolean; jumps: number }) {
  return (
    <section id="skills" className="min-h-screen flex items-center justify-center pointer-events-none" style={{ padding: "110px 240px 60px 60px" }}>
      {unlocked ? (
        <Panel title="SKILLS">
          <div className="grid grid-cols-2 gap-x-11 gap-y-1">
            {SKILLS.map((col, ci) => (
              <div key={ci}>
                {col.map(([name, pct]) => (
                  <div key={name} className="flex items-center gap-2.5 mb-0.5">
                    <span className="text-[6px] text-white min-w-[100px]">{name}</span>
                    <div className="flex-1 h-4 bg-white/10 border-2 border-white/20 overflow-hidden">
                      <div className="h-full bg-[#E52521] relative transition-all duration-[1200ms] ease-out" style={{ width: `${pct}%` }}>
                        <div className="absolute inset-x-0 top-0 h-[35%] bg-white/20" />
                      </div>
                    </div>
                    <span className="text-[6px] text-[#FCD000] min-w-[32px] text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <LockedPanel id="skills" name="SKILLS" challenge={<>Jump <span className="text-[#FCD000]">15 times</span> to unlock</>} val={jumps} max={15} />
      )}
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────────── */
function ContactSection({ unlocked, score }: { unlocked: boolean; score: number }) {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="min-h-screen flex items-center justify-center pointer-events-none" style={{ padding: "110px 240px 60px 60px" }}>
      {unlocked ? (
        <Panel title="CONTACT">
          <div className="grid grid-cols-2 gap-9">
            <div className="flex flex-col gap-4 pointer-events-all">
              {[["YOUR NAME", "text", "Player One..."], ["EMAIL", "email", "player@world.com"]].map(([label, type, placeholder]) => (
                <div key={label as string} className="flex flex-col gap-1.5">
                  <label className="text-[6px] text-[#FCD000]">{label}</label>
                  <input type={type as string} placeholder={placeholder as string} className="font-[inherit] text-[7px] bg-white/5 border-[3px] border-white/25 text-white px-3 py-2.5 outline-none focus:border-[#FCD000]" />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-[6px] text-[#FCD000]">MESSAGE</label>
                <textarea placeholder="Enter your message..." className="font-[inherit] text-[7px] bg-white/5 border-[3px] border-white/25 text-white px-3 py-2.5 outline-none focus:border-[#FCD000] resize-y min-h-[80px]" />
              </div>
              <button onClick={() => setSent(true)} className="font-[inherit] text-[7px] bg-[#E52521] text-white border-4 border-white px-6 py-3 cursor-pointer self-start active:translate-x-0.5 active:translate-y-0.5" style={{ boxShadow: "4px 4px 0 #000" }}>
                {sent ? "★ SENT!" : "SEND ▶"}
              </button>
            </div>
            <div className="flex flex-col gap-5 justify-center">
              {[["✉", "tamasaty06@gmail.com"], ["⌨", "github.com/aryasheva"], ["▦", "linkedin.com/in/aryasheva"], ["◈", "@aryasheva"]].map(([icon, text]) => (
                <a key={text as string} href="#" className="flex items-center gap-3 text-[7px] text-[#ccc] no-underline p-3 border-2 border-white/15 hover:border-[#FCD000] hover:text-[#FCD000] pointer-events-all transition-colors">
                  <span className="text-sm w-6 text-center">{icon}</span>{text}
                </a>
              ))}
            </div>
          </div>
        </Panel>
      ) : (
        <LockedPanel id="contact" name="CONTACT" challenge={<>Reach score <span className="text-[#FCD000]">3000 pts</span> to unlock</>} val={score} max={3000} />
      )}
    </section>
  );
}

/* ─── Tweaks Panel ───────────────────────────────────────────────── */
function TweaksPanel({ config, setConfig, onCheat }: { config: RenderConfig; setConfig: React.Dispatch<React.SetStateAction<RenderConfig>>; onCheat: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "__activate_edit_mode") setVisible(true);
      if (e.data?.type === "__deactivate_edit_mode") setVisible(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  if (!visible) return null;
  return (
    <div className="fixed bottom-[70px] left-4 z-[999] bg-[#0a0a28]/97 border-4 border-[#FCD000] p-4 w-[210px] text-[7px] text-white" style={{ boxShadow: "4px 4px 0 #000" }}>
      <h3 className="text-[#FCD000] mb-3.5 text-[9px] text-center">TWEAKS</h3>
      <label className="block text-[5px] text-[#aaa] mb-1">SKY COLOR</label>
      <select className="font-[inherit] text-[5px] bg-white/10 border-2 border-white/20 text-white p-1 w-full mb-3" value={config.skyColor} onChange={(e) => setConfig((c) => ({ ...c, skyColor: e.target.value }))}>
        <option value="#5C94FC">DAY SKY</option>
        <option value="#1a1a3a">NIGHT</option>
        <option value="#2d1b4e">DUSK</option>
        <option value="#0a3d0a">UNDERGROUND</option>
      </select>
      <label className="flex items-center gap-2 text-[5px] mb-2 cursor-pointer">
        <input type="checkbox" checked={config.showClouds} onChange={(e) => setConfig((c) => ({ ...c, showClouds: e.target.checked }))} /> CLOUDS
      </label>
      <label className="flex items-center gap-2 text-[5px] mb-3 cursor-pointer">
        <input type="checkbox" checked={config.showCoins} onChange={(e) => setConfig((c) => ({ ...c, showCoins: e.target.checked }))} /> COINS
      </label>
      <button onClick={onCheat} className="font-[inherit] text-[6px] bg-[#E52521]/80 text-white border-[3px] border-white p-2 cursor-pointer w-full hover:bg-[#E52521]" style={{ boxShadow: "3px 3px 0 #000" }}>🔓 UNLOCK ALL</button>
    </div>
  );
}

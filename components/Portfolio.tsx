"use client";

export default function Portfolio() {
  return (
    <>
      <Navbar />
      <HUD />
      <Hero />
    </>
  );
}

/* ─────────── NAVBAR ─────────── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-56px px-8 bg-[#0a0a28]/95 border-b-4 border-[#FCD000]">
      <div className="text-[#FCD000] text-[11px] tracking-widest" style={{ textShadow: "2px 2px 0 #000" }}>
        Tama Toes
      </div>
      <ul className="flex gap-7 list-none">
        <li><NavLink>ABOUT</NavLink></li>
        <li><NavLink>WORK</NavLink></li>
        <li><NavLink>SKILLS</NavLink></li>
        <li><NavLink>CONTACT</NavLink></li>
      </ul>
    </nav>
  );
}

function NavLink({ children }: { children: React.ReactNode }) {
  return (
    <a href="#" className="text-white text-[9px] tracking-widest hover:text-[#FCD000] transition-colors">
      🔒 {children}
    </a>
  );
}

/* ─────────── HUD (Heads-Up Display) ─────────── */
function HUD() {
  return (
    <div className="fixed top-56px left-0 right-0 z-40 flex justify-center gap-10 items-center py-2 bg-[#0a0a28]/75 border-b border-white/10 text-[9px] text-white">
      <HUDItem label="SCORE" value="000000" />
      <HUDItem label="" value="♥ ♥ ♥" />
      <HUDItem label="COINS" value="×00" />
      <HUDItem label="JUMPS" value="00" />
      <HUDItem label="BLOCKS" value="00" />
    </div>
  );
}

function HUDItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {label && <span className="text-white/60">{label}</span>}
      <span className="text-[#FCD000] text-[10px]">{value}</span>
    </div>
  );
}

function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-110px">
      <h1 className="text-clamp(22px,4vw,42px) text-white leading-[1.7] mb-5" style={{ textShadow: "4px 4px 0 #000, -2px -2px 0 #1a6ebd" }}>
        ARYA SHEVA<br />SATYATAMA
      </h1>
      <p className="text-[11px] text-[#FCD000] mb-10" style={{ textShadow: "2px 2px 0 #000" }}>
        FULL-STACK DEVELOPER
      </p>
      <p className="text-[9px] text-white/70 leading-loose mb-7" style={{ textShadow: "1px 1px 0 #000" }}>
        Complete missions to unlock<br />each section of this portfolio!
      </p>
      <p className="text-[10px] text-white animate-pulse" style={{ textShadow: "2px 2px 0 #000" }}>
        ▼ PLAY TO EXPLORE ▼
      </p>
    </section>
  );
}
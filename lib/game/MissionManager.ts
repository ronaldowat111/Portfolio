import { GameState } from "./GameState";

export type SectionId = "about" | "projects" | "skills" | "contact";

interface MissionDef {
  id: SectionId;
  key: keyof Pick<GameState, "coins" | "blockHits" | "jumps" | "score">;
  target: number;
  label: string;
}

export interface MissionProgress {
  id: SectionId;
  current: number;
  target: number;
  pct: number;
  done: boolean;
  label: string;
}

const MISSIONS: MissionDef[] = [
  { id: "about",    key: "coins",     target: 10,   label: "Collect 10 coins" },
  { id: "projects", key: "blockHits", target: 4,    label: "Hit 4 ? blocks" },
  { id: "skills",   key: "jumps",     target: 15,   label: "Jump 15 times" },
  { id: "contact",  key: "score",     target: 3000, label: "Reach score 3000" },
];

export class MissionManager {
  private unlocked = new Set<SectionId>();

  /** Returns newly-unlocked section IDs since last call. */
  update(state: GameState): SectionId[] {
    const newlyUnlocked: SectionId[] = [];
    for (const m of MISSIONS) {
      if (this.unlocked.has(m.id)) continue;
      if (state[m.key] >= m.target) {
        this.unlocked.add(m.id);
        newlyUnlocked.push(m.id);
      }
    }
    return newlyUnlocked;
  }

  isUnlocked(id: SectionId): boolean {
    return this.unlocked.has(id);
  }

  getProgress(state: GameState): MissionProgress[] {
    return MISSIONS.map((m) => {
      const current = Math.min(state[m.key], m.target);
      return {
        id: m.id,
        current,
        target: m.target,
        pct: Math.min(100, (current / m.target) * 100),
        done: this.unlocked.has(m.id),
        label: m.label,
      };
    });
  }

  unlockAll(state: GameState): void {
    for (const m of MISSIONS) {
      state[m.key] = m.target as never;
      this.unlocked.add(m.id);
    }
  }
}

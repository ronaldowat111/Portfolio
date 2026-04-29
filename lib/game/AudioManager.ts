export class AudioManager {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as never as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    return this.ctx;
  }

  private beep(freq: number, dur: number, type: OscillatorType = "square", vol = 0.15): void {
    try {
      const a = this.getCtx();
      const o = a.createOscillator();
      const g = a.createGain();
      o.connect(g);
      g.connect(a.destination);
      o.type = type;
      o.frequency.setValueAtTime(freq, a.currentTime);
      g.gain.setValueAtTime(vol, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
      o.start(a.currentTime);
      o.stop(a.currentTime + dur);
    } catch { /* silently ignore */ }
  }

  playCoin(): void {
    this.beep(988, 0.08);
    setTimeout(() => this.beep(1319, 0.12), 80);
  }

  playJump(): void {
    this.beep(523, 0.06, "sine");
    setTimeout(() => this.beep(784, 0.08, "sine"), 60);
  }

  playBlock(): void {
    this.beep(220, 0.05);
    setTimeout(() => this.beep(330, 0.08), 60);
  }

  playUnlock(): void {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => this.beep(f, 0.15, "square", 0.2), i * 80)
    );
  }
}

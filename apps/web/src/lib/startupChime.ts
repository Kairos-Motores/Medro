/**
 * Som de abertura do sistema — um acorde maior (Lá) em arpejo rápido com um
 * "brilho" agudo discreto e cauda longa. Sintetizado via Web Audio (sem asset).
 *
 * Só toca depois de um gesto do usuário (o clique de login), então a política de
 * autoplay do browser costuma liberar; qualquer falha é engolida em silêncio.
 * Pode ser desligado com `localStorage['medro.mute-startup'] = '1'`.
 */
export function playStartupChime(): void {
  try {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("medro.mute-startup") === "1") return;

    const AC: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;

    const ctx = new AC();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const now = ctx.currentTime + 0.03;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // filtro que "abre" durante o swell — dá o ar de boot
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(900, now);
    lp.frequency.linearRampToValueAtTime(4600, now + 0.9);
    lp.Q.value = 0.7;
    lp.connect(master);

    // envelope geral: sobe suave, cauda longa
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.22, now + 0.2);
    master.gain.setTargetAtTime(0.0001, now + 1.15, 0.55);

    // acorde de Lá maior, arpejado
    const notes = [220, 277.18, 329.63, 440]; // A3 · C#4 · E4 · A4
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === notes.length - 1 ? "triangle" : "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      const t0 = now + i * 0.065;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(i === 3 ? 0.15 : 0.26, t0 + 0.05);
      g.gain.setTargetAtTime(0.0001, t0 + 0.3, 0.6);
      osc.connect(g).connect(lp);
      osc.start(t0);
      osc.stop(t0 + 2.4);
    });

    // brilho agudo, bem no fundo
    const spark = ctx.createOscillator();
    spark.type = "sine";
    spark.frequency.setValueAtTime(1760, now + 0.28);
    spark.frequency.exponentialRampToValueAtTime(2637, now + 0.55);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0, now + 0.28);
    sg.gain.linearRampToValueAtTime(0.045, now + 0.35);
    sg.gain.setTargetAtTime(0.0001, now + 0.55, 0.28);
    spark.connect(sg).connect(master);
    spark.start(now + 0.28);
    spark.stop(now + 1.6);

    window.setTimeout(() => ctx.close().catch(() => {}), 2800);
  } catch {
    /* sem som, sem problema */
  }
}

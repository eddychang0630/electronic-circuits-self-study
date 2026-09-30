/* Long-channel teaching model. No fitted real-device parameters. */
(function (root) {
  'use strict';
  const PARAMETERS = Object.freeze({ vt0: 0.70, gamma: 0.42, twoPhiF: 0.60, flatBand: 0 });
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function calculate({ vgs, vds, vsb }) {
    vgs = clamp(Number(vgs), -1, 3);
    vds = clamp(Number(vds), 0, 3);
    vsb = clamp(Number(vsb), 0, 1.5);
    const { vt0, gamma, twoPhiF, flatBand } = PARAMETERS;
    const vt = vt0 + gamma * (Math.sqrt(twoPhiF + vsb) - Math.sqrt(twoPhiF));
    const vov = vgs - vt;
    const vgb = vgs + vsb;
    const vgd = vgs - vds;
    const hasChannel = vov > 0;
    const pinchOff = hasChannel && vds >= vov;
    const region = !hasChannel ? 'cutoff' : pinchOff ? 'saturation' : 'triode';
    const surface = vgb < flatBand - 0.15 ? 'accumulation'
      : vgb <= flatBand + 0.15 ? 'flatband'
      : hasChannel ? 'inversion' : 'depletion';
    // Qualitative visual depth; stop growing with gate voltage after strong inversion.
    const depletionDrive = Math.min(Math.max(0, vgb), vt + vsb);
    const depletionFraction = surface === 'accumulation' ? 0
      : surface === 'flatband' ? 0.05
      : clamp(0.16 + 0.34 * Math.sqrt(depletionDrive) + 0.10 * vsb, 0.16, 0.90);
    const qSource = Math.max(0, vov);
    const qDrain = Math.max(0, vov - vds);
    const normalizedCurrent = !hasChannel ? 0
      : pinchOff ? vov * vov
      : 2 * vov * vds - vds * vds;
    return {
      vgs, vds, vsb, vt, vov, vgb, vgd, hasChannel, pinchOff,
      region, surface, depletionFraction, qSource, qDrain, normalizedCurrent,
    };
  }

  const api = { calculate, PARAMETERS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.MOSModel = api;
})(typeof window !== 'undefined' ? window : globalThis);

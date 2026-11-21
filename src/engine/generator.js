import { createPRNG } from './prng.js';
import { PALETTES, BG_PRESETS, clamp } from './defaults.js';

function F(n) { return n.toFixed(1); }

function buildPetalPath(len, wid, R) {
  const w2 = wid / 2;
  const c1y = R.range(len * 0.28, len * 0.48);
  const c1l = w2 * R.range(0.5, 1.0);
  const c1r = w2 * R.range(0.5, 1.0);
  const c2y = R.range(len * 0.58, len * 0.82);
  const c2l = w2 * R.range(0.25, 0.75);
  const c2r = w2 * R.range(0.25, 0.75);
  const tx = R.range(-w2 * 0.25, w2 * 0.25);
  return `M0,0 C${F(-c1l)},${F(c1y)} ${F(-c2l)},${F(c2y)} ${F(tx)},${F(len)} ` +
    `C${F(c2r)},${F(c2y)} ${F(c1r)},${F(c1y)} 0,0 ` +
    `Q${F(R.range(-w2 * 0.12, w2 * 0.12))},${F(len * R.range(0.01, 0.04))} 0,0`;
}

function petalColor(R, palette, depth) {
  const h = R.pick(palette.hues) + R.range(-8, 8);
  const s = R.range(palette.satRange[0], palette.satRange[1]);
  const l = R.range(55, 78) - depth * 6;
  return `hsl(${h.toFixed(1)},${s.toFixed(1)}%,${l.toFixed(1)}%)`;
}

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

export function generateFlower(params) {
  const R = createPRNG(params.seed);
  const P = params;
  const pal = PALETTES[P.palette] || PALETTES.indigo;
  const out = [];
  const w = (s) => out.push(s);

  const CX = F(R.range(770, 830));
  const CY = F(R.range(380, 440));

  /* ── SVG open ── */
  w(`<?xml version="1.0" encoding="UTF-8"?>`);
  w(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">`);

  /* ── <defs> ── */
  w(`<defs>`);

  /* bgSeed drives paper texture randomness */
  const bs = P.bgSeed != null ? P.bgSeed : P.seed;

  w(`<filter id="petalDisp" x="-8%" y="-8%" width="116%" height="116%">`);
  w(`<feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="3" seed="${(bs + 1) % 999}" result="t"/>`);
  w(`<feDisplacementMap in="SourceGraphic" in2="t" scale="${P.displacementScale}" xChannelSelector="R" yChannelSelector="G" result="d"/>`);
  w(`<feGaussianBlur in="d" stdDeviation="0.5"/>`);
  w(`</filter>`);

  w(`<filter id="bloomDisp" x="-15%" y="-15%" width="130%" height="130%">`);
  w(`<feTurbulence type="turbulence" baseFrequency="0.012" numOctaves="4" seed="${(bs + 2) % 999}" result="t"/>`);
  w(`<feDisplacementMap in="SourceGraphic" in2="t" scale="${P.bloomDisplacementScale}" xChannelSelector="R" yChannelSelector="G" result="d"/>`);
  w(`<feGaussianBlur in="d" stdDeviation="1.2"/>`);
  w(`</filter>`);

  w(`<filter id="paperGrain" x="0%" y="0%" width="100%" height="100%">`);
  w(`<feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="${(bs + 37) % 999}" result="n"/>`);
  w(`<feColorMatrix type="saturate" values="0" in="n" result="g"/>`);
  w(`<feComponentTransfer in="g" result="gf"><feFuncA type="linear" slope="0.045" intercept="0.955"/></feComponentTransfer>`);
  w(`<feBlend in="SourceGraphic" in2="gf" mode="multiply"/>`);
  w(`</filter>`);

  w(`<filter id="paperFiber" x="0%" y="0%" width="100%" height="100%">`);
  w(`<feTurbulence type="turbulence" baseFrequency="0.3 0.08" numOctaves="2" seed="${(bs + 77) % 999}" result="fb"/>`);
  w(`<feColorMatrix type="saturate" values="0" in="fb" result="fm"/>`);
  w(`<feComponentTransfer in="fm" result="ff"><feFuncA type="linear" slope="0.018" intercept="0.982"/></feComponentTransfer>`);
  w(`</filter>`);

  w(`<filter id="paperBright" x="0%" y="0%" width="100%" height="100%">`);
  w(`<feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves="3" seed="${(bs + 512) % 999}" result="b"/>`);
  w(`<feColorMatrix type="saturate" values="0" in="b" result="bm"/>`);
  w(`<feComponentTransfer in="bm" result="bf">`);
  w(`<feFuncR type="linear" slope="0.03" intercept="0.985"/>`);
  w(`<feFuncG type="linear" slope="0.025" intercept="0.982"/>`);
  w(`<feFuncB type="linear" slope="0.015" intercept="0.985"/>`);
  w(`</feComponentTransfer>`);
  w(`</filter>`);

  /* gradients */
  w(`<radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">`);
  w(`<stop offset="0%" stop-color="${pal.center}" stop-opacity="0.95"/>`);
  w(`<stop offset="30%" stop-color="#1a1445" stop-opacity="0.85"/>`);
  w(`<stop offset="65%" stop-color="#2e2060" stop-opacity="0.6"/>`);
  w(`<stop offset="100%" stop-color="#4a3580" stop-opacity="0"/>`);
  w(`</radialGradient>`);

  w(`<radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">`);
  w(`<stop offset="0%" stop-color="${pal.centerGlow}" stop-opacity="0.35"/>`);
  w(`<stop offset="50%" stop-color="#4a3d7a" stop-opacity="0.15"/>`);
  w(`<stop offset="100%" stop-color="#2c2555" stop-opacity="0"/>`);
  w(`</radialGradient>`);

  /* background params */
  const bgP = BG_PRESETS[P.bgPreset] || BG_PRESETS.warmIvory;
  const bgBase = P.bgColor || bgP.base;
  const bgLight = bgP.baseLight;
  const bgDark = bgP.baseDark;
  const vStr = P.vignette != null ? P.vignette : bgP.vignette;
  const oOp = P.overlayOpacity != null ? P.overlayOpacity : 0.12;

  w(`<radialGradient id="bgGrad" cx="52%" cy="45%" r="65%">`);
  w(`<stop offset="0%" stop-color="${bgLight}"/>`);
  w(`<stop offset="100%" stop-color="${bgDark}"/>`);
  w(`</radialGradient>`);

  w(`<radialGradient id="vignette" cx="50%" cy="48%" r="58%">`);
  w(`<stop offset="0%" stop-color="${bgBase}" stop-opacity="0"/>`);
  w(`<stop offset="75%" stop-color="${bgDark}" stop-opacity="0"/>`);
  w(`<stop offset="100%" stop-color="${bgDark}" stop-opacity="${vStr}"/>`);
  w(`</radialGradient>`);
  w(`</defs>`);

  /* ── Background ── */
  w(`<rect x="0" y="0" width="1600" height="900" fill="${bgBase}"/>`);
  w(`<rect x="0" y="0" width="1600" height="900" fill="url(#bgGrad)" opacity="0.3"/>`);
  w(`<rect x="0" y="0" width="1600" height="900" fill="${bgLight}" filter="url(#paperGrain)" opacity="${P.paperGrain != null ? P.paperGrain / 0.045 : 1}"/>`);
  w(`<rect x="0" y="0" width="1600" height="900" fill="${bgDark}" filter="url(#paperFiber)" opacity="${P.paperFiber != null ? P.paperFiber : bgP.fiber}"/>`);
  w(`<rect x="0" y="0" width="1600" height="900" fill="${bgLight}" filter="url(#paperBright)" opacity="${P.brightnessVar != null ? P.brightnessVar : bgP.brightness}"/>`);
  w(`<rect x="0" y="0" width="1600" height="900" fill="url(#vignette)"/>`);

  /* ── Stem ── */
  if (P.stemVisible) {
    const sH = F(R.range(150, 170));
    const sS = F(R.range(12, 22));
    const sL = F(R.range(42, 52));
    const stemCol = `hsl(${sH},${sS}%,${sL}%)`;
    const ssx = F(R.range(+CX - 8, +CX + 8));
    const ssy = F(R.range(+CY + 30, +CY + 55));
    const sex = F(R.range(660, 740));
    const sey = F(R.range(830, 885));
    const curv = P.stemCurvature;
    const sc1x = F(R.range(+ssx - 50 * curv, +ssx + 20 * curv));
    const sc1y = F(R.range(+ssy + 60 * curv, +ssy + 160 * curv));
    const sc2x = F(R.range(+sex - 30 * curv, +sex + 35 * curv));
    const sc2y = F(R.range(+sey - 150 * curv, +sey - 50 * curv));
    w(`<g opacity="${P.stemOpacity}">`);
    w(`<path d="M${ssx},${ssy} C${sc1x},${sc1y} ${sc2x},${sc2y} ${sex},${sey}" stroke="${stemCol}" stroke-width="${F(R.range(1.8, 2.8))}" stroke-linecap="round" fill="none" filter="url(#petalDisp)"/>`);
    w(`<path d="M${F(R.range(+ssx - 1.5, +ssx + 1.5))},${F(R.range(+ssy - 1, +ssy + 1))} C${F(R.range(+sc1x - 2, +sc1x + 2))},${F(R.range(+sc1y - 2, +sc1y + 2))} ${F(R.range(+sc2x - 2, +sc2x + 2))},${F(R.range(+sc2y - 2, +sc2y + 2))} ${F(R.range(+sex - 2, +sex + 2))},${F(R.range(+sey - 1, +sey + 1))}" stroke="${stemCol}" stroke-width="${F(R.range(3, 5))}" stroke-linecap="round" fill="none" opacity="0.12"/>`);
    w(`</g>`);
  }

  /* ── Petals ── */
  const nP = clamp(P.petalCount, 8, 50);
  const angles = [];
  for (let i = 0; i < nP; i++) angles.push((360 / nP) * i + R.range(-10, 10));

  for (let p = 0; p < nP; p++) {
    const ang = angles[p];
    const pLen = R.range(P.petalLengthMin, P.petalLengthMax);
    const pWid = R.range(P.petalWidthMin, P.petalWidthMax);
    const nL = R.int(P.petalLayersMin, P.petalLayersMax);
    w(`<g transform="translate(${CX},${CY}) rotate(${F(ang)})">`);
    w(`<path d="${buildPetalPath(pLen * R.range(1.05, 1.15), pWid * R.range(1.1, 1.3), R)}" fill="${petalColor(R, pal, 0)}" opacity="${F(R.range(0.03, 0.07))}" filter="url(#bloomDisp)"/>`);
    for (let l = 0; l < nL; l++) {
      w(`<path d="${buildPetalPath(pLen * R.range(0.88, 1.04), pWid * R.range(0.85, 1.05), R)}" fill="${petalColor(R, pal, l)}" opacity="${F(R.range(P.opacityMin, P.opacityMax))}" transform="translate(${F(R.range(-4, 4))},${F(R.range(-3, 3))}) rotate(${F(R.range(-3, 3))})" filter="url(#petalDisp)"/>`);
    }
    w(`<path d="${buildPetalPath(pLen * R.range(0.35, 0.5), pWid * R.range(0.35, 0.5), R)}" fill="${petalColor(R, pal, 3)}" opacity="${F(R.range(0.06, 0.14))}" transform="translate(${F(R.range(-2, 2))},${F(R.range(-2, 2))})"/>`);
    w(`</g>`);
  }

  /* ── Outer pigment blooms ── */
  const nB = clamp(P.bloomCount, 0, 20);
  for (let b = 0; b < nB; b++) {
    const bA = R.range(0, 360), bD = R.range(165, 260);
    const bX = F(Math.cos(bA * Math.PI / 180) * bD + +CX);
    const bY = F(Math.sin(bA * Math.PI / 180) * bD + +CY);
    const bR = R.range(P.bloomRadiusMin, P.bloomRadiusMax);
    w(`<ellipse cx="${bX}" cy="${bY}" rx="${F(bR)}" ry="${F(bR * R.range(0.6, 1.4))}" fill="${petalColor(R, pal, 0)}" opacity="${F(R.range(0.02, P.bloomOpacityMax))}" transform="rotate(${F(R.range(0, 360))} ${bX} ${bY})" filter="url(#bloomDisp)"/>`);
  }

  /* ── Color overlap zones ── */
  w(`<g opacity="0.06">`);
  for (let bl = 0; bl < 10; bl++) {
    const blA = R.range(0, 360), blD = R.range(40, 140);
    const blX = F(Math.cos(blA * Math.PI / 180) * blD + +CX);
    const blY = F(Math.sin(blA * Math.PI / 180) * blD + +CY);
    w(`<ellipse cx="${blX}" cy="${blY}" rx="${F(R.range(25, 65))}" ry="${F(R.range(20, 50))}" fill="${petalColor(R, pal, 2)}" opacity="${F(R.range(0.03, 0.09))}" transform="rotate(${F(R.range(0, 360))} ${blX} ${blY})" filter="url(#petalDisp)"/>`);
  }
  w(`</g>`);

  /* ── Center ── */
  w(`<circle cx="${CX}" cy="${CY}" r="48" fill="url(#centerGlow)" filter="url(#petalDisp)"/>`);
  w(`<circle cx="${CX}" cy="${CY}" r="${P.centerSize}" fill="url(#centerGrad)" filter="url(#petalDisp)"/>`);
  w(`<circle cx="${F(R.range(+CX - 2, +CX + 2))}" cy="${F(R.range(+CY - 2, +CY + 2))}" r="${P.coreSize}" fill="${pal.center}" opacity="0.7" filter="url(#petalDisp)"/>`);
  w(`<circle cx="${F(R.range(+CX - 1.5, +CX + 1.5))}" cy="${F(R.range(+CY - 1.5, +CY + 1.5))}" r="${F(P.coreSize * 0.47)}" fill="#050510" opacity="${P.centerOpacity}"/>`);
  for (let cb = 0; cb < 6; cb++) {
    const cbA = R.range(0, 360), cbD = R.range(8, 22);
    const cbX = F(Math.cos(cbA * Math.PI / 180) * cbD + +CX);
    const cbY = F(Math.sin(cbA * Math.PI / 180) * cbD + +CY);
    w(`<ellipse cx="${cbX}" cy="${cbY}" rx="${F(R.range(3, 8))}" ry="${F(R.range(3, 7))}" fill="${pal.center}" opacity="${F(R.range(0.25, 0.5))}" transform="rotate(${F(R.range(0, 360))} ${cbX} ${cbY})"/>`);
  }

  /* ── Stamens ── */
  const nSt = clamp(P.stamenCount, 0, 80);
  w(`<g opacity="0.5">`);
  for (let s = 0; s < nSt; s++) {
    const sA = R.range(0, 360) * Math.PI / 180;
    const sL = R.range(P.stamenLengthMin, P.stamenLengthMax);
    const sW = R.range(-12, 12);
    const eX = F(Math.cos(sA) * sL + sW + +CX);
    const eY = F(Math.sin(sA) * sL + sW * 0.5 + +CY);
    const cpA = sA + R.range(-0.3, 0.3);
    const cpD = sL * R.range(0.4, 0.65);
    const cpX = F(Math.cos(cpA) * cpD + R.range(-8, 8) + +CX);
    const cpY = F(Math.sin(cpA) * cpD + R.range(-8, 8) + +CY);
    const sH = R.range(210, 260), sS = R.range(20, 40), sL2 = R.range(45, 65);
    const sCol = `hsl(${sH.toFixed(0)},${sS.toFixed(0)}%,${sL2.toFixed(0)}%)`;
    w(`<path d="M${F(R.range(+CX - 3, +CX + 3))},${F(R.range(+CY - 3, +CY + 3))} Q${cpX},${cpY} ${eX},${eY}" stroke="${sCol}" stroke-width="${F(R.range(0.3, 0.9))}" stroke-linecap="round" fill="none" opacity="${F(R.range(0.2, 0.55))}"/>`);
    if (R.next() > 0.45) {
      w(`<circle cx="${eX}" cy="${eY}" r="${F(R.range(0.8, 2.2))}" fill="hsl(${F(sH + R.range(-10, 10))},${F(sS + 5)}%,${F(sL2 - 8)}%)" opacity="${F(R.range(0.25, 0.5))}"/>`);
    }
  }
  w(`</g>`);

  /* ── Final paper overlay ── */
  w(`<rect x="0" y="0" width="1600" height="900" fill="${bgDark}" filter="url(#paperGrain)" opacity="${oOp}" pointer-events="none"/>`);
  w(`</svg>`);

  return out.join('\n');
}

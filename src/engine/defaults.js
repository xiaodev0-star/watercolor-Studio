/**
 * Default parameters — matches seed 20863 reference output.
 * Users can override any of these from the UI.
 */

export const PALETTES = {
  indigo: {
    label: '靛蓝幽兰',
    desc: 'Default indigo-violet watercolor',
    hues: [228, 232, 220, 240, 215, 248, 225, 235, 218, 242, 230, 222, 238, 245, 212],
    satRange: [18, 38],
    center: '#0a0a20',
    centerGlow: '#6b5b95',
  },
  rose: {
    label: '玫瑰灰粉',
    desc: 'Dusty rose & muted pink',
    hues: [340, 348, 335, 355, 330, 358, 342, 350, 328, 352, 345, 338],
    satRange: [15, 35],
    center: '#1a0a10',
    centerGlow: '#8b4560',
  },
  sage: {
    label: '苍苔清影',
    desc: 'Sage green & muted teal',
    hues: [155, 162, 148, 170, 140, 165, 158, 152, 168, 145],
    satRange: [12, 30],
    center: '#0a1510',
    centerGlow: '#4a7a5b',
  },
  amber: {
    label: '琥珀暮光',
    desc: 'Warm amber & burnt sienna',
    hues: [30, 38, 25, 42, 20, 35, 45, 28, 40, 33],
    satRange: [18, 40],
    center: '#1a1005',
    centerGlow: '#8b6a3a',
  },
  plum: {
    label: '紫檀沉香',
    desc: 'Deep plum & burgundy',
    hues: [300, 308, 295, 315, 290, 305, 310, 298, 312, 292],
    satRange: [15, 35],
    center: '#150515',
    centerGlow: '#7a3a6b',
  },
  mist: {
    label: '青霭烟岚',
    desc: 'Dusty blue mist',
    hues: [198, 206, 214, 190, 222, 202, 210, 196],
    satRange: [16, 34],
    center: '#08141f',
    centerGlow: '#5b7f9e',
  },
  blush: {
    label: '夭桃秾李',
    desc: 'Soft blush blossom',
    hues: [352, 358, 345, 8, 340, 15, 4, 348],
    satRange: [22, 42],
    center: '#1f0d13',
    centerGlow: '#a06076',
  },
  clay: {
    label: '赤陶秋壤',
    desc: 'Muted terracotta clay',
    hues: [16, 24, 10, 30, 20, 34, 12, 26],
    satRange: [24, 44],
    center: '#1f0f07',
    centerGlow: '#9a6248',
  },
  lilac: {
    label: '丁香薄暮',
    desc: 'Lilac dusk',
    hues: [268, 276, 258, 284, 262, 272, 280, 264],
    satRange: [14, 32],
    center: '#150920',
    centerGlow: '#7f5f9e',
  },
  porcelain: {
    label: '青瓷雨色',
    desc: 'Dusty porcelain teal',
    hues: [176, 184, 168, 190, 172, 188, 180, 164],
    satRange: [14, 32],
    center: '#07191a',
    centerGlow: '#4f8a86',
  },
  ochre: {
    label: '秋金粟影',
    desc: 'Muted ochre & gold',
    hues: [42, 48, 36, 52, 40, 46, 33, 50],
    satRange: [26, 46],
    center: '#1c1405',
    centerGlow: '#a08347',
  },
  slate: {
    label: '黛瓦远山',
    desc: 'Slate blue-gray',
    hues: [212, 220, 206, 228, 216, 202, 224, 210],
    satRange: [10, 26],
    center: '#0a0f16',
    centerGlow: '#5f7286',
  },
};

export const BG_PRESETS = {
  warmIvory: {
    label: '暖象牙',
    desc: 'Warm ivory handmade paper',
    base: '#f3ece0', baseLight: '#f7f2ea', baseDark: '#e8dfd0',
    grain: 0.045, fiber: 0.35, brightness: 0.4, vignette: 0.18,
  },
  coolWhite: {
    label: '冷宣纸',
    desc: 'Cool white xuan paper',
    base: '#f0f0f2', baseLight: '#f8f8fa', baseDark: '#e4e4e8',
    grain: 0.035, fiber: 0.25, brightness: 0.3, vignette: 0.12,
  },
  agedParchment: {
    label: '旧羊皮',
    desc: 'Aged parchment with warm stains',
    base: '#e8dcc4', baseLight: '#f0e6d0', baseDark: '#d4c8a8',
    grain: 0.065, fiber: 0.5, brightness: 0.5, vignette: 0.28,
  },
  ricePaper: {
    label: '生宣',
    desc: 'Raw rice paper, slightly translucent',
    base: '#f5f0e6', baseLight: '#faf6ee', baseDark: '#ebe4d5',
    grain: 0.025, fiber: 0.45, brightness: 0.25, vignette: 0.08,
  },
  darkMoody: {
    label: '暗夜墨',
    desc: 'Dark moody background',
    base: '#1a1a22', baseLight: '#222230', baseDark: '#12121a',
    grain: 0.03, fiber: 0.15, brightness: 0.3, vignette: 0.0,
  },
  kraftBrown: {
    label: '牛皮纸',
    desc: 'Kraft paper brown',
    base: '#c4a882', baseLight: '#d0b892', baseDark: '#b09070',
    grain: 0.06, fiber: 0.4, brightness: 0.4, vignette: 0.22,
  },
};

export const DEFAULT_PARAMS = {
  seed: 20863,

  // Petals
  petalCount: 26,
  petalLengthMin: 120,
  petalLengthMax: 210,
  petalWidthMin: 40,
  petalWidthMax: 82,
  petalLayersMin: 3,
  petalLayersMax: 6,

  // Colors
  palette: 'indigo',
  hueShiftRange: 8,

  // Opacity
  opacityMin: 0.06,
  opacityMax: 0.22,
  centerOpacity: 0.85,

  // Stamens
  stamenCount: 48,
  stamenLengthMin: 28,
  stamenLengthMax: 98,

  // Bloom
  bloomCount: 10,
  bloomRadiusMin: 20,
  bloomRadiusMax: 58,
  bloomOpacityMax: 0.06,

  // Stem
  stemVisible: true,
  stemOpacity: 0.55,
  stemCurvature: 0.5,

  // Displacement
  displacementScale: 6,
  bloomDisplacementScale: 14,

  // Center
  centerSize: 32,
  coreSize: 15,

  // Background
  bgPreset: 'warmIvory',
  bgColor: '#f3ece0',
  paperGrain: 0.045,
  paperFiber: 0.35,
  brightnessVar: 0.4,
  vignette: 0.18,
  overlayOpacity: 0.12,
  bgSeed: 20863,
};

/** Clamp a numeric value to [min, max]. */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

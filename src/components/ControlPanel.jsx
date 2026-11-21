import React, { useState, useEffect, useRef } from 'react';
import { PALETTES, BG_PRESETS } from '../engine/defaults.js';
import { Icon, Slider, Switch, Swatch, IconBtn, midOf, pairOf } from './ui.jsx';

const CATS = [
  { k: 'shape', icon: 'petals', title: '花瓣' },
  { k: 'color', icon: 'droplet', title: '色彩' },
  { k: 'stem', icon: 'leaf', title: '花茎' },
  { k: 'paper', icon: 'paper', title: '背景' },
];

const GRID_PICKS = [
  ['grid2', 4, '2×2'],
  ['grid3', 9, '3×3'],
  ['grid4', 16, '4×4'],
];

/* 纸色色点：低饱和暖中性，跟 Anthropic 纸感主题同调 */
const PAPER_TONES = [
  '#faf9f5', '#f7f2e8', '#f3ece0', '#efe6d4',
  '#e7dcc6', '#ddd2b8', '#c9bda6', '#2a2a33',
];

/* palette → 斜向连续渐变：每色一个停靠点，靠 CSS 自然插值，彻底无断层。
   注入为 --pal：笔刷底稿用素色，颜料层（::before）取它刷出配色 */
function palStyle(pal) {
  const stops = pal.hues
    .slice(0, 5)
    .map((h, i) => `hsl(${h}, ${pal.satRange[0] + 5 * i}%, ${62 - 6 * i}%)`);
  const bands = stops
    .map((c, i) => `${c} ${((i / (stops.length - 1)) * 100).toFixed(1)}%`)
    .join(', ');
  return { '--pal': `linear-gradient(135deg, ${bands})` };
}

function hex2hsv(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = 60 * (((g - b) / d) % 6);
    else if (mx === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  return { h: (h + 360) % 360, s: mx ? d / mx : 0, v: mx };
}

function hsv2hex(h, s, v) {
  const f = (n) => {
    const k = (n + h / 60) % 6;
    const c = v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(5)}${f(3)}${f(1)}`;
}

/* 主题化取色器：SV 面板 + 色相条，替代原生 color 弹窗 */
function ColorPad({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const { h, s, v } = React.useMemo(() => hex2hsv(value), [value]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [open]);

  const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

  const pickSV = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onChange(
      hsv2hex(h, clamp01((e.clientX - r.left) / r.width), 1 - clamp01((e.clientY - r.top) / r.height))
    );
  };
  const pickH = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onChange(hsv2hex(clamp01((e.clientX - r.left) / r.width) * 360, s, v));
  };
  const drag = (handler) => (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    handler(e);
  };
  const move = (handler) => (e) => {
    if (e.buttons) handler(e);
  };

  return (
    <div className="color-pad" ref={boxRef}>
      <button
        type="button"
        className={`tone tone-current ${open ? 'is-open' : ''}`}
        style={{ background: value }}
        onClick={() => setOpen((o) => !o)}
        title="自定义底色"
        aria-label="自定义纸张底色"
      />
      {open && (
        <div className="pad-pop">
          <div
            className="pad-sv"
            style={{ '--h': h }}
            onPointerDown={drag(pickSV)}
            onPointerMove={move(pickSV)}
          >
            <span
              className="pad-dot"
              style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%` }}
            />
          </div>
          <div
            className="pad-hue"
            onPointerDown={drag(pickH)}
            onPointerMove={move(pickH)}
          >
            <span className="pad-hue-knob" style={{ left: `${(h / 360) * 100}%` }} />
          </div>
          <div className="pad-hex">{value}</div>
        </div>
      )}
    </div>
  );
}

export default function ControlPanel({
  params,
  onChange,
  onRandomize,
  onGenerateMulti,
  onOpenAdvanced,
}) {
  const [cat, setCat] = useState(null);

  const set = (k, v) => onChange({ ...params, [k]: v });
  const setPair = (kMin, kMax, m, span, a0, a1, b0, b1) => {
    const [mn, mx] = pairOf(m, span, a0, a1, b0, b1);
    onChange({ ...params, [kMin]: mn, [kMax]: mx });
  };

  const renderBody = () => {
    switch (cat) {
      /* ── 花瓣 ── */
      case 'shape':
        return (
          <>
            <Slider
              icon="count"
              title="花瓣数量"
              value={params.petalCount}
              min={6}
              max={50}
              onChange={(v) => set('petalCount', v)}
            />
            <Slider
              icon="length"
              title="花瓣长度"
              value={midOf(params.petalLengthMin, params.petalLengthMax)}
              min={60}
              max={260}
              onChange={(v) =>
                setPair('petalLengthMin', 'petalLengthMax', v, 45, 40, 200, 80, 300)
              }
            />
            <Slider
              icon="width"
              title="花瓣宽度"
              value={midOf(params.petalWidthMin, params.petalWidthMax)}
              min={20}
              max={130}
              onChange={(v) =>
                setPair('petalWidthMin', 'petalWidthMax', v, 21, 15, 80, 30, 140)
              }
            />
            <Slider
              icon="layers"
              title="每瓣层数"
              value={midOf(params.petalLayersMin, params.petalLayersMax)}
              min={2}
              max={8}
              onChange={(v) =>
                setPair('petalLayersMin', 'petalLayersMax', v, 1, 1, 5, 2, 10)
              }
            />
          </>
        );

      /* ── 色彩 ── */
      case 'color':
        return (
          <div className="sw-grid pal-grid">
            {Object.entries(PALETTES).map(([key, pal]) => (
              <Swatch
                key={key}
                className="sw-pal-strip"
                active={params.palette === key}
                style={palStyle(pal)}
                label={pal.label}
                title={pal.desc}
                onClick={() => set('palette', key)}
              />
            ))}
          </div>
        );

      /* ── 花茎 ── */
      case 'stem':
        return (
          <>
            <Switch
              icon="eye"
              title="显示花茎"
              on={params.stemVisible}
              onChange={(v) => set('stemVisible', v)}
            />
            <Slider
              icon="opacity"
              title="花茎不透明度"
              value={params.stemOpacity}
              min={0.1}
              max={1}
              step={0.05}
              dec={2}
              onChange={(v) => set('stemOpacity', v)}
            />
            <Slider
              icon="curve"
              title="花茎弯曲"
              value={params.stemCurvature}
              min={0}
              max={1}
              step={0.05}
              dec={2}
              onChange={(v) => set('stemCurvature', v)}
            />
          </>
        );

      /* ── 背景 ── */
      case 'paper':
        return (
          <>
            <div className="sw-grid bg-grid">
              {Object.entries(BG_PRESETS).map(([key, preset]) => (
                <Swatch
                  key={key}
                  className="sw-bg"
                  active={params.bgPreset === key}
                  label={preset.label}
                  title={preset.desc}
                  style={{ background: preset.base, '--light': preset.baseLight }}
                  onClick={() =>
                    onChange({
                      ...params,
                      bgPreset: key,
                      bgColor: preset.base,
                      paperGrain: preset.grain,
                      paperFiber: preset.fiber,
                      brightnessVar: preset.brightness,
                      vignette: preset.vignette,
                    })
                  }
                />
              ))}
            </div>
            <div className="ctl">
              <div className="ctl-head">
                <span className="ctl-ic">
                  <Icon name="droplet" size={16} />
                </span>
                <span className="ctl-label">纸张底色</span>
                <ColorPad
                  value={params.bgColor}
                  onChange={(c) => set('bgColor', c)}
                />
              </div>
              <div className="tone-row">
                {PAPER_TONES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`tone ${params.bgColor.toLowerCase() === c ? 'is-on' : ''}`}
                    style={{ background: c }}
                    onClick={() => set('bgColor', c)}
                    title={c}
                    aria-label={`底色 ${c}`}
                  />
                ))}
              </div>
            </div>
            <Slider
              icon="grain"
              title="纸张纹理"
              value={params.paperGrain}
              min={0}
              max={0.12}
              step={0.005}
              dec={3}
              onChange={(v) => set('paperGrain', v)}
            />
          </>
        );

      /* ── 首页 ── */
      default:
        return (
          <>
            <button
              type="button"
              className="btn-hero"
              onClick={onRandomize}
              aria-label="随机一幅"
            >
              <Icon name="dice" size={21.5} />
              <span className="btn-label">随机一幅</span>
              <span className="sheen" />
            </button>
            <div className="pick-row">
              {GRID_PICKS.map(([icon, n, text]) => (
                <button
                  key={n}
                  type="button"
                  className="btn-tile"
                  onClick={() => onGenerateMulti(n)}
                  aria-label={text}
                >
                  <Icon name={icon} size={17} />
                  <span className="btn-label">{text}</span>
                </button>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <>
      <nav className="rail" aria-label="设置分类">
        <button
          type="button"
          className={`rail-btn rail-brand ${cat === null ? 'is-on' : ''}`}
          onClick={() => setCat(null)}
          aria-label="首页"
          aria-pressed={cat === null}
        >
          <Icon name="flower" size={20.5} />
          <span className="rail-label">首页</span>
        </button>
        <div className="rail-list">
          {CATS.map((c) => (
            <button
              key={c.k}
              type="button"
              className={`rail-btn ${cat === c.k ? 'is-on' : ''}`}
              onClick={() => setCat(cat === c.k ? null : c.k)}
              aria-label={c.title}
              aria-pressed={cat === c.k}
            >
              <Icon name={c.icon} size={20.5} inked={cat === 'paper'} />
              <span className="rail-label">{c.title}</span>
            </button>
          ))}
        </div>
        <div className="rail-foot">
          <button
            type="button"
            className="rail-btn"
            onClick={onOpenAdvanced}
            aria-label="高级"
          >
            <Icon name="sliders" size={20.5} />
            <span className="rail-label">高级</span>
          </button>
        </div>
      </nav>

      <aside className="panel">
        <div className={`panel-body ${cat ? '' : 'home'}`} key={cat || 'home'}>
          {renderBody()}
        </div>
      </aside>
    </>
  );
}

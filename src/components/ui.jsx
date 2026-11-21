import React from 'react';
import { clamp } from '../engine/defaults.js';

/* ─────────────────────────────────────────────
   Icon set — 24px grid, 1.5 stroke, monochrome
   ───────────────────────────────────────────── */

/** Midpoint of a min/max pair — lets two sliders collapse into one. */
export const midOf = (a, b) => (a + b) / 2;

/** Rebuild a min/max pair from a single midpoint slider. */
export const pairOf = (m, span, a0, a1, b0, b1) => [
  clamp(m - span, a0, a1),
  clamp(m + span, b0, b1),
];

const gridIcon = (n) => {
  const gap = n === 2 ? 2 : n === 3 ? 1.6 : 1.2;
  const cell = (16 - (n - 1) * gap) / n;
  const items = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      items.push(
        <rect
          key={`${r}-${c}`}
          x={4 + c * (cell + gap)}
          y={4 + r * (cell + gap)}
          width={cell}
          height={cell}
          rx={Math.min(1.4, cell * 0.3)}
        />
      );
    }
  }
  return <g>{items}</g>;
};

const dot = (x, y, r = 1.3) => (
  <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="currentColor" stroke="none" />
);

const ICONS = {
  flower: (
    <>
      <circle cx="12" cy="6.4" r="2.7" />
      <circle cx="17.6" cy="12" r="2.7" />
      <circle cx="12" cy="17.6" r="2.7" />
      <circle cx="6.4" cy="12" r="2.7" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
    </>
  ),
  // 花瓣页：三片舒展的花瓣 —— 与首页的四瓣+花心明确区分
  petals: (
    <>
      <path d="M12 6c3 3 3 7.4 0 10.4-3-3-3-7.4 0-10.4Z" />
      <path d="M5.2 12c3.9-.7 7.5 1.5 8.7 5.5-4.4.4-7.9-1.7-8.7-5.5Z" />
      <path d="M18.8 12c-.8 3.8-4.3 5.9-8.7 5.5 1.2-4 4.8-6.2 8.7-5.5Z" />
    </>
  ),
  droplet: <path d="M12 3.2c3.6 4.3 5.6 7 5.6 9.6a5.6 5.6 0 1 1-11.2 0C6.4 10.2 8.4 7.5 12 3.2Z" />,
  leaf: (
    <>
      <path d="M12 21v-8.2" />
      <path d="M12 12.8c0-4.4 3-7.4 7.7-8.2-.1 5-3.1 8-7.7 8.2Z" />
    </>
  ),
  // paper（背景）由 PaperPenIcon 单独绘制：空白纸面 + 会写字的笔
  sliders: (
    <>
      <path d="M4 7h4M14 7h6M4 12h9M17 12h3M4 17h2M10 17h10" />
      {dot(10, 7, 2)}
      {dot(15, 12, 2)}
      {dot(8, 17, 2)}
    </>
  ),
  dice: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      {dot(9, 9)}
      {dot(15, 9)}
      {dot(12, 12)}
      {dot(9, 15)}
      {dot(15, 15)}
    </>
  ),
  grid2: gridIcon(2),
  grid3: gridIcon(3),
  grid4: gridIcon(4),
  download: (
    <>
      <path d="M12 4v10.5M12 14.5l3.6-3.6M12 14.5l-3.6-3.6" />
      <path d="M4.5 18.5h15" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <circle cx="9" cy="10" r="1.7" />
      <path d="M4.5 17.5l4.5-4 3.2 3 3-2.4 4.3 3.6" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
      <path d="M21 3v5h-5" />
    </>
  ),
  undo: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </>
  ),
  arrowLeft: <path d="M14.5 5.5 8 12l6.5 6.5" />,
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  // </> 尖括号 —— SVG（标记语言）的导出标识
  code: (
    <>
      <path d="M9.5 7 4.5 12l5 5" />
      <path d="M14.5 7l5 5-5 5" />
    </>
  ),
  check: <path pathLength="1" d="M5.5 12.5l4.2 4.2 8.8-9.4" />,
  chevron: <path d="M9.5 6l6 6-6 6" />,
  eye: (
    <>
      <path d="M2.5 12S6 6.2 12 6.2 21.5 12 21.5 12 18 17.8 12 17.8 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.7" />
    </>
  ),
  count: (
    <g>
      {dot(7, 7)}
      {dot(12, 7)}
      {dot(17, 7)}
      {dot(7, 12)}
      {dot(12, 12)}
      {dot(17, 12)}
      {dot(7, 17)}
      {dot(12, 17)}
      {dot(17, 17)}
    </g>
  ),
  length: (
    <>
      <path d="M4.5 6h15M4.5 18h15" />
      <path d="M12 6v12M12 6 9 9M12 6l3 3M12 18l-3-3M12 18l3-3" />
    </>
  ),
  width: (
    <>
      <path d="M6 4.5v15M18 4.5v15" />
      <path d="M6 12h12M6 12l3-3M6 12l3 3M18 12l-3-3M18 12l-3 3" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3.8 3.6 8 12 12.2 20.4 8 12 3.8Z" />
      <path d="M3.6 12.4 12 16.6l8.4-4.2" />
      <path d="M3.6 16.4 12 20.6l8.4-4.2" />
    </>
  ),
  opacity: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 3.8a8.2 8.2 0 0 0 0 16.4Z" fill="currentColor" stroke="none" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  sparkle: (
    <>
      <path d="M11 4.5l1.7 4.8 4.8 1.7-4.8 1.7L11 17.5l-1.7-4.8L4.5 11l4.8-1.7L11 4.5Z" />
      <path d="M17.8 3.6l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
    </>
  ),
  waves: (
    <>
      <path d="M3 8.5c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
      <path d="M3 13.5c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
      <path d="M3 18.5c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
    </>
  ),
  wind: (
    <>
      <path d="M3 9h9.5a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 14.5h13a2.5 2.5 0 1 1-2.5 2.5" />
    </>
  ),
  radius: (
    <>
      <circle cx="12" cy="12" r="7.6" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <path d="M12 12l5.4 5.4" />
    </>
  ),
  brightness: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" />
    </>
  ),
  vignette: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <rect x="7.5" y="7.5" width="9" height="9" rx="2" strokeDasharray="3 2.6" />
    </>
  ),
  overlay: (
    <>
      <rect x="4" y="4" width="12" height="12" rx="2.5" />
      <rect x="8" y="8" width="12" height="12" rx="2.5" />
    </>
  ),
  fiber: (
    <>
      <path d="M7 5.5v13" />
      <path d="M11 4v16" />
      <path d="M15 6.5v11" />
      <path d="M19 5v14" />
    </>
  ),
  hue: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 4v3.4M12 16.6V20M4 12h3.4M16.6 12H20" />
    </>
  ),
  hash: <path d="M10.5 4 8.5 20M16.5 4l-2 16M4.5 9.5h15M3.5 15h15" />,
  curve: (
    <>
      <path pathLength="1" d="M4 17.5C7.5 7 16.5 7 20 17.5" />
      {dot(4, 17.5, 1.4)}
      {dot(20, 17.5, 1.4)}
    </>
  ),
  grain: (
    <g>
      {dot(7, 7.5, 1.15)}
      {dot(12.5, 6, 1.15)}
      {dot(17, 9.5, 1.15)}
      {dot(9, 12, 1.15)}
      {dot(14.5, 12.5, 1.15)}
      {dot(6.5, 15.5, 1.15)}
      {dot(11, 17.5, 1.15)}
      {dot(17, 17, 1.15)}
    </g>
  ),
  bloom: (
    <>
      <circle cx="10" cy="11" r="6.2" strokeDasharray="3.2 3.2" />
      <circle cx="15.5" cy="15.5" r="3.4" />
    </>
  ),
};

/* ─────────────────────────────────────────────
   宿主交互：图标的动画不监听自己，而监听它所在的
   按钮 / 控制行 / 卡片 —— 进入 → onEnter，点击 → onClick，
   至于进去后演什么，由每个图标自己决定。
   ───────────────────────────────────────────── */

function useHost(ref, handlers) {
  const h = React.useRef(handlers);
  h.current = handlers;
  React.useEffect(() => {
    const svg = ref.current;
    if (!svg) return undefined;
    const host = svg.closest('button, .ctl, .grid-cell') || svg;
    const bind = (type, key) => {
      const fn = (e) => h.current[key]?.(e);
      host.addEventListener(type, fn);
      return () => host.removeEventListener(type, fn);
    };
    const offs = [
      bind('pointerenter', 'onEnter'),
      bind('pointermove', 'onMove'),
      bind('pointerleave', 'onLeave'),
      bind('click', 'onClick'),
    ];
    return () => offs.forEach((off) => off());
  }, [ref]);
}

/* 离开时的收势：
   · 还没轮到的图形 → 撤掉动画直接归位（opacity/dash 过渡抹平）；
   · 正在跑的 → playbackRate 翻负，从离开的那一刻原路倒放回起点；
   · 一笔画（pathLength=1，基态是画满）例外：倒放会停在隐藏态，
     改成正着画完 —— 落定后再撤 is-hot，此刻姿态与静止一致，零跳变。
   rewind=false（点击过）时全部正着播完，不倒放。 */
function rewindAnimations(svg, rewind, onSettled) {
  const anims = svg
    .getAnimations({ subtree: true })
    .filter((a) => typeof a.animationName === 'string'); // 只管动画，不管过渡
  let waiting = 0;
  const running = [];
  anims.forEach((a) => {
    if (a.playState === 'finished') return;
    if (a.playState !== 'running') {
      if (rewind) {
        a.cancel();
        return;
      }
    }
    waiting += 1;
    running.push(a);
  });
  if (waiting === 0) {
    onSettled();
    return;
  }
  let left = waiting;
  const done = () => {
    if (--left <= 0) onSettled();
  };
  running.forEach((a) => {
    const t = a.effect && a.effect.target;
    const drawable =
      t && t.getAttribute && t.getAttribute('pathLength') === '1' && !t.classList.contains('pp-line');
    if (rewind && !drawable) {
      try {
        a.playbackRate = -1;
      } catch {
        /* 不支持倒放的浏览器 → 正着播完，同样落定 */
      }
    }
    a.addEventListener('finish', done, { once: true });
  });
}

/* ─────────────────────────────────────────────
   背景图标：纸 + 笔，两个常驻形态。
   · 默认：空白纸 —— 其他任何页面都保持这个样子；
   · 背景页：带字迹的纸 —— 切进背景页时当场写一遍后落定。
   进入按钮 → 纸和笔朝指针倾，笔落纸逐行书写、慢慢收回。
   非背景页的 hover 是一次「试笔」：写完字迹自动收回，
   桌面上不留痕；背景页离开时字迹同样收回。
   ───────────────────────────────────────────── */

const WRITE_MS = 1750; // 与 pp-pen-write 的 1.6s 时序对齐，留一点余量

function PaperPenIcon({ size, className = '', inked = false }) {
  const rem = `${size / 16}rem`;
  const ref = React.useRef(null);
  const [pt, setPt] = React.useState({ x: 0, y: 0 });
  const [hot, setHot] = React.useState(false);
  const [writing, setWriting] = React.useState(false);
  const [drawn, setDrawn] = React.useState(false);
  const [run, setRun] = React.useState(0);
  const timer = React.useRef(null);
  const inkedRef = React.useRef(inked);
  inkedRef.current = inked;
  const clicked = React.useRef(false);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const start = React.useCallback(() => {
    setRun((r) => r + 1); // key 递增 → 重挂载笔与字迹，动画重新播放
    setWriting(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setWriting(false);
      setDrawn(inkedRef.current); // 只有背景页让字迹落定
    }, WRITE_MS);
  }, []);

  // 指针量化到 0.1：既够跟手，又不会每帧都重渲染
  const track = React.useCallback((e) => {
    const svg = ref.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const q = (v) => Math.round(Math.max(-1, Math.min(1, v)) * 10) / 10;
    setPt({
      x: q(((e.clientX - r.left) / r.width) * 2 - 1),
      y: q(((e.clientY - r.top) / r.height) * 2 - 1),
    });
  }, []);

  useHost(ref, {
    onEnter: (e) => {
      clicked.current = false;
      setHot(true);
      track(e);
      start();
    },
    onMove: track,
    onLeave: () => {
      setHot(false);
      setPt({ x: 0, y: 0 });
      const svg = ref.current;
      if (!svg || clicked.current || inkedRef.current) return;
      // 试笔途经即走：笔与字迹原路收回，桌上不留痕
      rewindAnimations(svg, true, () => {
        window.clearTimeout(timer.current);
        setWriting(false);
      });
    },
    onClick: () => {
      clicked.current = true;
      start();
    },
  });

  // 切进背景页 → 当场写一遍并落定；切走 → 字迹收回
  React.useEffect(() => {
    if (inked) start();
    else setDrawn(false);
  }, [inked, start]);

  return (
    <svg
      ref={ref}
      className={`ico paper-ico ${hot ? 'is-hot' : ''} ${writing ? 'is-writing' : ''} ${className}`}
      width={rem}
      height={rem}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ '--px': pt.x, '--py': pt.y }}
    >
      <g className="pp-paper">
        <rect x="3.5" y="4" width="13.5" height="15" rx="2" />
        <g className={`pp-ink ${drawn ? 'is-drawn' : ''}`} key={run}>
          <path className="pp-line" style={{ '--d': '0.35s' }} pathLength="1" d="M6.5 9h7.3" />
          <path className="pp-line" style={{ '--d': '0.74s' }} pathLength="1" d="M6.5 12.3h6.2" />
          <path className="pp-line" style={{ '--d': '1.06s' }} pathLength="1" d="M6.5 15.6h5.4" />
        </g>
      </g>

      <g className="pp-pen-follow">
        <g className="pp-pen" key={run}>
          <path d="M14.4 15.6 15.71 12.67 17.33 14.29Z" />
          <path d="M15.71 12.67 19.95 8.42A1.15 1.15 0 0 1 21.58 10.05L17.33 14.29Z" />
          <path d="M18.54 9.84 20.16 11.46" />
        </g>
      </g>
    </svg>
  );
}

export function Icon({ name, size = 18, className, inked }) {
  const glyph = ICONS[name];
  const ref = React.useRef(null);
  const [hot, setHot] = React.useState(false);
  const [run, setRun] = React.useState(0);
  const clicked = React.useRef(false);
  const settle = React.useRef(null);

  React.useEffect(() => () => window.clearTimeout(settle.current), []);

  useHost(ref, {
    onEnter: () => {
      window.clearTimeout(settle.current);
      clicked.current = false;
      setRun((r) => r + 1); // 每次进入都从头演（也覆盖倒放中折返的场景）
      setHot(true);
    },
    onLeave: () => {
      const svg = ref.current;
      if (!svg) {
        setHot(false);
        return;
      }
      // 没点过 → 原路倒放；点过 → 正着播完。全部落定才撤类，零跳变
      rewindAnimations(svg, !clicked.current, () => setHot(false));
      // 兜底：万一 finish 不触发，也让它落定（进入时会清掉）
      window.clearTimeout(settle.current);
      settle.current = window.setTimeout(() => setHot(false), 2600);
    },
    onClick: () => {
      clicked.current = true;
      setRun((r) => r + 1); // 重挂载图层 → 进行中的动画从头重播
    },
  });

  /* --d：按图形顺序注入递增延时，图内错峰全部交给 CSS 变量 */
  React.useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    let i = 0;
    svg.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse').forEach((el) => {
      el.style.setProperty('--d', `${(i++ * 0.055).toFixed(3)}s`);
    });
  }, [glyph, name, run]);

  if (name === 'paper') return <PaperPenIcon size={size} className={className} inked={inked} />;
  if (!glyph) return null;
  // size 以 16px 为 1rem 基准换算，图标随根字号（视口缩放）流动
  const rem = `${size / 16}rem`;
  return (
    <svg
      ref={ref}
      className={`ico ico-a-${name} ${hot ? 'is-hot' : ''} ${className || ''}`}
      width={rem}
      height={rem}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <React.Fragment key={run}>{glyph}</React.Fragment>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Artwork as an image — the browser decodes & caches
   the SVG off the document layout path, so dragging
   sliders never repaints 400 live nodes with filters.
   ───────────────────────────────────────────── */

const urlCache = new Map(); // svgString -> blobURL (FIFO, bounded)
const URL_CACHE_MAX = 48;

export function svgUrl(svgString) {
  if (!svgString) return '';
  let url = urlCache.get(svgString);
  if (url) {
    // refresh recency
    urlCache.delete(svgString);
    urlCache.set(svgString, url);
    return url;
  }
  url = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml' }));
  urlCache.set(svgString, url);
  if (urlCache.size > URL_CACHE_MAX) {
    const oldest = urlCache.keys().next().value;
    const evicted = urlCache.get(oldest);
    urlCache.delete(oldest);
    URL.revokeObjectURL(evicted);
  }
  return url;
}

/* ─────────────────────────────────────────────
   Primitives
   ───────────────────────────────────────────── */

export function Slider({ icon, value, min, max, step = 1, onChange, dec = 0, label, title }) {
  // Pair-derived midpoints can land between steps — snap for display & thumb.
  const v = step >= 1 ? Math.round(value) : value;
  const pct = max > min ? ((v - min) / (max - min)) * 100 : 0;
  const text = label ?? title;
  return (
    <div className="ctl">
      <div className="ctl-head">
        <span className="ctl-ic">
          <Icon name={icon} size={16} />
        </span>
        <span className="ctl-label">{text}</span>
        <span className="ctl-num">{Number(v).toFixed(dec)}</span>
      </div>
      <input
        type="range"
        className="rng"
        min={min}
        max={max}
        step={step}
        value={v}
        style={{ '--p': `${Math.max(0, Math.min(100, pct))}%` }}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={text}
      />
    </div>
  );
}

export function Switch({ icon, on, onChange, label, title }) {
  const text = label ?? title;
  return (
    <div className="ctl">
      <div className="ctl-head">
        <span className="ctl-ic">
          <Icon name={icon} size={16} />
        </span>
        <span className="ctl-label">{text}</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={text}
          className={`sw ${on ? 'on' : ''}`}
          onClick={() => onChange(!on)}
        >
          <span className="sw-knob" />
        </button>
      </div>
    </div>
  );
}

export function Swatch({ active, style, onClick, label, title, className = '' }) {
  const text = label ?? title;
  return (
    <button
      type="button"
      className={`sw-pal ${className} ${active ? 'is-on' : ''}`}
      onClick={onClick}
      title={title || text}
      aria-label={title || text}
      aria-pressed={!!active}
    >
      <span className="sw-face" style={style} />
      {text && <span className="sw-name">{text}</span>}
    </button>
  );
}

export function IconBtn({ name, text, onClick, title, size = 16, className = '' }) {
  return (
    <button
      type="button"
      className={`btn-icon ${text ? 'has-text' : ''} ${className}`}
      onClick={onClick}
      title={title || text}
      aria-label={title || text}
    >
      <Icon name={name} size={size} />
      {text && <span className="btn-text">{text}</span>}
    </button>
  );
}

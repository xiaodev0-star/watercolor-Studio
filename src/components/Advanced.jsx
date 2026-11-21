import React, { useState } from 'react';
import { DEFAULT_PARAMS } from '../engine/defaults.js';
import { Icon, Slider, IconBtn, midOf, pairOf } from './ui.jsx';

function SeedRow({ icon, label, value, onChange, onRandom }) {
  return (
    <div className="ctl">
      <div className="ctl-head">
        <span className="ctl-ic">
          <Icon name={icon} size={16} />
        </span>
        <span className="ctl-label">{label}</span>
        <button
          type="button"
          className="btn-mini"
          onClick={onRandom}
          title="随机"
          aria-label={`${label}随机`}
        >
          <Icon name="dice" size={15} />
        </button>
      </div>
      <input
        type="number"
        className="ctl-input"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        aria-label={label}
      />
    </div>
  );
}

/**
 * Right-hand sheet: the artwork stays visible behind it and a compact
 * live preview is pinned on top, so every fine-tuned value updates the
 * picture in real time.
 */
export default function Advanced({ params, onChange, onClose, onReset, url, seed, bg }) {
  const [open, setOpen] = useState(null);
  const [closing, setClosing] = useState(false);

  const set = (k, v) => onChange({ ...params, [k]: v });
  const setPair = (kMin, kMax, m, span, a0, a1, b0, b1) => {
    const [mn, mx] = pairOf(m, span, a0, a1, b0, b1);
    onChange({ ...params, [kMin]: mn, [kMax]: mx });
  };

  const close = () => {
    setClosing(true);
    window.setTimeout(onClose, 240);
  };

  const groups = [
    {
      k: 'opacity',
      icon: 'opacity',
      title: '透明度',
      body: (
        <>
          <Slider
            icon="layers"
            title="图层透明度"
            value={midOf(params.opacityMin, params.opacityMax)}
            min={0.05}
            max={0.35}
            step={0.01}
            dec={2}
            onChange={(v) => setPair('opacityMin', 'opacityMax', v, 0.08, 0.02, 0.15, 0.08, 0.5)}
          />
          <Slider
            icon="target"
            title="花心不透明度"
            value={params.centerOpacity}
            min={0.3}
            max={1}
            step={0.05}
            dec={2}
            onChange={(v) => set('centerOpacity', v)}
          />
        </>
      ),
    },
    {
      k: 'stamen',
      icon: 'sparkle',
      title: '花蕊',
      body: (
        <>
          <Slider
            icon="count"
            title="花蕊数量"
            value={params.stamenCount}
            min={0}
            max={80}
            onChange={(v) => set('stamenCount', v)}
          />
          <Slider
            icon="length"
            title="花蕊长度"
            value={midOf(params.stamenLengthMin, params.stamenLengthMax)}
            min={45}
            max={125}
            onChange={(v) =>
              setPair('stamenLengthMin', 'stamenLengthMax', v, 35, 10, 60, 40, 160)
            }
          />
        </>
      ),
    },
    {
      k: 'bloom',
      icon: 'bloom',
      title: '晕散',
      body: (
        <>
          <Slider
            icon="count"
            title="晕散数量"
            value={params.bloomCount}
            min={0}
            max={20}
            onChange={(v) => set('bloomCount', v)}
          />
          <Slider
            icon="radius"
            title="晕散半径"
            value={midOf(params.bloomRadiusMin, params.bloomRadiusMax)}
            min={24}
            max={80}
            onChange={(v) => setPair('bloomRadiusMin', 'bloomRadiusMax', v, 19, 5, 40, 20, 100)}
          />
          <Slider
            icon="opacity"
            title="晕散透明度"
            value={params.bloomOpacityMax}
            min={0.01}
            max={0.15}
            step={0.005}
            dec={3}
            onChange={(v) => set('bloomOpacityMax', v)}
          />
        </>
      ),
    },
    {
      k: 'paper',
      icon: 'paper',
      title: '纸张',
      body: (
        <>
          <Slider
            icon="fiber"
            title="纸张纤维"
            value={params.paperFiber}
            min={0}
            max={0.8}
            step={0.05}
            dec={2}
            onChange={(v) => set('paperFiber', v)}
          />
          <Slider
            icon="brightness"
            title="亮度不均匀"
            value={params.brightnessVar}
            min={0}
            max={0.8}
            step={0.05}
            dec={2}
            onChange={(v) => set('brightnessVar', v)}
          />
          <Slider
            icon="vignette"
            title="暗角强度"
            value={params.vignette}
            min={0}
            max={0.5}
            step={0.02}
            dec={2}
            onChange={(v) => set('vignette', v)}
          />
          <Slider
            icon="overlay"
            title="顶层纸纹"
            value={params.overlayOpacity}
            min={0}
            max={0.3}
            step={0.01}
            dec={2}
            onChange={(v) => set('overlayOpacity', v)}
          />
          <SeedRow
            icon="hash"
            label="纸纹种子"
            value={params.bgSeed != null ? params.bgSeed : params.seed}
            onChange={(v) => set('bgSeed', v)}
            onRandom={() => set('bgSeed', Math.floor(Math.random() * 999999) + 1)}
          />
        </>
      ),
    },
    {
      k: 'filter',
      icon: 'waves',
      title: '滤镜',
      body: (
        <>
          <Slider
            icon="waves"
            title="花瓣位移"
            value={params.displacementScale}
            min={0}
            max={20}
            onChange={(v) => set('displacementScale', v)}
          />
          <Slider
            icon="wind"
            title="晕散位移"
            value={params.bloomDisplacementScale}
            min={0}
            max={30}
            onChange={(v) => set('bloomDisplacementScale', v)}
          />
          <Slider
            icon="radius"
            title="花心大小"
            value={params.centerSize}
            min={10}
            max={60}
            onChange={(v) => set('centerSize', v)}
          />
        </>
      ),
    },
    {
      k: 'color',
      icon: 'droplet',
      title: '色彩',
      body: (
        <Slider
          icon="hue"
          title="色相偏移"
          value={params.hueShiftRange}
          min={0}
          max={25}
          onChange={(v) => set('hueShiftRange', v)}
        />
      ),
    },
    {
      k: 'seed',
      icon: 'hash',
      title: '种子',
      body: (
        <SeedRow
          icon="target"
          label="随机种子"
          value={params.seed}
          onChange={(v) => set('seed', v)}
          onRandom={() => set('seed', Math.floor(Math.random() * 999999) + 1)}
        />
      ),
    },
  ];

  return (
    <div className={`adv ${closing ? 'is-closing' : ''}`} role="dialog" aria-label="高级设置">
      <div className="adv-head">
        <div className="adv-bar">
          <IconBtn name="arrowLeft" text="返回" size={16} onClick={close} />
        </div>
        <div className="adv-preview" style={{ background: bg }}>
          <img src={url} alt="" draggable={false} />
          <span className="seed-chip">{seed}</span>
        </div>
      </div>

      <div className="adv-scroll">
        <div className="adv-col">
          {groups.map((g) => (
            <section key={g.k} className={`grp ${open === g.k ? 'open' : ''}`}>
              <button
                type="button"
                className="grp-head"
                onClick={() => setOpen(open === g.k ? null : g.k)}
                aria-expanded={open === g.k}
              >
                <span className="grp-left">
                  <Icon name={g.icon} size={17} inked={open === 'paper'} />
                  <span className="grp-title">{g.title}</span>
                </span>
                <span className="grp-chv">
                  <Icon name="chevron" size={14} />
                </span>
              </button>
              <div className="grp-body">
                <div className="grp-inner">
                  <div className="grp-pad">{g.body}</div>
                </div>
              </div>
            </section>
          ))}

          <div className="adv-foot">
            <button
              type="button"
              className="btn-icon has-text"
              onClick={() => onChange({ ...DEFAULT_PARAMS })}
            >
              <Icon name="undo" size={16} />
              <span className="btn-text">恢复默认</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

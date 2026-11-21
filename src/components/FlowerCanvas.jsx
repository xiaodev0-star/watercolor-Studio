import React, { useState, useEffect } from 'react';
import { Icon, IconBtn } from './ui.jsx';

/**
 * The artwork is rendered as an <img> pointing to a cached blob URL:
 * the browser rasterises the SVG off the document layout path and
 * reuses the decoded image while the URL stays the same.
 * `key={seed}` replays the reveal only for genuinely new pieces.
 *
 * 导出入口默认收成一个「下载」按钮；点击后原位过渡展开 PNG / SVG
 * 两个导出项，导出或点画布任意处即收回。
 */
export default function FlowerCanvas({ url, seed, bg, onDownload, onExportPNG }) {
  const [pickOpen, setPickOpen] = useState(false);

  // 展开时点外面任意处收起（点在 canvas-tools 内部不触发）
  useEffect(() => {
    if (!pickOpen) return undefined;
    const onDoc = (e) => {
      if (!e.target.closest?.('.canvas-tools')) setPickOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [pickOpen]);

  return (
    <div className="canvas-wrap">
      <div className="canvas-card" style={{ background: bg }}>
        <img className="canvas-img" key={seed} src={url} alt="" draggable={false} />

        <div className={`canvas-tools ${pickOpen ? 'is-open' : ''}`}>
          <div className="tool-stack">
            <button
              type="button"
              className="btn-icon has-text tool-main"
              onClick={() => setPickOpen((o) => !o)}
              aria-expanded={pickOpen}
              aria-label="下载"
              title="下载"
            >
              <Icon name="download" size={15} />
              <span className="btn-text">下载</span>
            </button>

            <div className="tool-split" aria-hidden={!pickOpen}>
              <IconBtn
                name="image"
                text="PNG"
                size={15}
                onClick={() => {
                  setPickOpen(false);
                  onExportPNG();
                }}
              />
              <IconBtn
                name="code"
                text="SVG"
                size={15}
                onClick={() => {
                  setPickOpen(false);
                  onDownload();
                }}
              />
            </div>
          </div>
        </div>

        <span className="seed-chip">{seed}</span>
      </div>
    </div>
  );
}

import React, { useMemo, useCallback } from 'react';
import { generateFlower } from '../engine/generator.js';
import { Icon, svgUrl } from './ui.jsx';

function GridCell({ params, index, onSelect, selected, delay }) {
  const cellParams = useMemo(
    () => ({ ...params, seed: params.seed + index * 7919 }),
    [params, index]
  );
  const svgString = useMemo(() => generateFlower(cellParams), [cellParams]);
  const url = svgUrl(svgString);

  const handleDownload = useCallback(
    (e) => {
      e.stopPropagation();
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const u = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = u;
      a.download = `watercolor_${cellParams.seed}.svg`;
      a.click();
      URL.revokeObjectURL(u);
    },
    [svgString, cellParams.seed]
  );

  return (
    <div
      className={`grid-cell ${selected ? 'selected' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onSelect(cellParams.seed)}
    >
      <div className="grid-cell-svg">
        <img src={url} alt="" draggable={false} />
      </div>
      <span className="cell-tag">{cellParams.seed}</span>
      <span className="cell-mark">
        <Icon name="check" size={13} />
      </span>
      <div className="cell-tools">
        <button
          type="button"
          className="cell-btn"
          onClick={handleDownload}
          aria-label="下载"
        >
          <Icon name="download" size={14} />
          <span>下载</span>
        </button>
        <button
          type="button"
          className="cell-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(cellParams.seed);
          }}
          aria-label="用它"
        >
          <Icon name="target" size={14} />
          <span>用它</span>
        </button>
      </div>
    </div>
  );
}

export default function MultiGrid({ params, count, onUseSeed, onClose }) {
  const [selected, setSelected] = React.useState(null);

  const handleDownloadAll = useCallback(() => {
    for (let i = 0; i < count; i++) {
      const cellParams = { ...params, seed: params.seed + i * 7919 };
      const svg = generateFlower(cellParams);
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const u = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = u;
      a.download = `watercolor_${cellParams.seed}.svg`;
      a.click();
      URL.revokeObjectURL(u);
    }
  }, [params, count]);

  const cols = count <= 4 ? 2 : count <= 9 ? 3 : 4;

  return (
    <div className="multi-overlay">
      <div className="multi-bar">
        {selected !== null && (
          <button
            type="button"
            className="btn-icon has-text is-accent"
            onClick={() => onUseSeed(selected)}
            aria-label="使用"
          >
            <Icon name="check" size={16} />
            <span className="btn-text">使用它</span>
          </button>
        )}
        <button
          type="button"
          className="btn-icon has-text"
          onClick={handleDownloadAll}
          aria-label="全部下载"
        >
          <Icon name="download" size={16} />
          <span className="btn-text">全部下载</span>
        </button>
        <button
          type="button"
          className="btn-icon"
          onClick={onClose}
          title="关闭"
          aria-label="关闭"
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      <div className="multi-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: count }, (_, i) => (
          <GridCell
            key={i}
            params={params}
            index={i}
            delay={i * 35}
            onSelect={setSelected}
            selected={selected === params.seed + i * 7919}
          />
        ))}
      </div>
    </div>
  );
}

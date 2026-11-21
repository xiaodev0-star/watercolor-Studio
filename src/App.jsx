import React, { useState, useCallback, useMemo, useEffect, useDeferredValue } from 'react';
import { DEFAULT_PARAMS } from './engine/defaults.js';
import { generateFlower } from './engine/generator.js';
import ControlPanel from './components/ControlPanel.jsx';
import FlowerCanvas from './components/FlowerCanvas.jsx';
import MultiGrid from './components/MultiGrid.jsx';
import Advanced from './components/Advanced.jsx';
import { svgUrl } from './components/ui.jsx';

export default function App() {
  const [params, setParams] = useState({ ...DEFAULT_PARAMS });
  const [multiCount, setMultiCount] = useState(0);
  const [advanced, setAdvanced] = useState(false);

  // Sliders stay urgent (instant thumb feedback); the artwork is generated
  // from a deferred copy during idle time, so dragging never blocks.
  const deferredParams = useDeferredValue(params);
  const svgString = useMemo(() => generateFlower(deferredParams), [deferredParams]);
  const artworkUrl = useMemo(() => svgUrl(svgString), [svgString]);

  const handleRandomize = useCallback(() => {
    setParams((prev) => ({
      ...prev,
      seed: Math.floor(Math.random() * 999999) + 1,
    }));
  }, []);

  const handleUseSeed = useCallback((seed) => {
    setParams((prev) => ({ ...prev, seed }));
    setMultiCount(0);
  }, []);

  // Exports always use the current params, never the deferred preview.
  const handleDownload = useCallback(() => {
    const blob = new Blob([generateFlower(params)], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watercolor_${params.seed}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [params]);

  const handleExportPNG = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 3200;
    canvas.height = 1800;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([generateFlower(params)], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 3200, 1800);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `watercolor_${params.seed}.png`;
      a.click();
    };
    img.src = url;
  }, [params]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleRandomize();
      }
      if (e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleDownload();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRandomize, handleDownload]);

  return (
    <div className="app">
      <ControlPanel
        params={params}
        onChange={setParams}
        onRandomize={handleRandomize}
        onGenerateMulti={setMultiCount}
        onOpenAdvanced={() => setAdvanced(true)}
      />

      <main className="main">
        <FlowerCanvas
          url={artworkUrl}
          seed={params.seed}
          bg={params.bgColor}
          onDownload={handleDownload}
          onExport={handleExportPNG}
        />
      </main>

      {multiCount > 0 && (
        <MultiGrid
          params={params}
          count={multiCount}
          onUseSeed={handleUseSeed}
          onClose={() => setMultiCount(0)}
        />
      )}

      {advanced && (
        <Advanced
          params={params}
          onChange={setParams}
          onClose={() => setAdvanced(false)}
          onReset={() => setParams({ ...DEFAULT_PARAMS })}
          url={artworkUrl}
          seed={params.seed}
          bg={params.bgColor}
        />
      )}

      <div className="grain" />
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { BlastPattern } from '../types';

interface BlastCanvasProps {
  layout: {
    B: number;
    S: number;
    rows: number;
    cols: number;
    pattern: BlastPattern;
  };
  scale: number;
  theme: 'light' | 'dark';
}

const BlastCanvas: React.FC<BlastCanvasProps> = ({ layout, scale, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Colors
  const bg = theme === 'dark' ? '#071018' : '#ffffff';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const holeFill = theme === 'dark' ? '#ff6b6b' : '#ef4444';
  const holeStroke = theme === 'dark' ? '#7f1d1d' : '#991b1b';

  const chooseNiceGridSpacing = (pxPerMeter: number) => {
    const targetPx = 100; 
    const idealMeters = targetPx / pxPerMeter;
    const nice = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
    for (let n of nice) if (n >= idealMeters) return n;
    return nice[nice.length - 1];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { B, S, rows, cols, pattern } = layout;
    const gridMeters = chooseNiceGridSpacing(scale);
    const pxPerCell = gridMeters * scale;

    // Draw Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    const startX = offset.x % pxPerCell;
    for (let x = startX; x <= canvas.width; x += pxPerCell) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    const startY = offset.y % pxPerCell;
    for (let y = startY; y <= canvas.height; y += pxPerCell) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw Holes
    const radius = Math.max(3, Math.min(8, scale * 0.08));
    const margin = 50;

    for (let r = 0; r < rows; r++) {
      // Apply offset for Staggered and Diagonal patterns
      // Square: Aligned (offset 0)
      // Staggered/Diagonal: Alternate rows shifted by S/2
      const isStaggeredLayout = pattern === BlastPattern.Staggered || pattern === BlastPattern.Diagonal;
      const x_offset = (isStaggeredLayout && r % 2 !== 0) ? S / 2 : 0;

      for (let c = 0; c < cols; c++) {
        const x = margin + (c * S * scale) + (x_offset * scale) + offset.x;
        const y = margin + (r * B * scale) + offset.y;
        
        // Optimization: Don't draw if off screen
        if (x < -radius || y < -radius || x > canvas.width + radius || y > canvas.height + radius) continue;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = holeFill;
        ctx.fill();
        ctx.strokeStyle = holeStroke;
        ctx.stroke();
      }
    }

  }, [layout, scale, offset, theme, bg, gridColor, holeFill, holeStroke]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full overflow-hidden cursor-move relative touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        width={2000} // Large canvas for drawing buffer
        height={1600}
        className="block"
      />
      
      {/* Overlay Info */}
      <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 p-2 rounded shadow text-xs text-slate-500 pointer-events-none">
        Scale: {scale.toFixed(1)} px/m
      </div>
    </div>
  );
};

export default BlastCanvas;
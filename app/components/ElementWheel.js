"use client";

import { WHEEL_ORDER, CONTROLLER_OF, ELEMENTS } from "../../lib/numerology";

function polar(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function ElementWheel({ activeElement }) {
  const cx = 150, cy = 150, r = 105, nodeR = 30;
  const n = WHEEL_ORDER.length;
  const positions = {};
  WHEEL_ORDER.forEach((el, i) => {
    positions[el] = polar(cx, cy, r, (360 / n) * i);
  });

  const controlLines = WHEEL_ORDER.map((elm) => {
    const from = CONTROLLER_OF[elm];
    const p1 = positions[from];
    const p2 = positions[elm];
    return { key: `ctrl-${from}-${elm}`, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
  });

  const genLines = WHEEL_ORDER.map((from, i) => {
    const to = WHEEL_ORDER[(i + 1) % n];
    const p1 = positions[from], p2 = positions[to];
    const dx = p2.x - p1.x, dy = p2.y - p1.y, dist = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / dist, uy = dy / dist;
    return {
      key: `gen-${from}-${to}`,
      x1: p1.x + ux * (nodeR + 4),
      y1: p1.y + uy * (nodeR + 4),
      x2: p2.x - ux * (nodeR + 8),
      y2: p2.y - uy * (nodeR + 8),
    };
  });

  return (
    <svg id="wheel-svg" viewBox="0 0 300 300">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(143,203,162,0.9)" />
        </marker>
      </defs>

      {controlLines.map((l) => (
        <line
          key={l.key}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="rgba(219,106,52,0.28)" strokeWidth="1.2" strokeDasharray="3,5"
        />
      ))}

      {genLines.map((l) => (
        <line
          key={l.key}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="rgba(143,203,162,0.55)" strokeWidth="1.6" markerEnd="url(#arrow)"
        />
      ))}

      {WHEEL_ORDER.map((elm) => {
        const p = positions[elm];
        const isActive = elm === activeElement;
        return (
          <g key={elm}>
            <circle
              cx={p.x} cy={p.y} r={isActive ? nodeR + 4 : nodeR}
              fill={isActive ? ELEMENTS[elm].hex : "rgba(255,255,255,0.05)"}
              stroke={isActive ? "#E4C98A" : "rgba(255,255,255,0.15)"}
              strokeWidth={isActive ? 2 : 1}
              style={isActive ? { filter: "drop-shadow(0 0 10px rgba(228,201,138,0.7))" } : undefined}
            />
            <text
              x={p.x} y={p.y + 4} textAnchor="middle"
              fontFamily="Sora, sans-serif"
              fontSize={isActive ? 13 : 11}
              fontWeight={isActive ? 700 : 500}
              fill={isActive ? "#0B0B14" : "rgba(241,238,230,0.75)"}
            >
              {ELEMENTS[elm].name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

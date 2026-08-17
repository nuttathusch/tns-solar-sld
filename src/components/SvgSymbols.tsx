import React from 'react';

// Breaker 1-Pole / 2-Pole / 3-Pole / 4-Pole Symbol (Exact PEA / วสท. Standard as in Image 2)
export const CircuitBreakerSymbol: React.FC<{
  x: number;
  y: number;
  poles?: 1 | 2 | 3 | 4;
  label?: string;
  sublabel?: string;
  alignFromLeft?: boolean;
}> = ({ x, y, poles = 2, label, sublabel, alignFromLeft = true }) => {
  const poleSpacing = 20;
  const startX = alignFromLeft ? x : x - ((poles - 1) * poleSpacing) / 2;
  const totalWidth = (poles - 1) * poleSpacing;

  return (
    <g className="circuit-breaker-symbol">
      {Array.from({ length: poles }).map((_, i) => {
        const px = startX + i * poleSpacing;
        return (
          <g key={i}>
            {/* Top vertical terminal line */}
            <line x1={px} y1={y - 20} x2={px} y2={y - 4} stroke="#000000" strokeWidth="1.8" />

            {/* Circuit Breaker Trip Element: Clean 'X' Cross on the vertical line */}
            <line
              x1={px - 4.5}
              y1={y - 14}
              x2={px + 4.5}
              y2={y - 5}
              stroke="#000000"
              strokeWidth="1.8"
              strokeLinecap="square"
            />
            <line
              x1={px + 4.5}
              y1={y - 14}
              x2={px - 4.5}
              y2={y - 5}
              stroke="#000000"
              strokeWidth="1.8"
              strokeLinecap="square"
            />

            {/* Open switch contact blade (clean diagonal blade from upper-left into hinge point) */}
            <line
              x1={px - 7.5}
              y1={y - 2}
              x2={px}
              y2={y + 8}
              stroke="#000000"
              strokeWidth="2.0"
              strokeLinecap="round"
            />

            {/* Bottom vertical terminal line continuing straight down */}
            <line x1={px} y1={y + 8} x2={px} y2={y + 22} stroke="#000000" strokeWidth="1.8" />
          </g>
        );
      })}

      {/* Mechanical Interlock Tie bar for multipole breakers */}
      {poles > 1 && (
        <line
          x1={startX - 6}
          y1={y + 3}
          x2={startX + totalWidth + 1}
          y2={y + 3}
          stroke="#000000"
          strokeWidth="1.2"
          strokeDasharray="2.5 2"
        />
      )}

      {/* Text Labels with clean right-side margin */}
      {label && (
        <text
          x={startX + totalWidth + 14}
          y={sublabel ? y + 2 : y + 5}
          fontFamily="Arial, sans-serif"
          fontSize="9.5"
          fontWeight="bold"
          fill="#000000"
        >
          {label}
        </text>
      )}
      {sublabel && (
        <text
          x={startX + totalWidth + 14}
          y={y + 14}
          fontFamily="Arial, sans-serif"
          fontSize="8"
          fill="#333333"
        >
          {sublabel}
        </text>
      )}
    </g>
  );
};

// IEEE Relay Code Bubble Symbol e.g. (50) (50N) (51) (51N)
export const RelayCircle: React.FC<{
  cx: number;
  cy: number;
  radius?: number;
  code: string;
}> = ({ cx, cy, radius = 9, code }) => {
  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill="#ffffff" stroke="#000000" strokeWidth="1.3" />
      <text
        x={cx}
        y={cy + 3.2}
        fontFamily="Arial, sans-serif"
        fontSize="7.5"
        fontWeight="bold"
        textAnchor="middle"
        fill="#000000"
      >
        {code}
      </text>
    </g>
  );
};

// Ground Symbol (Clean 3 horizontal grounding lines)
export const GroundSymbol: React.FC<{
  x: number;
  y: number;
  size?: number;
  label?: string;
}> = ({ x, y, size = 16, label }) => {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 8} stroke="#000000" strokeWidth="1.6" />
      <line x1={x - size / 2} y1={y + 8} x2={x + size / 2} y2={y + 8} stroke="#000000" strokeWidth="1.8" />
      <line x1={x - size / 3} y1={y + 12} x2={x + size / 3} y2={y + 12} stroke="#000000" strokeWidth="1.5" />
      <line x1={x - size / 6} y1={y + 16} x2={x + size / 6} y2={y + 16} stroke="#000000" strokeWidth="1.2" />
      {label && (
        <text x={x + 12} y={y + 12} fontFamily="Arial, sans-serif" fontSize="8" fill="#000000">
          {label}
        </text>
      )}
    </g>
  );
};

// Surge Protection Device (SPD) Symbol
export const SpdSymbol: React.FC<{
  x: number;
  y: number;
  label?: string;
  typeText?: string;
}> = ({ x, y, label = 'AC SPD', typeText = 'TYPE II' }) => {
  return (
    <g>
      <rect x={x - 18} y={y - 18} width={36} height={36} fill="#ffffff" stroke="#000000" strokeWidth="1.3" />
      <path
        d={`M ${x - 12} ${y - 10} L ${x + 5} ${y} L ${x - 4} ${y} L ${x + 12} ${y + 10}`}
        fill="none"
        stroke="#000000"
        strokeWidth="1.6"
      />
      <text x={x} y={y + 28} fontFamily="Arial, sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="#000000">
        {label}
      </text>
      {typeText && (
        <text x={x} y={y + 37} fontFamily="Arial, sans-serif" fontSize="6.5" textAnchor="middle" fill="#444444">
          {typeText}
        </text>
      )}
    </g>
  );
};

// Current Transformer (CT) Symbol
export const CtSymbol: React.FC<{
  cx: number;
  cy: number;
  radius?: number;
  label?: string;
}> = ({ cx, cy, radius = 7, label }) => {
  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
      <line x1={cx - radius - 3} y1={cy} x2={cx + radius + 3} y2={cy} stroke="#000000" strokeWidth="1.2" />
      {label && (
        <text x={cx + radius + 6} y={cy + 3} fontFamily="Arial, sans-serif" fontSize="7.5" fill="#000000">
          {label}
        </text>
      )}
    </g>
  );
};

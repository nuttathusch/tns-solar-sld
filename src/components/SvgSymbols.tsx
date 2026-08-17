import React from 'react';

// Breaker 1-Pole / 2-Pole / 3-Pole / 4-Pole Symbol
export const CircuitBreakerSymbol: React.FC<{
  x: number;
  y: number;
  poles?: 1 | 2 | 3 | 4;
  label?: string;
  sublabel?: string;
  isRcbo?: boolean;
}> = ({ x, y, poles = 3, label, sublabel }) => {
  const poleSpacing = 16;
  const width = (poles - 1) * poleSpacing;
  const startX = x - width / 2;

  return (
    <g className="circuit-breaker-symbol">
      {Array.from({ length: poles }).map((_, i) => {
        const px = startX + i * poleSpacing;
        return (
          <g key={i}>
            {/* Top connection point */}
            <line x1={px} y1={y - 18} x2={px} y2={y - 8} stroke="#000" strokeWidth="1.5" />
            {/* Switch contact */}
            <line x1={px} y1={y - 8} x2={px + 6} y2={y + 8} stroke="#000" strokeWidth="1.5" />
            {/* X cross for circuit breaker */}
            <line x1={px - 4} y1={y - 3} x2={px + 4} y2={y + 3} stroke="#000" strokeWidth="1.2" />
            <line x1={px + 4} y1={y - 3} x2={px - 4} y2={y + 3} stroke="#000" strokeWidth="1.2" />
            {/* Bottom connection point */}
            <line x1={px} y1={y + 8} x2={px} y2={y + 18} stroke="#000" strokeWidth="1.5" />
          </g>
        );
      })}

      {/* Tie bar for multipole */}
      {poles > 1 && (
        <line
          x1={startX - 2}
          y1={y}
          x2={startX + width + 2}
          y2={y}
          stroke="#000"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      )}

      {/* Labels */}
      {label && (
        <text
          x={startX + width + 14}
          y={y - 2}
          fontFamily="Arial, sans-serif"
          fontSize="9"
          fontWeight="bold"
          fill="#000"
        >
          {label}
        </text>
      )}
      {sublabel && (
        <text
          x={startX + width + 14}
          y={y + 10}
          fontFamily="Arial, sans-serif"
          fontSize="8"
          fill="#333"
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
}> = ({ cx, cy, radius = 10, code }) => {
  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill="#fff" stroke="#000" strokeWidth="1.2" />
      <text
        x={cx}
        y={cy + 3.5}
        fontFamily="Arial, sans-serif"
        fontSize="8"
        fontWeight="bold"
        textAnchor="middle"
        fill="#000"
      >
        {code}
      </text>
    </g>
  );
};

// Ground Symbol
export const GroundSymbol: React.FC<{
  x: number;
  y: number;
  size?: number;
  label?: string;
}> = ({ x, y, size = 16, label }) => {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 10} stroke="#000" strokeWidth="1.5" />
      <line x1={x - size / 2} y1={y + 10} x2={x + size / 2} y2={y + 10} stroke="#000" strokeWidth="1.8" />
      <line x1={x - size / 3} y1={y + 14} x2={x + size / 3} y2={y + 14} stroke="#000" strokeWidth="1.5" />
      <line x1={x - size / 6} y1={y + 18} x2={x + size / 6} y2={y + 18} stroke="#000" strokeWidth="1.2" />
      {label && (
        <text x={x + 12} y={y + 12} fontFamily="Arial, sans-serif" fontSize="8" fill="#000">
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
      <rect x={x - 20} y={y - 20} width={40} height={40} fill="#fff" stroke="#000" strokeWidth="1.2" />
      <path d={`M ${x - 14} ${y - 12} L ${x + 6} ${y} L ${x - 4} ${y} L ${x + 14} ${y + 12}`} fill="none" stroke="#000" strokeWidth="1.5" />
      <text x={x} y={y + 28} fontFamily="Arial, sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="#000">
        {label}
      </text>
      {typeText && (
        <text x={x} y={y + 36} fontFamily="Arial, sans-serif" fontSize="7" textAnchor="middle" fill="#444">
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
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#000" strokeWidth="1.5" />
      <line x1={cx - radius - 3} y1={cy} x2={cx + radius + 3} y2={cy} stroke="#000" strokeWidth="1.2" />
      {label && (
        <text x={cx + radius + 5} y={cy + 3} fontFamily="Arial, sans-serif" fontSize="7.5" fill="#000">
          {label}
        </text>
      )}
    </g>
  );
};

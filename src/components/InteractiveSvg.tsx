import React, { useState } from 'react';
import type { ElementOffset } from '../types/solar';

interface DraggableGroupProps {
  id: string;
  initialX: number;
  initialY: number;
  offset?: ElementOffset;
  onOffsetChange: (id: string, newOffset: ElementOffset) => void;
  isMoveMode?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const DraggableGroup: React.FC<DraggableGroupProps> = ({
  id,
  initialX,
  initialY,
  offset = { dx: 0, dy: 0 },
  onOffsetChange,
  isMoveMode = true,
  children,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const currentX = initialX + (offset.dx || 0);
  const currentY = initialY + (offset.dy || 0);

  const handleMouseDown = (e: React.MouseEvent<SVGGElement>) => {
    if (!isMoveMode) return;
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGGElement>) => {
    if (!isDragging || !dragStart) return;
    e.stopPropagation();
    const scale = 1; // Handled relatively
    const deltaX = (e.clientX - dragStart.x) * scale;
    const deltaY = (e.clientY - dragStart.y) * scale;

    onOffsetChange(id, {
      dx: (offset.dx || 0) + deltaX,
      dy: (offset.dy || 0) + deltaY,
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent<SVGGElement>) => {
    if (isDragging) {
      e.stopPropagation();
      setIsDragging(false);
      setDragStart(null);
    }
  };

  return (
    <g
      transform={`translate(${currentX}, ${currentY})`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`draggable-group ${isMoveMode ? 'cursor-move' : ''} ${className}`}
      style={{ userSelect: 'none' }}
    >
      {isMoveMode && (
        <rect
          x={-4}
          y={-4}
          width="100%"
          height="100%"
          fill="transparent"
          stroke={isDragging ? '#f59e0b' : 'transparent'}
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="hover:stroke-amber-400/50 transition"
        />
      )}
      {children}
    </g>
  );
};

interface EditableSvgTextProps {
  x: number;
  y: number;
  text: string;
  fieldLabel?: string;
  onEdit: (newValue: string) => void;
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: string | number;
  textAnchor?: 'start' | 'middle' | 'end';
  fill?: string;
  className?: string;
  isEditMode?: boolean;
}

export const EditableSvgText: React.FC<EditableSvgTextProps> = ({
  x,
  y,
  text,
  fieldLabel,
  onEdit,
  fontFamily = 'Arial, sans-serif',
  fontSize = 9,
  fontWeight = 'normal',
  textAnchor = 'start',
  fill = '#000000',
  className = '',
  isEditMode = true,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const promptMsg = fieldLabel
      ? `แก้ไข ${fieldLabel}:`
      : `แก้ไขข้อความ (เดิม: "${text}"):`;
    const result = window.prompt(promptMsg, text);
    if (result !== null && result !== text) {
      onEdit(result);
    }
  };

  return (
    <text
      x={x}
      y={y}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      textAnchor={textAnchor}
      fill={fill}
      onClick={handleClick}
      className={`select-none transition-all ${
        isEditMode
          ? 'cursor-pointer hover:fill-amber-600 hover:font-bold underline-offset-2'
          : ''
      } ${className}`}
    >
      {isEditMode && <title>{`คลิกเพื่อแก้ไข "${text}"`}</title>}
      {text}
    </text>
  );
};

import React, { useState } from 'react';
import type { ElementOffset } from '../types/solar';

interface DraggableGroupProps {
  id: string;
  name?: string;
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
  name,
  initialX,
  initialY,
  offset = { dx: 0, dy: 0 },
  onOffsetChange,
  isMoveMode = false,
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
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

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
      className={`draggable-group transition-all ${
        isMoveMode
          ? isDragging
            ? 'cursor-grabbing select-none opacity-90'
            : 'cursor-grab hover:opacity-95'
          : ''
      } ${className}`}
      style={{ userSelect: 'none' }}
    >
      {/* Visual Bounding Outline in Move Mode */}
      {isMoveMode && (
        <g className="pointer-events-none">
          <rect
            x={-6}
            y={-6}
            width="100%"
            height="100%"
            fill="transparent"
            stroke={isDragging ? '#38bdf8' : '#f59e0b'}
            strokeWidth="1.5"
            strokeDasharray={isDragging ? '4 2' : '3 3'}
            className="animate-pulse"
          />
          {name && (
            <text
              x={0}
              y={-10}
              fontFamily="Arial, sans-serif"
              fontSize="8"
              fontWeight="bold"
              fill={isDragging ? '#0284c7' : '#d97706'}
            >
              🖐️ {name} (คลิกลากขยับได้)
            </text>
          )}
        </g>
      )}
      {children}
    </g>
  );
};

interface EditableSvgTextProps {
  id: string;
  x: number;
  y: number;
  text: string;
  label?: string;
  onOpenEdit: (id: string, text: string, label: string) => void;
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: string | number;
  textAnchor?: 'start' | 'middle' | 'end';
  fill?: string;
  className?: string;
  isEditMode?: boolean;
  dy?: number | string;
  children?: React.ReactNode;
}

export const EditableSvgText: React.FC<EditableSvgTextProps> = ({
  id,
  x,
  y,
  text,
  label,
  onOpenEdit,
  fontFamily = 'Arial, sans-serif',
  fontSize = 8.5,
  fontWeight = 'normal',
  textAnchor = 'start',
  fill = '#000000',
  className = '',
  isEditMode = true,
  dy,
  children,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.stopPropagation();
    onOpenEdit(id, text, label || 'ข้อความในแบบ');
  };

  return (
    <text
      x={x}
      y={y}
      dy={dy}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      textAnchor={textAnchor}
      fill={fill}
      onClick={handleClick}
      className={`select-none transition-all ${
        isEditMode
          ? 'cursor-pointer hover:fill-amber-600 hover:font-bold underline decoration-amber-400 decoration-dotted'
          : ''
      } ${className}`}
    >
      {isEditMode && <title>{`✏️ คลิกเพื่อแก้ไข: "${text}"`}</title>}
      {children || text}
    </text>
  );
};

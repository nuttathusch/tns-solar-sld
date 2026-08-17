import React, { useState } from 'react';
import type { SolarSLDProject, ElementOffset } from '../types/solar';
import { TitleBlock, TechnicalNotesAndSpecs } from './TitleBlock';
import { CircuitBreakerSymbol, RelayCircle, GroundSymbol, SpdSymbol, CtSymbol } from './SvgSymbols';
import { DraggableGroup, EditableSvgText } from './InteractiveSvg';
import { TextEditModal } from './TextEditModal';
import { Edit3, Move, RotateCcw } from 'lucide-react';

interface SldCanvasProps {
  project: SolarSLDProject;
  svgRef: React.RefObject<SVGSVGElement | null>;
  zoom?: number;
  onProjectChange?: (updater: (prev: SolarSLDProject) => SolarSLDProject) => void;
  isMoveMode?: boolean;
  setIsMoveMode?: React.Dispatch<React.SetStateAction<boolean>>;
  isEditMode?: boolean;
  setIsEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SldCanvas: React.FC<SldCanvasProps> = ({
  project,
  svgRef,
  zoom = 1,
  onProjectChange,
  isMoveMode = false,
  setIsMoveMode,
  isEditMode = true,
  setIsEditMode,
}) => {
  const { projectInfo, pvConfig, inverterConfig, combinerConfig, loadCenterConfig, customTextOverrides } = project;
  const is3Phase = inverterConfig.phase === '3P';
  const isMicro = inverterConfig.systemType === 'microinverter';

  // Text Edit Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    id: string;
    text: string;
    label: string;
    defaultValue?: string;
  }>({
    isOpen: false,
    id: '',
    text: '',
    label: '',
  });

  // Master SVG dimensions (standard high-res drawing area)
  const SVG_WIDTH = 1360;
  const SVG_HEIGHT = 920;

  // Title block coordinates (Right column)
  const TB_WIDTH = 230;
  const TB_X = SVG_WIDTH - TB_WIDTH - 25; // 1105
  const TB_Y = 25;
  const TB_HEIGHT = SVG_HEIGHT - 50; // 870

  // Technical Specs & Notes coordinates
  const SPECS_X = 750;
  const SPECS_Y = 440;

  const getText = (key: string, fallback: string): string => {
    return customTextOverrides?.[key] ?? fallback;
  };

  const handleOffsetChange = (id: string, newOffset: ElementOffset) => {
    if (!onProjectChange) return;
    onProjectChange((prev) => ({
      ...prev,
      customOffsets: {
        ...(prev.customOffsets || {}),
        [id]: newOffset,
      },
    }));
  };

  const handleResetPositions = () => {
    if (!onProjectChange) return;
    onProjectChange((prev) => ({
      ...prev,
      customOffsets: {},
    }));
  };

  const getOffset = (id: string): ElementOffset => {
    return project.customOffsets?.[id] || { dx: 0, dy: 0 };
  };

  const handleOpenEdit = (id: string, currentText: string, label: string) => {
    setModalState({
      isOpen: true,
      id,
      text: currentText,
      label,
    });
  };

  const handleSaveText = (newVal: string) => {
    if (!onProjectChange || !modalState.id) return;
    onProjectChange((prev) => ({
      ...prev,
      customTextOverrides: {
        ...(prev.customTextOverrides || {}),
        [modalState.id]: newVal,
      },
    }));
  };

  const handleResetSingleText = () => {
    if (!onProjectChange || !modalState.id) return;
    onProjectChange((prev) => {
      const nextOverrides = { ...(prev.customTextOverrides || {}) };
      delete nextOverrides[modalState.id];
      return {
        ...prev,
        customTextOverrides: nextOverrides,
      };
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-full relative">
      {/* Sticky High-Visibility Toolbar */}
      <div className="flex items-center justify-between w-full max-w-[1360px] mb-2 px-3.5 py-2 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl text-xs text-slate-200 gap-3 shadow-lg z-10 sticky top-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <span>📐 โหมดแก้ไข CAD:</span>
          </span>

          {/* Toggle Direct Text Edit Mode */}
          <button
            onClick={() => setIsEditMode?.(!isEditMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition shadow-xs ${
              isEditMode
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Edit3 size={14} />
            <span>{isEditMode ? '✏️ โหมดคลิกแก้ไขข้อความ (เปิดอยู่)' : '✏️ เปิดโหมดคลิกแก้ไขข้อความ'}</span>
          </button>

          {/* Toggle Drag/Move Elements Mode */}
          <button
            onClick={() => setIsMoveMode?.(!isMoveMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition shadow-xs ${
              isMoveMode
                ? 'bg-sky-500 text-slate-950 border-sky-400 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Move size={14} />
            <span>{isMoveMode ? '🖐️ โหมดลากขยับตำแหน่ง CAD (เปิดอยู่)' : '🖐️ เปิดโหมดลากขยับตำแหน่ง CAD'}</span>
          </button>

          {/* Reset All Offsets */}
          <button
            onClick={handleResetPositions}
            title="รีเซ็ตตำแหน่งวัตถุกลับค่ามาตรฐานเริ่มต้น"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            <RotateCcw size={13} />
            <span>รีเซ็ตตำแหน่งเดิม</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-300 hidden lg:flex items-center gap-2">
          {isEditMode && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
              💡 คลิกที่ข้อความใดก็ได้บนแบบเพื่อแก้ไข
            </span>
          )}
          {isMoveMode && (
            <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded">
              💡 คลิกลากที่กล่องวัตถุเพื่อขยับตำแหน่ง
            </span>
          )}
        </div>
      </div>

      {/* SVG Container */}
      <div className="svg-canvas-container flex justify-center items-center overflow-auto p-4 bg-slate-900 rounded-xl shadow-2xl w-full">
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="bg-white shadow-lg transition-transform duration-200"
          style={{
            width: `${SVG_WIDTH * zoom}px`,
            height: `${SVG_HEIGHT * zoom}px`,
            maxWidth: '100%',
            aspectRatio: `${SVG_WIDTH} / ${SVG_HEIGHT}`,
          }}
        >
          {/* Outer Drawing Border & Grid Frame */}
          <rect
            x="15"
            y="15"
            width={SVG_WIDTH - 30}
            height={SVG_HEIGHT - 30}
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2"
          />
          <rect
            x="20"
            y="20"
            width={SVG_WIDTH - 40}
            height={SVG_HEIGHT - 40}
            fill="none"
            stroke="#000000"
            strokeWidth="0.8"
          />

          {/* ========================================================================= */}
          {/* 1. TOP HEADER: GRID & METER CONNECTION (PEA / MEA)                        */}
          {/* ========================================================================= */}
          <DraggableGroup
            id="grid-header"
            name="หัวต่อสายไฟการไฟฟ้า & มิเตอร์"
            initialX={0}
            initialY={0}
            offset={getOffset('grid-header')}
            onOffsetChange={handleOffsetChange}
            isMoveMode={isMoveMode}
          >
            {/* Main Grid Line */}
            <line x1="50" y1="65" x2="700" y2="65" stroke="#000" strokeWidth="2" />
            <EditableSvgText
              id="grid.systemTitle"
              x={350}
              y={55}
              text={getText(
                'grid.systemTitle',
                `${projectInfo.gridAuthority} Distribution System ${projectInfo.gridVoltage}`
              )}
              label="หัวข้อระบบจำหน่ายไฟฟ้า"
              onOpenEdit={handleOpenEdit}
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              isEditMode={isEditMode}
            />

            {/* kWh Meter */}
            <rect x="290" y="78" width="44" height="24" fill="#fff" stroke="#000" strokeWidth="1.5" />
            <text x="312" y="94" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#000">
              kWh
            </text>
            <line x1="312" y1="65" x2="312" y2="78" stroke="#000" strokeWidth="1.8" />
            <line x1="312" y1="102" x2="312" y2="150" stroke="#000" strokeWidth="1.8" />

            {/* PEA / Customer Boundary Marker */}
            <g transform="translate(130, 90)">
              <path d="M 0 0 L 0 35 M -5 8 L 0 0 L 5 8" fill="none" stroke="#000" strokeWidth="1" />
              <EditableSvgText
                id="grid.authorityName"
                x={8}
                y={10}
                text={getText('grid.authorityName', projectInfo.gridAuthority)}
                label="ชื่อการไฟฟ้า (PEA/MEA)"
                onOpenEdit={handleOpenEdit}
                fontSize="8"
                fontWeight="bold"
                isEditMode={isEditMode}
              />
              <EditableSvgText
                id="grid.customerBoundary"
                x={8}
                y={22}
                text={getText('grid.customerBoundary', 'CUSTOMER')}
                label="ป้ายแบ่งเขตผู้ใช้ไฟฟ้า"
                onOpenEdit={handleOpenEdit}
                fontSize="8"
                fontWeight="bold"
                isEditMode={isEditMode}
              />
              <line x1="-30" y1="18" x2="60" y2="18" stroke="#666" strokeWidth="0.8" strokeDasharray="3 3" />
            </g>

            {/* Service Drop Cable Callout */}
            <EditableSvgText
              id="grid.cableSpec"
              x={375}
              y={118}
              text={getText('grid.cableSpec', projectInfo.gridCableSpec)}
              label="สเปกสายเมนเข้าอาคาร"
              onOpenEdit={handleOpenEdit}
              fontSize="8"
              fontWeight="bold"
              isEditMode={isEditMode}
            />

            {/* Consumption CTs */}
            <g transform="translate(312, 130)">
              <circle cx="0" cy="0" r="7" fill="none" stroke="#000" strokeWidth="1.5" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#000" strokeWidth="1.2" />
              <text x="14" y="-3" fontFamily="Arial, sans-serif" fontSize="7.5" fontWeight="bold" fill="#000">
                Consumption CT's
              </text>
              <EditableSvgText
                id="grid.consumptionCt"
                x={14}
                y={8}
                text={getText('grid.consumptionCt', combinerConfig.consumptionCt)}
                label="Consumption CT Spec"
                onOpenEdit={handleOpenEdit}
                fontSize="7.5"
                isEditMode={isEditMode}
              />
              {/* CT Secondary Wire down to Combiner Box */}
              <path
                d="M 12 4 L 470 4 L 470 380"
                fill="none"
                stroke="#555"
                strokeWidth="0.9"
                strokeDasharray="4 2"
              />
              <EditableSvgText
                id="grid.ctWireNote"
                x={500}
                y={240}
                text={getText('grid.ctWireNote', "Consumption CT's Wire in wireway")}
                label="คำอธิบายสาย Consumption CT"
                onOpenEdit={handleOpenEdit}
                fontSize="7"
                fill="#444"
                isEditMode={isEditMode}
              />
            </g>
          </DraggableGroup>

          {/* ========================================================================= */}
          {/* 2. CONSUMER UNIT / LOAD CENTER / MDB                                      */}
          {/* ========================================================================= */}
          <DraggableGroup
            id="load-center"
            name="ตู้ MDB / Consumer Unit"
            initialX={180}
            initialY={150}
            offset={getOffset('load-center')}
            onOffsetChange={handleOffsetChange}
            isMoveMode={isMoveMode}
          >
            {/* Box outline */}
            <rect x="0" y="0" width="265" height="155" fill="#fff" stroke="#000" strokeWidth="1.2" />
            <EditableSvgText
              id="lc.title"
              x={10}
              y={14}
              text={getText('lc.title', loadCenterConfig.title)}
              label="ชื่อตู้ MDB / Consumer Unit"
              onOpenEdit={handleOpenEdit}
              fontSize="8"
              fontWeight="bold"
              isEditMode={isEditMode}
            />

            {/* Main Breaker */}
            <CircuitBreakerSymbol
              x={132}
              y={40}
              poles={is3Phase ? 3 : 2}
              label={getText('lc.mainBreaker', loadCenterConfig.mainBreaker.split('IC')[0] || loadCenterConfig.mainBreaker)}
              sublabel={loadCenterConfig.mainBreaker.includes('IC') ? `IC ${loadCenterConfig.mainBreaker.split('IC')[1]}` : ''}
            />

            {/* Main Busbar */}
            <line x1="30" y1="75" x2="235" y2="75" stroke="#000" strokeWidth="2.5" />
            <line x1="132" y1="58" x2="132" y2="75" stroke="#000" strokeWidth="1.8" />

            {/* Branch Loads (Customer House Loads) */}
            {[45, 75, 105, 135].map((bx, i) => (
              <g key={i} transform={`translate(${bx}, 75)`}>
                <line x1="0" y1="0" x2="0" y2="15" stroke="#000" strokeWidth="1.2" />
                <CircuitBreakerSymbol x={0} y={25} poles={1} alignFromLeft={false} />
                <line x1="0" y1="43" x2="0" y2="55" stroke="#000" strokeWidth="1.2" />
                <path d="M 0 55 L -4 63 L 4 63 Z" fill="#000" />
                <text x="0" y="73" fontFamily="Arial, sans-serif" fontSize="6.5" textAnchor="middle" fill="#000">
                  LOAD
                </text>
              </g>
            ))}

            {/* Solar Feeder Breaker */}
            <g transform="translate(195, 75)">
              <line x1="0" y1="0" x2="0" y2="15" stroke="#000" strokeWidth="1.5" />
              <CircuitBreakerSymbol
                x={0}
                y={25}
                poles={is3Phase ? 3 : 2}
                alignFromLeft={false}
                label={getText('lc.solarFeeder', loadCenterConfig.solarFeederBreaker.split('IC')[0] || loadCenterConfig.solarFeederBreaker)}
              />
              {/* Feeder line out of Load Center towards Solar Combiner Box */}
              <line x1="0" y1="43" x2="0" y2="80" stroke="#000" strokeWidth="1.8" />
            </g>

            {/* Neutral & Ground Busbar details */}
            <g transform="translate(235, 120)">
              <line x1="0" y1="0" x2="35" y2="0" stroke="#000" strokeWidth="1.5" />
              <GroundSymbol x={35} y={0} size={14} />
              <EditableSvgText
                id="lc.groundCable"
                x={45}
                y={10}
                text={getText('lc.groundCable', combinerConfig.groundCableSpec)}
                label="สเปกสายกราวด์ MDB"
                onOpenEdit={handleOpenEdit}
                fontSize="7"
                isEditMode={isEditMode}
              />
              <EditableSvgText
                id="lc.groundRod"
                x={45}
                y={22}
                text={getText('lc.groundRod', loadCenterConfig.groundRodSpec)}
                label="สเปก Ground Rod MDB"
                onOpenEdit={handleOpenEdit}
                fontSize="6.5"
                fill="#444"
                isEditMode={isEditMode}
              />
            </g>
          </DraggableGroup>

          {/* Cable Callout: Load Center to Solar Combiner Box */}
          <DraggableGroup
            id="cable-lc-to-cb"
            name="ป้ายสายเชื่อม MDB ไปยัง Combiner"
            initialX={180}
            initialY={315}
            offset={getOffset('cable-lc-to-cb')}
            onOffsetChange={handleOffsetChange}
            isMoveMode={isMoveMode}
          >
            <line x1="195" y1="-10" x2="195" y2="40" stroke="#000" strokeWidth="1.8" />
            <EditableSvgText
              id="cable.cbToMdb"
              x={0}
              y={15}
              text={getText('cable.cbToMdb', combinerConfig.cableCombinerToMdb)}
              label="สเปกสาย Combiner ไปยัง MDB"
              onOpenEdit={handleOpenEdit}
              fontSize="8"
              fontWeight="bold"
              isEditMode={isEditMode}
            />
            <EditableSvgText
              id="cable.boundaryNote"
              x={0}
              y={28}
              text={getText('cable.boundaryNote', 'ระบบไฟฟ้าเดิมของผู้ใช้ไฟฟ้า ────► ระบบโซลาร์เซลล์')}
              label="คำอธิบายทิศทางการเชื่อมต่อ"
              onOpenEdit={handleOpenEdit}
              fontSize="7"
              fill="#444"
              isEditMode={isEditMode}
            />
          </DraggableGroup>

          {/* ========================================================================= */}
          {/* 3. SOLAR CELL COMBINER BOX (PRISTINE ALIGNMENT & AMPLE MARGINS)           */}
          {/* ========================================================================= */}
          <DraggableGroup
            id="solar-combiner"
            name="ตู้ Solar Combiner Box"
            initialX={180}
            initialY={355}
            offset={getOffset('solar-combiner')}
            onOffsetChange={handleOffsetChange}
            isMoveMode={isMoveMode}
          >
            {/* Main Box Outline */}
            <rect x="0" y="0" width="370" height="205" fill="#fff" stroke="#000" strokeWidth="1.5" />
            <EditableSvgText
              id="cb.title"
              x={12}
              y={16}
              text={getText('cb.title', isMicro ? 'Solar Cell Combiner Box' : 'Solar DC/AC Combiner & Distribution Box')}
              label="ชื่อตู้ Combiner Box"
              onOpenEdit={handleOpenEdit}
              fontSize="8.5"
              fontWeight="bold"
              isEditMode={isEditMode}
            />

            {/* AC SPD */}
            <g transform="translate(45, 60)">
              <SpdSymbol
                x={0}
                y={0}
                label={getText('cb.spdLabel', combinerConfig.acSpdRating.split('TYPE')[0] || 'AC SPD')}
                typeText={getText('cb.spdType', 'TYPE II 20/40kA')}
              />
              <line x1="0" y1="-40" x2="0" y2="-20" stroke="#000" strokeWidth="1.2" />
              <line x1="0" y1="20" x2="0" y2="50" stroke="#000" strokeWidth="1.2" />
              <GroundSymbol x={0} y={50} size={12} />
            </g>

            {/* Interconnecting Line to SPD */}
            <line x1="45" y1="20" x2="145" y2="20" stroke="#000" strokeWidth="1.5" />

            {/* Main Circuit Protection Line & Breakers */}
            <g transform="translate(145, 20)">
              {/* IEEE Relay Circles (POSITIONED COMFORTABLY ON LEFT WITH PLENTY OF MARGIN) */}
              <g transform="translate(-40, 25)">
                {/* Dashed sensing link line to breaker */}
                <line x1="0" y1="0" x2="40" y2="0" stroke="#000" strokeWidth="1" strokeDasharray="2.5 2" />
                <circle cx="40" cy="0" r="2" fill="#000" />

                <RelayCircle cx={-22} cy={-11} radius={8.5} code="50" />
                <RelayCircle cx={0} cy={-11} radius={8.5} code="50N" />
                <RelayCircle cx={-22} cy={11} radius={8.5} code="51" />
                <RelayCircle cx={0} cy={11} radius={8.5} code="51N" />
              </g>

              {/* Top incoming line to RCBO */}
              <line x1="0" y1="0" x2="0" y2="7" stroke="#000" strokeWidth="1.8" />

              {/* RCBO Symbol */}
              <CircuitBreakerSymbol
                x={0}
                y={25}
                poles={is3Phase ? 4 : 2}
                alignFromLeft={true}
                label={getText('cb.rcboRating', combinerConfig.rcboRating)}
                sublabel={getText('cb.rcboType', combinerConfig.rcboType)}
              />

              {/* Line connecting RCBO to MCB */}
              <line x1="0" y1="43" x2="0" y2="82" stroke="#000" strokeWidth="1.8" />

              {/* MCB / Isolator Symbol */}
              <CircuitBreakerSymbol
                x={0}
                y={100}
                poles={is3Phase ? 3 : 2}
                alignFromLeft={true}
                label={getText('cb.mcbRating', combinerConfig.mcbRating)}
              />

              {/* Line connecting MCB downward */}
              <line x1="0" y1="118" x2="0" y2={is3Phase ? 142 : 185} stroke="#000" strokeWidth="1.8" />

              {/* MCCB Main Isolator (for 3-Phase systems) */}
              {is3Phase && (
                <g transform="translate(0, 150)">
                  <CircuitBreakerSymbol
                    x={0}
                    y={10}
                    poles={3}
                    alignFromLeft={true}
                    label={getText('cb.mccbRating', combinerConfig.mccbRating)}
                  />
                  <line x1="0" y1="28" x2="0" y2="45" stroke="#000" strokeWidth="1.8" />
                </g>
              )}
            </g>

            {/* Gateway & Zero Export Controller Box */}
            <g transform="translate(250, 45)">
              <rect x="0" y="0" width="95" height="55" fill="#fff" stroke="#000" strokeWidth="1.2" />
              <text x="47" y="14" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#000">
                {inverterConfig.brand}
              </text>
              <text x="47" y="25" fontFamily="Arial, sans-serif" fontSize="6.5" textAnchor="middle" fill="#000">
                Gateway
              </text>
              <text x="47" y="36" fontFamily="Arial, sans-serif" fontSize="6" textAnchor="middle" fill="#000">
                POWER SENSOR
              </text>
              <text x="47" y="47" fontFamily="Arial, sans-serif" fontSize="6" textAnchor="middle" fill="#000">
                & Zero Export Controller
              </text>

              {/* Production CTs */}
              <g transform="translate(-10, 80)">
                <CtSymbol cx={0} cy={0} label="Production CT's" />
                <EditableSvgText
                  id="cb.productionCt"
                  x={14}
                  y={12}
                  text={getText('cb.productionCt', combinerConfig.productionCt)}
                  label="Production CT Spec"
                  onOpenEdit={handleOpenEdit}
                  fontSize="6.5"
                  isEditMode={isEditMode}
                />
              </g>

              {/* Phase Coupler (if 3-Phase Enphase) */}
              {combinerConfig.hasPhaseCoupler && (
                <g transform="translate(-5, 115)">
                  <rect x="0" y="0" width="105" height="18" fill="#fff" stroke="#000" strokeWidth="1" />
                  <EditableSvgText
                    id="cb.phaseCoupler"
                    x={52}
                    y={12}
                    text={getText('cb.phaseCoupler', combinerConfig.phaseCoupler)}
                    label="Phase Coupler Model"
                    onOpenEdit={handleOpenEdit}
                    fontSize="6.5"
                    textAnchor="middle"
                    isEditMode={isEditMode}
                  />
                </g>
              )}
            </g>

            {/* Grounding Rod Connection */}
            <g transform="translate(370, 160)">
              <line x1="0" y1="0" x2="35" y2="0" stroke="#000" strokeWidth="1.5" />
              <GroundSymbol x={35} y={0} size={14} />
              <EditableSvgText
                id="cb.groundRod"
                x={45}
                y={8}
                text={getText('cb.groundRod', combinerConfig.groundRodSpec)}
                label="Ground Rod Spec Combiner"
                onOpenEdit={handleOpenEdit}
                fontSize="7"
                isEditMode={isEditMode}
              />
              <EditableSvgText
                id="cb.groundCable"
                x={45}
                y={18}
                text={getText('cb.groundCable', combinerConfig.groundCableSpec)}
                label="Ground Cable Spec Combiner"
                onOpenEdit={handleOpenEdit}
                fontSize="6.5"
                fill="#444"
                isEditMode={isEditMode}
              />
            </g>
          </DraggableGroup>

          {/* Cable Callout: Combiner Box to Inverter / PV Branch */}
          <DraggableGroup
            id="cable-cb-to-inv"
            name="ป้ายสายเชื่อม Combiner ไปยัง PV Branch"
            initialX={180}
            initialY={565}
            offset={getOffset('cable-cb-to-inv')}
            onOffsetChange={handleOffsetChange}
            isMoveMode={isMoveMode}
          >
            <line x1="145" y1="-10" x2="145" y2="40" stroke="#000" strokeWidth="1.8" />
            <EditableSvgText
              id="cable.invToCb"
              x={-40}
              y={20}
              text={getText('cable.invToCb', combinerConfig.cableInverterToCombiner)}
              label="สเปกสาย Inverter ไปยัง Combiner"
              onOpenEdit={handleOpenEdit}
              fontSize="8"
              fontWeight="bold"
              isEditMode={isEditMode}
            />
          </DraggableGroup>

          {/* ========================================================================= */}
          {/* 4. LOWER SECTION: PV BRANCH & INVERTERS (Microinverter or String)         */}
          {/* ========================================================================= */}
          {isMicro ? (
            /* ------------------------------------------------------------- */
            /* MICROINVERTER SYSTEM (Enphase / ATMOCE)                       */
            /* ------------------------------------------------------------- */
            <DraggableGroup
              id="micro-pv-branch"
              name="บล็อกแผงโซลาร์ & ไมโครอินเวอร์เตอร์"
              initialX={120}
              initialY={620}
              offset={getOffset('micro-pv-branch')}
              onOffsetChange={handleOffsetChange}
              isMoveMode={isMoveMode}
            >
              {/* Header: PV Branch */}
              <EditableSvgText
                id="pv.branchHeader"
                x={20}
                y={0}
                text={getText('pv.branchHeader', `PV Branch #1 | ${pvConfig.panelCount} MODULE`)}
                label="หัวข้อ PV Branch"
                onOpenEdit={handleOpenEdit}
                fontSize="8.5"
                fontWeight="bold"
                isEditMode={isEditMode}
              />

              {/* Q-Cable Main Bus Line */}
              <line x1="20" y1="85" x2="490" y2="85" stroke="#000" strokeWidth="2" />
              <EditableSvgText
                id="pv.qCableSpec"
                x={240}
                y={102}
                text={getText(
                  'pv.qCableSpec',
                  is3Phase ? 'Enphase Q cable 4x4C (25A)' : '1x2C - Enphase Q cable (25A max)'
                )}
                label="สเปก Q-Cable"
                onOpenEdit={handleOpenEdit}
                fontSize="7.5"
                isEditMode={isEditMode}
              />
              <text x="5" y="90" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
                {is3Phase ? '3L+N' : 'L+N'}
              </text>
              <text x="5" y="55" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
                GND
              </text>

              {/* Ground Line */}
              <line x1="20" y1="50" x2="490" y2="50" stroke="#000" strokeWidth="1" strokeDasharray="3 2" />

              {/* Render Visual Panels & Attached Microinverters */}
              {(() => {
                const total = pvConfig.panelCount;
                const displayPanels =
                  total <= 5
                    ? Array.from({ length: total }, (_, i) => String(i + 1).padStart(2, '0'))
                    : ['01', '02', '03', '...', String(total).padStart(2, '0')];

                return displayPanels.map((pLabel, idx) => {
                  const px = 45 + idx * 75;

                  if (pLabel === '...') {
                    return (
                      <g key={idx} transform={`translate(${px + 20}, 40)`}>
                        <text x="0" y="0" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#555">
                          • • •
                        </text>
                      </g>
                    );
                  }

                  return (
                    <g key={idx} transform={`translate(${px}, 10)`}>
                      {/* PV Solar Panel */}
                      <rect x="0" y="0" width="38" height="42" fill="#fff" stroke="#000" strokeWidth="1.2" />
                      <line x1="0" y1="21" x2="38" y2="21" stroke="#000" strokeWidth="0.8" />
                      <line x1="19" y1="0" x2="19" y2="42" stroke="#000" strokeWidth="0.8" />
                      <text x="19" y="-4" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#000">
                        {pLabel}
                      </text>

                      {/* Microinverter Box Attached Underneath */}
                      <rect x="2" y="46" width="34" height="24" fill="#fff" stroke="#000" strokeWidth="1.2" />
                      <line x1="2" y1="46" x2="36" y2="70" stroke="#000" strokeWidth="0.8" />
                      {/* DC lines from Panel to Inverter */}
                      <line x1="10" y1="42" x2="10" y2="46" stroke="#000" strokeWidth="1" />
                      <line x1="28" y1="42" x2="28" y2="46" stroke="#000" strokeWidth="1" />

                      {/* AC connection from Inverter to Q-Cable bus */}
                      <line x1="19" y1="70" x2="19" y2="75" stroke="#000" strokeWidth="1.5" />
                      <circle cx="19" cy="75" r="2" fill="#000" />
                      {is3Phase && (
                        <text x="19" y="83" fontFamily="Arial, sans-serif" fontSize="6" textAnchor="middle" fill="#000">
                          {idx % 3 === 0 ? 'L1' : idx % 3 === 1 ? 'L2' : 'L3'}
                        </text>
                      )}
                    </g>
                  );
                });
              })()}

              {/* Microinverter & PV Specs Callout */}
              <g transform="translate(0, 115)">
                <EditableSvgText
                  id="pv.moduleCountNote"
                  x={20}
                  y={15}
                  text={getText(
                    'pv.moduleCountNote',
                    `Number of PV Module = ${pvConfig.panelCount} Module, Maximum Power at ${pvConfig.powerPerPanel} Wp`
                  )}
                  label="ข้อความจำนวนและกำลังแผง"
                  onOpenEdit={handleOpenEdit}
                  fontSize="8.5"
                  isEditMode={isEditMode}
                />
                <EditableSvgText
                  id="pv.totalPowerNote"
                  x={20}
                  y={30}
                  text={getText('pv.totalPowerNote', `PV System Power = ${pvConfig.totalKwp} kWp`)}
                  label="ข้อความ PV System Power"
                  onOpenEdit={handleOpenEdit}
                  fontSize="8.5"
                  fontWeight="bold"
                  isEditMode={isEditMode}
                />
                <EditableSvgText
                  id="pv.acPeakNote"
                  x={20}
                  y={48}
                  text={getText(
                    'pv.acPeakNote',
                    `AC output power (peak) = ${inverterConfig.microinverterCount} Module x ${inverterConfig.unitPowerVa}VA = ${inverterConfig.totalOutputKva} kVA (${inverterConfig.totalOutputKw} kW)`
                  )}
                  label="ข้อความ AC Output Power Peak"
                  onOpenEdit={handleOpenEdit}
                  fontSize="9.5"
                  fontWeight="bold"
                  isEditMode={isEditMode}
                />
              </g>
            </DraggableGroup>
          ) : (
            /* ------------------------------------------------------------- */
            /* STRING INVERTER SYSTEM (Huawei SUN2000)                       */
            /* ------------------------------------------------------------- */
            <DraggableGroup
              id="string-pv-branch"
              name="บล็อก String Inverter & DC Box"
              initialX={120}
              initialY={610}
              offset={getOffset('string-pv-branch')}
              onOffsetChange={handleOffsetChange}
              isMoveMode={isMoveMode}
            >
              {/* Header: PV Array Strings */}
              <EditableSvgText
                id="string.arrayHeader"
                x={20}
                y={0}
                text={getText(
                  'string.arrayHeader',
                  `PV Array (${inverterConfig.stringCount} String(s) x ${inverterConfig.modulesPerString} Modules = ${pvConfig.panelCount} Modules)`
                )}
                label="หัวข้อ PV Array String"
                onOpenEdit={handleOpenEdit}
                fontSize="8.5"
                fontWeight="bold"
                isEditMode={isEditMode}
              />

              {/* DC Protection Box */}
              <rect x="20" y="15" width="220" height="90" fill="#fff" stroke="#000" strokeWidth="1.2" strokeDasharray="3 2" />
              <text x="30" y="30" fontFamily="Arial, sans-serif" fontSize="7.5" fontWeight="bold" fill="#000">
                Solar DC Combiner & Protection
              </text>

              {/* DC Fuse & Isolator */}
              <g transform="translate(45, 55)">
                <rect x="0" y="-12" width="25" height="14" fill="#fff" stroke="#000" strokeWidth="1" />
                <line x1="-8" y1="-5" x2="33" y2="-5" stroke="#000" strokeWidth="1.2" />
                <text x="12" y="12" fontFamily="Arial, sans-serif" fontSize="6.5" textAnchor="middle" fill="#000">
                  DC FUSE
                </text>
              </g>
              <g transform="translate(105, 55)">
                <line x1="0" y1="-12" x2="0" y2="2" stroke="#000" strokeWidth="1.2" />
                <line x1="0" y1="2" x2="6" y2="18" stroke="#000" strokeWidth="1.5" />
                <text x="0" y="28" fontFamily="Arial, sans-serif" fontSize="6.5" textAnchor="middle" fill="#000">
                  DC ISOLATOR
                </text>
              </g>
              <g transform="translate(165, 55)">
                <SpdSymbol x={0} y={0} label="DC SPD" typeText="1000V DC" />
              </g>

              {/* Inverter Unit Box (Huawei SUN2000) */}
              <g transform="translate(270, 15)">
                <rect x="0" y="0" width="200" height="90" fill="#fff" stroke="#000" strokeWidth="1.8" />
                <rect x="5" y="5" width="190" height="20" fill="#f1f5f9" stroke="#000" strokeWidth="0.8" />
                <EditableSvgText
                  id="string.invTitle"
                  x={100}
                  y={18}
                  text={getText('string.invTitle', `${inverterConfig.brand} ${inverterConfig.model}`)}
                  label="ชื่อและรุ่น Inverter ในกล่อง"
                  onOpenEdit={handleOpenEdit}
                  fontSize="8.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  isEditMode={isEditMode}
                />
                <EditableSvgText
                  id="string.ratedPower"
                  x={15}
                  y={42}
                  text={getText('string.ratedPower', `• Rated AC Power: ${inverterConfig.stringInverterCapacityKw} kW`)}
                  label="Rated AC Power Inverter"
                  onOpenEdit={handleOpenEdit}
                  fontSize="7"
                  isEditMode={isEditMode}
                />
                <EditableSvgText
                  id="string.apparentPower"
                  x={15}
                  y={55}
                  text={getText('string.apparentPower', `• Max AC Apparent Power: ${(inverterConfig.unitPowerVa / 1000).toFixed(1)} kVA`)}
                  label="Max AC Apparent Power"
                  onOpenEdit={handleOpenEdit}
                  fontSize="7"
                  isEditMode={isEditMode}
                />
                <text x="15" y="68" fontFamily="Arial, sans-serif" fontSize="7" fill="#000">
                  • Built-in Anti-Islanding Protection
                </text>
                <text x="15" y="81" fontFamily="Arial, sans-serif" fontSize="7" fill="#000">
                  • Output: {is3Phase ? '3P 380/400V (L1,L2,L3,N,PE)' : '1P 220/230V (L,N,PE)'}
                </text>
              </g>

              {/* DC and AC connection wires */}
              <line x1="240" y1="60" x2="270" y2="60" stroke="#000" strokeWidth="1.8" />
              <line x1="470" y1="60" x2="520" y2="60" stroke="#000" strokeWidth="2" />
              <line x1="520" y1="60" x2="520" y2="-60" stroke="#000" strokeWidth="2" />
              <line x1="520" y1="-60" x2="325" y2="-60" stroke="#000" strokeWidth="2" />

              {/* Specs summary text */}
              <g transform="translate(20, 115)">
                <EditableSvgText
                  id="string.summaryModules"
                  x={0}
                  y={15}
                  text={getText(
                    'string.summaryModules',
                    `Number of PV Module = ${pvConfig.panelCount} Module, Maximum Power at ${pvConfig.powerPerPanel} Wp`
                  )}
                  label="ข้อความสรุปจำนวนและกำลังแผง"
                  onOpenEdit={handleOpenEdit}
                  fontSize="8.5"
                  isEditMode={isEditMode}
                />
                <EditableSvgText
                  id="string.summaryPower"
                  x={0}
                  y={30}
                  text={getText(
                    'string.summaryPower',
                    `PV System Power = ${pvConfig.totalKwp} kWp | Inverter Output = ${inverterConfig.totalOutputKw} kW`
                  )}
                  label="ข้อความสรุปกำลังติดตั้งโซลาร์และเอาต์พุต"
                  onOpenEdit={handleOpenEdit}
                  fontSize="8.5"
                  fontWeight="bold"
                  isEditMode={isEditMode}
                />
              </g>
            </DraggableGroup>
          )}

          {/* ========================================================================= */}
          {/* 5. MAIN DRAWING BANNER TITLE (Bottom Left / Center)                       */}
          {/* ========================================================================= */}
          <DraggableGroup
            id="banner-title"
            name="ชื่อหัวกระดาษแบบหลัก (Banner Title)"
            initialX={100}
            initialY={875}
            offset={getOffset('banner-title')}
            onOffsetChange={handleOffsetChange}
            isMoveMode={isMoveMode}
          >
            <EditableSvgText
              id="banner.mainTitle"
              x={350}
              y={0}
              text={getText('banner.mainTitle', 'Electrical Single Line Diagram Solar Roof Top - ON GRID')}
              label="หัวข้อแบบหลัก (Drawing Banner)"
              onOpenEdit={handleOpenEdit}
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
              isEditMode={isEditMode}
            />
            <EditableSvgText
              id="banner.subTitle"
              x={350}
              y={18}
              text={getText(
                'banner.subTitle',
                isMicro
                  ? `AC output power (peak) = ${inverterConfig.microinverterCount} Module x ${inverterConfig.unitPowerVa} VA = ${inverterConfig.totalOutputKva} kVA`
                  : `Total Solar Installed Capacity = ${pvConfig.totalKwp} kWp | AC Output = ${inverterConfig.totalOutputKw} kW`
              )}
              label="คำอธิบายใต้หัวข้อแบบหลัก"
              onOpenEdit={handleOpenEdit}
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              fill="#222"
              isEditMode={isEditMode}
            />
          </DraggableGroup>

          {/* ========================================================================= */}
          {/* 6. TECHNICAL SPECS, RELAY TABLE & PEA NOTES (Middle/Bottom Right)         */}
          {/* ========================================================================= */}
          <DraggableGroup
            id="specs-notes"
            name="ตารางสเปก, Relay Code & โน้ต กฟภ."
            initialX={SPECS_X}
            initialY={SPECS_Y}
            offset={getOffset('specs-notes')}
            onOffsetChange={handleOffsetChange}
            isMoveMode={isMoveMode}
          >
            <TechnicalNotesAndSpecs
              project={project}
              x={0}
              y={0}
              isEditMode={isEditMode}
              onOpenEdit={handleOpenEdit}
            />
          </DraggableGroup>

          {/* ========================================================================= */}
          {/* 7. TITLE BLOCK (Full Height Right Column)                                 */}
          {/* ========================================================================= */}
          <TitleBlock
            project={project}
            x={TB_X}
            y={TB_Y}
            width={TB_WIDTH}
            height={TB_HEIGHT}
            isEditMode={isEditMode}
            onOpenEdit={handleOpenEdit}
          />
        </svg>
      </div>

      {/* Direct Rich Text Edit Modal */}
      <TextEditModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((s) => ({ ...s, isOpen: false }))}
        title={modalState.label}
        initialValue={modalState.text}
        onSave={handleSaveText}
        onReset={handleResetSingleText}
      />
    </div>
  );
};

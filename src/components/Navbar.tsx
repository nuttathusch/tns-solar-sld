import React from 'react';
import type { SolarSLDProject } from '../types/solar';
import { DEFAULT_PRESETS } from '../constants/presets';
import {
  FolderOpen,
  Save,
  Copy,
  Download,
  Printer,
  FileCode,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Edit3,
  Move,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NavbarProps {
  project: SolarSLDProject;
  savedCount: number;
  onOpenProjectManager: () => void;
  onQuickSave: () => void;
  onMakeCopy: () => void;
  onSelectPreset: (preset: SolarSLDProject) => void;
  onExportPdf: () => void;
  onExportSvg: () => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  isExporting: boolean;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  isMoveMode: boolean;
  setIsMoveMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  project,
  savedCount,
  onOpenProjectManager,
  onQuickSave,
  onMakeCopy,
  onSelectPreset,
  onExportPdf,
  onExportSvg,
  zoom,
  setZoom,
  isExporting,
  isEditMode,
  setIsEditMode,
  isMoveMode,
  setIsMoveMode,
}) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.1 },
    });
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-slate-100 px-3 py-2 flex flex-wrap items-center justify-between shadow-md z-20 gap-2">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-sm shadow-inner">
          TNS
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wide flex items-center gap-1.5 text-slate-100">
            <span>TNS Solar SLD</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.2 rounded border border-amber-500/30">
              PEA / MEA
            </span>
          </h1>
          <p className="text-[10px] text-slate-400">ระบบสร้างแบบไฟฟ้าโซลาร์เซลล์ (3-200 kW)</p>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">⚡ Preset:</span>
        <select
          value={project.id}
          onChange={(e) => {
            const found = DEFAULT_PRESETS.find((p) => p.id === e.target.value);
            if (found) {
              onSelectPreset(found);
              triggerConfetti();
            }
          }}
          className="bg-slate-900 border border-slate-700 text-amber-300 font-medium text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer shadow-sm max-w-[180px] sm:max-w-[220px] truncate"
        >
          {DEFAULT_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* CAD Interactive Modes (Text Edit & Drag Move) */}
      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          title="เปิด/ปิด โหมดคลิกแก้ไขข้อความได้โดยตรงในแบบ"
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
            isEditMode
              ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Edit3 size={13} />
          <span>{isEditMode ? '✏️ แก้ไขข้อความ (เปิด)' : '✏️ แก้ไขข้อความ'}</span>
        </button>

        <button
          onClick={() => setIsMoveMode(!isMoveMode)}
          title="เปิด/ปิด โหมดลากขยับตำแหน่งบล็อกและข้อความ CAD"
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
            isMoveMode
              ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/20 animate-pulse'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Move size={13} />
          <span>{isMoveMode ? '🖐️ โหมดลาก CAD (เปิด)' : '🖐️ โหมดลาก CAD'}</span>
        </button>
      </div>

      {/* Project Management Buttons (Saved in Web, Open, Make a Copy) */}
      <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
        {/* Open Project Manager Modal */}
        <button
          onClick={onOpenProjectManager}
          title="เปิดคลังแบบที่เคยทำไว้ในเว็บ"
          className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold px-2.5 py-1.5 rounded-lg border border-amber-500/30 transition shadow-sm"
        >
          <FolderOpen size={14} className="text-amber-400" />
          <span>คลังแบบ</span>
          {savedCount > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {savedCount}
            </span>
          )}
        </button>

        {/* Quick Save */}
        <button
          onClick={onQuickSave}
          title="บันทึกแบบปัจจุบันไว้ในเว็บ"
          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <Save size={13} className="text-emerald-400" />
          <span className="hidden md:inline">บันทึก</span>
        </button>

        {/* Make a Copy / Clone */}
        <button
          onClick={onMakeCopy}
          title="ทำสำเนา (Make a copy) จากแบบนี้ เพื่อไปแก้ไขเป็นหลังใหม่"
          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <Copy size={13} className="text-sky-400" />
          <span className="hidden md:inline">ทำสำเนา</span>
        </button>
      </div>

      {/* Zoom and Canvas Controls */}
      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
        <button
          onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(1))))}
          title="Zoom Out"
          className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition"
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-[11px] font-mono font-medium text-slate-300 px-1 w-9 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(2.0, Number((z + 0.1).toFixed(1))))}
          title="Zoom In"
          className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={() => setZoom(0.85)}
          title="Fit to View"
          className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition border-l border-slate-800 pl-1.5"
        >
          <Maximize2 size={13} />
        </button>
      </div>

      {/* Export & Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => window.print()}
          title="พิมพ์เอกสาร / Print"
          className="p-1.5 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg border border-slate-800 transition"
        >
          <Printer size={14} />
        </button>

        <button
          onClick={onExportSvg}
          title="Export เป็นไฟล์ SVG Vector"
          className="p-1.5 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded-lg border border-slate-800 transition"
        >
          <FileCode size={14} />
        </button>

        {/* Master PDF Export Button */}
        <button
          onClick={onExportPdf}
          disabled={isExporting}
          className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-amber-500/20 transition transform active:scale-95 disabled:opacity-50"
        >
          <Download size={14} />
          <span>{isExporting ? 'กำลังสร้าง PDF...' : 'Export PDF (A3)'}</span>
        </button>
      </div>
    </header>
  );
};

import React, { useRef } from 'react';
import type { SolarSLDProject } from '../types/solar';
import { DEFAULT_PRESETS } from '../constants/presets';
import {
  Download,
  Printer,
  FileCode,
  FolderOpen,
  Save,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NavbarProps {
  project: SolarSLDProject;
  onSelectPreset: (preset: SolarSLDProject) => void;
  onExportPdf: () => void;
  onExportSvg: () => void;
  onSaveJson: () => void;
  onLoadJson: (data: SolarSLDProject) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  isExporting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  project,
  onSelectPreset,
  onExportPdf,
  onExportSvg,
  onSaveJson,
  onLoadJson,
  zoom,
  setZoom,
  isExporting,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          onLoadJson(parsed);
        } catch (err) {
          alert('ไม่สามารถเปิดไฟล์ JSON นี้ได้');
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.1 },
    });
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-slate-100 px-4 py-2.5 flex items-center justify-between shadow-md z-20">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-sm shadow-inner">
          TNS
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wide flex items-center gap-1.5 text-slate-100">
            <span>TNS Solar SLD Generator</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.5 rounded border border-amber-500/30">
              PEA / MEA
            </span>
          </h1>
          <p className="text-[11px] text-slate-400">ระบบสร้างแบบไฟฟ้าโซลาร์เซลล์อัตโนมัติ (3 kW - 200 kW)</p>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium hidden md:inline">⚡ Preset:</span>
        <select
          value={project.id}
          onChange={(e) => {
            const found = DEFAULT_PRESETS.find((p) => p.id === e.target.value);
            if (found) {
              onSelectPreset(found);
              triggerConfetti();
            }
          }}
          className="bg-slate-900 border border-slate-700 text-amber-300 font-medium text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer shadow-sm max-w-[260px] truncate"
        >
          {DEFAULT_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Zoom and Canvas Controls */}
      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
        <button
          onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(1))))}
          title="Zoom Out"
          className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition"
        >
          <ZoomOut size={15} />
        </button>
        <span className="text-[11px] font-mono font-medium text-slate-300 px-1 w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(2.0, Number((z + 0.1).toFixed(1))))}
          title="Zoom In"
          className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition"
        >
          <ZoomIn size={15} />
        </button>
        <button
          onClick={() => setZoom(0.85)}
          title="Fit to View"
          className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition border-l border-slate-800 pl-1.5"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Export & Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSaveJson}
          title="บันทึกไฟล์โปรเจกต์ (JSON)"
          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <Save size={13} />
          <span className="hidden lg:inline">Save</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          title="เปิดไฟล์โปรเจกต์ (JSON)"
          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <FolderOpen size={13} />
          <span className="hidden lg:inline">Load</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => window.print()}
          title="พิมพ์เอกสาร / Print"
          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <Printer size={13} />
          <span className="hidden lg:inline">พิมพ์</span>
        </button>

        <button
          onClick={onExportSvg}
          title="Export เป็นไฟล์ SVG Vector"
          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <FileCode size={13} />
          <span className="hidden lg:inline">SVG</span>
        </button>

        {/* Master PDF Export Button */}
        <button
          onClick={onExportPdf}
          disabled={isExporting}
          className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg shadow-lg shadow-amber-500/20 transition transform active:scale-95 disabled:opacity-50"
        >
          <Download size={14} />
          <span>{isExporting ? 'กำลังสร้าง PDF...' : 'Export PDF (A3)'}</span>
        </button>
      </div>
    </header>
  );
};

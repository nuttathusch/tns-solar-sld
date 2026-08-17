import { useState, useRef, useEffect } from 'react';
import type { SolarSLDProject } from './types/solar';
import { DEFAULT_PRESETS } from './constants/presets';
import { Navbar } from './components/Navbar';
import { ProjectForm } from './components/ProjectForm';
import { SldCanvas } from './components/SldCanvas';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { exportSvgToPdf, exportSvgToFile } from './utils/pdfExport';
import {
  getSavedProjects,
  saveProjectToStorage,
  cloneProjectInStorage,
} from './utils/storage';
import confetti from 'canvas-confetti';

export function App() {
  const [project, setProject] = useState<SolarSLDProject>(() => {
    // If there are saved projects, load the latest one, else fallback to default preset
    const saved = getSavedProjects();
    if (saved.length > 0) {
      return saved[0].data;
    }
    return DEFAULT_PRESETS[3] || DEFAULT_PRESETS[0];
  });

  const [savedCount, setSavedCount] = useState<number>(0);
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(0.85);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const refreshSavedCount = () => {
    setSavedCount(getSavedProjects().length);
  };

  useEffect(() => {
    refreshSavedCount();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectPreset = (preset: SolarSLDProject) => {
    const clone = JSON.parse(JSON.stringify(preset));
    clone.id = `proj_${Date.now()}`;
    setProject(clone);
    showToast(`⚡ โหลด Preset "${preset.title}" เรียบร้อยแล้ว`);
  };

  const handleQuickSave = () => {
    const entry = saveProjectToStorage(project);
    refreshSavedCount();
    showToast(`💾 บันทึกโปรเจกต์ "${entry.name}" ไว้ในเว็บแล้ว`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.1 },
    });
  };

  const handleMakeCopy = () => {
    // Save current first
    const saved = saveProjectToStorage(project);
    // Then clone it
    const cloned = cloneProjectInStorage(saved.id);
    if (cloned) {
      setProject(cloned.data);
      refreshSavedCount();
      showToast(`📋 ทำสำเนาเป็น "${cloned.name}" เรียบร้อย! คุณกำลังแก้ไขไฟล์สำเนาใหม่`);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.15 },
      });
    }
  };

  const handleExportPdf = async () => {
    if (!svgRef.current) return;
    setIsExporting(true);
    try {
      const sanitizedName = (project.projectInfo.customerName || 'Solar')
        .replace(/[^a-zA-Z0-9ก-๙_-]/g, '_')
        .substring(0, 30);
      const filename = `TNS_SLD_${sanitizedName}_${project.pvConfig.totalKwp}kWp.pdf`;

      await exportSvgToPdf(svgRef.current, filename, project.paperSize || 'A3');

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.2 },
      });
      showToast(`✅ Export PDF (${project.paperSize || 'A3'}) สำเร็จแล้ว`);
    } catch (err) {
      console.error('Export PDF error:', err);
      showToast('⚠️ เกิดข้อผิดพลาดในการสร้าง PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSvg = () => {
    if (!svgRef.current) return;
    const sanitizedName = (project.projectInfo.customerName || 'Solar')
      .replace(/[^a-zA-Z0-9ก-๙_-]/g, '_')
      .substring(0, 30);
    const filename = `TNS_SLD_${sanitizedName}_${project.pvConfig.totalKwp}kWp.svg`;
    exportSvgToFile(svgRef.current, filename);
    showToast(`✅ Export SVG เรียบร้อยแล้ว`);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-14 right-6 z-50 bg-slate-900 border border-amber-500/50 text-amber-300 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl animate-in slide-in-from-top-2 duration-200 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Toolbar */}
      <Navbar
        project={project}
        savedCount={savedCount}
        onOpenProjectManager={() => setIsProjectManagerOpen(true)}
        onQuickSave={handleQuickSave}
        onMakeCopy={handleMakeCopy}
        onSelectPreset={handleSelectPreset}
        onExportPdf={handleExportPdf}
        onExportSvg={handleExportSvg}
        zoom={zoom}
        setZoom={setZoom}
        isExporting={isExporting}
      />

      {/* Main Workspace Layout */}
      <div className="main-layout-container flex flex-1 overflow-hidden">
        {/* Left Sidebar: Interactive Configuration Form */}
        <aside className="w-[380px] lg:w-[420px] h-full flex-shrink-0 border-r border-slate-800 shadow-xl z-10">
          <ProjectForm project={project} onChange={setProject} />
        </aside>

        {/* Right Canvas: Live SVG Preview */}
        <main className="flex-1 h-full overflow-auto bg-slate-900/90 flex items-center justify-center p-6 relative">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />

          {/* SVG Drawing Canvas */}
          <SldCanvas project={project} svgRef={svgRef} zoom={zoom} />
        </main>
      </div>

      {/* Project Manager Modal (คลังแบบ, เปิด, แก้ไข, Make a copy) */}
      <ProjectManagerModal
        isOpen={isProjectManagerOpen}
        onClose={() => {
          setIsProjectManagerOpen(false);
          refreshSavedCount();
        }}
        currentProject={project}
        onSelectProject={(selected) => {
          setProject(selected);
          showToast(`📂 เปิดแบบ "${selected.projectInfo.projectName || selected.projectInfo.customerName}" สำเร็จ`);
        }}
        onSaveCurrent={handleQuickSave}
      />
    </div>
  );
}

export default App;

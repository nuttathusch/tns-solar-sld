import { useState, useRef } from 'react';
import type { SolarSLDProject } from './types/solar';
import { DEFAULT_PRESETS } from './constants/presets';
import { Navbar } from './components/Navbar';
import { ProjectForm } from './components/ProjectForm';
import { SldCanvas } from './components/SldCanvas';
import { exportSvgToPdf, exportSvgToFile } from './utils/pdfExport';
import confetti from 'canvas-confetti';

export function App() {
  const [project, setProject] = useState<SolarSLDProject>(DEFAULT_PRESETS[3] || DEFAULT_PRESETS[0]);
  const [zoom, setZoom] = useState<number>(0.85);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleSelectPreset = (preset: SolarSLDProject) => {
    setProject(JSON.parse(JSON.stringify(preset)));
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
    } catch (err) {
      console.error('Export PDF error:', err);
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
  };

  const handleSaveJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    const sanitizedName = (project.projectInfo.customerName || 'Solar')
      .replace(/[^a-zA-Z0-9ก-๙_-]/g, '_')
      .substring(0, 30);
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TNS_Project_${sanitizedName}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleLoadJson = (data: SolarSLDProject) => {
    if (data && data.projectInfo && data.pvConfig && data.inverterConfig) {
      setProject(data);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.1 },
      });
    } else {
      alert('โครงสร้างไฟล์ JSON ไม่ถูกต้องสำหรับ Solar SLD');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Header Toolbar */}
      <Navbar
        project={project}
        onSelectPreset={handleSelectPreset}
        onExportPdf={handleExportPdf}
        onExportSvg={handleExportSvg}
        onSaveJson={handleSaveJson}
        onLoadJson={handleLoadJson}
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
    </div>
  );
}

export default App;

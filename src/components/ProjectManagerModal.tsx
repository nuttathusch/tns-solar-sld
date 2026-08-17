import React, { useState, useEffect, useRef } from 'react';
import type { SolarSLDProject } from '../types/solar';
import {
  type SavedProjectEntry,
  getSavedProjects,
  saveProjectToStorage,
  cloneProjectInStorage,
  deleteProjectFromStorage,
  exportAllSavedProjectsJson,
  importSavedProjectsJson,
} from '../utils/storage';
import {
  FolderOpen,
  Copy,
  Trash2,
  Download,
  Upload,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Zap,
  Building,
  X,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: SolarSLDProject;
  onSelectProject: (project: SolarSLDProject) => void;
  onSaveCurrent: () => void;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  onSelectProject,
}) => {
  const [projects, setProjects] = useState<SavedProjectEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveTitleInput, setSaveTitleInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshList = () => {
    const list = getSavedProjects();
    setProjects(list);
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
      setSaveTitleInput(
        currentProject.projectInfo.projectName ||
          `แบบของ ${currentProject.projectInfo.customerName || 'ลูกค้า'}`
      );
    }
  }, [isOpen, currentProject]);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  if (!isOpen) return null;

  // Filter projects by search
  const filtered = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.data.projectInfo.jobNo.toLowerCase().includes(q) ||
      p.data.projectInfo.drawingNo.toLowerCase().includes(q)
    );
  });

  const handleSaveCurrent = () => {
    const entry = saveProjectToStorage(currentProject, saveTitleInput.trim());
    refreshList();
    showNotification(`✅ บันทึกโปรเจกต์ "${entry.name}" เรียบร้อยแล้ว`);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.2 } });
  };

  const handleOpen = (entry: SavedProjectEntry) => {
    onSelectProject(entry.data);
    onClose();
  };

  const handleClone = (entry: SavedProjectEntry) => {
    const cloned = cloneProjectInStorage(entry.id);
    if (cloned) {
      refreshList();
      showNotification(`📋 คัดลอกสร้างสำเนา "${cloned.name}" เรียบร้อยแล้ว`);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.3 } });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบแบบ "${name}"?`)) {
      deleteProjectFromStorage(id);
      refreshList();
      showNotification(`🗑️ ลบโปรเจกต์ "${name}" แล้ว`);
    }
  };

  const handleExportSingle = (entry: SavedProjectEntry) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entry.data, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `TNS_SLD_${entry.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const raw = event.target?.result as string;
          const count = importSavedProjectsJson(raw);
          refreshList();
          showNotification(`📥 นำเข้าโปรเจกต์สำเร็จ ${count} รายการ`);
        } catch (err) {
          alert('รูปแบบไฟล์ JSON ไม่ถูกต้อง');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
              <FolderOpen size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>คลังโปรเจกต์ & แบบที่เคยทำ (Saved Projects)</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  {projects.length} แบบ
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                เปิดแก้ไข, ทำสำเนา (Make a Copy), หรือบันทึกเก็บไว้ในเว็บ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notification Banner */}
        {statusMessage && (
          <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-xs font-semibold text-amber-300 flex items-center gap-2">
            <CheckCircle2 size={14} />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Quick Save Bar */}
        <div className="p-3 bg-slate-950/50 border-b border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-300">💾 บันทึกแบบปัจจุบัน:</span>
          <input
            type="text"
            value={saveTitleInput}
            onChange={(e) => setSaveTitleInput(e.target.value)}
            placeholder="ตั้งชื่อโปรเจกต์ เช่น บ้านคุณสมชาย 5kW..."
            className="flex-1 min-w-[200px] bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleSaveCurrent}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition"
          >
            <Plus size={14} />
            <span>บันทึกลงเว็บ</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Backup buttons */}
          <button
            onClick={exportAllSavedProjectsJson}
            title="ดาวน์โหลดไฟล์สำรองข้อมูลทั้งหมด"
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <Download size={13} />
            <span>Backup ทั้งหมด</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="นำเข้าไฟล์สำรองข้อมูล"
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <Upload size={13} />
            <span>นำเข้า Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportBackup}
            className="hidden"
          />
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาตามชื่อโปรเจกต์, ชื่อลูกค้า, Job No, Drawing No..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FolderOpen size={40} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">ยังไม่มีโปรเจกต์ที่บันทึกไว้ในเบราว์เซอร์</p>
              <p className="text-xs text-slate-600 mt-1">
                คุณสามารถกดปุ่ม "บันทึกลงเว็บ" ด้านบน เพื่อเก็บแบบที่กำลังทำอยู่ไว้เปิดแก้ไขในภายหลังได้
              </p>
            </div>
          ) : (
            filtered.map((entry) => {
              const isCurrent = entry.data.id === currentProject.id;
              const formattedDate = new Date(entry.updatedAt).toLocaleString('th-TH', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              return (
                <div
                  key={entry.id}
                  className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Left info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-100">{entry.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded">
                          กำลังเปิดอยู่
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          entry.systemType === 'microinverter'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {entry.systemType === 'microinverter' ? <Zap size={10} /> : <Building size={10} />}
                        {entry.systemType === 'microinverter' ? 'Microinverter' : 'String Inverter'}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-1.5 py-0.5 rounded">
                        {entry.capacityKwp} kWp ({entry.data.inverterConfig.phase})
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                      <span>👤 เจ้าของ: <strong className="text-slate-200">{entry.customerName}</strong></span>
                      <span>📄 Drawing: <strong className="text-slate-300">{entry.data.projectInfo.drawingNo}</strong></span>
                      <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                        <Clock size={11} />
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {/* Open Button */}
                    <button
                      onClick={() => handleOpen(entry)}
                      className="flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition"
                      title="เปิดแบบนี้เพื่อแก้ไข"
                    >
                      <FileCheck size={14} />
                      <span>เปิดแก้ไข</span>
                    </button>

                    {/* Clone / Make a Copy Button */}
                    <button
                      onClick={() => handleClone(entry)}
                      className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
                      title="ทำสำเนา (Make a copy) เพื่อนำไปแก้ไขเป็นแบบใหม่"
                    >
                      <Copy size={13} />
                      <span>ทำสำเนา (Copy)</span>
                    </button>

                    {/* Export Single JSON */}
                    <button
                      onClick={() => handleExportSingle(entry)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                      title="ดาวน์โหลด JSON"
                    >
                      <Download size={14} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(entry.id, entry.name)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="ลบโปรเจกต์นี้"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            💡 <strong>เคล็ดลับ:</strong> ข้อมูลจะถูกบันทึกไว้ในเว็บเบราว์เซอร์ของเครื่องนี้ สามารถกด "ทำสำเนา (Copy)" เพื่อโคลนโปรเจกต์ไปสร้างบ้านหลังใหม่ได้ในคลิกเดียว
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

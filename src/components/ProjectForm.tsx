import React, { useState } from 'react';
import type {
  SolarSLDProject,
  PhaseType,
  GridAuthority,
} from '../types/solar';
import {
  PV_MODULE_DATABASE,
  INVERTER_DATABASE,
  STANDARD_ENGINEERS,
} from '../constants/equipment';
import {
  calculatePVTotal,
  calculateInverterOutput,
  calculateElectricalSizing,
} from '../utils/calc';
import {
  Sun,
  Zap,
  ShieldCheck,
  FileText,
  UserCheck,
  Layers,
  Wand2,
} from 'lucide-react';

interface ProjectFormProps {
  project: SolarSLDProject;
  onChange: (updated: SolarSLDProject) => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ project, onChange }) => {
  const [activeTab, setActiveTab] = useState<'system' | 'pv' | 'inverter' | 'protection' | 'info' | 'engineer'>('system');

  const updateProject = (updater: (prev: SolarSLDProject) => SolarSLDProject) => {
    onChange(updater(project));
  };

  // Quick auto-sizing action
  const handleAutoSizing = () => {
    const { totalKva } = calculateInverterOutput(project.inverterConfig);
    const sizing = calculateElectricalSizing(
      project.inverterConfig.phase,
      totalKva
    );

    updateProject((prev) => ({
      ...prev,
      combinerConfig: {
        ...prev.combinerConfig,
        rcboRating: `RCBO ${prev.inverterConfig.phase === '3P' ? '4P' : '2P'} ${sizing.recommendedBreakerA}AT`,
        mcbRating: sizing.breakerRatingText,
        cableCombinerToMdb: sizing.cableSpecText,
        groundCableSpec: sizing.groundCableSpecText,
      },
    }));
  };

  return (
    <div className="project-form-container flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-200">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 px-2 pt-2 gap-1 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-medium transition ${
            activeTab === 'system'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Zap size={14} />
          <span>ระบบหลัก</span>
        </button>
        <button
          onClick={() => setActiveTab('pv')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-medium transition ${
            activeTab === 'pv'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Sun size={14} />
          <span>แผงโซลาร์</span>
        </button>
        <button
          onClick={() => setActiveTab('inverter')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-medium transition ${
            activeTab === 'inverter'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Layers size={14} />
          <span>อินเวอร์เตอร์</span>
        </button>
        <button
          onClick={() => setActiveTab('protection')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-medium transition ${
            activeTab === 'protection'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <ShieldCheck size={14} />
          <span>ป้องกัน & สายไฟ</span>
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-medium transition ${
            activeTab === 'info'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <FileText size={14} />
          <span>ข้อมูลโครงการ</span>
        </button>
        <button
          onClick={() => setActiveTab('engineer')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-medium transition ${
            activeTab === 'engineer'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <UserCheck size={14} />
          <span>วิศวกร กว.</span>
        </button>
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ========================================================================= */}
        {/* TAB 1: SYSTEM OVERVIEW & ARCHITECTURE                                      */}
        {/* ========================================================================= */}
        {activeTab === 'system' && (
          <div className="space-y-4">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 mb-2">ประเภทระบบ (System Type)</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateProject((prev) => ({
                      ...prev,
                      inverterConfig: {
                        ...prev.inverterConfig,
                        systemType: 'microinverter',
                        brand: 'Enphase',
                        model: 'IQ8P-72-2-INT',
                        microinverterCount: prev.pvConfig.panelCount,
                        unitPowerKw: 0.475,
                        unitPowerVa: 480,
                        unitMaxCurrent: 2.07,
                      },
                    }));
                  }}
                  className={`py-2 px-3 rounded text-xs font-medium border text-center transition ${
                    project.inverterConfig.systemType === 'microinverter'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  ⚡ Microinverter
                  <span className="block text-[10px] text-slate-400 mt-0.5">Enphase / ATMOCE</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateProject((prev) => ({
                      ...prev,
                      inverterConfig: {
                        ...prev.inverterConfig,
                        systemType: 'string_inverter',
                        brand: 'Huawei',
                        model: 'SUN2000-5KTL-M1',
                        stringInverterCapacityKw: 5,
                        stringInverterQuantity: 1,
                        unitPowerVa: 5500,
                        unitMaxCurrent: 8.5,
                        phase: '3P',
                      },
                    }));
                  }}
                  className={`py-2 px-3 rounded text-xs font-medium border text-center transition ${
                    project.inverterConfig.systemType === 'string_inverter'
                      ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  🏢 String Inverter
                  <span className="block text-[10px] text-slate-400 mt-0.5">Huawei (3kW - 200kW)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">ระบบเฟส (Phase)</label>
                <select
                  value={project.inverterConfig.phase}
                  onChange={(e) => {
                    const phase = e.target.value as PhaseType;
                    updateProject((prev) => ({
                      ...prev,
                      inverterConfig: { ...prev.inverterConfig, phase },
                      projectInfo: {
                        ...prev.projectInfo,
                        gridVoltage: phase === '1P' ? '220 V' : '380 / 220 V',
                      },
                    }));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="1P">1 เฟส 2 สาย (1-Phase 220V)</option>
                  <option value="3P">3 เฟส 4 สาย (3-Phase 380/220V)</option>
                </select>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">การไฟฟ้า (Authority)</label>
                <select
                  value={project.projectInfo.gridAuthority}
                  onChange={(e) => {
                    const auth = e.target.value as GridAuthority;
                    updateProject((prev) => ({
                      ...prev,
                      projectInfo: { ...prev.projectInfo, gridAuthority: auth },
                    }));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="PEA">กฟภ. (PEA - ภูมิภาค)</option>
                  <option value="MEA">กฟน. (MEA - นครหลวง)</option>
                </select>
              </div>
            </div>

            {/* Quick Sizing summary badge */}
            <div className="p-3 bg-gradient-to-r from-amber-500/10 to-blue-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-200">สรุปขนาดระบบ:</span>
                <button
                  type="button"
                  onClick={handleAutoSizing}
                  className="flex items-center gap-1 text-[11px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-2 py-0.5 rounded transition"
                >
                  <Wand2 size={12} />
                  Auto-size เบรกเกอร์ & สาย
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">ขนาดติดตั้ง DC: </span>
                  <span className="font-bold text-amber-400">{project.pvConfig.totalKwp} kWp</span>
                </div>
                <div>
                  <span className="text-slate-400">กำลังผลิต AC: </span>
                  <span className="font-bold text-sky-400">
                    {project.inverterConfig.systemType === 'microinverter'
                      ? `${project.inverterConfig.totalOutputKva} kVA (${project.inverterConfig.totalOutputKw} kW)`
                      : `${project.inverterConfig.totalOutputKw} kW`}
                  </span>
                </div>
              </div>
            </div>

            {/* Display Options */}
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 block mb-1">ตัวเลือกการแสดงผลในแบบ</span>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={project.showRelayTable}
                  onChange={(e) => updateProject((prev) => ({ ...prev, showRelayTable: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                />
                แสดงตาราง IEEE Protection Relay Table (50, 50N, 51, 51N...)
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={project.showZeroExportNote}
                  onChange={(e) => updateProject((prev) => ({ ...prev, showZeroExportNote: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                />
                แสดงข้อความ Zero Export Device (กันไฟย้อน)
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={project.showPhaseProtectionNote}
                  onChange={(e) => updateProject((prev) => ({ ...prev, showPhaseProtectionNote: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                />
                แสดงข้อความระบบป้องกันทางด้านเฟสและกราวด์
              </label>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PV MODULE CONFIG (Explicitly Requested Inputs)                      */}
        {/* ========================================================================= */}
        {activeTab === 'pv' && (
          <div className="space-y-3">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">เลือกแผงสำเร็จรูป</label>
              <select
                onChange={(e) => {
                  const found = PV_MODULE_DATABASE.find((m) => m.model === e.target.value);
                  if (found) {
                    updateProject((prev) => {
                      const totalKwp = calculatePVTotal({
                        ...prev.pvConfig,
                        powerPerPanel: found.powerPerPanel,
                        brand: found.brand,
                        model: found.model,
                        voc: found.voc,
                        isc: found.isc,
                        vmp: found.vmp,
                        imp: found.imp,
                      });
                      return {
                        ...prev,
                        pvConfig: {
                          ...prev.pvConfig,
                          brand: found.brand,
                          model: found.model,
                          powerPerPanel: found.powerPerPanel,
                          voc: found.voc,
                          isc: found.isc,
                          vmp: found.vmp,
                          imp: found.imp,
                          totalKwp,
                        },
                      };
                    });
                  }
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 mb-3"
              >
                <option value="">-- เลือกสเปกแผงจากฐานข้อมูล --</option>
                {PV_MODULE_DATABASE.map((m) => (
                  <option key={m.model} value={m.model}>
                    {m.brand} {m.model} ({m.powerPerPanel} Wp)
                  </option>
                ))}
              </select>

              {/* Explicit User Requirements: Panel Wattage & Panel Count */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-amber-500/10 rounded border border-amber-500/30">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    ⚡ ขนาดแผง (Wp)
                  </label>
                  <input
                    type="number"
                    value={project.pvConfig.powerPerPanel}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      updateProject((prev) => {
                        const totalKwp = calculatePVTotal({ ...prev.pvConfig, powerPerPanel: val });
                        return {
                          ...prev,
                          pvConfig: { ...prev.pvConfig, powerPerPanel: val, totalKwp },
                        };
                      });
                    }}
                    placeholder="เช่น 650"
                    className="w-full bg-slate-900 border border-amber-500/50 rounded px-2.5 py-1.5 text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">เช่น 550, 630, 650W</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    🔢 จำนวนแผง (แผง)
                  </label>
                  <input
                    type="number"
                    value={project.pvConfig.panelCount}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      updateProject((prev) => {
                        const totalKwp = calculatePVTotal({ ...prev.pvConfig, panelCount: val });
                        const microCount =
                          prev.inverterConfig.systemType === 'microinverter'
                            ? val
                            : prev.inverterConfig.microinverterCount;
                        const invOutput = calculateInverterOutput({
                          ...prev.inverterConfig,
                          microinverterCount: microCount,
                        });

                        return {
                          ...prev,
                          pvConfig: { ...prev.pvConfig, panelCount: val, totalKwp },
                          inverterConfig: {
                            ...prev.inverterConfig,
                            microinverterCount: microCount,
                            modulesPerString: val,
                            totalOutputKw: invOutput.totalKw,
                            totalOutputKva: invOutput.totalKva,
                          },
                        };
                      });
                    }}
                    placeholder="เช่น 8"
                    className="w-full bg-slate-900 border border-amber-500/50 rounded px-2.5 py-1.5 text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">เช่น 8, 9, 15, 21 แผง</span>
                </div>
              </div>

              {/* Total Calculated DC kWp */}
              <div className="mt-3 p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">รวมกำลังการผลิตติดตั้ง (PV System Power):</span>
                <span className="text-sm font-black text-amber-400">{project.pvConfig.totalKwp} kWp</span>
              </div>
            </div>

            {/* Detailed Electrical Specs */}
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 block mb-1">พิกัดไฟฟ้าของแผง (Datasheet)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400">ยี่ห้อ (Brand)</label>
                  <input
                    type="text"
                    value={project.pvConfig.brand}
                    onChange={(e) => updateProject((prev) => ({ ...prev, pvConfig: { ...prev.pvConfig, brand: e.target.value } }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400">รุ่น (Model)</label>
                  <input
                    type="text"
                    value={project.pvConfig.model}
                    onChange={(e) => updateProject((prev) => ({ ...prev, pvConfig: { ...prev.pvConfig, model: e.target.value } }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] text-slate-400">Voc (V)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={project.pvConfig.voc}
                    onChange={(e) => updateProject((prev) => ({ ...prev, pvConfig: { ...prev.pvConfig, voc: Number(e.target.value) || 0 } }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Isc (A)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={project.pvConfig.isc}
                    onChange={(e) => updateProject((prev) => ({ ...prev, pvConfig: { ...prev.pvConfig, isc: Number(e.target.value) || 0 } }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Vmp (V)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={project.pvConfig.vmp}
                    onChange={(e) => updateProject((prev) => ({ ...prev, pvConfig: { ...prev.pvConfig, vmp: Number(e.target.value) || 0 } }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Imp (A)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={project.pvConfig.imp}
                    onChange={(e) => updateProject((prev) => ({ ...prev, pvConfig: { ...prev.pvConfig, imp: Number(e.target.value) || 0 } }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: INVERTER CONFIG (Microinverter vs String)                           */}
        {/* ========================================================================= */}
        {activeTab === 'inverter' && (
          <div className="space-y-3">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">เลือกรุ่น Inverter จากฐานข้อมูล</label>
              <select
                onChange={(e) => {
                  const found = INVERTER_DATABASE.find((inv) => inv.model === e.target.value);
                  if (found) {
                    updateProject((prev) => {
                      const updatedInv = {
                        ...prev.inverterConfig,
                        brand: found.brand,
                        model: found.model,
                        systemType: found.systemType,
                        phase: found.phase,
                        unitPowerKw: found.unitPowerKw,
                        unitPowerVa: found.unitPowerVa,
                        unitMaxCurrent: found.unitMaxCurrent,
                        stringInverterCapacityKw: found.nominalCapacityKw || prev.inverterConfig.stringInverterCapacityKw,
                      };
                      const output = calculateInverterOutput(updatedInv);
                      return {
                        ...prev,
                        inverterConfig: {
                          ...updatedInv,
                          totalOutputKw: output.totalKw,
                          totalOutputKva: output.totalKva,
                        },
                      };
                    });
                  }
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 mb-3"
              >
                <option value="">-- เลือกรุ่น Inverter --</option>
                {INVERTER_DATABASE.map((inv) => (
                  <option key={inv.model} value={inv.model}>
                    [{inv.systemType === 'microinverter' ? 'Micro' : 'String'}] {inv.brand} {inv.model} ({inv.phase})
                  </option>
                ))}
              </select>

              {/* Microinverter Specific Inputs (Explicit User Requirement) */}
              {project.inverterConfig.systemType === 'microinverter' ? (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-500/10 rounded border border-amber-500/30">
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      ⚡ จำนวน Microinverter (ชุด/เครื่อง)
                    </label>
                    <input
                      type="number"
                      value={project.inverterConfig.microinverterCount}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        updateProject((prev) => {
                          const output = calculateInverterOutput({ ...prev.inverterConfig, microinverterCount: val });
                          return {
                            ...prev,
                            inverterConfig: {
                              ...prev.inverterConfig,
                              microinverterCount: val,
                              totalOutputKw: output.totalKw,
                              totalOutputKva: output.totalKva,
                            },
                          };
                        });
                      }}
                      placeholder="เช่น 8"
                      className="w-full bg-slate-900 border border-amber-500/50 rounded px-2.5 py-1.5 text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      เช่น 8 เครื่อง สำหรับระบบ 8 แผง (1-in-1) หรือ 4 เครื่อง (2-in-1)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400">กำลังต่อตัว (kW)</label>
                      <input
                        type="number"
                        step="0.001"
                        value={project.inverterConfig.unitPowerKw}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          updateProject((prev) => {
                            const output = calculateInverterOutput({ ...prev.inverterConfig, unitPowerKw: val });
                            return {
                              ...prev,
                              inverterConfig: { ...prev.inverterConfig, unitPowerKw: val, totalOutputKw: output.totalKw },
                            };
                          });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400">กำลังสูงสุด (VA)</label>
                      <input
                        type="number"
                        value={project.inverterConfig.unitPowerVa}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          updateProject((prev) => {
                            const output = calculateInverterOutput({ ...prev.inverterConfig, unitPowerVa: val });
                            return {
                              ...prev,
                              inverterConfig: { ...prev.inverterConfig, unitPowerVa: val, totalOutputKva: output.totalKva },
                            };
                          });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400">กระแสสูงสุด (A)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={project.inverterConfig.unitMaxCurrent}
                        onChange={(e) => updateProject((prev) => ({ ...prev, inverterConfig: { ...prev.inverterConfig, unitMaxCurrent: Number(e.target.value) || 0 } }))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* String Inverter Specific Inputs */
                <div className="space-y-3">
                  <div className="p-3 bg-sky-500/10 rounded border border-sky-500/30">
                    <label className="block text-xs font-bold text-sky-300 mb-1">
                      🏢 ขนาดกำลัง Inverter (kW)
                    </label>
                    <input
                      type="number"
                      value={project.inverterConfig.stringInverterCapacityKw}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        updateProject((prev) => {
                          const output = calculateInverterOutput({ ...prev.inverterConfig, stringInverterCapacityKw: val });
                          return {
                            ...prev,
                            inverterConfig: {
                              ...prev.inverterConfig,
                              stringInverterCapacityKw: val,
                              totalOutputKw: output.totalKw,
                              totalOutputKva: output.totalKva,
                            },
                          };
                        });
                      }}
                      placeholder="เช่น 5, 10, 20, 50, 100"
                      className="w-full bg-slate-900 border border-sky-500/50 rounded px-2.5 py-1.5 text-sm font-bold text-sky-300 focus:outline-none focus:border-sky-400"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      เช่น 3, 5, 10, 15, 20, 30, 40, 50, 100, 115 kW
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400">จำนวน String</label>
                      <input
                        type="number"
                        value={project.inverterConfig.stringCount}
                        onChange={(e) => updateProject((prev) => ({ ...prev, inverterConfig: { ...prev.inverterConfig, stringCount: Number(e.target.value) || 1 } }))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400">จำนวนแผง/String</label>
                      <input
                        type="number"
                        value={project.inverterConfig.modulesPerString}
                        onChange={(e) => updateProject((prev) => ({ ...prev, inverterConfig: { ...prev.inverterConfig, modulesPerString: Number(e.target.value) || 1 } }))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Total Calculated AC Power */}
              <div className="mt-3 p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">รวมกำลังเอาต์พุต AC รวม:</span>
                <span className="text-sm font-black text-sky-400">
                  {project.inverterConfig.totalOutputKw} kW ({project.inverterConfig.totalOutputKva} kVA)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PROTECTION & SWITCHGEAR SIZING                                      */}
        {/* ========================================================================= */}
        {activeTab === 'protection' && (
          <div className="space-y-3">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-300">อุปกรณ์ป้องกันในตู้ Combiner</span>
                <button
                  type="button"
                  onClick={handleAutoSizing}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30"
                >
                  ⚡ คำนวณขนาดอัตโนมัติ
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400">พิกัด RCBO</label>
                <input
                  type="text"
                  value={project.combinerConfig.rcboRating}
                  onChange={(e) => updateProject((prev) => ({ ...prev, combinerConfig: { ...prev.combinerConfig, rcboRating: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400">พิกัด MCB / MCCB</label>
                <input
                  type="text"
                  value={project.combinerConfig.mcbRating}
                  onChange={(e) => updateProject((prev) => ({ ...prev, combinerConfig: { ...prev.combinerConfig, mcbRating: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400">พิกัด AC SPD</label>
                <input
                  type="text"
                  value={project.combinerConfig.acSpdRating}
                  onChange={(e) => updateProject((prev) => ({ ...prev, combinerConfig: { ...prev.combinerConfig, acSpdRating: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400">รุ่น Gateway / Zero Export Meter</label>
                <input
                  type="text"
                  value={project.combinerConfig.gatewayModel}
                  onChange={(e) => updateProject((prev) => ({ ...prev, combinerConfig: { ...prev.combinerConfig, gatewayModel: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block mb-1">สายไฟและท่อร้อยสาย (Cables & Conduits)</span>
              <div>
                <label className="block text-[11px] text-slate-400">สาย Combiner ➔ Main MDB</label>
                <input
                  type="text"
                  value={project.combinerConfig.cableCombinerToMdb}
                  onChange={(e) => updateProject((prev) => ({ ...prev, combinerConfig: { ...prev.combinerConfig, cableCombinerToMdb: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400">สาย Inverter ➔ Combiner</label>
                <input
                  type="text"
                  value={project.combinerConfig.cableInverterToCombiner}
                  onChange={(e) => updateProject((prev) => ({ ...prev, combinerConfig: { ...prev.combinerConfig, cableInverterToCombiner: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400">ระบบสายดิน (Grounding)</label>
                <input
                  type="text"
                  value={project.combinerConfig.groundRodSpec}
                  onChange={(e) => updateProject((prev) => ({ ...prev, combinerConfig: { ...prev.combinerConfig, groundRodSpec: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PROJECT INFO & TITLE BLOCK DETAILS                                  */}
        {/* ========================================================================= */}
        {activeTab === 'info' && (
          <div className="space-y-3">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2.5">
              <div>
                <label className="block text-[11px] text-slate-400">Project Owner (บริษัทผู้ติดตั้ง)</label>
                <input
                  type="text"
                  value={project.projectInfo.projectOwner}
                  onChange={(e) => updateProject((prev) => ({ ...prev, projectInfo: { ...prev.projectInfo, projectOwner: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400">ชื่อโครงการ (Project Name)</label>
                <input
                  type="text"
                  value={project.projectInfo.projectName}
                  onChange={(e) => updateProject((prev) => ({ ...prev, projectInfo: { ...prev.projectInfo, projectName: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400">ชื่อลูกค้า / เจ้าของบ้าน (Owner)</label>
                <input
                  type="text"
                  value={project.projectInfo.customerName}
                  onChange={(e) => updateProject((prev) => ({ ...prev, projectInfo: { ...prev.projectInfo, customerName: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400">สถานที่ติดตั้ง (Location)</label>
                <textarea
                  rows={2}
                  value={project.projectInfo.location}
                  onChange={(e) => updateProject((prev) => ({ ...prev, projectInfo: { ...prev.projectInfo, location: e.target.value } }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400">พิกัด GPS (Coordinates)</label>
                <input
                  type="text"
                  value={project.projectInfo.coordinates}
                  onChange={(e) => updateProject((prev) => ({ ...prev, projectInfo: { ...prev.projectInfo, coordinates: e.target.value } }))}
                  placeholder="เช่น 18.818031, 98.993748"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400">Job No.</label>
                  <input
                    type="text"
                    value={project.projectInfo.jobNo}
                    onChange={(e) => updateProject((prev) => ({ ...prev, projectInfo: { ...prev.projectInfo, jobNo: e.target.value } }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400">Drawing No.</label>
                  <input
                    type="text"
                    value={project.projectInfo.drawingNo}
                    onChange={(e) => updateProject((prev) => ({ ...prev, projectInfo: { ...prev.projectInfo, drawingNo: e.target.value } }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400">วันที่ (Date)</label>
                  <input
                    type="text"
                    value={project.projectInfo.date}
                    onChange={(e) => updateProject((prev) => ({ ...prev, projectInfo: { ...prev.projectInfo, date: e.target.value } }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400">Revision</label>
                  <input
                    type="text"
                    value={project.projectInfo.revision}
                    onChange={(e) => updateProject((prev) => ({ ...prev, projectInfo: { ...prev.projectInfo, revision: e.target.value } }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ELECTRICAL ENGINEER & CERTIFICATION                                */}
        {/* ========================================================================= */}
        {activeTab === 'engineer' && (
          <div className="space-y-3">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2.5">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">เลือกวิศวกรผู้รับรองแบบ</label>
              <select
                value={project.projectInfo.engineer.id}
                onChange={(e) => {
                  const found = STANDARD_ENGINEERS.find((eng) => eng.id === e.target.value);
                  if (found) {
                    updateProject((prev) => ({
                      ...prev,
                      projectInfo: { ...prev.projectInfo, engineer: found },
                    }));
                  }
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 mb-3"
              >
                {STANDARD_ENGINEERS.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name} ({eng.license})
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-[11px] text-slate-400">ชื่อ-นามสกุล วิศวกร</label>
                <input
                  type="text"
                  value={project.projectInfo.engineer.name}
                  onChange={(e) =>
                    updateProject((prev) => ({
                      ...prev,
                      projectInfo: {
                        ...prev.projectInfo,
                        engineer: { ...prev.projectInfo.engineer, name: e.target.value },
                      },
                    }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400">เลขที่ใบอนุญาต กว.</label>
                <input
                  type="text"
                  value={project.projectInfo.engineer.license}
                  onChange={(e) =>
                    updateProject((prev) => ({
                      ...prev,
                      projectInfo: {
                        ...prev.projectInfo,
                        engineer: { ...prev.projectInfo.engineer, license: e.target.value },
                      },
                    }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

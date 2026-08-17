import React from 'react';
import type { SolarSLDProject } from '../types/solar';
import { STANDARD_RELAY_ITEMS } from '../constants/equipment';

interface TitleBlockProps {
  project: SolarSLDProject;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const TitleBlock: React.FC<TitleBlockProps> = ({
  project,
  x,
  y,
  width,
  height,
}) => {
  const { projectInfo } = project;
  const leftX = x;
  const rightX = x + width;

  // Vertical divisions for Title Block rows
  const rowHeights = [
    75,  // 0: PROJECT OWNER
    95,  // 1: PROJECT NAME
    75,  // 2: OWNER
    120, // 3: LOCATION
    65,  // 4: JOB NO.
    145, // 5: ELECTRICAL ENGINEER (with signature)
    55,  // 6: DATE
    55,  // 7: REV / VERSION
    65,  // 8: DRAWING NO.
  ];

  let currentY = y;
  const rows = rowHeights.map((h) => {
    const r = { y: currentY, height: h };
    currentY += h;
    return r;
  });

  return (
    <g className="title-block">
      {/* Outer Title Block Container */}
      <rect
        x={leftX}
        y={y}
        width={width}
        height={height}
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="1.5"
      />

      {/* Row 0: PROJECT OWNER */}
      <line x1={leftX} y1={rows[0].y + rows[0].height} x2={rightX} y2={rows[0].y + rows[0].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[0].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        PROJECT OWNER :
      </text>
      <text x={leftX + width / 2} y={rows[0].y + 48} fontFamily="Arial, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#000">
        {projectInfo.projectOwner || 'TNS Network Solutions Co.,Ltd.'}
      </text>

      {/* Row 1: PROJECT NAME */}
      <line x1={leftX} y1={rows[1].y + rows[1].height} x2={rightX} y2={rows[1].y + rows[1].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[1].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        PROJECT NAME :
      </text>
      <foreignObject x={leftX + 8} y={rows[1].y + 24} width={width - 16} height={rows[1].height - 28}>
        <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 600, color: '#000', lineHeight: '1.3' }}>
          {projectInfo.projectName}
        </div>
      </foreignObject>

      {/* Row 2: OWNER */}
      <line x1={leftX} y1={rows[2].y + rows[2].height} x2={rightX} y2={rows[2].y + rows[2].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[2].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        OWNER :
      </text>
      <foreignObject x={leftX + 8} y={rows[2].y + 24} width={width - 16} height={rows[2].height - 28}>
        <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#000' }}>
          {projectInfo.customerName}
        </div>
      </foreignObject>

      {/* Row 3: LOCATION */}
      <line x1={leftX} y1={rows[3].y + rows[3].height} x2={rightX} y2={rows[3].y + rows[3].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[3].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        LOCATION :
      </text>
      <foreignObject x={leftX + 8} y={rows[3].y + 24} width={width - 16} height={rows[3].height - 28}>
        <div style={{ textAlign: 'center', fontSize: '9px', color: '#000', lineHeight: '1.4' }}>
          <div>{projectInfo.location}</div>
          {projectInfo.coordinates && (
            <div style={{ marginTop: '4px', fontWeight: 500 }}>{projectInfo.coordinates}</div>
          )}
        </div>
      </foreignObject>

      {/* Row 4: JOB NO. */}
      <line x1={leftX} y1={rows[4].y + rows[4].height} x2={rightX} y2={rows[4].y + rows[4].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[4].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        JOB NO. :
      </text>
      <text x={leftX + width / 2} y={rows[4].y + 44} fontFamily="Arial, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#000">
        {projectInfo.jobNo}
      </text>

      {/* Row 5: ELECTRICAL ENGINEER */}
      <line x1={leftX} y1={rows[5].y + rows[5].height} x2={rightX} y2={rows[5].y + rows[5].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[5].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        ELECTRICAL ENGINEER :
      </text>
      {/* Signature Area */}
      <g transform={`translate(${leftX + width / 2 - 40}, ${rows[5].y + 30})`}>
        {projectInfo.engineer.signatureImage ? (
          <image href={projectInfo.engineer.signatureImage} width="80" height="50" preserveAspectRatio="xMidYMid meet" />
        ) : (
          <path
            d="M 10 35 Q 25 5, 45 25 T 75 18 T 90 35"
            fill="none"
            stroke="#1a365d"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        )}
      </g>
      <text x={leftX + width / 2} y={rows[5].y + 105} fontFamily="Arial, sans-serif" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#000">
        {projectInfo.engineer.name}
      </text>
      <text x={leftX + width / 2} y={rows[5].y + 122} fontFamily="Arial, sans-serif" fontSize="8.5" textAnchor="middle" fill="#222">
        {projectInfo.engineer.license}
      </text>

      {/* Row 6: DATE */}
      <line x1={leftX} y1={rows[6].y + rows[6].height} x2={rightX} y2={rows[6].y + rows[6].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[6].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        DATE :
      </text>
      <text x={leftX + width / 2} y={rows[6].y + 40} fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#000">
        {projectInfo.date}
      </text>

      {/* Row 7: REV / VERSION */}
      <line x1={leftX} y1={rows[7].y + rows[7].height} x2={rightX} y2={rows[7].y + rows[7].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[7].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        REV / Version :
      </text>
      <text x={leftX + width / 2} y={rows[7].y + 40} fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#000">
        {projectInfo.revision}
      </text>

      {/* Row 8: DRAWING NO. */}
      <text x={leftX + 8} y={rows[8].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        DRAWING NO. :
      </text>
      <text x={leftX + width / 2} y={rows[8].y + 45} fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000">
        {projectInfo.drawingNo}
      </text>
    </g>
  );
};

// Technical Notes, Spec Tables and IEEE Relay Table component
export const TechnicalNotesAndSpecs: React.FC<{
  project: SolarSLDProject;
  x: number;
  y: number;
}> = ({ project, x, y }) => {
  const { pvConfig, inverterConfig, combinerConfig, showRelayTable, showZeroExportNote, showPhaseProtectionNote } = project;

  return (
    <g className="tech-specs-and-notes" transform={`translate(${x}, ${y})`}>
      {/* 1. IEEE Relay Code Table (Top right of specs area) */}
      {showRelayTable && (
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="280" height="115" fill="#fff" stroke="#000" strokeWidth="1" />
          <line x1="0" y1="16" x2="280" y2="16" stroke="#000" strokeWidth="0.8" />
          <line x1="65" y1="0" x2="65" y2="115" stroke="#000" strokeWidth="0.8" />
          <line x1="210" y1="0" x2="210" y2="115" stroke="#000" strokeWidth="0.8" />

          {/* Header */}
          <text x="32" y="11" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#000">
            RELAY CODE
          </text>
          <text x="137" y="11" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#000">
            DESCRIPTION
          </text>
          <text x="245" y="11" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#000">
            PROTECTION
          </text>

          {/* Rows */}
          {STANDARD_RELAY_ITEMS.map((item, idx) => {
            const rowY = 28 + idx * 12;
            return (
              <g key={item.code}>
                {idx > 0 && <line x1="0" y1={rowY - 10} x2="280" y2={rowY - 10} stroke="#e2e8f0" strokeWidth="0.5" />}
                <circle cx="32" cy={rowY - 3} r="5" fill="#fff" stroke="#000" strokeWidth="0.8" />
                <text x="32" y={rowY} fontFamily="Arial, sans-serif" fontSize="6.5" fontWeight="bold" textAnchor="middle" fill="#000">
                  {item.code}
                </text>
                <text x="70" y={rowY} fontFamily="Arial, sans-serif" fontSize="6" fill="#000">
                  {item.description}
                </text>
                <text x="215" y={rowY} fontFamily="Arial, sans-serif" fontSize="6" fill="#000">
                  {item.protection}
                </text>
              </g>
            );
          })}
        </g>
      )}

      {/* 2. Mandatory PEA Notes Box */}
      <g transform={`translate(0, ${showRelayTable ? 125 : 0})`}>
        {showZeroExportNote && (
          <g>
            <text x="0" y="14" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
              * ระบบป้องกันการจ่ายไฟฟ้าไหลย้อนเข้าสู่ระบบโครงข่ายไฟฟ้า
            </text>
            <text x="10" y="26" fontFamily="Arial, sans-serif" fontSize="8" fill="#000">
              (Export Limiting Device: EXL) ที่ใช้งาน
            </text>
            {/* Checkbox */}
            <rect x="25" y="32" width="9" height="9" fill="#fff" stroke="#000" strokeWidth="0.8" />
            <path d="M 27 36 L 29 39 L 33 33" fill="none" stroke="#000" strokeWidth="1.2" />
            <text x="40" y="40" fontFamily="Arial, sans-serif" fontSize="7.5" fill="#000">
              Zero Export Device ยี่ห้อ {inverterConfig.brand} รุ่น {combinerConfig.gatewayModel}
            </text>
          </g>
        )}

        {showPhaseProtectionNote && (
          <g transform="translate(0, 50)">
            <text x="0" y="14" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
              ** ระบบป้องกันทางด้านเฟสและกราวด์
            </text>
            {/* Checkbox */}
            <rect x="25" y="20" width="9" height="9" fill="#fff" stroke="#000" strokeWidth="0.8" />
            <path d="M 27 24 L 29 27 L 33 21" fill="none" stroke="#000" strokeWidth="1.2" />
            <text x="40" y="28" fontFamily="Arial, sans-serif" fontSize="7.5" fill="#000">
              {combinerConfig.rcboRating} {combinerConfig.rcboType} ร่วมกับอุปกรณ์ป้องกันกระแสเกิน {combinerConfig.mccbRating}
            </text>
          </g>
        )}
      </g>

      {/* 3. Summary Bullet points */}
      <g transform={`translate(0, ${showRelayTable ? 220 : 100})`}>
        {/* Bullet 1: PV Modules */}
        <text x="0" y="14" fontFamily="Arial, sans-serif" fontSize="8" fill="#000">
          - แผงโซลาร์เซลล์ ยี่ห้อ {pvConfig.brand} รุ่น {pvConfig.model}
        </text>
        <text x="10" y="26" fontFamily="Arial, sans-serif" fontSize="8" fill="#000">
          กำลังผลิต {pvConfig.powerPerPanel} Wp ต่อแผง จำนวน {pvConfig.panelCount} แผง
        </text>
        <text x="10" y="38" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
          รวมกำลังการผลิตติดตั้ง {pvConfig.totalKwp} kWp
        </text>

        {/* Bullet 2: Inverter */}
        <text x="0" y="58" fontFamily="Arial, sans-serif" fontSize="8" fill="#000">
          - {inverterConfig.systemType === 'microinverter' ? 'ไมโครอินเวอร์เตอร์' : 'อินเวอร์เตอร์'} ยี่ห้อ {inverterConfig.brand} รุ่น {inverterConfig.model}
        </text>
        <text x="10" y="70" fontFamily="Arial, sans-serif" fontSize="7.5" fill="#000">
          พร้อมฟังก์ชัน {inverterConfig.hasAntiIslanding ? 'Anti-Islanding' : ''} {inverterConfig.hasRapidShutdown ? 'และ Rapid Shutdown' : ''}
        </text>
        {inverterConfig.systemType === 'microinverter' ? (
          <>
            <text x="10" y="82" fontFamily="Arial, sans-serif" fontSize="8" fill="#000">
              กำลังผลิต {inverterConfig.unitPowerKw} kW จำนวน {inverterConfig.microinverterCount} เครื่อง
            </text>
            <text x="10" y="94" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
              รวมกำลังเอาต์พุตทั้งระบบ {inverterConfig.totalOutputKw} kW ({inverterConfig.totalOutputKva} kVA)
            </text>
          </>
        ) : (
          <>
            <text x="10" y="82" fontFamily="Arial, sans-serif" fontSize="8" fill="#000">
              กำลังผลิต {inverterConfig.stringInverterCapacityKw} kW จำนวน {inverterConfig.stringInverterQuantity} เครื่อง
            </text>
            <text x="10" y="94" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
              รวมกำลังเอาต์พุตทั้งระบบ {inverterConfig.totalOutputKw} kW
            </text>
          </>
        )}
      </g>

      {/* 4. Equipment Specification Tables (At Bottom Right) */}
      <g transform={`translate(0, ${showRelayTable ? 335 : 220})`}>
        {/* PV Module Spec Table */}
        <rect x="0" y="0" width="280" height="42" fill="#fff" stroke="#000" strokeWidth="1" />
        <line x1="0" y1="14" x2="280" y2="14" stroke="#000" strokeWidth="0.8" />
        <text x="140" y="10" fontFamily="Arial, sans-serif" fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="#000">
          PV MODULE
        </text>
        <line x1="90" y1="14" x2="90" y2="28" stroke="#000" strokeWidth="0.8" />
        <text x="8" y="24" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" fill="#000">
          BRAND: {pvConfig.brand}
        </text>
        <text x="96" y="24" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" fill="#000">
          MODEL: {pvConfig.model}
        </text>
        <line x1="0" y1="28" x2="280" y2="28" stroke="#000" strokeWidth="0.8" />
        <text x="8" y="38" fontFamily="Arial, sans-serif" fontSize="6.5" fill="#000">
          Pm = {pvConfig.powerPerPanel} Wp | Voc = {pvConfig.voc} V | Isc = {pvConfig.isc} A | Vmp = {pvConfig.vmp} V | Imp = {pvConfig.imp} A
        </text>

        {/* Inverter Spec Table */}
        <g transform="translate(0, 50)">
          <rect x="0" y="0" width="280" height="52" fill="#fff" stroke="#000" strokeWidth="1" />
          <text x="8" y="14" fontFamily="Arial, sans-serif" fontSize="7.5" fontWeight="bold" fill="#000">
            {inverterConfig.brand} {inverterConfig.systemType === 'microinverter' ? 'Microinverters' : 'Inverter'} : {inverterConfig.model}
          </text>
          {inverterConfig.systemType === 'microinverter' ? (
            <>
              <text x="8" y="26" fontFamily="Arial, sans-serif" fontSize="7" fill="#000">
                Maximum apparent power = {inverterConfig.unitPowerVa} VA
              </text>
              <text x="8" y="37" fontFamily="Arial, sans-serif" fontSize="7" fill="#000">
                Rated power = {(inverterConfig.unitPowerKw * 1000).toFixed(0)} W
              </text>
              <text x="8" y="48" fontFamily="Arial, sans-serif" fontSize="7" fill="#000">
                Maximum output current = {inverterConfig.unitMaxCurrent} A
              </text>
            </>
          ) : (
            <>
              <text x="8" y="26" fontFamily="Arial, sans-serif" fontSize="7" fill="#000">
                Maximum apparent power = {(inverterConfig.unitPowerVa / 1000).toFixed(1)} kVA
              </text>
              <text x="8" y="37" fontFamily="Arial, sans-serif" fontSize="7" fill="#000">
                Rated power = {inverterConfig.stringInverterCapacityKw} kW
              </text>
              <text x="8" y="48" fontFamily="Arial, sans-serif" fontSize="7" fill="#000">
                Maximum output current = {inverterConfig.unitMaxCurrent} A
              </text>
            </>
          )}
        </g>
      </g>
    </g>
  );
};

import React from 'react';
import type { SolarSLDProject } from '../types/solar';
import { STANDARD_RELAY_ITEMS } from '../constants/equipment';
import { EditableSvgText } from './InteractiveSvg';

interface TitleBlockProps {
  project: SolarSLDProject;
  x: number;
  y: number;
  width: number;
  height: number;
  isEditMode?: boolean;
  onOpenEdit: (id: string, text: string, label: string) => void;
}

function splitIntoLines(text: string, maxChars: number = 28): string[] {
  if (!text) return [];
  const rawParts = text.split('\n');
  const result: string[] = [];

  for (const part of rawParts) {
    const words = part.split(' ');
    let currentLine = '';

    for (const word of words) {
      if (!currentLine) {
        currentLine = word;
      } else if ((currentLine + ' ' + word).length <= maxChars) {
        currentLine += ' ' + word;
      } else {
        result.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      result.push(currentLine);
    }
  }

  return result;
}

export const TitleBlock: React.FC<TitleBlockProps> = ({
  project,
  x,
  y,
  width,
  height,
  isEditMode = true,
  onOpenEdit,
}) => {
  const { projectInfo, customTextOverrides } = project;
  const leftX = x;
  const rightX = x + width;
  const centerX = x + width / 2;

  const getText = (key: string, fallback: string) => {
    return customTextOverrides?.[key] ?? fallback;
  };

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

  const projectOwner = getText('tb.projectOwner', projectInfo.projectOwner || 'TNS Network Solutions Co.,Ltd.');
  const projectName = getText('tb.projectName', projectInfo.projectName || 'Solar Rooftop');
  const customerName = getText('tb.customerName', projectInfo.customerName || '');
  const location = getText('tb.location', projectInfo.location || '');
  const coordinates = getText('tb.coordinates', projectInfo.coordinates || '');
  const jobNo = getText('tb.jobNo', projectInfo.jobNo || '');
  const engineerName = getText('tb.engineerName', projectInfo.engineer.name || '');
  const engineerLicense = getText('tb.engineerLicense', projectInfo.engineer.license || '');
  const date = getText('tb.date', projectInfo.date || '');
  const revision = getText('tb.revision', projectInfo.revision || '0');
  const drawingNo = getText('tb.drawingNo', projectInfo.drawingNo || '');

  const projectNameLines = splitIntoLines(projectName, 24);
  const ownerLines = splitIntoLines(customerName, 22);
  const locationLines = splitIntoLines(location, 26);

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
      <EditableSvgText
        id="tb.projectOwner"
        x={centerX}
        y={rows[0].y + 48}
        text={projectOwner}
        label="Project Owner (เจ้าของโครงการ)"
        onOpenEdit={onOpenEdit}
        fontSize="10.5"
        fontWeight="bold"
        textAnchor="middle"
        isEditMode={isEditMode}
      />

      {/* Row 1: PROJECT NAME */}
      <line x1={leftX} y1={rows[1].y + rows[1].height} x2={rightX} y2={rows[1].y + rows[1].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[1].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        PROJECT NAME :
      </text>
      <g
        onClick={() => isEditMode && onOpenEdit('tb.projectName', projectName, 'Project Name (ชื่อโครงการ)')}
        className={isEditMode ? 'cursor-pointer' : ''}
      >
        {isEditMode && <title>✏️ คลิกเพื่อแก้ไขชื่อโครงการ</title>}
        <text
          x={centerX}
          y={rows[1].y + 36}
          fontFamily="Arial, sans-serif"
          fontSize="9"
          fontWeight="bold"
          textAnchor="middle"
          fill="#000"
          className={isEditMode ? 'hover:fill-amber-600 underline decoration-dotted decoration-amber-400' : ''}
        >
          {projectNameLines.map((line, idx) => (
            <tspan key={idx} x={centerX} dy={idx === 0 ? 0 : 13}>
              {line}
            </tspan>
          ))}
        </text>
      </g>

      {/* Row 2: OWNER */}
      <line x1={leftX} y1={rows[2].y + rows[2].height} x2={rightX} y2={rows[2].y + rows[2].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[2].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        OWNER :
      </text>
      <g
        onClick={() => isEditMode && onOpenEdit('tb.customerName', customerName, 'Owner (ชื่อเจ้าของ/ผู้ขออนุญาต)')}
        className={isEditMode ? 'cursor-pointer' : ''}
      >
        {isEditMode && <title>✏️ คลิกเพื่อแก้ไขชื่อเจ้าของ</title>}
        <text
          x={centerX}
          y={rows[2].y + 42}
          fontFamily="Arial, sans-serif"
          fontSize="10.5"
          fontWeight="bold"
          textAnchor="middle"
          fill="#000"
          className={isEditMode ? 'hover:fill-amber-600 underline decoration-dotted decoration-amber-400' : ''}
        >
          {ownerLines.map((line, idx) => (
            <tspan key={idx} x={centerX} dy={idx === 0 ? 0 : 14}>
              {line}
            </tspan>
          ))}
        </text>
      </g>

      {/* Row 3: LOCATION */}
      <line x1={leftX} y1={rows[3].y + rows[3].height} x2={rightX} y2={rows[3].y + rows[3].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[3].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        LOCATION :
      </text>
      <g
        onClick={() => isEditMode && onOpenEdit('tb.location', location, 'Location (สถานที่ติดตั้ง)')}
        className={isEditMode ? 'cursor-pointer' : ''}
      >
        {isEditMode && <title>✏️ คลิกเพื่อแก้ไขสถานที่ติดตั้ง</title>}
        <text
          x={centerX}
          y={rows[3].y + 34}
          fontFamily="Arial, sans-serif"
          fontSize="8"
          textAnchor="middle"
          fill="#000"
          className={isEditMode ? 'hover:fill-amber-600 underline decoration-dotted decoration-amber-400' : ''}
        >
          {locationLines.map((line, idx) => (
            <tspan key={idx} x={centerX} dy={idx === 0 ? 0 : 12}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
      {coordinates && (
        <EditableSvgText
          id="tb.coordinates"
          x={centerX}
          y={rows[3].y + rows[3].height - 12}
          text={coordinates}
          label="พิกัด GPS Coordinates"
          onOpenEdit={onOpenEdit}
          fontSize="8"
          fontWeight="bold"
          textAnchor="middle"
          isEditMode={isEditMode}
        />
      )}

      {/* Row 4: JOB NO. */}
      <line x1={leftX} y1={rows[4].y + rows[4].height} x2={rightX} y2={rows[4].y + rows[4].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[4].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        JOB NO. :
      </text>
      <EditableSvgText
        id="tb.jobNo"
        x={centerX}
        y={rows[4].y + 44}
        text={jobNo}
        label="Job No."
        onOpenEdit={onOpenEdit}
        fontSize="10.5"
        fontWeight="bold"
        textAnchor="middle"
        isEditMode={isEditMode}
      />

      {/* Row 5: ELECTRICAL ENGINEER */}
      <line x1={leftX} y1={rows[5].y + rows[5].height} x2={rightX} y2={rows[5].y + rows[5].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[5].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        ELECTRICAL ENGINEER :
      </text>
      {/* Signature Area */}
      <g transform={`translate(${centerX - 40}, ${rows[5].y + 30})`}>
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
      <EditableSvgText
        id="tb.engineerName"
        x={centerX}
        y={rows[5].y + 105}
        text={engineerName}
        label="ชื่อวิศวกรไฟฟ้า"
        onOpenEdit={onOpenEdit}
        fontSize="9"
        fontWeight="bold"
        textAnchor="middle"
        isEditMode={isEditMode}
      />
      <EditableSvgText
        id="tb.engineerLicense"
        x={centerX}
        y={rows[5].y + 122}
        text={engineerLicense}
        label="เลขที่ใบอนุญาตวิศวกร (ภฟก.)"
        onOpenEdit={onOpenEdit}
        fontSize="8.5"
        textAnchor="middle"
        fill="#222"
        isEditMode={isEditMode}
      />

      {/* Row 6: DATE */}
      <line x1={leftX} y1={rows[6].y + rows[6].height} x2={rightX} y2={rows[6].y + rows[6].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[6].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        DATE :
      </text>
      <EditableSvgText
        id="tb.date"
        x={centerX}
        y={rows[6].y + 40}
        text={date}
        label="วันที่ (Date)"
        onOpenEdit={onOpenEdit}
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        isEditMode={isEditMode}
      />

      {/* Row 7: REV / VERSION */}
      <line x1={leftX} y1={rows[7].y + rows[7].height} x2={rightX} y2={rows[7].y + rows[7].height} stroke="#000" strokeWidth="1" />
      <text x={leftX + 8} y={rows[7].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        REV / Version :
      </text>
      <EditableSvgText
        id="tb.revision"
        x={centerX}
        y={rows[7].y + 40}
        text={revision}
        label="Revision / Version"
        onOpenEdit={onOpenEdit}
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        isEditMode={isEditMode}
      />

      {/* Row 8: DRAWING NO. */}
      <text x={leftX + 8} y={rows[8].y + 16} fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
        DRAWING NO. :
      </text>
      <EditableSvgText
        id="tb.drawingNo"
        x={centerX}
        y={rows[8].y + 45}
        text={drawingNo}
        label="Drawing No. (เลขที่แบบ)"
        onOpenEdit={onOpenEdit}
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        isEditMode={isEditMode}
      />
    </g>
  );
};

// Technical Notes, Spec Tables and IEEE Relay Table component
export const TechnicalNotesAndSpecs: React.FC<{
  project: SolarSLDProject;
  x: number;
  y: number;
  isEditMode?: boolean;
  onOpenEdit: (id: string, text: string, label: string) => void;
}> = ({ project, x, y, isEditMode = true, onOpenEdit }) => {
  const { pvConfig, inverterConfig, combinerConfig, showRelayTable, showZeroExportNote, showPhaseProtectionNote, customTextOverrides } = project;

  const getText = (key: string, fallback: string) => {
    return customTextOverrides?.[key] ?? fallback;
  };

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
            const codeText = getText(`relay.${item.code}.code`, item.code);
            const descText = getText(`relay.${item.code}.desc`, item.description);
            const protText = getText(`relay.${item.code}.prot`, item.protection);

            return (
              <g key={item.code}>
                {idx > 0 && <line x1="0" y1={rowY - 10} x2="280" y2={rowY - 10} stroke="#e2e8f0" strokeWidth="0.5" />}
                <circle cx="32" cy={rowY - 3} r="5" fill="#fff" stroke="#000" strokeWidth="0.8" />
                <EditableSvgText
                  id={`relay.${item.code}.code`}
                  x={32}
                  y={rowY}
                  text={codeText}
                  label={`Relay Code ${item.code}`}
                  onOpenEdit={onOpenEdit}
                  fontSize="6.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  isEditMode={isEditMode}
                />
                <EditableSvgText
                  id={`relay.${item.code}.desc`}
                  x={70}
                  y={rowY}
                  text={descText}
                  label={`คำอธิบาย Relay ${item.code}`}
                  onOpenEdit={onOpenEdit}
                  fontSize="6"
                  isEditMode={isEditMode}
                />
                <EditableSvgText
                  id={`relay.${item.code}.prot`}
                  x={215}
                  y={rowY}
                  text={protText}
                  label={`Protection Relay ${item.code}`}
                  onOpenEdit={onOpenEdit}
                  fontSize="6"
                  isEditMode={isEditMode}
                />
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
            <EditableSvgText
              id="notes.zeroExport"
              x={40}
              y={40}
              text={getText(
                'notes.zeroExport',
                `Zero Export Device ยี่ห้อ ${inverterConfig.brand} รุ่น ${combinerConfig.gatewayModel}`
              )}
              label="ข้อความ Zero Export Note"
              onOpenEdit={onOpenEdit}
              fontSize="7.5"
              isEditMode={isEditMode}
            />
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
            <EditableSvgText
              id="notes.phaseProtection"
              x={40}
              y={28}
              text={getText(
                'notes.phaseProtection',
                `${combinerConfig.rcboRating} ${combinerConfig.rcboType} ร่วมกับอุปกรณ์ป้องกันกระแสเกิน ${combinerConfig.mccbRating}`
              )}
              label="ข้อความระบบป้องกันทางด้านเฟสและกราวด์"
              onOpenEdit={onOpenEdit}
              fontSize="7.5"
              isEditMode={isEditMode}
            />
          </g>
        )}
      </g>

      {/* 3. Summary Bullet points */}
      <g transform={`translate(0, ${showRelayTable ? 220 : 100})`}>
        {/* Bullet 1: PV Modules */}
        <EditableSvgText
          id="summary.pvBrand"
          x={0}
          y={14}
          text={getText('summary.pvBrand', `- แผงโซลาร์เซลล์ ยี่ห้อ ${pvConfig.brand} รุ่น ${pvConfig.model}`)}
          label="ข้อความแผงโซลาร์เซลล์ (ยี่ห้อ/รุ่น)"
          onOpenEdit={onOpenEdit}
          fontSize="8"
          isEditMode={isEditMode}
        />
        <EditableSvgText
          id="summary.pvPower"
          x={10}
          y={26}
          text={getText('summary.pvPower', `กำลังผลิต ${pvConfig.powerPerPanel} Wp ต่อแผง จำนวน ${pvConfig.panelCount} แผง`)}
          label="ข้อความกำลังผลิตแผงและจำนวนแผง"
          onOpenEdit={onOpenEdit}
          fontSize="8"
          isEditMode={isEditMode}
        />
        <EditableSvgText
          id="summary.pvTotal"
          x={10}
          y={38}
          text={getText('summary.pvTotal', `รวมกำลังการผลิตติดตั้ง ${pvConfig.totalKwp} kWp`)}
          label="ข้อความรวมกำลังติดตั้งโซลาร์ (kWp)"
          onOpenEdit={onOpenEdit}
          fontSize="8"
          fontWeight="bold"
          isEditMode={isEditMode}
        />

        {/* Bullet 2: Inverter */}
        <EditableSvgText
          id="summary.invBrand"
          x={0}
          y={58}
          text={getText(
            'summary.invBrand',
            `- ${inverterConfig.systemType === 'microinverter' ? 'ไมโครอินเวอร์เตอร์' : 'อินเวอร์เตอร์'} ยี่ห้อ ${inverterConfig.brand} รุ่น ${inverterConfig.model}`
          )}
          label="ข้อความยี่ห้อและรุ่นอินเวอร์เตอร์"
          onOpenEdit={onOpenEdit}
          fontSize="8"
          isEditMode={isEditMode}
        />
        <EditableSvgText
          id="summary.invProtection"
          x={10}
          y={70}
          text={getText(
            'summary.invProtection',
            `พร้อมฟังก์ชัน ${inverterConfig.hasAntiIslanding ? 'Anti-Islanding' : ''} ${inverterConfig.hasRapidShutdown ? 'และ Rapid Shutdown' : ''}`
          )}
          label="ข้อความฟังก์ชันป้องกันอินเวอร์เตอร์"
          onOpenEdit={onOpenEdit}
          fontSize="7.5"
          isEditMode={isEditMode}
        />
        {inverterConfig.systemType === 'microinverter' ? (
          <>
            <EditableSvgText
              id="summary.microCount"
              x={10}
              y={82}
              text={getText(
                'summary.microCount',
                `กำลังผลิต ${inverterConfig.unitPowerKw} kW จำนวน ${inverterConfig.microinverterCount} เครื่อง`
              )}
              label="ข้อความจำนวนไมโครอินเวอร์เตอร์"
              onOpenEdit={onOpenEdit}
              fontSize="8"
              isEditMode={isEditMode}
            />
            <EditableSvgText
              id="summary.microOutput"
              x={10}
              y={94}
              text={getText(
                'summary.microOutput',
                `รวมกำลังเอาต์พุตทั้งระบบ ${inverterConfig.totalOutputKw} kW (${inverterConfig.totalOutputKva} kVA)`
              )}
              label="ข้อความกำลังผลิตรวม AC"
              onOpenEdit={onOpenEdit}
              fontSize="8"
              fontWeight="bold"
              isEditMode={isEditMode}
            />
          </>
        ) : (
          <>
            <EditableSvgText
              id="summary.stringCount"
              x={10}
              y={82}
              text={getText(
                'summary.stringCount',
                `กำลังผลิต ${inverterConfig.stringInverterCapacityKw} kW จำนวน ${inverterConfig.stringInverterQuantity} เครื่อง`
              )}
              label="ข้อความกำลังผลิตและจำนวนอินเวอร์เตอร์"
              onOpenEdit={onOpenEdit}
              fontSize="8"
              isEditMode={isEditMode}
            />
            <EditableSvgText
              id="summary.stringOutput"
              x={10}
              y={94}
              text={getText('summary.stringOutput', `รวมกำลังเอาต์พุตทั้งระบบ ${inverterConfig.totalOutputKw} kW`)}
              label="ข้อความรวมกำลังเอาต์พุต String Inverter"
              onOpenEdit={onOpenEdit}
              fontSize="8"
              fontWeight="bold"
              isEditMode={isEditMode}
            />
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
        <EditableSvgText
          id="spec.pvBrand"
          x={8}
          y={24}
          text={getText('spec.pvBrand', `BRAND: ${pvConfig.brand}`)}
          label="ตารางสเปก BRAND แผง"
          onOpenEdit={onOpenEdit}
          fontSize="7"
          fontWeight="bold"
          isEditMode={isEditMode}
        />
        <EditableSvgText
          id="spec.pvModel"
          x={96}
          y={24}
          text={getText('spec.pvModel', `MODEL: ${pvConfig.model}`)}
          label="ตารางสเปก MODEL แผง"
          onOpenEdit={onOpenEdit}
          fontSize="7"
          fontWeight="bold"
          isEditMode={isEditMode}
        />
        <line x1="0" y1="28" x2="280" y2="28" stroke="#000" strokeWidth="0.8" />
        <EditableSvgText
          id="spec.pvElectrical"
          x={8}
          y={38}
          text={getText(
            'spec.pvElectrical',
            `Pm = ${pvConfig.powerPerPanel} Wp | Voc = ${pvConfig.voc} V | Isc = ${pvConfig.isc} A | Vmp = ${pvConfig.vmp} V | Imp = ${pvConfig.imp} A`
          )}
          label="ตารางสเปกไฟฟ้าแผง (Pm, Voc, Isc, Vmp, Imp)"
          onOpenEdit={onOpenEdit}
          fontSize="6.5"
          isEditMode={isEditMode}
        />

        {/* Inverter Spec Table */}
        <g transform="translate(0, 50)">
          <rect x="0" y="0" width="280" height="52" fill="#fff" stroke="#000" strokeWidth="1" />
          <EditableSvgText
            id="spec.invHeader"
            x={8}
            y={14}
            text={getText(
              'spec.invHeader',
              `${inverterConfig.brand} ${inverterConfig.systemType === 'microinverter' ? 'Microinverters' : 'Inverter'} : ${inverterConfig.model}`
            )}
            label="หัวข้อตารางสเปก Inverter"
            onOpenEdit={onOpenEdit}
            fontSize="7.5"
            fontWeight="bold"
            isEditMode={isEditMode}
          />
          {inverterConfig.systemType === 'microinverter' ? (
            <>
              <EditableSvgText
                id="spec.invVa"
                x={8}
                y={26}
                text={getText('spec.invVa', `Maximum apparent power = ${inverterConfig.unitPowerVa} VA`)}
                label="สเปก Maximum Apparent Power"
                onOpenEdit={onOpenEdit}
                fontSize="7"
                isEditMode={isEditMode}
              />
              <EditableSvgText
                id="spec.invRatedW"
                x={8}
                y={37}
                text={getText('spec.invRatedW', `Rated power = ${(inverterConfig.unitPowerKw * 1000).toFixed(0)} W`)}
                label="สเปก Rated Power (W)"
                onOpenEdit={onOpenEdit}
                fontSize="7"
                isEditMode={isEditMode}
              />
              <EditableSvgText
                id="spec.invCurrent"
                x={8}
                y={48}
                text={getText('spec.invCurrent', `Maximum output current = ${inverterConfig.unitMaxCurrent} A`)}
                label="สเปก Maximum Output Current"
                onOpenEdit={onOpenEdit}
                fontSize="7"
                isEditMode={isEditMode}
              />
            </>
          ) : (
            <>
              <EditableSvgText
                id="spec.invKva"
                x={8}
                y={26}
                text={getText('spec.invKva', `Maximum apparent power = ${(inverterConfig.unitPowerVa / 1000).toFixed(1)} kVA`)}
                label="สเปก Maximum Apparent Power (kVA)"
                onOpenEdit={onOpenEdit}
                fontSize="7"
                isEditMode={isEditMode}
              />
              <EditableSvgText
                id="spec.invRatedKw"
                x={8}
                y={37}
                text={getText('spec.invRatedKw', `Rated power = ${inverterConfig.stringInverterCapacityKw} kW`)}
                label="สเปก Rated Power (kW)"
                onOpenEdit={onOpenEdit}
                fontSize="7"
                isEditMode={isEditMode}
              />
              <EditableSvgText
                id="spec.invCurrent"
                x={8}
                y={48}
                text={getText('spec.invCurrent', `Maximum output current = ${inverterConfig.unitMaxCurrent} A`)}
                label="สเปก Maximum Output Current"
                onOpenEdit={onOpenEdit}
                fontSize="7"
                isEditMode={isEditMode}
              />
            </>
          )}
        </g>
      </g>
    </g>
  );
};

import React from 'react';
import type { SolarSLDProject } from '../types/solar';
import { TitleBlock, TechnicalNotesAndSpecs } from './TitleBlock';
import { CircuitBreakerSymbol, RelayCircle, GroundSymbol, SpdSymbol, CtSymbol } from './SvgSymbols';

interface SldCanvasProps {
  project: SolarSLDProject;
  svgRef: React.RefObject<SVGSVGElement | null>;
  zoom?: number;
}

export const SldCanvas: React.FC<SldCanvasProps> = ({ project, svgRef, zoom = 1 }) => {
  const { projectInfo, pvConfig, inverterConfig, combinerConfig, loadCenterConfig } = project;
  const is3Phase = inverterConfig.phase === '3P';
  const isMicro = inverterConfig.systemType === 'microinverter';

  // Master SVG dimensions (standard high-res drawing area)
  const SVG_WIDTH = 1360;
  const SVG_HEIGHT = 920;

  // Title block coordinates (Right column)
  const TB_WIDTH = 230;
  const TB_X = SVG_WIDTH - TB_WIDTH - 25; // ~1105
  const TB_Y = 25;
  const TB_HEIGHT = SVG_HEIGHT - 50; // 870

  // Technical Specs & Notes coordinates
  const SPECS_X = 760;
  const SPECS_Y = 440;

  return (
    <div className="svg-canvas-container flex justify-center items-center overflow-auto p-4 bg-slate-900 rounded-xl shadow-2xl">
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
        <g id="grid-header">
          {/* Main Grid Line */}
          <line x1="50" y1="65" x2="700" y2="65" stroke="#000" strokeWidth="2" />
          <text x="350" y="55" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#000">
            {projectInfo.gridAuthority} Distribution System {projectInfo.gridVoltage}
          </text>

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
            <text x="8" y="10" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
              {projectInfo.gridAuthority}
            </text>
            <text x="8" y="22" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
              CUSTOMER
            </text>
            <line x1="-30" y1="18" x2="60" y2="18" stroke="#666" strokeWidth="0.8" strokeDasharray="3 3" />
          </g>

          {/* Service Drop Cable Callout */}
          <text x="375" y="118" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
            {projectInfo.gridCableSpec}
          </text>

          {/* Consumption CTs */}
          <g transform="translate(312, 130)">
            <circle cx="0" cy="0" r="7" fill="none" stroke="#000" strokeWidth="1.5" />
            <line x1="-10" y1="0" x2="10" y2="0" stroke="#000" strokeWidth="1.2" />
            <text x="14" y="-3" fontFamily="Arial, sans-serif" fontSize="7.5" fontWeight="bold" fill="#000">
              Consumption CT's
            </text>
            <text x="14" y="8" fontFamily="Arial, sans-serif" fontSize="7.5" fill="#000">
              {combinerConfig.consumptionCt}
            </text>
            {/* CT Secondary Wire down to Combiner Box */}
            <path
              d="M 12 4 L 470 4 L 470 380"
              fill="none"
              stroke="#555"
              strokeWidth="0.9"
              strokeDasharray="4 2"
            />
            <text x="500" y="240" fontFamily="Arial, sans-serif" fontSize="7" fill="#444">
              Consumption CT's Wire in wireway
            </text>
          </g>
        </g>

        {/* ========================================================================= */}
        {/* 2. CONSUMER UNIT / LOAD CENTER / MDB                                      */}
        {/* ========================================================================= */}
        <g id="load-center" transform="translate(180, 150)">
          {/* Box outline */}
          <rect x="0" y="0" width="265" height="155" fill="#fff" stroke="#000" strokeWidth="1.2" />
          <text x="10" y="14" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
            {loadCenterConfig.title}
          </text>

          {/* Main Breaker */}
          <CircuitBreakerSymbol
            x={132}
            y={40}
            poles={is3Phase ? 3 : 2}
            label={loadCenterConfig.mainBreaker.split('IC')[0] || loadCenterConfig.mainBreaker}
            sublabel={loadCenterConfig.mainBreaker.includes('IC') ? `IC ${loadCenterConfig.mainBreaker.split('IC')[1]}` : ''}
          />

          {/* Main Busbar */}
          <line x1="30" y1="75" x2="235" y2="75" stroke="#000" strokeWidth="2.5" />
          <line x1="132" y1="58" x2="132" y2="75" stroke="#000" strokeWidth="1.8" />

          {/* Branch Loads (Customer House Loads) */}
          {[45, 75, 105, 135].map((bx, i) => (
            <g key={i} transform={`translate(${bx}, 75)`}>
              <line x1="0" y1="0" x2="0" y2="15" stroke="#000" strokeWidth="1.2" />
              <CircuitBreakerSymbol x={0} y={25} poles={1} />
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
              label={loadCenterConfig.solarFeederBreaker.split('IC')[0] || loadCenterConfig.solarFeederBreaker}
            />
            {/* Feeder line out of Load Center towards Solar Combiner Box */}
            <line x1="0" y1="43" x2="0" y2="80" stroke="#000" strokeWidth="1.8" />
          </g>

          {/* Neutral & Ground Busbar details */}
          <g transform="translate(235, 120)">
            <line x1="0" y1="0" x2="35" y2="0" stroke="#000" strokeWidth="1.5" />
            <GroundSymbol x={35} y={0} size={14} />
            <text x="45" y="10" fontFamily="Arial, sans-serif" fontSize="7" fill="#000">
              {combinerConfig.groundCableSpec}
            </text>
            <text x="45" y="22" fontFamily="Arial, sans-serif" fontSize="6.5" fill="#444">
              {loadCenterConfig.groundRodSpec}
            </text>
          </g>
        </g>

        {/* Cable Callout: Load Center to Solar Combiner Box */}
        <g transform="translate(180, 315)">
          <line x1="195" y1="-10" x2="195" y2="40" stroke="#000" strokeWidth="1.8" />
          <text x="0" y="15" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
            {combinerConfig.cableCombinerToMdb}
          </text>
          <text x="0" y="28" fontFamily="Arial, sans-serif" fontSize="7" fill="#444">
            ระบบไฟฟ้าเดิมของผู้ใช้ไฟฟ้า ────► ระบบโซลาร์เซลล์
          </text>
        </g>

        {/* ========================================================================= */}
        {/* 3. SOLAR CELL COMBINER BOX                                                */}
        {/* ========================================================================= */}
        <g id="solar-combiner" transform="translate(180, 355)">
          {/* Main Box Outline */}
          <rect x="0" y="0" width="370" height="195" fill="#fff" stroke="#000" strokeWidth="1.5" />
          <text x="12" y="16" fontFamily="Arial, sans-serif" fontSize="8.5" fontWeight="bold" fill="#000">
            {isMicro ? 'Solar Cell Combiner Box' : 'Solar DC/AC Combiner & Distribution Box'}
          </text>

          {/* AC SPD */}
          <g transform="translate(45, 60)">
            <SpdSymbol x={0} y={0} label={combinerConfig.acSpdRating.split('TYPE')[0] || 'AC SPD'} typeText="TYPE II 20/40kA" />
            <line x1="0" y1="-40" x2="0" y2="-20" stroke="#000" strokeWidth="1.2" />
            <line x1="0" y1="20" x2="0" y2="50" stroke="#000" strokeWidth="1.2" />
            <GroundSymbol x={0} y={50} size={12} />
          </g>

          {/* Interconnecting Line to SPD */}
          <line x1="45" y1="20" x2="145" y2="20" stroke="#000" strokeWidth="1.5" />

          {/* Protection Relays & RCBO */}
          <g transform="translate(145, 20)">
            {/* IEEE Relay Circles */}
            <g transform="translate(-30, 25)">
              <RelayCircle cx={0} cy={0} code="50" />
              <RelayCircle cx={20} cy={0} code="50N" />
              <RelayCircle cx={0} cy={22} code="51" />
              <RelayCircle cx={20} cy={22} code="51N" />
            </g>

            {/* RCBO */}
            <line x1="0" y1="0" x2="0" y2="15" stroke="#000" strokeWidth="1.8" />
            <CircuitBreakerSymbol
              x={0}
              y={25}
              poles={is3Phase ? 4 : 2}
              label={combinerConfig.rcboRating}
              sublabel={combinerConfig.rcboType}
            />
            <line x1="0" y1="43" x2="0" y2="85" stroke="#000" strokeWidth="1.8" />

            {/* MCB / Isolator */}
            <CircuitBreakerSymbol
              x={0}
              y={95}
              poles={is3Phase ? 3 : 2}
              label={combinerConfig.mcbRating}
            />
            <line x1="0" y1="113" x2="0" y2="145" stroke="#000" strokeWidth="1.8" />

            {/* MCCB Main Isolator (for 3-Phase systems) */}
            {is3Phase && (
              <g transform="translate(0, 150)">
                <CircuitBreakerSymbol
                  x={0}
                  y={10}
                  poles={3}
                  label={combinerConfig.mccbRating}
                />
                <line x1="0" y1="28" x2="0" y2="55" stroke="#000" strokeWidth="1.8" />
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
              <text x="14" y="12" fontFamily="Arial, sans-serif" fontSize="6.5" fill="#000">
                {combinerConfig.productionCt}
              </text>
            </g>

            {/* Phase Coupler (if 3-Phase Enphase) */}
            {combinerConfig.hasPhaseCoupler && (
              <g transform="translate(-5, 115)">
                <rect x="0" y="0" width="105" height="18" fill="#fff" stroke="#000" strokeWidth="1" />
                <text x="52" y="12" fontFamily="Arial, sans-serif" fontSize="6.5" textAnchor="middle" fill="#000">
                  {combinerConfig.phaseCoupler}
                </text>
              </g>
            )}
          </g>

          {/* Grounding Rod Connection */}
          <g transform="translate(370, 160)">
            <line x1="0" y1="0" x2="35" y2="0" stroke="#000" strokeWidth="1.5" />
            <GroundSymbol x={35} y={0} size={14} />
            <text x="45" y="8" fontFamily="Arial, sans-serif" fontSize="7" fill="#000">
              {combinerConfig.groundRodSpec}
            </text>
            <text x="45" y="18" fontFamily="Arial, sans-serif" fontSize="6.5" fill="#444">
              {combinerConfig.groundCableSpec}
            </text>
          </g>
        </g>

        {/* Cable Callout: Combiner Box to Inverter / PV Branch */}
        <g transform="translate(180, 565)">
          <line x1="145" y1="-10" x2="145" y2="40" stroke="#000" strokeWidth="1.8" />
          <text x="-40" y="20" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">
            {combinerConfig.cableInverterToCombiner}
          </text>
        </g>

        {/* ========================================================================= */}
        {/* 4. LOWER SECTION: PV BRANCH & INVERTERS (Microinverter or String)         */}
        {/* ========================================================================= */}
        {isMicro ? (
          /* ------------------------------------------------------------- */
          /* MICROINVERTER SYSTEM (Enphase / ATMOCE)                       */
          /* ------------------------------------------------------------- */
          <g id="microinverter-system" transform="translate(120, 620)">
            {/* Header: PV Branch */}
            <text x="20" y="0" fontFamily="Arial, sans-serif" fontSize="8.5" fontWeight="bold" fill="#000">
              PV Branch #1 | {pvConfig.panelCount} MODULE
            </text>

            {/* Q-Cable Main Bus Line */}
            <line x1="20" y1="85" x2="490" y2="85" stroke="#000" strokeWidth="2" />
            <text x="240" y="102" fontFamily="Arial, sans-serif" fontSize="7.5" fill="#000">
              {is3Phase ? 'Enphase Q cable 4x4C (25A)' : '1x2C - Enphase Q cable (25A max)'}
            </text>
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
              // Generate display panel indices: 01, 02, 03, ..., last
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

            {/* Microinverter & PV Specs Callout on the left */}
            <g transform="translate(0, 115)">
              <text x="20" y="15" fontFamily="Arial, sans-serif" fontSize="8.5" fill="#000">
                Number of PV Module = {pvConfig.panelCount} Module, Maximum Power at {pvConfig.powerPerPanel} Wp
              </text>
              <text x="20" y="30" fontFamily="Arial, sans-serif" fontSize="8.5" fontWeight="bold" fill="#000">
                PV System Power = {pvConfig.totalKwp} kWp
              </text>
              <text x="20" y="48" fontFamily="Arial, sans-serif" fontSize="9.5" fontWeight="bold" fill="#000">
                AC output power (peak) = {inverterConfig.microinverterCount} Module x {inverterConfig.unitPowerVa}VA = {inverterConfig.totalOutputKva} kVA ({inverterConfig.totalOutputKw} kW)
              </text>
            </g>
          </g>
        ) : (
          /* ------------------------------------------------------------- */
          /* STRING INVERTER SYSTEM (Huawei SUN2000)                       */
          /* ------------------------------------------------------------- */
          <g id="string-inverter-system" transform="translate(120, 610)">
            {/* Header: PV Array Strings */}
            <text x="20" y="0" fontFamily="Arial, sans-serif" fontSize="8.5" fontWeight="bold" fill="#000">
              PV Array ({inverterConfig.stringCount} String(s) x {inverterConfig.modulesPerString} Modules = {pvConfig.panelCount} Modules)
            </text>

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
              <text x="100" y="18" fontFamily="Arial, sans-serif" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#000">
                {inverterConfig.brand} {inverterConfig.model}
              </text>
              <text x="15" y="42" fontFamily="Arial, sans-serif" fontSize="7" fill="#000">
                • Rated AC Power: {inverterConfig.stringInverterCapacityKw} kW
              </text>
              <text x="15" y="55" fontFamily="Arial, sans-serif" fontSize="7" fill="#000">
                • Max AC Apparent Power: {(inverterConfig.unitPowerVa / 1000).toFixed(1)} kVA
              </text>
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
              <text x="0" y="15" fontFamily="Arial, sans-serif" fontSize="8.5" fill="#000">
                Number of PV Module = {pvConfig.panelCount} Module, Maximum Power at {pvConfig.powerPerPanel} Wp
              </text>
              <text x="0" y="30" fontFamily="Arial, sans-serif" fontSize="8.5" fontWeight="bold" fill="#000">
                PV System Power = {pvConfig.totalKwp} kWp | Inverter Output = {inverterConfig.totalOutputKw} kW
              </text>
            </g>
          </g>
        )}

        {/* ========================================================================= */}
        {/* 5. MAIN DRAWING BANNER TITLE (Bottom Left / Center)                       */}
        {/* ========================================================================= */}
        <g transform="translate(100, 875)">
          <text x="350" y="0" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#000">
            Electrical Single Line Diagram Solar Roof Top - ON GRID
          </text>
          <text x="350" y="18" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#222">
            {isMicro
              ? `AC output power (peak) = ${inverterConfig.microinverterCount} Module x ${inverterConfig.unitPowerVa} VA = ${inverterConfig.totalOutputKva} kVA`
              : `Total Solar Installed Capacity = ${pvConfig.totalKwp} kWp | AC Output = ${inverterConfig.totalOutputKw} kW`}
          </text>
        </g>

        {/* ========================================================================= */}
        {/* 6. TECHNICAL SPECS, RELAY TABLE & PEA NOTES (Middle/Bottom Right)         */}
        {/* ========================================================================= */}
        <TechnicalNotesAndSpecs project={project} x={SPECS_X} y={SPECS_Y} />

        {/* ========================================================================= */}
        {/* 7. TITLE BLOCK (Full Height Right Column)                                 */}
        {/* ========================================================================= */}
        <TitleBlock project={project} x={TB_X} y={TB_Y} width={TB_WIDTH} height={TB_HEIGHT} />
      </svg>
    </div>
  );
};

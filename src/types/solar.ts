export type SystemType = 'microinverter' | 'string_inverter';
export type PhaseType = '1P' | '3P';
export type GridAuthority = 'PEA' | 'MEA';

export interface EngineerInfo {
  id: string;
  name: string;
  license: string;
  signatureText?: string;
  signatureImage?: string;
}

export interface RelayItem {
  code: string;
  description: string;
  protection: string;
}

export interface ProjectInfo {
  projectOwner: string;
  projectName: string;
  customerName: string;
  location: string;
  coordinates: string;
  jobNo: string;
  drawingNo: string;
  revision: string;
  date: string;
  engineer: EngineerInfo;
  gridAuthority: GridAuthority;
  gridVoltage: string;
  gridCableSpec: string;
}

export interface PVModuleConfig {
  brand: string;
  model: string;
  powerPerPanel: number; // Watt (e.g. 650)
  panelCount: number;    // Count (e.g. 8)
  voc: number;          // V
  isc: number;          // A
  vmp: number;          // V
  imp: number;          // A
  totalKwp: number;     // kWp (auto-calculated)
}

export interface InverterConfig {
  systemType: SystemType;
  brand: string;
  model: string;
  phase: PhaseType;
  // Microinverter specific:
  microinverterCount: number; // Qty (e.g. 8)
  unitPowerKw: number;        // kW per microinverter (e.g. 0.475)
  unitPowerVa: number;        // VA per microinverter (e.g. 480)
  unitMaxCurrent: number;     // A per microinverter (e.g. 2.07)
  // String Inverter specific:
  stringInverterCapacityKw: number; // kW (e.g. 5, 10, 20, 50, 100)
  stringInverterQuantity: number;  // Inverter count (default 1)
  stringCount: number;             // number of strings (e.g. 2)
  modulesPerString: number;        // modules per string (e.g. 8)
  mpptCount: number;               // MPPT count
  // Overall output:
  totalOutputKw: number;
  totalOutputKva: number;
  hasAntiIslanding: boolean;
  hasRapidShutdown: boolean;
}

export interface CombinerConfig {
  rcboRating: string;
  rcboType: string;
  mcbRating: string;
  mccbRating: string;
  acSpdRating: string;
  gatewayModel: string;
  productionCt: string;
  consumptionCt: string;
  phaseCoupler: string;
  hasZeroExport: boolean;
  hasPhaseCoupler: boolean;
  cableInverterToCombiner: string;
  cableCombinerToMdb: string;
  groundRodSpec: string;
  groundCableSpec: string;
  // String inverter DC protection:
  dcFuseRating?: string;
  dcIsolatorRating?: string;
  dcSpdRating?: string;
  dcCableSpec?: string;
}

export interface LoadCenterConfig {
  title: string; // "Consumer Unit" or "Load Center" or "MDB"
  mainBreaker: string;
  solarFeederBreaker: string;
  busbarSpec: string;
  groundRodSpec: string;
}

export interface SolarSLDProject {
  id: string;
  title: string;
  projectInfo: ProjectInfo;
  pvConfig: PVModuleConfig;
  inverterConfig: InverterConfig;
  combinerConfig: CombinerConfig;
  loadCenterConfig: LoadCenterConfig;
  showRelayTable: boolean;
  showZeroExportNote: boolean;
  showPhaseProtectionNote: boolean;
  customNotes?: string[];
  paperSize: 'A3' | 'A4';
  orientation: 'landscape';
}

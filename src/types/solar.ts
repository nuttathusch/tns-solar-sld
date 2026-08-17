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
  powerPerPanel: number;
  panelCount: number;
  voc: number;
  isc: number;
  vmp: number;
  imp: number;
  totalKwp: number;
}

export interface InverterConfig {
  systemType: SystemType;
  brand: string;
  model: string;
  phase: PhaseType;
  microinverterCount: number;
  unitPowerKw: number;
  unitPowerVa: number;
  unitMaxCurrent: number;
  stringInverterCapacityKw: number;
  stringInverterQuantity: number;
  stringCount: number;
  modulesPerString: number;
  mpptCount: number;
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
  dcFuseRating?: string;
  dcIsolatorRating?: string;
  dcSpdRating?: string;
  dcCableSpec?: string;
}

export interface LoadCenterConfig {
  title: string;
  mainBreaker: string;
  solarFeederBreaker: string;
  busbarSpec: string;
  groundRodSpec: string;
}

export interface ElementOffset {
  dx: number;
  dy: number;
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
  customOffsets?: Record<string, ElementOffset>;
}

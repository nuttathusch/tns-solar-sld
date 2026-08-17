import type { EngineerInfo, RelayItem } from '../types/solar';

export interface PVModuleOption {
  brand: string;
  model: string;
  powerPerPanel: number;
  voc: number;
  isc: number;
  vmp: number;
  imp: number;
}

export interface InverterOption {
  brand: string;
  model: string;
  systemType: 'microinverter' | 'string_inverter';
  phase: '1P' | '3P';
  unitPowerKw: number;
  unitPowerVa: number;
  unitMaxCurrent: number;
  nominalCapacityKw?: number;
  mpptCount?: number;
}

export const PV_MODULE_DATABASE: PVModuleOption[] = [
  {
    brand: 'LONGi',
    model: 'LR5-78HGD-635M',
    powerPerPanel: 635,
    voc: 57.39,
    isc: 13.97,
    vmp: 48.15,
    imp: 13.19,
  },
  {
    brand: 'LONGi',
    model: 'LR7-72HVH-645M',
    powerPerPanel: 645,
    voc: 53.80,
    isc: 15.21,
    vmp: 44.46,
    imp: 14.51,
  },
  {
    brand: 'LONGi',
    model: 'LR5-72HPH-555M',
    powerPerPanel: 555,
    voc: 49.95,
    isc: 14.04,
    vmp: 42.10,
    imp: 13.19,
  },
  {
    brand: 'LONGi',
    model: 'LR5-78HGD-650M',
    powerPerPanel: 650,
    voc: 57.80,
    isc: 14.15,
    vmp: 48.50,
    imp: 13.40,
  },
  {
    brand: 'Jinko Solar',
    model: 'JKM585N-72HL4-BDV',
    powerPerPanel: 585,
    voc: 51.50,
    isc: 14.36,
    vmp: 43.10,
    imp: 13.57,
  },
  {
    brand: 'Jinko Solar',
    model: 'Tiger Neo 620W N-type',
    powerPerPanel: 620,
    voc: 53.20,
    isc: 14.75,
    vmp: 44.50,
    imp: 13.93,
  },
  {
    brand: 'Trina Solar',
    model: 'TSM-DEG21C.20 670W',
    powerPerPanel: 670,
    voc: 45.70,
    isc: 18.52,
    vmp: 38.30,
    imp: 17.50,
  },
];

export const INVERTER_DATABASE: InverterOption[] = [
  // Enphase Microinverters
  {
    brand: 'Enphase',
    model: 'IQ7A-72-2-INT',
    systemType: 'microinverter',
    phase: '1P',
    unitPowerKw: 0.349,
    unitPowerVa: 366,
    unitMaxCurrent: 1.52,
  },
  {
    brand: 'Enphase',
    model: 'IQ7A-72-2-INT (3-Phase)',
    systemType: 'microinverter',
    phase: '3P',
    unitPowerKw: 0.349,
    unitPowerVa: 366,
    unitMaxCurrent: 1.49,
  },
  {
    brand: 'Enphase',
    model: 'IQ8P-72-2-INT',
    systemType: 'microinverter',
    phase: '3P',
    unitPowerKw: 0.475,
    unitPowerVa: 480,
    unitMaxCurrent: 2.07,
  },
  {
    brand: 'Enphase',
    model: 'IQ7PLUS-72-2-INT',
    systemType: 'microinverter',
    phase: '1P',
    unitPowerKw: 0.290,
    unitPowerVa: 295,
    unitMaxCurrent: 1.28,
  },
  // ATMOCE Microinverters
  {
    brand: 'ATMOCE',
    model: 'ATM-MI-800W',
    systemType: 'microinverter',
    phase: '1P',
    unitPowerKw: 0.800,
    unitPowerVa: 800,
    unitMaxCurrent: 3.48,
  },
  {
    brand: 'ATMOCE',
    model: 'ATM-MI-1600W-3P',
    systemType: 'microinverter',
    phase: '3P',
    unitPowerKw: 1.600,
    unitPowerVa: 1600,
    unitMaxCurrent: 2.31,
  },
  // Huawei String Inverters (1-Phase & 3-Phase 3kW - 115kW)
  {
    brand: 'Huawei',
    model: 'SUN2000-3KTL-L1',
    systemType: 'string_inverter',
    phase: '1P',
    unitPowerKw: 3.0,
    unitPowerVa: 3300,
    unitMaxCurrent: 15.0,
    nominalCapacityKw: 3,
    mpptCount: 2,
  },
  {
    brand: 'Huawei',
    model: 'SUN2000-5KTL-L1',
    systemType: 'string_inverter',
    phase: '1P',
    unitPowerKw: 5.0,
    unitPowerVa: 5500,
    unitMaxCurrent: 25.0,
    nominalCapacityKw: 5,
    mpptCount: 2,
  },
  {
    brand: 'Huawei',
    model: 'SUN2000-5KTL-M1',
    systemType: 'string_inverter',
    phase: '3P',
    unitPowerKw: 5.0,
    unitPowerVa: 5500,
    unitMaxCurrent: 8.5,
    nominalCapacityKw: 5,
    mpptCount: 2,
  },
  {
    brand: 'Huawei',
    model: 'SUN2000-10KTL-M2',
    systemType: 'string_inverter',
    phase: '3P',
    unitPowerKw: 10.0,
    unitPowerVa: 11000,
    unitMaxCurrent: 16.9,
    nominalCapacityKw: 10,
    mpptCount: 2,
  },
  {
    brand: 'Huawei',
    model: 'SUN2000-15KTL-M2',
    systemType: 'string_inverter',
    phase: '3P',
    unitPowerKw: 15.0,
    unitPowerVa: 16500,
    unitMaxCurrent: 25.2,
    nominalCapacityKw: 15,
    mpptCount: 2,
  },
  {
    brand: 'Huawei',
    model: 'SUN2000-20KTL-M2',
    systemType: 'string_inverter',
    phase: '3P',
    unitPowerKw: 20.0,
    unitPowerVa: 22000,
    unitMaxCurrent: 33.5,
    nominalCapacityKw: 20,
    mpptCount: 4,
  },
  {
    brand: 'Huawei',
    model: 'SUN2000-30KTL-M3',
    systemType: 'string_inverter',
    phase: '3P',
    unitPowerKw: 30.0,
    unitPowerVa: 33000,
    unitMaxCurrent: 47.9,
    nominalCapacityKw: 30,
    mpptCount: 4,
  },
  {
    brand: 'Huawei',
    model: 'SUN2000-40KTL-M3',
    systemType: 'string_inverter',
    phase: '3P',
    unitPowerKw: 40.0,
    unitPowerVa: 44000,
    unitMaxCurrent: 63.8,
    nominalCapacityKw: 40,
    mpptCount: 4,
  },
  {
    brand: 'Huawei',
    model: 'SUN2000-50KTL-M3',
    systemType: 'string_inverter',
    phase: '3P',
    unitPowerKw: 50.0,
    unitPowerVa: 55000,
    unitMaxCurrent: 79.7,
    nominalCapacityKw: 50,
    mpptCount: 4,
  },
  {
    brand: 'Huawei',
    model: 'SUN2000-100KTL-M1',
    systemType: 'string_inverter',
    phase: '3P',
    unitPowerKw: 100.0,
    unitPowerVa: 110000,
    unitMaxCurrent: 160.0,
    nominalCapacityKw: 100,
    mpptCount: 10,
  },
  {
    brand: 'Huawei',
    model: 'SUN2000-115KTL-M2',
    systemType: 'string_inverter',
    phase: '3P',
    unitPowerKw: 115.0,
    unitPowerVa: 125000,
    unitMaxCurrent: 182.0,
    nominalCapacityKw: 115,
    mpptCount: 10,
  },
];

export const STANDARD_ENGINEERS: EngineerInfo[] = [
  {
    id: 'chuta',
    name: 'นาย จุฑา พรพนมชัย',
    license: 'ภฟก.54706',
    signatureText: 'จุฑา พรพนมชัย ภฟก.54706',
  },
  {
    id: 'pamorn',
    name: 'นาย ภมร ตาคำ',
    license: 'ภฟก.46868',
    signatureText: 'ภมร ตาคำ ภฟก.46868',
  },
  {
    id: 'saranyawat',
    name: 'นาย ศรัณยวัฒ เปรมจิตต์',
    license: 'ภฟก.68492',
    signatureText: 'ศรัณยวัฒ เปรมจิตต์ ภฟก.68492',
  },
];

export const STANDARD_RELAY_ITEMS: RelayItem[] = [
  { code: '50', description: 'INSTANTANEOUS OVERCURRENT RELAY', protection: '*RCBO (SOLAR)' },
  { code: '50N', description: 'INSTANTANEOUS GROUND FAULT RELAY', protection: '*RCBO (SOLAR)' },
  { code: '51', description: 'AC TIME OVERCURRENT RELAY', protection: '*RCBO (SOLAR)' },
  { code: '51N', description: 'TIME DELAY GROUND FAULT RELAY', protection: '*RCBO (SOLAR)' },
  { code: '27', description: 'UNDERVOLTAGE RELAY', protection: 'INVERTER' },
  { code: '59', description: 'OVER VOLTAGE RELAY', protection: 'INVERTER' },
  { code: '81O', description: 'OVER FREQUENCY RELAY', protection: 'INVERTER' },
  { code: '81U', description: 'UNDER FREQUENCY RELAY', protection: 'INVERTER' },
];

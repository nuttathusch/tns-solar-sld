import type { InverterConfig, PhaseType, PVModuleConfig } from '../types/solar';

export interface SizingRecommendation {
  calculatedCurrentA: number;
  recommendedBreakerA: number;
  breakerRatingText: string;
  recommendedCableSizeSqmm: number;
  cableSpecText: string;
  groundCableSizeSqmm: number;
  groundCableSpecText: string;
  conduitSizeInch: string;
}

export function calculatePVTotal(pv: PVModuleConfig): number {
  return Number(((pv.powerPerPanel * pv.panelCount) / 1000).toFixed(3));
}

export function calculateInverterOutput(inverter: InverterConfig): { totalKw: number; totalKva: number } {
  if (inverter.systemType === 'microinverter') {
    const totalKw = Number((inverter.microinverterCount * inverter.unitPowerKw).toFixed(3));
    const totalKva = Number(((inverter.microinverterCount * inverter.unitPowerVa) / 1000).toFixed(3));
    return { totalKw, totalKva };
  } else {
    const totalKw = Number((inverter.stringInverterQuantity * inverter.stringInverterCapacityKw).toFixed(2));
    const totalKva = Number((inverter.stringInverterQuantity * (inverter.unitPowerVa / 1000)).toFixed(2));
    return { totalKw, totalKva };
  }
}

export function calculateElectricalSizing(
  phase: PhaseType,
  totalKva: number
): SizingRecommendation {
  const voltage = phase === '1P' ? 230 : 400;
  const current =
    phase === '1P'
      ? (totalKva * 1000) / voltage
      : (totalKva * 1000) / (Math.sqrt(3) * voltage);

  const designCurrent = current * 1.25;

  // Standard Breaker Steps
  const standardBreakers = [16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400];
  const recommendedBreaker = standardBreakers.find((b) => b >= designCurrent) || 400;

  // Cable Sizing (Copper PVC/XLPE in conduit / wireway)
  let cableSize = 4;
  let groundSize = 6;
  let conduit = '1"';

  if (recommendedBreaker <= 20) {
    cableSize = 4;
    groundSize = 6;
    conduit = '1"';
  } else if (recommendedBreaker <= 32) {
    cableSize = 6;
    groundSize = 6;
    conduit = '1"';
  } else if (recommendedBreaker <= 40) {
    cableSize = 10;
    groundSize = 10;
    conduit = '1 1/4"';
  } else if (recommendedBreaker <= 63) {
    cableSize = 16;
    groundSize = 10;
    conduit = '1 1/2"';
  } else if (recommendedBreaker <= 80) {
    cableSize = 25;
    groundSize = 16;
    conduit = '2"';
  } else if (recommendedBreaker <= 100) {
    cableSize = 35;
    groundSize = 16;
    conduit = '2"';
  } else if (recommendedBreaker <= 160) {
    cableSize = 70;
    groundSize = 25;
    conduit = '2 1/2"';
  } else if (recommendedBreaker <= 200) {
    cableSize = 95;
    groundSize = 35;
    conduit = '3"';
  } else {
    cableSize = 150;
    groundSize = 50;
    conduit = '4"';
  }

  const poleCountBreaker = phase === '1P' ? '2P' : '3P';

  const breakerRatingText =
    recommendedBreaker <= 32
      ? `MCB ${poleCountBreaker} ${recommendedBreaker}AT,63AF IC 6kA`
      : `MCCB ${poleCountBreaker} ${recommendedBreaker}AT 100AF IC 10kA`;

  const cableCores = phase === '1P' ? '2x1C' : '4x1C';
  const cableSpecText = `${cableCores}-${cableSize} Sq.mm. IEC01 / G ${groundSize} Sq.mm. IEC01 IN WIREWAY`;
  const groundCableSpecText = `1x${groundSize} sq.mm. /IEC01 (G)`;

  return {
    calculatedCurrentA: Number(current.toFixed(2)),
    recommendedBreakerA: recommendedBreaker,
    breakerRatingText,
    recommendedCableSizeSqmm: cableSize,
    cableSpecText,
    groundCableSizeSqmm: groundSize,
    groundCableSpecText,
    conduitSizeInch: conduit,
  };
}

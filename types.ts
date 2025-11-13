export interface Cell {
  id: number;
  voltage: number;
  internalResistance: number;
  isAnomaly?: boolean;
  anomalyReason?: string;
  zScore?: number;
}

export interface BatteryData {
  packVoltage: number;
  packCurrent: number;
  temperature: number;
  stateOfCharge: number;
  cells: Cell[];
  designCapacity: number;
  fullChargeCapacity: number;
  stateOfHealth: number;
  cycleCount: number;
}

export interface ScanHistoryItem {
  id: string; // timestamp as a unique ID
  timestamp: string;
  vehicle: string;
  verdictText: string;
  anomalyCount: number;
  data: BatteryData;
}

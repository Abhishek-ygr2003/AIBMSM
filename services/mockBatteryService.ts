import { BatteryData, Cell } from '../types';

const TOTAL_CELLS = 96;
const NORMAL_VOLTAGE = 3.7;
const VOLTAGE_NOISE = 0.015;
const NORMAL_RESISTANCE = 0.002; // in Ohms
const RESISTANCE_NOISE = 0.0005;

// Anomalies
const ANOMALY_CELL_1_ID = 15; // Low voltage
const ANOMALY_CELL_2_ID = 78; // High voltage
const ANOMALY_CELL_3_ID = 52; // High internal resistance

const ANOMALY_CELL_1_VOLTAGE = 3.55;
const ANOMALY_CELL_2_VOLTAGE = 3.82;
const ANOMALY_CELL_3_RESISTANCE = 0.015; // Significantly higher resistance

// Static Battery Health Info
const DESIGN_CAPACITY = 4000; // mAh
const FULL_CHARGE_CAPACITY = 3650; // mAh, representing some degradation
const CYCLE_COUNT = 312;

let intervalId: number | null = null;

const generateCellData = (): Cell[] => {
  return Array.from({ length: TOTAL_CELLS }, (_, i) => {
    const id = i + 1;
    let voltage = NORMAL_VOLTAGE + (Math.random() - 0.5) * 2 * VOLTAGE_NOISE;
    let internalResistance = NORMAL_RESISTANCE + (Math.random() - 0.5) * 2 * RESISTANCE_NOISE;

    if (id === ANOMALY_CELL_1_ID) {
      voltage = ANOMALY_CELL_1_VOLTAGE + (Math.random() - 0.5) * VOLTAGE_NOISE;
    } else if (id === ANOMALY_CELL_2_ID) {
      voltage = ANOMALY_CELL_2_VOLTAGE + (Math.random() - 0.5) * VOLTAGE_NOISE;
    } else if (id === ANOMALY_CELL_3_ID) {
      internalResistance = ANOMALY_CELL_3_RESISTANCE + (Math.random() - 0.5) * RESISTANCE_NOISE;
    }
    
    return { 
      id, 
      voltage: parseFloat(voltage.toFixed(3)),
      internalResistance: parseFloat(internalResistance.toFixed(4)),
    };
  });
};

const generateBatteryData = (): BatteryData => {
  const cells = generateCellData();
  const packVoltage = cells.reduce((sum, cell) => sum + cell.voltage, 0) / (TOTAL_CELLS/4); // Simplified series voltage
  const stateOfHealth = (FULL_CHARGE_CAPACITY / DESIGN_CAPACITY) * 100;
  
  return {
    packVoltage: parseFloat(packVoltage.toFixed(2)),
    packCurrent: parseFloat((15 + Math.random() * 5).toFixed(2)),
    temperature: parseFloat((45 + Math.random() * 5).toFixed(1)),
    stateOfCharge: parseFloat((75 - Math.random() * 2).toFixed(1)),
    cells,
    designCapacity: DESIGN_CAPACITY,
    fullChargeCapacity: FULL_CHARGE_CAPACITY,
    stateOfHealth: parseFloat(stateOfHealth.toFixed(1)),
    cycleCount: CYCLE_COUNT
  };
};

export const mockBatteryService = {
  startStreaming: (
    callback: (data: BatteryData) => void,
    options?: { cycle?: boolean; intervalMs?: number }
  ) => {
    const cycle = options?.cycle ?? true;
    const intervalMs = options?.intervalMs ?? 2000;

    if (intervalId) {
      clearInterval(intervalId);
    }

    const data = generateBatteryData();
    callback(data); // Initial data

    if (cycle) {
      intervalId = window.setInterval(() => {
        callback(generateBatteryData());
      }, intervalMs);
    } else {
      intervalId = null;
    }
  },
  stopStreaming: () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  },
};

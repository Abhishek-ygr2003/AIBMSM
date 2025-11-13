import React from 'react';
import { BatteryData } from '../types';
import { getHealthVerdictText, getVerdictClassName } from '../utils/verdict';

interface BatteryHealthSummaryProps {
  data: BatteryData;
  anomalyCount: number;
  onRunQuickScan: () => void;
  onRunDeepScan: () => void;
  isQuickScanning: boolean;
  quickScanSoh: number | null;
  sohJustUpdated: boolean;
}

const BatteryHealthSummary: React.FC<BatteryHealthSummaryProps> = ({ data, anomalyCount, onRunQuickScan, onRunDeepScan, isQuickScanning, quickScanSoh, sohJustUpdated }) => {
    const verdictText = getHealthVerdictText(data.stateOfHealth, anomalyCount);
    const verdictClassName = getVerdictClassName(verdictText);

    const sohToDisplay = quickScanSoh !== null ? quickScanSoh : data.stateOfHealth;
    const sohLabel = quickScanSoh !== null ? "SOH (ML-Verified):" : "State of Health (SoH):";

    const sohValueClassName = `font-semibold text-slate-100 transition-all duration-500 ${sohJustUpdated ? 'text-teal-300 scale-110' : ''}`;


    return (
        <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg border border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-slate-200">Battery Health Summary</h2>
            
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-400">Health Verdict:</span>
                    <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${verdictClassName}`}>{verdictText}</span>
                </div>
                <div className="flex justify-between items-baseline">
                    <span className="text-slate-400">{sohLabel}</span>
                    <span className={sohValueClassName}>{sohToDisplay}%</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Cycle Count:</span>
                    <span className="font-semibold text-slate-100">{data.cycleCount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Design Capacity:</span>
                    <span className="font-semibold text-slate-100">{data.designCapacity} mAh</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Full Charge Capacity:</span>
                    <span className="font-semibold text-slate-100">{data.fullChargeCapacity} mAh</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
                <h3 className="text-base font-bold text-slate-300 mb-3">Advanced Diagnostics (Demo)</h3>
                <div className="space-y-2 text-sm">
                    <button 
                        onClick={onRunQuickScan}
                        disabled={isQuickScanning}
                        className="w-full px-4 py-2 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center justify-center"
                    >
                        {isQuickScanning && (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isQuickScanning ? 'Analyzing DCIR...' : 'Run Quick SOH Scan (Tier 1)'}
                    </button>
                    <button 
                        onClick={onRunDeepScan}
                        className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors"
                    >
                        Run Deep Diagnostic (Tier 2)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BatteryHealthSummary;
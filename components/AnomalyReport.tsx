
import React from 'react';
import { Cell } from '../types';

interface AnomalyReportProps {
  anomalies: Cell[];
}

const AnomalyReport: React.FC<AnomalyReportProps> = ({ anomalies }) => {
  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-200">Live Anomaly Report</h2>
      <div className="max-h-60 overflow-y-auto pr-2">
        {anomalies.length > 0 ? (
          <ul className="space-y-3">
            {anomalies.map((cell) => (
              <li key={cell.id} className="p-3 bg-black/50 rounded-lg border border-red-500/30">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-red-400">Cell #{cell.id}</span>
                    <div className="text-right text-xs">
                        <p>V: <span className="font-medium text-gray-200">{cell.voltage.toFixed(3)}</span></p>
                        <p>Ω: <span className="font-medium text-gray-200">{(cell.internalResistance * 1000).toFixed(1)} mΩ</span></p>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{cell.anomalyReason}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-green-400 font-semibold">No Anomalies Detected</p>
            <p className="text-sm text-gray-500">All cells are operating within normal parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyReport;

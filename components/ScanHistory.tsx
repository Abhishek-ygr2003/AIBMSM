import React from 'react';
import { ScanHistoryItem } from '../types';
import { getVerdictClassName } from '../utils/verdict';

interface ScanHistoryProps {
  history: ScanHistoryItem[];
  onView: (item: ScanHistoryItem) => void;
  onClear: () => void;
  viewingHistoryId: string | null;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ history, onView, onClear, viewingHistoryId }) => {
  return (
    <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-200">Scan History</h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            Clear History
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto pr-2">
        {history.length > 0 ? (
          <ul className="space-y-3">
            {history.map((item) => {
              const isViewing = viewingHistoryId === item.id;
              return (
              <li key={item.id} className={`p-3 rounded-lg border transition-all ${isViewing ? 'bg-blue-900/50 border-blue-500' : 'bg-slate-900/70 border-slate-700'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-200 text-sm">{item.vehicle}</p>
                    <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                  <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${getVerdictClassName(item.verdictText)}`}>
                    {item.verdictText}
                  </span>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <p className="text-xs text-slate-400">
                    Anomalies: <span className="font-bold text-red-400">{item.anomalyCount}</span>
                  </p>
                  <button
                    onClick={() => onView(item)}
                    disabled={isViewing}
                    className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                  >
                    {isViewing ? 'Viewing' : 'View Details'}
                  </button>
                </div>
              </li>
            )})}
          </ul>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 font-semibold">No Scan History</p>
            <p className="text-sm text-slate-500 mt-1">Completed scans will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanHistory;

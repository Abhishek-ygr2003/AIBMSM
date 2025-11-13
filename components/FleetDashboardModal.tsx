import React from 'react';

interface FleetDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FleetDashboardModal: React.FC<FleetDashboardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-lg p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Fleet Dashboard (Phase 3 Preview)
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-slate-300 text-sm space-y-4">
            <p>
                The upcoming Fleet Dashboard is a powerful web application designed for B2B customers managing multiple vehicles. It provides a centralized command center for monitoring the battery health of your entire fleet.
            </p>
            <h3 className="font-bold text-slate-100 pt-2 border-t border-slate-700">Key Features will include:</h3>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong className="text-cyan-400">Fleet-Wide Health Overview:</strong> At-a-glance visualization of SOH and anomaly status for all assets.</li>
                <li><strong className="text-cyan-400">Historical Trend Analysis:</strong> Track battery degradation over time for each vehicle to forecast replacement needs.</li>
                <li><strong className="text-cyan-400">Predictive Maintenance Alerts:</strong> Configure custom alerts for when a battery's health drops below a certain threshold, enabling proactive service.</li>
                <li><strong className="text-cyan-400">API Integration:</strong> Seamlessly integrate battery health data into your existing Fleet Management Systems (FMS).</li>
            </ul>
            <p className="pt-4 text-xs text-slate-400">This feature is scheduled for development in Phase 3 and will be a game-changer for commercial operators.</p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors"
        >
          Close Preview
        </button>
      </div>
    </div>
  );
};

export default FleetDashboardModal;

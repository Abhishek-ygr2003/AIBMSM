import React, { useState } from 'react';
import FleetDashboardModal from './FleetDashboardModal';

const Header: React.FC = () => {
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);

  return (
    <>
      <header className="p-4 sm:p-6 border-b border-slate-700/50">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Advanced EV Battery Diagnostics
            </h1>
            <p className="text-sm text-slate-400 mt-1">MVP for Indian 2/3-Wheeler Market</p>
          </div>
          <button 
            onClick={() => setIsFleetModalOpen(true)} 
            className="hidden sm:block text-sm text-blue-300 hover:text-blue-200 border border-blue-400/50 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
          >
            Fleet Dashboard (Demo)
          </button>
        </div>
      </header>
      <FleetDashboardModal isOpen={isFleetModalOpen} onClose={() => setIsFleetModalOpen(false)} />
    </>
  );
};

export default Header;
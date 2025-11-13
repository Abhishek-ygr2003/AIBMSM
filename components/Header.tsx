
import React, { useState } from 'react';
import FleetDashboardModal from './FleetDashboardModal';

const Header: React.FC = () => {
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);

  return (
    <>
      <header className="p-4 sm:p-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              Advanced EV Battery Diagnostics
            </h1>
            <p className="text-sm text-gray-500 mt-1">MVP for Indian 2/3-Wheeler Market</p>
          </div>
          <button 
            onClick={() => setIsFleetModalOpen(true)} 
            className="hidden sm:block text-sm text-cyan-400 hover:text-white border border-cyan-400/50 px-3 py-1.5 rounded-md transition-all whitespace-nowrap"
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

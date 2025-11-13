
import React, { useState } from 'react';
import FleetDashboardModal from './FleetDashboardModal';
import ApiKeyModal from './ApiKeyModal';

const Header: React.FC = () => {
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

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
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsFleetModalOpen(true)} 
              className="hidden sm:block text-sm text-cyan-400 hover:text-white border border-cyan-400/50 px-3 py-1.5 rounded-md transition-all whitespace-nowrap"
            >
              Fleet Dashboard (Demo)
            </button>
            <button 
              onClick={() => setIsApiKeyModalOpen(true)}
              title="Set Google Gemini API Key"
              className="p-2 rounded-md border border-gray-700 hover:border-cyan-400/50 hover:text-white text-gray-400 transition-colors"
              aria-label="Set API Key"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
            </button>
          </div>
        </div>
      </header>
      <FleetDashboardModal isOpen={isFleetModalOpen} onClose={() => setIsFleetModalOpen(false)} />
      <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
    </>
  );
};

export default Header;
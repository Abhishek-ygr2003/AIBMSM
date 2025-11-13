
import React, { useState, useEffect } from 'react';
import { Cell } from '../types';
import { aiAssistantService } from '../services/aiAssistantService';
import MarkdownRenderer from './MarkdownRenderer';

interface SelectedCellDetailsProps {
  cell: Cell;
  onClose: () => void;
  selectedVehicle: string;
}

const SelectedCellDetails: React.FC<SelectedCellDetailsProps> = ({ cell, onClose, selectedVehicle }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [analysisError, setAnalysisError] = useState('');

  // Reset AI state when cell changes
  useEffect(() => {
    setIsAnalyzing(false);
    setAiSuggestion('');
    setAnalysisError('');
  }, [cell.id]);

  const handleAskAI = async () => {
    setIsAnalyzing(true);
    setAiSuggestion('');
    setAnalysisError('');
    try {
      const suggestion = await aiAssistantService.getFixSuggestion(cell, selectedVehicle);
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setAnalysisError("Failed to get suggestion. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };


  const statusText = cell.isAnomaly ? cell.anomalyReason : 'Normal';
  const statusClassName = cell.isAnomaly ? 'text-red-400 font-bold' : 'text-green-400 font-bold';

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg border border-cyan-500 animate-fade-in relative">
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors z-10"
        aria-label="Close cell details"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-xl font-bold mb-4 text-gray-200">Selected Cell Details</h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Cell ID:</span>
          <span className="font-bold text-cyan-400 text-lg">#{cell.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Voltage:</span>
          <span className="font-semibold text-white">{cell.voltage.toFixed(3)} V</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Internal Resistance:</span>
          <span className="font-semibold text-white">{(cell.internalResistance * 1000).toFixed(1)} mΩ</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Z-Score:</span>
          <span className="font-semibold text-white">{cell.zScore?.toFixed(2)}</span>
        </div>
        <div className="pt-2 mt-2 border-t border-gray-800 flex justify-between items-center">
          <span className="text-gray-400">Status:</span>
          <span className={statusClassName}>{statusText}</span>
        </div>
      </div>

      {cell.isAnomaly && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <h3 className="font-semibold text-gray-300 mb-2">AI Assistant</h3>
          {!aiSuggestion && !isAnalyzing && !analysisError && (
            <button
              onClick={handleAskAI}
              className="w-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-fuchsia-500 transition-opacity"
            >
              Get Repair Suggestion
            </button>
          )}

          {isAnalyzing && (
            <div className="flex items-center justify-center text-sm text-gray-400">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              Analyzing...
            </div>
          )}

          {analysisError && <p className="text-sm text-red-400">{analysisError}</p>}
          
          {aiSuggestion && (
            <div className="text-sm text-gray-300 bg-black/50 p-3 rounded-md border border-gray-800">
              <MarkdownRenderer content={aiSuggestion} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectedCellDetails;

import React, { useState, useEffect } from 'react';

interface DeepDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleName: string;
}

const simulationSteps = [
  { text: 'Uploading test cycle data to cloud...', duration: 2000 },
  { text: 'Analyzing DCIR & impedance spectroscopy...', duration: 3000 },
  { text: 'Training GCN/Transformer model on historical data...', duration: 4000 },
  { text: 'Forecasting Remaining Useful Life (RUL)...', duration: 2500 },
  { text: 'Generating comprehensive report...', duration: 1500 },
];

const DeepDiagnosticModal: React.FC<DeepDiagnosticModalProps> = ({ isOpen, onClose, vehicleName }) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [results, setResults] = useState<{ soh: string; rul: string; confidence: string } | null>(null);

  useEffect(() => {
    let timer: number;
    if (isOpen && currentStep === -1) {
        // Start simulation
        timer = window.setTimeout(() => setCurrentStep(0), 500);
    } else if (!isOpen) {
        // Reset on close
        setCurrentStep(-1);
        setResults(null);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    let timer: number;
    if (currentStep >= 0 && currentStep < simulationSteps.length) {
      timer = window.setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, simulationSteps[currentStep].duration);
    } else if (currentStep === simulationSteps.length) {
      // Simulation complete
      setResults({ soh: '91.43%', rul: '22 Months', confidence: '98.5%' });
    }
    return () => clearTimeout(timer);
  }, [currentStep]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-md p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Deep Diagnostic (Tier 2)</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <p className="text-sm text-slate-400 mb-6">Simulating advanced analysis for <span className="font-semibold text-slate-300">{vehicleName}</span>...</p>

        {currentStep < simulationSteps.length ? (
            <div className="space-y-4">
                {simulationSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                        {index < currentStep ? (
                             <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                        ) : index === currentStep ? (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            </div>
                        ) : (
                            <div className="w-5 h-5 bg-slate-700 rounded-full flex-shrink-0" />
                        )}
                        <span className={`transition-colors ${index <= currentStep ? 'text-slate-300' : 'text-slate-500'}`}>
                            {step.text}
                        </span>
                    </div>
                ))}
            </div>
        ) : (
            <div className="animate-fade-in">
                <h3 className="text-lg font-semibold text-center text-green-400 mb-4">Analysis Complete</h3>
                <div className="bg-slate-900/50 p-4 rounded-lg space-y-3 border border-slate-700">
                    <div className="flex justify-between text-lg">
                        <span className="text-slate-400">Predicted SOH:</span>
                        <span className="font-bold text-slate-100">{results?.soh}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                        <span className="text-slate-400">Predicted RUL:</span>
                        <span className="font-bold text-slate-100">{results?.rul}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-slate-700">
                        <span className="text-slate-500">Model Confidence:</span>
                        <span className="font-semibold text-slate-300">{results?.confidence}</span>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="mt-6 w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors"
                >
                    Close Report
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default DeepDiagnosticModal;

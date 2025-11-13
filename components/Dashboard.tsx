
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BatteryData, Cell, ScanHistoryItem } from '../types';
import { mockBatteryService } from '../services/mockBatteryService';
import { historyService } from '../services/historyService';
import StatCard, { BoltIcon, ThermometerIcon, BatteryIcon, PowerIcon, HeartIcon, RefreshIcon } from './StatCard';
const CellVoltageChart = React.lazy(() => import('./CellVoltageChart'));
import DiagnosticControls from './DiagnosticControls';
import VehicleSelector from './VehicleSelector';
import BatteryHealthSummary from './BatteryHealthSummary';
import AnomalyReport from './AnomalyReport';
import ScanHistory from './ScanHistory';
import SelectedCellDetails from './SelectedCellDetails';
import DeepDiagnosticModal from './DeepDiagnosticModal';
import { getHealthVerdictText } from '../utils/verdict';
import { kmeans1d } from '../utils/clustering';
const VoltageClusterVisualizer = React.lazy(() => import('./VoltageClusterVisualizer'));


const Z_SCORE_THRESHOLD = 2.0; // Kept for informational calculation
const RESISTANCE_THRESHOLD = 0.010;

const processBatteryData = (data: BatteryData): { processedCells: Cell[], anomalies: Cell[], voltageClusters: { clusters: number[][], centroids: number[] } } => {
    const voltages = data.cells.map(c => c.voltage);
    const meanVoltage = voltages.reduce((a, b) => a + b) / voltages.length;
    const stdDev = Math.sqrt(voltages.map(x => Math.pow(x - meanVoltage, 2)).reduce((a, b) => a + b) / voltages.length);
  
    // K-Means Clustering for voltage anomalies
    const K = 2; // Assuming two clusters: 'normal' and 'anomaly'
    const { clusters, centroids } = kmeans1d(voltages, K);
    
    let anomalyClusterIndex = -1;
    if (clusters.length === K && clusters.every(c => c.length > 0)) {
        // The smaller cluster is considered the anomaly
        anomalyClusterIndex = clusters[0].length < clusters[1].length ? 0 : 1;
        
        // If clusters are similar in size, the one further from the overall mean is the anomaly
        // This handles cases where anomalies are almost as numerous as normal cells
        if (Math.abs(clusters[0].length - clusters[1].length) < data.cells.length * 0.1) { // less than 10% size difference
            anomalyClusterIndex = Math.abs(centroids[0] - meanVoltage) > Math.abs(centroids[1] - meanVoltage) ? 0 : 1;
        }
    }

    const anomalyVoltages = anomalyClusterIndex !== -1 ? new Set(clusters[anomalyClusterIndex]) : new Set();

    const processedCells = data.cells.map(cell => {
      const zScore = stdDev > 0 ? (cell.voltage - meanVoltage) / stdDev : 0;
      
      const isVoltageClusterAnomaly = anomalyVoltages.has(cell.voltage);
      const isResistanceAnomaly = cell.internalResistance > RESISTANCE_THRESHOLD;
      
      let anomalyReason = '';
      if(isVoltageClusterAnomaly && isResistanceAnomaly) {
        anomalyReason = 'Anomalous Voltage Cluster & High Resistance';
      } else if (isVoltageClusterAnomaly) {
        anomalyReason = 'Anomalous Voltage Cluster';
      } else if (isResistanceAnomaly) {
        anomalyReason = 'High Internal Resistance';
      }

      return {
        ...cell,
        zScore: zScore,
        isAnomaly: isVoltageClusterAnomaly || isResistanceAnomaly,
        anomalyReason: anomalyReason,
      };
    });

    const anomalies = processedCells.filter(cell => cell.isAnomaly);
    return { processedCells, anomalies, voltageClusters: { clusters, centroids } };
};


const Dashboard: React.FC = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [batteryData, setBatteryData] = useState<BatteryData | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('Ola S1 Pro (Gen 1)');
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [viewingHistoryItem, setViewingHistoryItem] = useState<ScanHistoryItem | null>(null);
  const [selectedCellId, setSelectedCellId] = useState<number | null>(null);
  
  // Demo state
  const [isQuickScanning, setIsQuickScanning] = useState(false);
  const [quickScanSoh, setQuickScanSoh] = useState<number | null>(null);
  const [sohJustUpdated, setSohJustUpdated] = useState(false);
  const [isDeepModalOpen, setIsDeepModalOpen] = useState(false);


  useEffect(() => {
    setHistory(historyService.getHistory());
  }, []);

  useEffect(() => {
    if (isScanning) {
      mockBatteryService.startStreaming(setBatteryData);
    } else {
      mockBatteryService.stopStreaming();
    }

    return () => {
      mockBatteryService.stopStreaming();
    };
  }, [isScanning]);
  
  const resetDemoState = () => {
    setIsQuickScanning(false);
    setQuickScanSoh(null);
    setIsDeepModalOpen(false);
    setSohJustUpdated(false);
  };

  const handleStartScan = useCallback(() => {
    setSelectedCellId(null);
    setViewingHistoryItem(null);
    resetDemoState();
    setIsScanning(true);
  }, []);

  const handleStopScan = useCallback(() => {
    if (batteryData) {
      const diagnosticData = processBatteryData(batteryData);
      const timestamp = new Date().toISOString();
      const newScan: ScanHistoryItem = {
        id: timestamp,
        timestamp,
        vehicle: selectedVehicle,
        verdictText: getHealthVerdictText(batteryData.stateOfHealth, diagnosticData.anomalies.length),
        anomalyCount: diagnosticData.anomalies.length,
        data: batteryData,
      };
      const updatedHistory = historyService.saveScan(newScan);
      setHistory(updatedHistory);
    }
    setIsScanning(false);
    setBatteryData(null);
    setSelectedCellId(null);
  }, [batteryData, selectedVehicle]);

  const handleViewHistory = useCallback((item: ScanHistoryItem) => {
    setIsScanning(false);
    setViewingHistoryItem(item);
    setSelectedCellId(null);
    resetDemoState();
  }, []);

  const handleReturnToLive = useCallback(() => {
    setViewingHistoryItem(null);
    setBatteryData(null);
    setSelectedCellId(null);
    resetDemoState();
  }, []);

  const handleClearHistory = useCallback(() => {
    historyService.clearHistory();
    setHistory([]);
  }, []);
  
  const handleCellSelect = useCallback((cellId: number) => {
    setSelectedCellId(prevId => prevId === cellId ? null : cellId);
  }, []);
  
  const activeData = useMemo(() => {
    const data = viewingHistoryItem ? viewingHistoryItem.data : batteryData;
    if (!data) return { batteryData: null, diagnosticData: null };
    const diagnosticData = processBatteryData(data);
    return {
        batteryData: data,
        diagnosticData: diagnosticData
    };
  }, [batteryData, viewingHistoryItem]);
  
  const handleRunQuickScan = useCallback(() => {
    if (!activeData.batteryData) return;
    setIsQuickScanning(true);
    setSohJustUpdated(false);
    // Simulate a 4-second scan
    setTimeout(() => {
        // Generate a slightly more "precise" SOH
        const baseSoh = activeData.batteryData!.stateOfHealth;
        // Make the change more noticeable for the demo
        const newSoh = parseFloat((baseSoh - (Math.random() * 1.5) - 0.5).toFixed(2));
        setQuickScanSoh(newSoh);
        setIsQuickScanning(false);
        setSohJustUpdated(true);
        // Reset the update flag after animation
        setTimeout(() => setSohJustUpdated(false), 1000);
    }, 4000);
  }, [activeData.batteryData]);

  const handleRunDeepScan = () => {
    setIsDeepModalOpen(true);
  };
  
  const selectedCell = useMemo(() => {
    if (!selectedCellId || !activeData.diagnosticData) return null;
    return activeData.diagnosticData.processedCells.find(c => c.id === selectedCellId) ?? null;
  }, [selectedCellId, activeData.diagnosticData]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <VehicleSelector
          selectedVehicle={selectedVehicle}
          onVehicleChange={setSelectedVehicle}
          disabled={isScanning || !!viewingHistoryItem}
        />
        {!viewingHistoryItem && (
            <DiagnosticControls
            isScanning={isScanning}
            onStart={handleStartScan}
            onStop={handleStopScan}
            />
        )}
      </div>

      {viewingHistoryItem && (
        <div className="bg-cyan-900/30 border border-cyan-600 rounded-lg p-4 flex justify-between items-center animate-fade-in">
          <p className="font-semibold text-cyan-300">
            Viewing scan for <span className="font-bold">{viewingHistoryItem.vehicle}</span> from {new Date(viewingHistoryItem.timestamp).toLocaleString()}
          </p>
          <button 
            onClick={handleReturnToLive} 
            className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-cyan-500 transition-colors"
          >
            Return to Live View
          </button>
        </div>
      )}

      {isScanning && !activeData.batteryData && <p className="text-center text-lg text-gray-400">Connecting to VCI and initiating scan...</p>}
      
      {activeData.batteryData && activeData.diagnosticData && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            <StatCard title="Pack Voltage" value={activeData.batteryData.packVoltage} unit="V" icon={<BoltIcon />} />
            <StatCard title="Pack Current" value={activeData.batteryData.packCurrent} unit="A" icon={<PowerIcon />} />
            <StatCard title="Temperature" value={activeData.batteryData.temperature} unit="°C" icon={<ThermometerIcon />} />
            <StatCard title="State of Charge" value={activeData.batteryData.stateOfCharge} unit="%" icon={<BatteryIcon />} />
            <StatCard title="State of Health" value={activeData.batteryData.stateOfHealth} unit="%" icon={<HeartIcon />} />
            <StatCard title="Cycle Count" value={activeData.batteryData.cycleCount} unit="" icon={<RefreshIcon />} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-200">{viewingHistoryItem ? 'Historical Cell Analysis' : 'Real-Time Cell Analysis'}</h2>
                <div className="h-80">
                  <React.Suspense fallback={<div className="flex items-center justify-center h-full">Loading chart…</div>}>
                    <CellVoltageChart 
                      cells={activeData.diagnosticData.processedCells} 
                      voltageThreshold={Z_SCORE_THRESHOLD}
                      resistanceThreshold={RESISTANCE_THRESHOLD}
                      onCellClick={handleCellSelect}
                      selectedCellId={selectedCellId}
                    />
                  </React.Suspense>
                </div>
                 <div className="mt-6">
                    <h3 className="text-lg font-bold mb-3 text-gray-300">Voltage Cluster Analysis</h3>
                    <React.Suspense fallback={<div className="py-6">Loading visualization…</div>}>
                      <VoltageClusterVisualizer 
                        cells={activeData.diagnosticData.processedCells} 
                        centroids={activeData.diagnosticData.voltageClusters.centroids}
                      />
                    </React.Suspense>
                </div>
            </div>

            <div className="space-y-6">
                <BatteryHealthSummary 
                  data={activeData.batteryData} 
                  anomalyCount={activeData.diagnosticData.anomalies.length}
                  onRunQuickScan={handleRunQuickScan}
                  onRunDeepScan={handleRunDeepScan}
                  isQuickScanning={isQuickScanning}
                  quickScanSoh={quickScanSoh}
                  sohJustUpdated={sohJustUpdated}
                />
                <AnomalyReport anomalies={activeData.diagnosticData.anomalies} />
                {selectedCell && (
                  <SelectedCellDetails 
                    cell={selectedCell} 
                    onClose={() => setSelectedCellId(null)}
                    selectedVehicle={selectedVehicle}
                  />
                )}
                <ScanHistory
                    history={history}
                    onView={handleViewHistory}
                    onClear={handleClearHistory}
                    viewingHistoryId={viewingHistoryItem?.id ?? null}
                />
            </div>
          </div>
        </div>
      )}

      {!isScanning && !activeData.batteryData && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col items-center justify-center h-[34rem] bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-700">
                <h2 className="text-2xl font-bold text-gray-400">Ready to Scan</h2>
                <p className="text-gray-500 mt-2">Select a vehicle and click "Start Scan" to begin diagnostics.</p>
            </div>
            <div className="space-y-6">
                <ScanHistory
                    history={history}
                    onView={handleViewHistory}
                    onClear={handleClearHistory}
                    viewingHistoryId={viewingHistoryItem?.id ?? null}
                />
            </div>
        </div>
      )}
      {isDeepModalOpen && (
        <DeepDiagnosticModal 
            isOpen={isDeepModalOpen}
            onClose={() => setIsDeepModalOpen(false)}
            vehicleName={selectedVehicle}
        />
      )}
    </div>
  );
};

export default Dashboard;

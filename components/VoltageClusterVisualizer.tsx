
import React from 'react';
import { Cell } from '../types';

interface VoltageClusterVisualizerProps {
  cells: Cell[];
  centroids: number[];
}

const VoltageClusterVisualizer: React.FC<VoltageClusterVisualizerProps> = ({ cells, centroids }) => {
  if (!cells || cells.length === 0) {
    return null;
  }

  const voltages = cells.map(c => c.voltage);
  const minVoltage = Math.min(...voltages);
  const maxVoltage = Math.max(...voltages);
  const range = maxVoltage - minVoltage;

  // Handle case where all voltages are the same
  if (range < 0.001) { // Use a small threshold to avoid issues with floating point precision
      return (
         <div className="w-full h-20 p-4 bg-black/50 rounded-lg border border-gray-800 flex items-center justify-center">
             <p className="text-gray-400 text-sm">All cells have uniform voltage ({minVoltage.toFixed(3)}V). No distinct clusters to visualize.</p>
         </div>
      );
  }

  const getPosition = (value: number) => ((value - minVoltage) / range) * 100;

  return (
    <div className="w-full h-20 p-4 bg-black/50 rounded-lg border border-gray-800">
        <div className="relative h-full w-full">
            {/* Axis line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700" />
            
            {/* Centroid markers */}
            {centroids.map((centroid, index) => (
                <div 
                    key={`centroid-${index}`} 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                    style={{ left: `${getPosition(centroid)}%` }}
                    title={`Cluster Centroid: ${centroid.toFixed(3)}V`}
                >
                    <div className="w-3 h-3 border-2 border-fuchsia-500 rounded-full bg-gray-900" />
                </div>
            ))}
            
            {/* Cell data points */}
            {cells.map(cell => (
                <div 
                    key={cell.id} 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full transition-transform duration-300 hover:scale-150"
                    style={{ 
                        left: `${getPosition(cell.voltage)}%`,
                        backgroundColor: cell.isAnomaly ? '#ef4444' : '#00f2ea'
                    }}
                    title={`Cell #${cell.id}: ${cell.voltage.toFixed(3)}V`}
                />
            ))}

            {/* Labels */}
            <div className="absolute -bottom-2 left-0 text-xs text-gray-500">{minVoltage.toFixed(3)}V</div>
            <div className="absolute -bottom-2 right-0 text-xs text-gray-500">{maxVoltage.toFixed(3)}V</div>
        </div>
    </div>
  );
};

export default VoltageClusterVisualizer;

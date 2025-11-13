
import React from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Cell as RechartsCell, Legend } from 'recharts';
import { Cell } from '../types';

interface CellVoltageChartProps {
  cells: Cell[];
  voltageThreshold: number;
  resistanceThreshold: number;
  onCellClick: (cellId: number) => void;
  selectedCellId: number | null;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const cellData = payload[0].payload;
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded-lg shadow-xl text-sm w-48">
          <p className="font-bold text-gray-200 mb-2">{`Cell #${label}`}</p>
          <p className="text-cyan-400">{`Voltage: ${payload[0].value.toFixed(3)} V`}</p>
          <p className="text-amber-400">{`Resistance: ${(payload[1].value * 1000).toFixed(1)} mΩ`}</p>
          <p className="text-gray-400">{`Z-score: ${cellData.zScore.toFixed(2)}`}</p>
          
          {cellData.isAnomaly && (
            <div className="mt-2 pt-2 border-t border-gray-700">
                <p className="font-semibold text-red-400">Status: Anomaly Detected</p>
                <p className="text-xs text-gray-400 mt-1">{`Reason: ${cellData.anomalyReason}`}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
};

const CellVoltageChart: React.FC<CellVoltageChartProps> = ({ cells, onCellClick, selectedCellId }) => {
  return (
    <div role="figure" aria-label="Chart of cell voltages and internal resistance. Use tab key to navigate through individual cells and view details.">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={cells} 
          margin={{ top: 5, right: 20, left: -20, bottom: 20 }}
          accessibilityLayer={true}
        >
          <XAxis dataKey="id" tick={{ fill: '#888888' }} stroke="#374151" />
          <YAxis 
              yAxisId="left"
              dataKey="voltage"
              domain={['dataMin - 0.05', 'dataMax + 0.05']} 
              tick={{ fill: '#888888' }} 
              stroke="#374151"
              tickFormatter={(value) => typeof value === 'number' ? value.toFixed(2) : value}
              orientation="left"
              label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', fill: '#888888', dy: 40 }}
          />
          <YAxis 
              yAxisId="right"
              dataKey="internalResistance"
              domain={[0, 'dataMax * 1.2']}
              tick={{ fill: '#888888' }}
              stroke="#374151"
              tickFormatter={(value) => typeof value === 'number' ? (value * 1000).toFixed(1) : value}
              orientation="right"
              label={{ value: 'Resistance (mΩ)', angle: 90, position: 'insideRight', fill: '#888888', dy: -60 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0, 242, 234, 0.1)'}} />
          <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '10px'}} />
          <Bar dataKey="voltage" yAxisId="left" name="Voltage" onClick={(data: any) => {
            const id = Number(data?.id);
            if (!Number.isNaN(id)) onCellClick(id);
          }}>
            {cells.map((entry, index) => (
              <RechartsCell 
                key={`cell-${index}`} 
                fill={entry.isAnomaly ? '#ef4444' : '#00f2ea'} 
                stroke={entry.id === selectedCellId ? '#ffffff' : 'none'}
                strokeWidth={2}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Bar>
          <Line 
              type="monotone" 
              dataKey="internalResistance" 
              yAxisId="right" 
              name="Resistance"
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CellVoltageChart;

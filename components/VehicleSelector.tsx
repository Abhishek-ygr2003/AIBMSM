
import React from 'react';

interface VehicleSelectorProps {
  selectedVehicle: string;
  onVehicleChange: (vehicle: string) => void;
  disabled: boolean;
}

const vehicles = [
  'Ola S1 Pro (Gen 1)',
  'Ather 450X (Gen 3)',
  'TVS iQube ST',
  'Bajaj Chetak',
];

const VehicleSelector: React.FC<VehicleSelectorProps> = ({ selectedVehicle, onVehicleChange, disabled }) => {
  return (
    <div>
      <label htmlFor="vehicle" className="block text-sm font-medium text-slate-400 mb-1">
        Target Vehicle
      </label>
      <select
        id="vehicle"
        value={selectedVehicle}
        onChange={(e) => onVehicleChange(e.target.value)}
        disabled={disabled}
        className="bg-slate-800 border border-slate-600 text-slate-200 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-72 p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {vehicles.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VehicleSelector;

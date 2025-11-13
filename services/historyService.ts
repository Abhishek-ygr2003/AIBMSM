import { ScanHistoryItem } from '../types';

const HISTORY_KEY = 'ev-battery-diag-history';

export const historyService = {
  getHistory: (): ScanHistoryItem[] => {
    try {
      const historyJson = localStorage.getItem(HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error("Failed to parse scan history from localStorage", error);
      return [];
    }
  },

  saveScan: (scanData: ScanHistoryItem): ScanHistoryItem[] => {
    const history = historyService.getHistory();
    const updatedHistory = [scanData, ...history].slice(0, 20); // Keep latest 20 scans
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    } catch (error) {
      console.error("Failed to save scan history to localStorage", error);
      return history; // return original history on failure
    }
  },

  clearHistory: (): void => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error("Failed to clear scan history from localStorage", error);
    }
  },
};

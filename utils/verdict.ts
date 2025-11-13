
export const getHealthVerdictText = (soh: number, anomalies: number): string => {
    if (soh < 80 || anomalies > 5) {
        return 'Service Required';
    }
    if (soh < 90 || anomalies > 0) {
        return 'Degraded';
    }
    return 'Good';
};

export const getVerdictClassName = (verdictText: string): string => {
    switch(verdictText) {
        case 'Service Required': return 'bg-red-900 text-red-300';
        case 'Degraded': return 'bg-amber-900 text-amber-300';
        case 'Good': return 'bg-green-900 text-green-300';
        default: return 'bg-gray-700 text-gray-300';
    }
};

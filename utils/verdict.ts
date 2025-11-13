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
        case 'Service Required': return 'bg-red-500 text-red-50';
        case 'Degraded': return 'bg-amber-500 text-amber-50';
        case 'Good': return 'bg-green-500 text-green-50';
        default: return 'bg-slate-500 text-slate-50';
    }
};

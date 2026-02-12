export interface EnergyDataPoint {
  timestamp: string;
  energy_kwh: number;
  source: 'grid' | 'solar' | 'wind' | 'mixed';
  location?: string;
  cost_eur?: number;
}

export interface Dataset {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  data: EnergyDataPoint[];
  recordCount: number;
}

export interface Anomaly {
  timestamp: string;
  value: number;
  expected: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AnalysisResult {
  success: boolean;
  metric?: string;
  threshold?: number;
  anomaliesFound?: number;
  anomalies?: Anomaly[];
  summary?: string;
}

export interface Insight {
  category: 'efficiency' | 'cost' | 'emissions';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedImpact?: string;
}

export interface Report {
  id: string;
  generatedAt: string;
  datasetId: string;
  summary: {
    totalDataPoints: number;
    timeRange: string;
    avgConsumption: string;
    anomaliesDetected: number;
    insightsGenerated: number;
  };
  anomalies?: Anomaly[];
  insights?: Insight[];
}
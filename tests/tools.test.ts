import { describe, it, expect } from "vitest";
import { executeToolCall } from "../lib/agents/tools";

interface AnomalyItem {
  timestamp: string;
  value: number;
  expected: number;
  deviation: number;
  severity: string;
}

interface AnalyzeDataAnomalyResult {
  success: true;
  metric: string;
  threshold: number;
  anomaliesFound: number;
  anomalies: AnomalyItem[];
  summary: string;
}

interface GenerateInsightsResult {
  success: true;
  focus: string;
  insights: string[];
  priority?: string;
  estimatedImpact?: string;
}

interface ReportSummary {
  totalDataPoints: number;
  timeRange: string;
  avgConsumption: string;
  anomaliesDetected: number;
  insightsGenerated: number;
}

interface ReportData {
  id: string;
  generatedAt: string;
  datasetId: string;
  summary: ReportSummary;
  anomalies?: Array<{ date: string; severity: string; description: string }>;
  insights?: string[];
}

interface CreateReportResult {
  success: true;
  reportId: string;
  format: "json" | "summary";
  data: ReportData | string;
  downloadUrl: string;
}

interface SendAlertResult {
  success: true;
  alertId: string;
  type: string;
  severity: string;
  sentAt: string;
  recipients: string[];
  message: string;
}

interface ListDatasetsResult {
  success: true;
  count: number;
  datasets: Array<Record<string, unknown>>;
}

describe("agents/tools", () => {
  it("analyzeDataAnomaly returns anomalies", async () => {
    const res = (await executeToolCall("analyzeDataAnomaly", {
      datasetId: "ds_001",
      metric: "energy_kwh",
    })) as AnalyzeDataAnomalyResult;

    expect(res.success).toBe(true);
    expect(res.metric).toBe("energy_kwh");
    expect(res.anomaliesFound).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.anomalies)).toBe(true);
  });

  it("generateInsights returns insights for focus", async () => {
    const res = (await executeToolCall("generateInsights", {
      datasetId: "ds_001",
      focus: "efficiency",
    })) as GenerateInsightsResult;

    expect(res.success).toBe(true);
    expect(res.focus).toBe("efficiency");
    expect(Array.isArray(res.insights)).toBe(true);
  });

  it("createReport returns json report when format=json", async () => {
    const res = (await executeToolCall("createReport", {
      datasetId: "ds_001",
      includeAnomalies: true,
      includeInsights: true,
      format: "json",
    })) as CreateReportResult;

    expect(res.success).toBe(true);
    expect(res.format).toBe("json");
    expect(typeof res.data).toBe("object");
    expect((res.data as ReportData).datasetId).toBe("ds_001");
  });

  it("sendAlert returns success and recipients", async () => {
    const res = (await executeToolCall("sendAlert", {
      type: "anomaly",
      severity: "high",
      message: "Testing alert",
      recipients: ["a@b.com"],
    })) as SendAlertResult;

    expect(res.success).toBe(true);
    expect(res.recipients).toContain("a@b.com");
  });

  it("listDatasets returns datasets array", async () => {
    const res = (await executeToolCall(
      "listDatasets",
      {},
    )) as ListDatasetsResult;
    expect(res.success).toBe(true);
    expect(Array.isArray(res.datasets)).toBe(true);
    expect(res.count).toBe(res.datasets.length);
  });
});

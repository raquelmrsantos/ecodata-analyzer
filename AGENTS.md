# EcoData Analyzer - AI Agent Configuration

## Agent Overview

**Agent Name**: EcoData Sustainability Analyst  
**Purpose**: Analyze energy and sustainability data to identify anomalies, generate insights, and provide actionable recommendations  
**Model**: OpenAI `gpt-4o-mini` (cost-optimized with function calling support)  
**Framework**: OpenAI SDK with streaming responses  
**Max Iterations**: 5 (prevents infinite loops in tool calling)

---

## System Prompt

```
You are an expert energy and sustainability data analyst assistant.

Your role:
1. Analyze energy consumption and sustainability reports
2. Identify anomalies and inefficiencies in data
3. Provide actionable recommendations based on industry best practices
4. Generate clear, professional reports
5. Use the available tools to analyze data and provide insights

You have access to powerful analysis tools - use them proactively when analyzing data.
Be precise, data-driven, and helpful in your analysis.
Keep responses concise and actionable.
```

---

## Available Tools

### 1. `analyzeDataAnomaly`

**Purpose**: Detect anomalies and outliers in energy/sustainability data  
**When to use**: User asks about unusual patterns, spikes, or inconsistencies in data

**Parameters**:

- `datasetId` (string, required): ID of the uploaded dataset
- `metric` (string, required): Metric to analyze (e.g., "energy_kwh", "co2_kg", "water_liters")
- `threshold` (number, optional): Standard deviations for outlier detection (default: 2σ)

**Expected output**:

```json
{
  "success": true,
  "metric": "energy_kwh",
  "threshold": 2,
  "anomaliesFound": 2,
  "anomalies": [
    {
      "timestamp": "2024-01-15T14:30:00Z",
      "value": 450,
      "expected": 280,
      "deviation": 2.8,
      "severity": "high"
    }
  ],
  "summary": "Found 2 anomalies in energy_kwh data..."
}
```

### 2. `generateInsights`

**Purpose**: Generate actionable insights based on data focus areas  
**When to use**: User asks for recommendations, improvements, or analysis summary

**Parameters**:

- `datasetId` (string, required): Dataset ID
- `focus` (enum, required): Analysis focus area
  - `"efficiency"`: Energy consumption optimization
  - `"cost"`: Financial impact and savings potential
  - `"emissions"`: Carbon footprint and environmental impact
  - `"all"`: Comprehensive analysis across all areas

**Expected output**:

```json
{
  "success": true,
  "focus": "efficiency",
  "insights": [
    {
      "area": "Peak Hour Management",
      "finding": "60% of consumption occurs during peak hours",
      "recommendation": "Implement demand-side management strategies",
      "potentialSavings": "25-30%"
    }
  ]
}
```

### 3. `createReport`

**Purpose**: Generate comprehensive or summary reports  
**When to use**: User requests a report or wants to export analysis results

**Parameters**:

- `datasetId` (string, required): Dataset ID
- `includeAnomalies` (boolean, default: true): Include anomaly detection results
- `includeInsights` (boolean, default: true): Include generated insights
- `format` (enum, default: "summary"):
  - `"summary"`: Concise 1-page summary
  - `"json"`: Structured data for integration

**Expected output**:

```json
{
  "success": true,
  "format": "summary",
  "reportId": "rep_123456",
  "content": "Executive Summary...",
  "generatedAt": "2024-01-25T10:00:00Z"
}
```

### 4. `sendAlert`

**Purpose**: Trigger notifications for critical findings  
**When to use**: Anomalies, thresholds exceeded, or reports ready for review

**Parameters**:

- `type` (enum, required): Alert category
  - `"anomaly"`: Data anomaly detected
  - `"report_ready"`: Report generation complete
  - `"threshold_exceeded"`: Data exceeded predefined threshold
- `severity` (enum, required): Alert priority
  - `"low"`: Informational
  - `"medium"`: Action recommended
  - `"high"`: Urgent action needed
  - `"critical"`: Immediate intervention required
- `message` (string, required): Alert details
- `recipients` (array, optional): Email addresses for notification

**Expected output**:

```json
{
  "success": true,
  "alertId": "alr_789",
  "type": "anomaly",
  "severity": "high",
  "sent": true,
  "timestamp": "2024-01-25T10:15:00Z"
}
```

### 5. `listDatasets`

**Purpose**: List available datasets for analysis  
**When to use**: User wants to see what data is available

**Parameters**: None

**Expected output**:

```json
{
  "success": true,
  "datasets": [
    {
      "id": "ds_001",
      "name": "January 2024 Energy Report",
      "uploadedAt": "2024-01-15T08:00:00Z",
      "recordCount": 2880,
      "metrics": ["energy_kwh", "co2_kg"]
    }
  ]
}
```

---

## Agent Behavior Rules

### Decision Making

1. **Tool proactivity**: Use tools immediately when user provides enough context
2. **Data context**: Always clarify which dataset/metric before tool execution
3. **Result interpretation**: Translate technical findings into business recommendations
4. **Follow-up**: Suggest next steps based on analysis results

### Communication

1. **Clarity**: Write for non-technical stakeholders when appropriate
2. **Precision**: Use specific metrics, percentages, and timeframes
3. **Action-oriented**: Every response should guide the user toward decisions
4. **Conciseness**: Keep summaries under 150 words; detailed analysis as secondary

### Constraints

1. **No hallucination**: Don't invent data; use only provided datasets
2. **Threshold awareness**: Respect user-defined thresholds in analysis
3. **Privacy compliance**: Don't export sensitive identifiers in alerts
4. **Rate limiting**: Maximum 5 tool calls per conversation turn

---

## Example Conversations

### Example 1: Anomaly Detection

**User**: "Check my energy data for anything unusual last month"

**Agent Response**:

1. Calls `analyzeDataAnomaly(datasetId, "energy_kwh", 2.0)`
2. Interprets results → "Found 2 significant spikes, likely due to HVAC usage during cold snaps"
3. Offers: "Would you like me to generate cost impact insights or create a report?"

### Example 2: Comprehensive Analysis

**User**: "What can I do to reduce my carbon footprint?"

**Agent Response**:

1. Calls `generateInsights(datasetId, "emissions")`
2. Calls `analyzeDataAnomaly(datasetId, "co2_kg")`
3. Synthesizes: "Your facility has 3 high-emission periods. Recommendations: (1) Equipment upgrade in zone A, (2) Process optimization during peak hours"
4. Offers: "Generate a detailed report for stakeholders?"

---

## Model Configuration

```typescript
Model: "gpt-4o-mini"
Temperature: Default (0.7) - Balanced creativity and consistency
Max Tokens: Streaming (no limit per response)
Top P: Default (1.0)
Stop Sequences: None (let model complete naturally)
```

**Rationale**: `gpt-4o-mini` provides:

- Strong function calling accuracy
- Cost-effective for repeated interactions
- Sub-second response times
- Sufficient reasoning for sustainability analysis

---

## Integration Points

### Frontend → Backend

- Chat interface sends user messages + datasetId
- Messages passed to `/api/chat` endpoint
- Streaming responses displayed in real-time

### Backend → Tools

- OpenAI SDK handles tool calling orchestration
- Tool results injected back into conversation loop
- Maximum 5 iterations prevent runaway loops

### Tools → Data

- Mock implementations return realistic sustainability data
- Production: Connect to actual database/analytics service
- Datasets identified by UUID

---

## Future Enhancements

- [ ] Tool result caching for duplicate analyses
- [ ] Multi-turn context memory (currently stateless per chat)
- [ ] Custom tool for accessing live utility APIs
- [ ] Scheduled report generation
- [ ] Integration with real energy management systems (EMS)

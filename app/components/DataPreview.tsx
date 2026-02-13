"use client";

import { Dataset } from "@/types";
import { BarChart3, Calendar, Database, FileText } from "lucide-react";

interface DataPreviewProps {
  dataset: Dataset;
}

export function DataPreview({ dataset }: DataPreviewProps) {
  const columns = Object.keys(dataset.data[0] || {});
  const hasTimestamp = columns.some(
    (col) =>
      col.toLowerCase().includes("timestamp") ||
      col.toLowerCase().includes("date"),
  );
  const hasEnergy = columns.some(
    (col) =>
      col.toLowerCase().includes("energy") || col.toLowerCase().includes("kwh"),
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Dataset Overview
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">Total Records</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {dataset.recordCount}
            </p>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-emerald-600" />
              <p className="text-sm text-emerald-700 font-medium">File Size</p>
            </div>
            <p className="text-2xl font-bold text-emerald-900">
              {(dataset.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>

        {/* Data Quality Indicators */}
        <div className="flex gap-2 flex-wrap">
          {hasTimestamp && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              <Calendar className="w-3 h-3" />
              Time-series data
            </span>
          )}
          {hasEnergy && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              <BarChart3 className="w-3 h-3" />
              Energy metrics
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {columns.length} columns
          </span>
        </div>

        {/* Sample Data Table */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Sample Data Preview
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-300">
                  {columns.map((key) => (
                    <th
                      key={key}
                      className="pb-2 pr-4 font-semibold whitespace-nowrap"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {dataset.data.slice(0, 5).map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-200 hover:bg-white transition-colors"
                  >
                    {columns.map((col) => {
                      const value = (row as unknown as Record<string, unknown>)[
                        col
                      ];
                      const isNumber = typeof value === "number";

                      return (
                        <td
                          key={col}
                          className={`py-2 pr-4 ${isNumber ? "font-mono" : ""}`}
                        >
                          {isNumber
                            ? value.toFixed(2)
                            : String(value).length > 30
                              ? String(value).substring(0, 30) + "..."
                              : String(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {dataset.recordCount > 5 && (
            <p className="text-xs text-gray-500 mt-3 text-center">
              Showing 5 of {dataset.recordCount} records
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <strong className="text-gray-700 min-w-[80px]">Columns:</strong>
            <span className="flex-1 wrap-break-word">{columns.join(", ")}</span>
          </div>
          <div className="flex items-start gap-2">
            <strong className="text-gray-700 min-w-[80px]">Uploaded:</strong>
            <span>{dataset.uploadedAt.toLocaleString()}</span>
          </div>
          <div className="flex items-start gap-2">
            <strong className="text-gray-700 min-w-[80px]">Dataset ID:</strong>
            <code className="text-xs bg-white px-2 py-1 rounded border border-gray-200 font-mono">
              {dataset.id}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

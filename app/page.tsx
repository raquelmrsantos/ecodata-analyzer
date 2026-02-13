"use client";

import { Dataset } from "@/types";
import { FileUpload } from "./components/FileUpload";
import { DataPreview } from "./components/DataPreview";
import { ChatInterface } from "./components/ChatInterface";
import { useState } from "react";
import { Sparkles, Zap } from "lucide-react";

export default function Home() {
  const [dataset, setDataset] = useState<Dataset | null>(null);

  const handleFileProcessed = (processedDataset: Dataset) => {
    setDataset(processedDataset);
    console.log("Dataset processed:", processedDataset);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <main className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-6 border border-white/50">
            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
            <span className="text-sm font-semibold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AI-Powered Data Analysis
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            EcoData Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your energy data and let AI uncover insights, detect
            anomalies, and generate comprehensive reports
          </p>
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <FileUpload onFileProcessed={handleFileProcessed} />
        </div>

        {/* Main Content Grid */}
        {dataset && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Data Preview Column */}
            <div className="space-y-6">
              <DataPreview dataset={dataset} />
            </div>

            {/* Chat Interface Column */}
            <div className="space-y-6">
              <ChatInterface datasetId={dataset.id} />
            </div>
          </div>
        )}

        {/* Empty State with Features */}
        {!dataset && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Analysis
              </h3>
              <p className="text-gray-600 text-sm">
                AI-powered insights detect patterns and anomalies in your energy
                consumption data automatically
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Interactive Chat
              </h3>
              <p className="text-gray-600 text-sm">
                Ask questions about your data in natural language and get
                instant, detailed responses
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Visual Reports
              </h3>
              <p className="text-gray-600 text-sm">
                Generate comprehensive reports with visualizations to understand
                trends and make data-driven decisions
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

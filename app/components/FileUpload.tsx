"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, CheckCircle } from "lucide-react";
import { Dataset } from "@/types";

interface FileUploadProps {
  onFileProcessed: (dataset: Dataset) => void;
}

export function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0];
      if (!uploadedFile) return;

      setFile(uploadedFile);
      setIsProcessing(true);
      setError(null);

      try {
        // Read file content
        const text = await uploadedFile.text();

        // Simple CSV parsing
        const lines = text.split("\n").filter((line) => line.trim());
        if (lines.length < 2) {
          throw new Error("File must have at least a header and one data row");
        }

        const headers = lines[0].split(",").map((h) => h.trim());
        const data = lines.slice(1).map((line) => {
          const values = line.split(",");
          return headers.reduce((obj, header, i) => {
            const value = values[i]?.trim();
            // Try to parse numbers
            obj[header] = !isNaN(Number(value)) ? Number(value) : value;
            return obj;
          }, {} as any);
        });

        // Generate dataset
        const dataset: Dataset = {
          id: `dataset-${Date.now()}`,
          name: uploadedFile.name,
          size: uploadedFile.size,
          uploadedAt: new Date(),
          data,
          recordCount: data.length,
        };

        onFileProcessed(dataset);
      } catch (err) {
        console.error("Error processing file:", err);
        setError(err instanceof Error ? err.message : "Failed to process file");
        setFile(null);
      } finally {
        setIsProcessing(false);
      }
    },
    [onFileProcessed],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/json": [".json"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  if (file && !error) {
    return (
      <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-900">{file.name}</p>
              <p className="text-sm text-green-700">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-2 hover:bg-green-100 rounded-full transition-colors"
            title="Remove file"
          >
            <X className="w-5 h-5 text-green-700" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <Upload
          className={`w-12 h-12 mx-auto mb-4 ${
            error ? "text-red-400" : "text-gray-400"
          }`}
        />

        {isProcessing ? (
          <p className="text-gray-600 font-medium">Processing file...</p>
        ) : error ? (
          <>
            <p className="text-red-600 font-medium mb-1">
              Error processing file
            </p>
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={clearFile}
              className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
            >
              Try again
            </button>
          </>
        ) : isDragActive ? (
          <p className="text-blue-600 font-medium">Drop the file here</p>
        ) : (
          <>
            <p className="text-gray-700 font-medium mb-1">
              Drop your energy data file here
            </p>
            <p className="text-sm text-gray-500">
              or click to browse (CSV or JSON)
            </p>
            <p className="text-xs text-gray-400 mt-2">Max file size: 10MB</p>
          </>
        )}
      </div>
    </div>
  );
}

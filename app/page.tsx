"use client";

import { Dataset } from "@/types";
import { FileUpload } from "./components/FileUpload";
import { useState } from "react";

export default function Home() {
  const [dataset, setDataset] = useState<Dataset | null>(null);

  const handleFileProcessed = (processedDataset: Dataset) => {
    setDataset(processedDataset);
    console.log('Dataset processed:', processedDataset);
  };


  return (
    <div className="">
      <main className="">
        <FileUpload onFileProcessed={handleFileProcessed} />
       
      </main>
    </div>
  );
}

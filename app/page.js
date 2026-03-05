"use client";

import { useState } from "react";
import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import AnalysisResult from "@/components/AnalysisResult";

export default function Home() {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (text) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Failed to analyze. Please try again.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-[family-name:var(--font-geist-sans)]">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Is this message a scam?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Paste any suspicious text, link, or message below. Our AI and security tools will check it for you.
          </p>
        </div>

        <InputForm onSubmit={handleAnalyze} isPending={isPending} />

        {error && (
          <div className="w-full max-w-2xl mx-auto mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-lg text-center font-medium shadow-sm flex items-center justify-center gap-2">
            <span role="alert">{error}</span>
          </div>
        )}

        <AnalysisResult result={result} />
      </main>

      <footer className="w-full bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm md:text-base mt-auto">
        <p>Stay safe online. Always be critical of unexpected messages.</p>
        <p className="mt-2 text-xs opacity-75">Powered by Google Safe Browsing and AI</p>
      </footer>
    </div>
  );
}

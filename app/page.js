"use client";

import { useState } from "react";
import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import AnalysisResult from "@/components/AnalysisResult";
import { Facebook } from "lucide-react";

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
            ဒါက ငွေလိမ်တဲ့ စာ (သို့) လင့်ခ် လား?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            သံသယရှိသော စာသား (သို့မဟုတ်) လင့်ခ်ကို အောက်ပါအကွက်တွင် ထည့်သွင်းပြီး စစ်ဆေးပါ။
          </p>
        </div>

        <InputForm onSubmit={handleAnalyze} isPending={isPending} />

        {error && (
          <div className="w-full max-w-2xl mx-auto mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-lg text-center font-medium shadow-sm flex items-center justify-center gap-2">
            <span role="alert">{error}</span>
          </div>
        )}

        <AnalysisResult result={result} />

        {/* Promotional Banner */}
        <div className="w-full max-w-2xl mx-auto mt-12 p-6 md:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl shadow-sm flex flex-col items-center text-center">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
            AI နည်းပညာများကို လေ့လာချင်ပါသလား?
          </h3>
          <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
            AI ကို ဘယ်လို လက်တွေ့အသုံးချမလဲ၊ AI ကြောင့် ရနိုင်တဲ့ အလုပ်အကိုင် အခွင့်အလမ်းများနှင့် နည်းပညာဗဟုသုတများကို နေ့စဉ် မျှဝေပေးနေသော ကျွန်ုပ်တို့၏ Facebook Page ကို Follow လုပ်ထားပါ။
          </p>
          <a
            href="https://www.facebook.com/share/1CQe9tiAR4/?mibextid=wwXIfr"
            /* href="https://www.facebook.com/share/1CQe9tiAR4/?mibextid=wwXIfr" */
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <Facebook className="w-6 h-6" />
            Facebook Page သို့ သွားမည်
          </a>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm md:text-base mt-auto">
        <p>အင်တာနက်ပေါ်တွင် လုံခြုံစွာနေထိုင်ပါ။ မသင်္ကာဖွယ်ရာများကို အမြဲစစ်ဆေးပါ။</p>
        <p className="mt-2 text-xs opacity-75">Powered by Google Safe Browsing and AI</p>
      </footer>
    </div>
  );
}

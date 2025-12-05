import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultSection from './components/ResultSection';
import { analyzeJSL } from './services/geminiService';
import { AnalysisResult } from './types';

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeJSL(text);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "解析中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            日本語を手話の文法へ
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            入力された文章を解析し、日本手話（JSL）の文法に基づいた単語の並び順と区切りに変換します。
          </p>
        </div>

        <InputSection onAnalyze={handleAnalyze} isLoading={loading} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2 animate-pulse">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {result && (
          <ResultSection result={result} />
        )}

        {!result && !loading && !error && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-50">
             <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center text-center">
                <div className="h-12 w-20 bg-slate-200 rounded-md mb-2"></div>
                <p className="text-sm font-bold text-slate-400">名詞・動詞抽出</p>
             </div>
             <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center text-center">
                <div className="h-12 w-20 bg-slate-200 rounded-md mb-2"></div>
                <p className="text-sm font-bold text-slate-400">不要語省略</p>
             </div>
             <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center text-center">
                <div className="h-12 w-20 bg-slate-200 rounded-md mb-2"></div>
                <p className="text-sm font-bold text-slate-400">文法並べ替え</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
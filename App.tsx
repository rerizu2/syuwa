import React, { useState, useCallback } from 'react';
import { 
  Type, 
  Split, 
  Trash2, 
  Info, 
  Hand,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { splitTextForSignLanguage } from './services/geminiService';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { AppStatus } from './types';

const EXAMPLE_SENTENCES = [
  "私は今日、電車で学校へ行きました。",
  "明日の天気は晴れだと思います。",
  "手話を勉強するのはとても楽しいです。",
  "私の名前は田中です。よろしくお願いします。"
];

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [segments, setSegments] = useState<string[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) return;

    setStatus(AppStatus.LOADING);
    setErrorMsg(null);
    setSegments([]);

    try {
      const result = await splitTextForSignLanguage(inputText);
      setSegments(result);
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      setStatus(AppStatus.ERROR);
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("予期せぬエラーが発生しました。");
      }
    }
  }, [inputText]);

  const handleClear = () => {
    setInputText('');
    setSegments([]);
    setStatus(AppStatus.IDLE);
    setErrorMsg(null);
  };

  const loadExample = (text: string) => {
    setInputText(text);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Hand className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              SignSplitter AI
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Powered by Gemini
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Intro */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            手話翻訳のための単語分割
          </h2>
          <p className="text-slate-600 max-w-2xl">
            日本語の文章を入力すると、AIが手話表現に適した単語や文節に自動的に区切ります。
            助詞の省略や意味のまとまりを考慮して分割されます。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <label htmlFor="input-text" className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
                <span>入力テキスト</span>
                <span className="text-xs text-slate-400">{inputText.length}文字</span>
              </label>
              <textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="ここに文章を入力してください..."
                className="w-full h-48 p-4 rounded-xl border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-200 text-base leading-relaxed"
              />
              
              <div className="mt-4 flex gap-3">
                <Button 
                  onClick={handleAnalyze}
                  isLoading={status === AppStatus.LOADING}
                  disabled={!inputText.trim()}
                  className="flex-1"
                  icon={<Split className="w-4 h-4" />}
                >
                  分割する
                </Button>
                <Button 
                  variant="secondary"
                  onClick={handleClear}
                  disabled={status === AppStatus.LOADING || (!inputText && segments.length === 0)}
                  icon={<Trash2 className="w-4 h-4" />}
                  aria-label="クリア"
                />
              </div>
            </div>

            {/* Examples */}
            <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
              <h3 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <Type className="w-4 h-4" />
                例文を使ってみる
              </h3>
              <div className="space-y-2">
                {EXAMPLE_SENTENCES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => loadExample(ex)}
                    className="w-full text-left text-sm p-2 rounded-lg text-indigo-700 hover:bg-indigo-100 transition-colors truncate"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Split className="w-5 h-5 text-indigo-500" />
                  分割結果
                </h3>
                {segments.length > 0 && (
                   <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                     {segments.length} 単語
                   </span>
                )}
              </div>

              <div className="flex-grow p-6 bg-slate-50/50 rounded-b-2xl">
                {status === AppStatus.ERROR && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h4 className="text-lg font-medium text-red-900 mb-2">エラーが発生しました</h4>
                    <p className="text-red-600 max-w-md">{errorMsg}</p>
                  </div>
                )}

                {status === AppStatus.IDLE && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200">
                      <Hand className="w-10 h-10 text-slate-300" />
                    </div>
                    <p>テキストを入力して「分割する」ボタンを押してください</p>
                  </div>
                )}
                
                {status === AppStatus.LOADING && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="relative w-20 h-20 mb-6">
                      <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-slate-600 font-medium animate-pulse">
                      AIが手話構造を解析中...
                    </p>
                  </div>
                )}

                {status === AppStatus.SUCCESS && segments.length > 0 && (
                  <div>
                    <div className="mb-4 flex items-start gap-2 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100">
                      <Info className="w-5 h-5 flex-shrink-0" />
                      <p>
                        AIによる解析結果です。手話表現は地域や文脈によって異なる場合があります。
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                      {segments.map((segment, index) => (
                        <ResultCard key={`${index}-${segment}`} word={segment} index={index} />
                      ))}
                    </div>
                  </div>
                )}
                
                {status === AppStatus.SUCCESS && segments.length === 0 && (
                  <div className="text-center text-slate-500 mt-10">
                    分割できる単語が見つかりませんでした。
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} SignSplitter AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
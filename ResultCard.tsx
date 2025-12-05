import React from 'react';
import { Copy, Check } from 'lucide-react';

interface ResultCardProps {
  word: string;
  index: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ word, index }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(word);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="group relative flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 animate-in fade-in zoom-in-95 duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="text-xs font-semibold text-slate-400 mb-1 tracking-wider uppercase">
        Word {index + 1}
      </div>
      <div className="text-2xl font-bold text-slate-800 text-center break-words w-full">
        {word}
      </div>
      
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
        title="Copy word"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};
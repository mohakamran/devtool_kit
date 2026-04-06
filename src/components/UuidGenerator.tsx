import React, { useState, useEffect } from 'react';
import ToolHeader from './ToolHeader';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { copyToClipboard, cn } from '../lib/utils';

export default function UuidGenerator({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generateUuids = () => {
    const newUuids = Array.from({ length: count }, () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    });
    setUuids(newUuids);
  };

  useEffect(() => {
    generateUuids();
  }, [count]);

  const handleCopy = (val: string, index: number) => {
    copyToClipboard(val);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto py-8">
      <div className={cn(
        "border rounded-xl p-8 transition-colors",
        isDarkMode ? "bg-[#161b22] border-gray-800" : "bg-white border-gray-200 shadow-sm"
      )}>
        <div className="flex items-center justify-between mb-8">
          <h2 className={cn(
            "text-xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>UUID v4 Generator</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Count:</span>
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className={cn(
                  "w-16 border rounded-md py-1 px-2 text-sm focus:outline-none transition-colors",
                  isDarkMode ? "bg-[#0d1117] border-gray-800 text-blue-400" : "bg-gray-50 border-gray-200 text-blue-600"
                )}
              />
            </div>
            <button 
              onClick={generateUuids}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {uuids.map((uuid, i) => (
            <div key={i} className={cn(
              "flex items-center gap-4 border rounded-lg p-4 group transition-colors",
              isDarkMode ? "bg-[#0d1117] border-gray-800 hover:border-blue-500/50" : "bg-gray-50 border-gray-200 hover:border-blue-300"
            )}>
              <span className="text-xs font-mono text-gray-500 w-4">{i + 1}</span>
              <span className={cn(
                "flex-1 font-mono break-all",
                isDarkMode ? "text-white" : "text-blue-600"
              )}>{uuid}</span>
              <button 
                onClick={() => handleCopy(uuid, i)}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  isDarkMode ? "hover:bg-gray-800 text-gray-500 hover:text-white" : "hover:bg-gray-200 text-gray-400 hover:text-gray-900"
                )}
              >
                {copied === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>

        <div className={cn(
          "mt-8 pt-6 border-t",
          isDarkMode ? "border-gray-800" : "border-gray-200"
        )}>
          <button 
            onClick={() => {
              copyToClipboard(uuids.join('\n'));
              setCopied(-1);
              setTimeout(() => setCopied(null), 2000);
            }}
            className={cn(
              "w-full py-3 rounded-md transition-colors font-medium flex items-center justify-center gap-2",
              isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            )}
          >
            {copied === -1 ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            Copy All UUIDs
          </button>
        </div>
      </div>
    </div>
  );
}

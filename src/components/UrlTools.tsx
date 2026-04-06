import React, { useState, useEffect } from 'react';
import ToolHeader from './ToolHeader';
import { Link, Search } from 'lucide-react';

import { cn } from '../lib/utils';

export default function UrlTools({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [input, setInput] = useState('');
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState('');
  const [queryParams, setQueryParams] = useState<[string, string][]>([]);

  useEffect(() => {
    try {
      setEncoded(encodeURIComponent(input));
      setDecoded(decodeURIComponent(input));
      
      const url = input.includes('?') ? input : `?${input}`;
      const params = new URLSearchParams(url.split('?')[1] || '');
      const entries: [string, string][] = [];
      params.forEach((value, key) => entries.push([key, value]));
      setQueryParams(entries);
    } catch (e) {
      // Ignore errors during typing
    }
  }, [input]);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col">
        <ToolHeader title="Input URL or Query String" onClear={() => setInput('')} />
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com/path?name=value&age=25"
          className={cn(
            "h-24 border rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors",
            isDarkMode ? "bg-[#161b22] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
          )}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="space-y-6 overflow-auto">
          <div className={cn(
            "border rounded-xl p-6 transition-colors",
            isDarkMode ? "bg-[#161b22] border-gray-800" : "bg-white border-gray-200"
          )}>
            <ToolHeader title="Encoded URL" copyValue={encoded} />
            <div className={cn(
              "font-mono text-sm break-all p-4 rounded-lg border transition-colors",
              isDarkMode ? "text-blue-400 bg-[#0d1117] border-gray-800" : "text-blue-600 bg-gray-50 border-gray-200"
            )}>
              {encoded || <span className="text-gray-500 italic">Waiting for input...</span>}
            </div>
          </div>
          <div className={cn(
            "border rounded-xl p-6 transition-colors",
            isDarkMode ? "bg-[#161b22] border-gray-800" : "bg-white border-gray-200"
          )}>
            <ToolHeader title="Decoded URL" copyValue={decoded} />
            <div className={cn(
              "font-mono text-sm break-all p-4 rounded-lg border transition-colors",
              isDarkMode ? "text-green-400 bg-[#0d1117] border-gray-800" : "text-green-600 bg-gray-50 border-gray-200"
            )}>
              {decoded || <span className="text-gray-500 italic">Waiting for input...</span>}
            </div>
          </div>
        </div>

        <div className={cn(
          "border rounded-xl p-6 flex flex-col h-full transition-colors",
          isDarkMode ? "bg-[#161b22] border-gray-800" : "bg-white border-gray-200"
        )}>
          <ToolHeader title="Query Parameters" />
          <div className="flex-1 overflow-auto space-y-2">
            {queryParams.length > 0 ? (
              queryParams.map(([key, value], i) => (
                <div key={i} className={cn(
                  "flex items-center gap-2 border rounded-lg p-3 group transition-colors",
                  isDarkMode ? "bg-[#0d1117] border-gray-800" : "bg-gray-50 border-gray-200"
                )}>
                  <span className="text-xs font-bold text-gray-500 w-4">{i + 1}</span>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <span className={cn("font-mono text-sm truncate", isDarkMode ? "text-blue-400" : "text-blue-600")} title={key}>{key}</span>
                    <span className={cn("font-mono text-sm truncate", isDarkMode ? "text-gray-300" : "text-gray-700")} title={value}>{value}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 italic gap-4">
                <Search className="w-12 h-12 opacity-20" />
                <p>No query parameters found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

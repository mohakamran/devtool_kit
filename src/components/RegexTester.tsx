import React, { useState, useEffect, useMemo } from 'react';
import ToolHeader from './ToolHeader';
import { Search, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export default function RegexTester({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!regex) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const re = new RegExp(regex, flags);
      setError(null);
      
      const allMatches: RegExpMatchArray[] = [];
      let match;
      
      if (flags.includes('g')) {
        while ((match = re.exec(testString)) !== null) {
          allMatches.push(match);
          if (match.index === re.lastIndex) re.lastIndex++;
        }
      } else {
        match = testString.match(re);
        if (match) allMatches.push(match);
      }
      
      setMatches(allMatches);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  }, [regex, flags, testString]);

  const highlightedText = useMemo(() => {
    if (!regex || error || matches.length === 0) return testString;

    let result = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      const start = match.index!;
      const end = start + match[0].length;

      // Add text before match
      result.push(testString.slice(lastIndex, start));
      
      // Add highlighted match
      result.push(
        <span 
          key={i} 
          className="bg-blue-500/30 border-b-2 border-blue-500 text-blue-600 dark:text-white group relative"
        >
          {match[0]}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none text-white">
            Match {i + 1} | Index: {start}
          </span>
        </span>
      );
      
      lastIndex = end;
    });

    result.push(testString.slice(lastIndex));
    return result;
  }, [testString, matches, regex, error]);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-400 mb-2">Regular Expression</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">/</span>
            <input 
              type="text"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              placeholder="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"
              className={cn(
                "w-full border rounded-md py-3 pl-6 pr-12 font-mono focus:outline-none focus:border-blue-500 transition-colors",
                isDarkMode ? "bg-[#161b22] border-gray-800 text-blue-400" : "bg-white border-gray-200 text-blue-600"
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">/</span>
          </div>
          {error && <p className="mt-2 text-xs text-red-500 dark:text-red-400">{error}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Flags</label>
          <input 
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="gim"
            className={cn(
              "w-full border rounded-md py-3 px-4 font-mono focus:outline-none focus:border-blue-500 transition-colors",
              isDarkMode ? "bg-[#161b22] border-gray-800 text-orange-400" : "bg-white border-gray-200 text-orange-600"
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col h-full">
          <ToolHeader title="Test String" onClear={() => setTestString('')} />
          <textarea 
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Paste text to test against the regex..."
            className={cn(
              "flex-1 border rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors",
              isDarkMode ? "bg-[#161b22] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
            )}
          />
        </div>

        <div className="flex flex-col h-full">
          <ToolHeader title="Matches" copyValue={matches.map(m => m[0]).join('\n')} />
          <div className={cn(
            "flex-1 border rounded-md p-4 overflow-auto font-mono text-sm whitespace-pre-wrap break-all transition-colors",
            isDarkMode ? "bg-[#161b22] border-gray-800 text-gray-300" : "bg-white border-gray-200 text-gray-700"
          )}>
            {highlightedText}
            {!regex && <p className="text-gray-500 italic">Enter a regex above to see matches...</p>}
            {regex && matches.length === 0 && !error && <p className="text-gray-500 italic">No matches found.</p>}
          </div>
          <div className={cn(
            "mt-4 p-4 border rounded-md flex items-center justify-between transition-colors",
            isDarkMode ? "bg-blue-900/10 border-blue-900/30" : "bg-blue-50 border-blue-200"
          )}>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm">
              <Search className="w-4 h-4" />
              <span>{matches.length} matches found</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Info className="w-4 h-4" />
              <span>Real-time highlighting enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

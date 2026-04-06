import React, { useState, useEffect } from 'react';
import ToolHeader from './ToolHeader';
import CryptoJS from 'crypto-js';
import { Hash, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../lib/utils';

import { cn } from '../lib/utils';

export default function HashGenerator({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: '',
  });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!input) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
      return;
    }

    setHashes({
      md5: CryptoJS.MD5(input).toString(),
      sha1: CryptoJS.SHA1(input).toString(),
      sha256: CryptoJS.SHA256(input).toString(),
      sha512: CryptoJS.SHA512(input).toString(),
    });
  }, [input]);

  const handleCopy = (val: string, id: string) => {
    copyToClipboard(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col">
        <ToolHeader title="Input Text" onClear={() => setInput('')} />
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className={cn(
            "h-32 border rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors",
            isDarkMode ? "bg-[#161b22] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
          )}
        />
      </div>

      <div className="flex-1 space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Generated Hashes</h3>
        {Object.entries(hashes).map(([algo, value]) => (
          <div key={algo} className={cn(
            "border rounded-md p-4 group transition-colors",
            isDarkMode ? "bg-[#161b22] border-gray-800" : "bg-white border-gray-200"
          )}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{algo}</span>
              <button 
                onClick={() => handleCopy(value, algo)}
                className={cn(
                  "p-1 rounded transition-colors",
                  isDarkMode ? "hover:bg-gray-800 text-gray-500 hover:text-white" : "hover:bg-gray-100 text-gray-400 hover:text-gray-900"
                )}
              >
                {copied === algo ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className={cn(
              "font-mono text-sm break-all transition-colors",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>
              {value || <span className="text-gray-500 italic">Waiting for input...</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

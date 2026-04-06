import React, { useState, useEffect } from 'react';
import ToolHeader from './ToolHeader';
import CodeEditor from './CodeEditor';
import { Shield, AlertCircle } from 'lucide-react';

import { cn } from '../lib/utils';

export default function JwtDecoder({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token.trim()) {
      setHeader('');
      setPayload('');
      setError(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format. Must have 3 parts separated by dots.');

      const decodedHeader = JSON.parse(atob(parts[0]));
      const decodedPayload = JSON.parse(atob(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setHeader('');
      setPayload('');
    }
  }, [token]);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col">
        <ToolHeader title="Encoded JWT Token" onClear={() => setToken('')} />
        <textarea 
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here..."
          className={cn(
            "h-24 border rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:border-blue-500 break-all transition-colors",
            isDarkMode ? "bg-[#161b22] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
          )}
        />
      </div>

      {error ? (
        <div className={cn(
          "border rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 transition-colors",
          isDarkMode ? "bg-red-900/10 border-red-900/30 text-red-400" : "bg-red-50 border-red-200 text-red-600"
        )}>
          <AlertCircle className="w-12 h-12" />
          <div>
            <p className="font-bold mb-1">Invalid Token</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="flex flex-col h-full">
            <ToolHeader title="Header" copyValue={header} />
            <CodeEditor language="json" value={header} readOnly placeholder="Header will appear here..." isDarkMode={isDarkMode} />
          </div>
          <div className="flex flex-col h-full">
            <ToolHeader title="Payload" copyValue={payload} />
            <CodeEditor language="json" value={payload} readOnly placeholder="Payload will appear here..." isDarkMode={isDarkMode} />
          </div>
        </div>
      )}

      <div className={cn(
        "border rounded-lg p-4 flex items-center gap-4 transition-colors",
        isDarkMode ? "bg-blue-900/10 border-blue-900/30" : "bg-blue-50 border-blue-200"
      )}>
        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <div className="text-sm">
          <p className="text-blue-600 dark:text-blue-400 font-bold">Security Note</p>
          <p className="text-gray-500 dark:text-gray-400">JWT decoding is done entirely in your browser. Your token is never sent to any server.</p>
        </div>
      </div>
    </div>
  );
}

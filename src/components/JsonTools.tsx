import React, { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import ToolHeader from './ToolHeader';
import { AlertCircle } from 'lucide-react';

interface JsonToolsProps {
  mode: 'format' | 'minify' | 'validate';
  isDarkMode?: boolean;
}

export default function JsonTools({ mode, isDarkMode = true }: JsonToolsProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setError(null);
      
      if (mode === 'format') {
        setOutput(JSON.stringify(parsed, null, 2));
      } else if (mode === 'minify') {
        setOutput(JSON.stringify(parsed));
      } else if (mode === 'validate') {
        setOutput('JSON is valid');
      }
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input, mode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col h-full min-h-[400px]">
        <ToolHeader 
          title="Input JSON" 
          onClear={() => setInput('')} 
          copyValue={input}
        />
        <CodeEditor 
          value={input} 
          onChange={setInput} 
          language="json" 
          placeholder="Paste your JSON here..."
        />
      </div>

      <div className="flex flex-col h-full min-h-[400px]">
        <ToolHeader 
          title={mode === 'validate' ? 'Validation Result' : 'Output'} 
          copyValue={output}
        />
        {error ? (
          <div className="flex-1 p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-white flex flex-col items-center justify-center text-center gap-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <div>
              <p className="font-bold mb-1">Invalid JSON</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        ) : mode === 'validate' && output ? (
          <div className="flex-1 p-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-md text-green-600 dark:text-white flex flex-col items-center justify-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 rotate-180 text-green-500" />
            </div>
            <p className="font-bold">JSON is valid</p>
          </div>
        ) : (
          <CodeEditor 
            value={output} 
            readOnly 
            language="json" 
            placeholder="Output will appear here..."
          />
        )}
      </div>
    </div>
  );
}

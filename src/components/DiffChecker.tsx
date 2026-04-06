import React, { useState, useMemo } from 'react';
import { diffLines, Change } from 'diff';
import ToolHeader from './ToolHeader';

export default function DiffChecker({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const diff = useMemo(() => {
    return diffLines(text1, text2);
  }, [text1, text2]);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-1/2 min-h-[300px]">
        <div className="flex flex-col h-full">
          <ToolHeader title="Original Text" onClear={() => setText1('')} copyValue={text1} />
          <textarea 
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Paste original text here..."
            className="flex-1 bg-[#161b22] border border-gray-800 rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col h-full">
          <ToolHeader title="Modified Text" onClear={() => setText2('')} copyValue={text2} />
          <textarea 
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Paste modified text here..."
            className="flex-1 bg-[#161b22] border border-gray-800 rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <ToolHeader 
          title="Differences" 
          copyValue={diff.map(p => (p.added ? '+ ' : p.removed ? '- ' : '  ') + p.value).join('')} 
        />
        <div className="flex-1 bg-[#161b22] border border-gray-800 rounded-md p-4 overflow-auto font-mono text-sm whitespace-pre">
          {diff.map((part, index) => (
            <div 
              key={index}
              className={`${
                part.added ? 'bg-green-900/20 text-green-400' : 
                part.removed ? 'bg-red-900/20 text-red-400' : 
                'text-gray-500'
              } px-2`}
            >
              <span className="inline-block w-6 select-none opacity-50">
                {part.added ? '+' : part.removed ? '-' : ' '}
              </span>
              {part.value}
            </div>
          ))}
          {!text1 && !text2 && <p className="text-gray-600 italic">Enter text above to see differences...</p>}
        </div>
      </div>
    </div>
  );
}

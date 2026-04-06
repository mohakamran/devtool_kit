import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ToolHeader from './ToolHeader';
import { Eye, Code } from 'lucide-react';

export default function MarkdownPreviewer({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [markdown, setMarkdown] = useState('# Hello World\n\nThis is a **Markdown** previewer.\n\n- List item 1\n- List item 2\n\n```javascript\nconsole.log("Hello World");\n```');
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-4 border-b border-gray-800 pb-4">
        <button 
          onClick={() => setView('split')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${view === 'split' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
        >
          Split View
        </button>
        <button 
          onClick={() => setView('edit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${view === 'edit' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
        >
          <Code className="w-4 h-4" />
          Editor Only
        </button>
        <button 
          onClick={() => setView('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${view === 'preview' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
        >
          <Eye className="w-4 h-4" />
          Preview Only
        </button>
      </div>

      <div className={`grid gap-6 flex-1 min-h-0 ${view === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {(view === 'split' || view === 'edit') && (
          <div className="flex flex-col h-full">
            <ToolHeader title="Markdown Editor" onClear={() => setMarkdown('')} copyValue={markdown} />
            <textarea 
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Write your markdown here..."
              className="flex-1 bg-[#161b22] border border-gray-800 rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {(view === 'split' || view === 'preview') && (
          <div className="flex flex-col h-full">
            <ToolHeader title="Preview" />
            <div className="flex-1 bg-white text-gray-900 border border-gray-200 rounded-md p-8 overflow-auto prose prose-sm max-w-none prose-slate">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

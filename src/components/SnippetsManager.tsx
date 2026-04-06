import React, { useState, useEffect } from 'react';
import ToolHeader from './ToolHeader';
import CodeEditor from './CodeEditor';
import { Plus, Search, Trash2, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../lib/utils';

interface Snippet {
  id: string;
  name: string;
  code: string;
  language: string;
  createdAt: number;
}

export default function SnippetsManager({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [activeSnippetId, setActiveSnippetId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  
  // Local state for the active snippet to avoid lag
  const [localSnippet, setLocalSnippet] = useState<Snippet | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dev-toolkit-snippets');
    if (saved) {
      setSnippets(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dev-toolkit-snippets', JSON.stringify(snippets));
  }, [snippets]);

  // Sync local snippet when active ID changes
  useEffect(() => {
    const active = snippets.find(s => s.id === activeSnippetId);
    setLocalSnippet(active || null);
  }, [activeSnippetId, snippets]);

  // Debounce local changes back to the main snippets list
  useEffect(() => {
    if (!localSnippet) return;
    
    const timeout = setTimeout(() => {
      setSnippets(prev => prev.map(s => 
        s.id === localSnippet.id ? localSnippet : s
      ));
    }, 500);

    return () => clearTimeout(timeout);
  }, [localSnippet]);

  const updateLocalSnippet = (updates: Partial<Snippet>) => {
    if (!localSnippet) return;
    setLocalSnippet({ ...localSnippet, ...updates });
  };

  const handleAdd = () => {
    const newSnippet: Snippet = {
      id: Date.now().toString(),
      name: 'New Snippet',
      code: '// Write your code here',
      language: 'javascript',
      createdAt: Date.now(),
    };
    setSnippets([newSnippet, ...snippets]);
    setActiveSnippetId(newSnippet.id);
  };

  const handleDelete = (id: string) => {
    setSnippets(snippets.filter(s => s.id !== id));
    if (activeSnippetId === id) setActiveSnippetId(null);
  };

  const handleCopy = (val: string, id: string) => {
    copyToClipboard(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = snippets.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full gap-6 overflow-hidden">
      {/* List */}
      <div className="w-80 flex flex-col gap-4 border-r border-gray-800 pr-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">My Snippets</h3>
          <button 
            onClick={handleAdd}
            className="p-1 hover:bg-gray-800 rounded text-blue-500 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text"
            placeholder="Search snippets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#161b22] border border-gray-800 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setActiveSnippetId(s.id);
              }}
              className={`w-full text-left p-3 rounded-lg border transition-all group cursor-pointer ${
                activeSnippetId === s.id 
                  ? 'bg-blue-600/10 border-blue-600/30' 
                  : 'bg-[#161b22] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold uppercase ${activeSnippetId === s.id ? 'text-blue-400' : 'text-gray-500'}`}>
                  {s.language}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(s.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-900/20 rounded text-red-500 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className={`text-sm font-medium truncate ${activeSnippetId === s.id ? 'text-white' : 'text-gray-400'}`}>
                {s.name}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-600 italic text-sm">
              No snippets found.
            </div>
          )}
        </div>
      </div>

      {/* Editor/Viewer */}
      <div className="flex-1 flex flex-col min-w-0">
        {localSnippet ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 flex gap-4 mr-4">
                <input 
                  type="text"
                  value={localSnippet.name}
                  onChange={(e) => updateLocalSnippet({ name: e.target.value })}
                  className="flex-1 bg-[#161b22] border border-gray-800 rounded-md py-2 px-4 text-white focus:outline-none focus:border-blue-500"
                />
                <select 
                  value={localSnippet.language}
                  onChange={(e) => updateLocalSnippet({ language: e.target.value })}
                  className="bg-[#161b22] border border-gray-800 rounded-md py-2 px-4 text-blue-400 focus:outline-none"
                >
                  {['javascript', 'css', 'markup', 'json'].map(l => (
                    <option key={l} value={l}>{l.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleCopy(localSnippet.code, localSnippet.id)}
                  className="p-2 hover:bg-gray-800 rounded-md transition-colors text-gray-400 hover:text-white"
                >
                  {copied === localSnippet.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <CodeEditor 
                value={localSnippet.code}
                onChange={(code) => updateLocalSnippet({ code })}
                language={localSnippet.language}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 italic gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-800/30 flex items-center justify-center">
              <Plus className="w-10 h-10 opacity-20" />
            </div>
            <p>Select a snippet or create a new one to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

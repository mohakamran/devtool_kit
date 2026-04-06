import React, { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Upload, FileText, Image as ImageIcon } from 'lucide-react';

import { cn } from '../lib/utils';

export default function Base64Tools({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [text, setText] = useState('');
  const [base64, setBase64] = useState('');
  const [mode, setMode] = useState<'text' | 'image'>('text');

  const encodeText = () => {
    try {
      setBase64(btoa(text));
    } catch (e) {
      console.error('Error encoding text:', e);
    }
  };

  const decodeBase64 = () => {
    try {
      setText(atob(base64));
    } catch (e) {
      console.error('Error decoding Base64:', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result.split(',')[1] || result);
      setMode('image');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className={cn(
        "flex items-center gap-4 border-b pb-4 transition-colors",
        isDarkMode ? "border-gray-800" : "border-gray-200"
      )}>
        <button 
          onClick={() => setMode('text')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors",
            mode === 'text' 
              ? "bg-blue-600 text-white" 
              : isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"
          )}
        >
          <FileText className="w-4 h-4" />
          Text Mode
        </button>
        <button 
          onClick={() => setMode('image')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors",
            mode === 'image' 
              ? "bg-blue-600 text-white" 
              : isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"
          )}
        >
          <ImageIcon className="w-4 h-4" />
          Image Mode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col h-full">
          <ToolHeader 
            title={mode === 'text' ? 'Plain Text' : 'Image Preview'} 
            onClear={() => setText('')}
          />
          {mode === 'text' ? (
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to encode..."
              className={cn(
                "flex-1 border rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors",
                isDarkMode ? "bg-[#161b22] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
              )}
            />
          ) : (
            <div className={cn(
              "flex-1 border rounded-md p-4 flex flex-col items-center justify-center gap-4 overflow-hidden transition-colors",
              isDarkMode ? "bg-[#161b22] border-gray-800" : "bg-white border-gray-200"
            )}>
              {base64 ? (
                <img 
                  src={`data:image/png;base64,${base64}`} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No image encoded yet</p>
                </div>
              )}
            </div>
          )}
          <button 
            onClick={encodeText}
            disabled={mode === 'image'}
            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-600 text-white py-2 px-4 rounded-md transition-colors font-medium"
          >
            Encode to Base64 →
          </button>
        </div>

        <div className="flex flex-col h-full">
          <ToolHeader 
            title="Base64 String" 
            onClear={() => setBase64('')}
            copyValue={base64}
          />
          <textarea 
            value={base64}
            onChange={(e) => setBase64(e.target.value)}
            placeholder="Paste Base64 string here..."
            className={cn(
              "flex-1 border rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:border-blue-500 break-all transition-colors",
              isDarkMode ? "bg-[#161b22] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
            )}
          />
          <div className="mt-4 flex gap-4">
            <button 
              onClick={decodeBase64}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
            >
              ← Decode to Text
            </button>
            <label className={cn(
              "flex-1 text-white py-2 px-4 rounded-md transition-colors font-medium text-center cursor-pointer flex items-center justify-center gap-2",
              isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-700 hover:bg-gray-600"
            )}>
              <Upload className="w-4 h-4" />
              Upload Image
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

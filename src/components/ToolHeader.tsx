import React from 'react';
import { Copy, Trash2, Check, Download } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard } from '../lib/utils';

interface ToolHeaderProps {
  title: string;
  description?: string;
  onClear?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  copyValue?: string;
}

export default function ToolHeader({ title, description, onClear, onCopy, onDownload, copyValue }: ToolHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else if (copyValue) {
      copyToClipboard(copyValue);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center gap-2">
          {onDownload && (
            <button 
              onClick={onDownload}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          {(onCopy || copyValue) && (
            <button 
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
          {onClear && (
            <button 
              onClick={onClear}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
}

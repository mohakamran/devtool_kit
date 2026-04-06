import React, { useState, useEffect } from 'react';
import ToolHeader from './ToolHeader';
import { Clock, Calendar, ArrowRightLeft, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../lib/utils';

export default function TimestampConverter({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [unix, setUnix] = useState(Math.floor(Date.now() / 1000).toString());
  const [human, setHuman] = useState(new Date().toISOString());
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const convertUnixToHuman = (val: string) => {
    try {
      const date = new Date(parseInt(val) * 1000);
      if (isNaN(date.getTime())) throw new Error('Invalid timestamp');
      setHuman(date.toISOString());
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const convertHumanToUnix = (val: string) => {
    try {
      const date = new Date(val);
      if (isNaN(date.getTime())) throw new Error('Invalid date format');
      setUnix(Math.floor(date.getTime() / 1000).toString());
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    convertUnixToHuman(unix);
  }, []);

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Clock className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Unix Timestamp</h3>
          </div>
          <input 
            type="text"
            value={unix}
            onChange={(e) => {
              setUnix(e.target.value);
              convertUnixToHuman(e.target.value);
            }}
            className="w-full bg-[#0d1117] border border-gray-800 rounded-lg p-4 text-xl font-mono text-white focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500 italic">Seconds since Jan 01 1970. (UTC)</p>
        </div>

        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-green-400">
            <Calendar className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Human Readable</h3>
          </div>
          <input 
            type="text"
            value={human}
            onChange={(e) => {
              setHuman(e.target.value);
              convertHumanToUnix(e.target.value);
            }}
            className="w-full bg-[#0d1117] border border-gray-800 rounded-lg p-4 text-xl font-mono text-white focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500 italic">ISO 8601 format (UTC)</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-4 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-8">
        <h3 className="text-lg font-bold text-white mb-6">Current Time Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Local Time', value: new Date(parseInt(unix) * 1000).toLocaleString() },
            { label: 'UTC Time', value: new Date(parseInt(unix) * 1000).toUTCString() },
            { label: 'ISO 8601', value: new Date(parseInt(unix) * 1000).toISOString() },
            { label: 'Unix (ms)', value: (parseInt(unix) * 1000).toString() },
          ].map((item) => (
            <div key={item.label} className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 group relative">
              <div className="flex items-center justify-between mb-1">
                <span className="block text-xs font-medium text-gray-500 uppercase">{item.label}</span>
                <button 
                  onClick={() => {
                    copyToClipboard(item.value);
                    setCopied(item.label);
                    setTimeout(() => setCopied(null), 2000);
                  }}
                  className="p-1 hover:bg-gray-800 rounded transition-colors text-gray-500 hover:text-white opacity-0 group-hover:opacity-100"
                >
                  {copied === item.label ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <span className="font-mono text-sm text-gray-300 break-all">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

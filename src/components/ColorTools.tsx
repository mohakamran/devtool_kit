import React, { useState, useEffect } from 'react';
import ToolHeader from './ToolHeader';
import { Palette, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../lib/utils';

export default function ColorTools({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [color, setColor] = useState('#3b82f6');
  const [copied, setCopied] = useState<string | null>(null);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const handleCopy = (val: string, id: string) => {
    copyToClipboard(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center gap-8 shadow-2xl">
          <div 
            className="w-48 h-48 rounded-2xl shadow-inner border-4 border-gray-800 transition-colors duration-300"
            style={{ backgroundColor: color }}
          />
          <input 
            type="color" 
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-12 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden"
          />
          <input 
            type="text" 
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full bg-[#0d1117] border border-gray-800 rounded-lg py-3 px-4 text-center font-mono text-xl text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-4">
          {[
            { label: 'HEX', value: color.toUpperCase() },
            { label: 'RGB', value: hexToRgb(color) },
            { label: 'HSL', value: hexToHsl(color) },
          ].map((item) => (
            <div key={item.label} className="bg-[#161b22] border border-gray-800 rounded-xl p-6 group hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
                <button 
                  onClick={() => handleCopy(item.value, item.label)}
                  className="p-2 hover:bg-gray-800 rounded-md transition-colors text-gray-500 hover:text-white"
                >
                  {copied === item.label ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="font-mono text-lg text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-8">
        <h3 className="text-lg font-bold text-white mb-6">Gradient Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            className="h-48 rounded-xl border border-gray-800 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${color}, #161b22)` }}
          />
          <div className="flex flex-col justify-center gap-4">
            <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm text-blue-400 break-all">
              background: linear-gradient(135deg, {color}, #161b22);
            </div>
            <button 
              onClick={() => handleCopy(`background: linear-gradient(135deg, ${color}, #161b22);`, 'gradient')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors font-medium flex items-center justify-center gap-2"
            >
              {copied === 'gradient' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy CSS Gradient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Plus, Trash2, Copy, Check, RefreshCw } from 'lucide-react';
import { copyToClipboard } from '../lib/utils';
import { cn } from '../lib/utils';

interface GradientColor {
  id: string;
  color: string;
  stop: number;
}

export default function GradientGenerator({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [colors, setColors] = useState<GradientColor[]>([
    { id: '1', color: '#3b82f6', stop: 0 },
    { id: '2', color: '#8b5cf6', stop: 100 },
  ]);
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [copied, setCopied] = useState(false);

  const addColor = () => {
    if (colors.length >= 5) return;
    const newColor = {
      id: Math.random().toString(36).substr(2, 9),
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      stop: Math.min(100, colors[colors.length - 1].stop + 20),
    };
    setColors([...colors, newColor].sort((a, b) => a.stop - b.stop));
  };

  const removeColor = (id: string) => {
    if (colors.length <= 2) return;
    setColors(colors.filter(c => c.id !== id));
  };

  const updateColor = (id: string, updates: Partial<GradientColor>) => {
    setColors(colors.map(c => c.id === id ? { ...c, ...updates } : c).sort((a, b) => a.stop - b.stop));
  };

  const gradientString = type === 'linear' 
    ? `linear-gradient(${angle}deg, ${colors.map(c => `${c.color} ${c.stop}%`).join(', ')})`
    : `radial-gradient(circle, ${colors.map(c => `${c.color} ${c.stop}%`).join(', ')})`;

  const handleCopy = () => {
    copyToClipboard(`background: ${gradientString};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const randomize = () => {
    const numColors = Math.floor(Math.random() * 3) + 2;
    const newColors = Array.from({ length: numColors }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
      stop: Math.floor((i / (numColors - 1)) * 100),
    }));
    setColors(newColors);
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-4">
      <ToolHeader 
        title="CSS Gradient Generator" 
        description="Design and generate beautiful CSS gradients with ease."
      />
      
      <div 
        className="w-full h-64 rounded-2xl shadow-2xl border border-gray-800/50 flex items-end justify-end p-6 transition-all duration-500"
        style={{ background: gradientString }}
      >
        <button 
          onClick={randomize}
          className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
          title="Randomize"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Configuration</h3>
              <div className="flex bg-[#0d1117] p-1 rounded-lg border border-gray-800">
                <button 
                  onClick={() => setType('linear')}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                    type === 'linear' ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  Linear
                </button>
                <button 
                  onClick={() => setType('radial')}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                    type === 'radial' ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  Radial
                </button>
              </div>
            </div>

            {type === 'linear' && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Angle</span>
                  <span className="text-blue-400 font-mono">{angle}°</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  value={angle}
                  onChange={(e) => setAngle(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#0d1117] rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Colors</span>
                <button 
                  onClick={addColor}
                  disabled={colors.length >= 5}
                  className="p-1.5 bg-blue-600/10 text-blue-400 rounded-md hover:bg-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {colors.map((c, index) => (
                  <div key={c.id} className="flex items-center gap-4 bg-[#0d1117] p-3 rounded-lg border border-gray-800 group">
                    <input 
                      type="color" 
                      value={c.color}
                      onChange={(e) => updateColor(c.id, { color: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                        <span>Stop</span>
                        <span>{c.stop}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={c.stop}
                        onChange={(e) => updateColor(c.id, { stop: parseInt(e.target.value) })}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    <button 
                      onClick={() => removeColor(c.id)}
                      className="p-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">CSS Output</h3>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy CSS'}
              </button>
            </div>
            <div className="flex-1 bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm text-blue-400 break-all leading-relaxed">
              <span className="text-purple-400">background</span>: {gradientString};
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

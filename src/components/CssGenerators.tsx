import React, { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Layout, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../lib/utils';

export default function CssGenerators({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [activeTab, setActiveTab] = useState<'shadow' | 'radius' | 'glass'>('shadow');
  const [copied, setCopied] = useState(false);

  // Shadow State
  const [shadow, setShadow] = useState({ x: 10, y: 10, blur: 20, spread: 0, color: '#000000', opacity: 0.5 });
  const shadowCss = `box-shadow: ${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px rgba(${parseInt(shadow.color.slice(1, 3), 16)}, ${parseInt(shadow.color.slice(3, 5), 16)}, ${parseInt(shadow.color.slice(5, 7), 16)}, ${shadow.opacity});`;

  // Radius State
  const [radius, setRadius] = useState({ tl: 20, tr: 20, br: 20, bl: 20 });
  const radiusCss = `border-radius: ${radius.tl}px ${radius.tr}px ${radius.br}px ${radius.bl}px;`;

  // Glass State
  const [glass, setGlass] = useState({ blur: 10, opacity: 0.2, color: '#ffffff' });
  const glassCss = `background: rgba(${parseInt(glass.color.slice(1, 3), 16)}, ${parseInt(glass.color.slice(3, 5), 16)}, ${parseInt(glass.color.slice(5, 7), 16)}, ${glass.opacity});\nbackdrop-filter: blur(${glass.blur}px);\n-webkit-backdrop-filter: blur(${glass.blur}px);\nborder: 1px solid rgba(255, 255, 255, 0.1);`;

  const handleCopy = (val: string) => {
    copyToClipboard(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-4 border-b border-gray-800 pb-4">
        {['shadow', 'radius', 'glass'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-md text-sm transition-colors capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            {tab} Generator
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="bg-[#161b22] border border-gray-800 rounded-xl p-8 space-y-6 overflow-auto">
          {activeTab === 'shadow' && (
            <>
              <h3 className="text-lg font-bold text-white mb-4">Shadow Settings</h3>
              {['x', 'y', 'blur', 'spread'].map((key) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-400 capitalize">{key} Offset</label>
                    <span className="text-xs text-blue-400 font-mono">{(shadow as any)[key]}px</span>
                  </div>
                  <input 
                    type="range" min="-100" max="100" 
                    value={(shadow as any)[key]} 
                    onChange={(e) => setShadow(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Shadow Color</label>
                <input 
                  type="color" value={shadow.color} 
                  onChange={(e) => setShadow(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 bg-transparent border-none cursor-pointer"
                />
              </div>
            </>
          )}

          {activeTab === 'radius' && (
            <>
              <h3 className="text-lg font-bold text-white mb-4">Border Radius Settings</h3>
              {['tl', 'tr', 'br', 'bl'].map((key) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-400 uppercase">{key}</label>
                    <span className="text-xs text-blue-400 font-mono">{(radius as any)[key]}px</span>
                  </div>
                  <input 
                    type="range" min="0" max="200" 
                    value={(radius as any)[key]} 
                    onChange={(e) => setRadius(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              ))}
            </>
          )}

          {activeTab === 'glass' && (
            <>
              <h3 className="text-lg font-bold text-white mb-4">Glassmorphism Settings</h3>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">Blur Amount</label>
                  <span className="text-xs text-blue-400 font-mono">{glass.blur}px</span>
                </div>
                <input 
                  type="range" min="0" max="50" 
                  value={glass.blur} 
                  onChange={(e) => setGlass(prev => ({ ...prev, blur: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">Opacity</label>
                  <span className="text-xs text-blue-400 font-mono">{Math.round(glass.opacity * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01"
                  value={glass.opacity} 
                  onChange={(e) => setGlass(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-6 h-full">
          <div className="flex-1 bg-[#0d1117] border border-gray-800 rounded-xl p-12 flex items-center justify-center relative overflow-hidden">
            {activeTab === 'glass' && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-20" />
            )}
            <div 
              className="w-48 h-48 bg-blue-600 transition-all duration-300 z-10"
              style={
                activeTab === 'shadow' ? { boxShadow: `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}${Math.round(shadow.opacity * 255).toString(16).padStart(2, '0')}` } :
                activeTab === 'radius' ? { borderRadius: `${radius.tl}px ${radius.tr}px ${radius.br}px ${radius.bl}px` } :
                { 
                  background: `rgba(${parseInt(glass.color.slice(1, 3), 16)}, ${parseInt(glass.color.slice(3, 5), 16)}, ${parseInt(glass.color.slice(5, 7), 16)}, ${glass.opacity})`,
                  backdropFilter: `blur(${glass.blur}px)`,
                  WebkitBackdropFilter: `blur(${glass.blur}px)`,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px'
                }
              }
            />
          </div>

          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">CSS Output</h4>
              <button 
                onClick={() => handleCopy(activeTab === 'shadow' ? shadowCss : activeTab === 'radius' ? radiusCss : glassCss)}
                className="p-2 hover:bg-gray-800 rounded-md transition-colors text-gray-400 hover:text-white"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="font-mono text-xs text-blue-400 bg-[#0d1117] p-4 rounded-lg border border-gray-800 whitespace-pre-wrap">
              {activeTab === 'shadow' ? shadowCss : activeTab === 'radius' ? radiusCss : glassCss}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import ToolHeader from './ToolHeader';
import { RefreshCw, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function PasswordGenerator({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);

  const generatePassword = () => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };

    let characters = '';
    if (options.uppercase) characters += charset.uppercase;
    if (options.lowercase) characters += charset.lowercase;
    if (options.numbers) characters += charset.numbers;
    if (options.symbols) characters += charset.symbols;

    if (!characters) return;

    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  useEffect(() => {
    let s = 0;
    if (password.length > 8) s += 1;
    if (password.length > 12) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;
    setStrength(s);
  }, [password]);

  const strengthInfo = [
    { label: 'Very Weak', color: 'bg-red-500', icon: ShieldAlert },
    { label: 'Weak', color: 'bg-orange-500', icon: ShieldAlert },
    { label: 'Fair', color: 'bg-yellow-500', icon: Shield },
    { label: 'Strong', color: 'bg-green-500', icon: ShieldCheck },
    { label: 'Very Strong', color: 'bg-blue-500', icon: ShieldCheck },
  ][Math.min(strength - 1, 4)] || { label: 'Too Short', color: 'bg-gray-700', icon: ShieldAlert };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto py-8">
      <div className={cn(
        "border rounded-xl p-8 shadow-2xl transition-colors",
        isDarkMode ? "bg-[#161b22] border-gray-800" : "bg-white border-gray-200"
      )}>
        <ToolHeader title="Generated Password" copyValue={password} />
        
        <div className="relative mb-8">
          <input 
            type="text" 
            readOnly 
            value={password}
            className={cn(
              "w-full border rounded-lg py-4 px-6 text-2xl font-mono text-center tracking-wider focus:outline-none transition-colors",
              isDarkMode ? "bg-[#0d1117] border-gray-800 text-blue-400" : "bg-gray-50 border-gray-200 text-blue-600"
            )}
          />
          <button 
            onClick={generatePassword}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors",
              isDarkMode ? "hover:bg-gray-800 text-gray-500 hover:text-white" : "hover:bg-gray-200 text-gray-400 hover:text-gray-900"
            )}
          >
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-500">Password Length: {length}</label>
            </div>
            <input 
              type="range" 
              min="4" 
              max="64" 
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className={cn(
                "w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-colors",
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(options).map(([key, val]) => (
              <label key={key} className={cn(
                "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                isDarkMode ? "bg-[#0d1117] border-gray-800 hover:bg-gray-800" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              )}>
                <input 
                  type="checkbox" 
                  checked={val}
                  onChange={() => setOptions(prev => ({ ...prev, [key]: !val }))}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={cn(
                  "text-sm font-medium capitalize",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>{key}</span>
              </label>
            ))}
          </div>

          <div className={cn(
            "pt-4 border-t",
            isDarkMode ? "border-gray-800" : "border-gray-200"
          )}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Strength Indicator</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${strengthInfo.color} text-white`}>
                {strengthInfo.label}
              </span>
            </div>
            <div className="flex gap-1 h-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex-1 rounded-full transition-all duration-500",
                    i <= strength ? strengthInfo.color : (isDarkMode ? "bg-gray-800" : "bg-gray-200")
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

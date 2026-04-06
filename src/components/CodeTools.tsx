import React, { useState, useEffect } from 'react';
import ToolHeader from './ToolHeader';
import CodeEditor from './CodeEditor';
import prettier from 'prettier/standalone';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import parserJs from 'prettier/parser-babel';

interface CodeToolsProps {
  mode: 'format' | 'minify';
  language: 'html' | 'css' | 'javascript';
  isDarkMode?: boolean;
}

export default function CodeTools({ mode, language, isDarkMode = true }: CodeToolsProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const getParser = () => {
    switch (language) {
      case 'html': return { parser: 'html', plugins: [parserHtml] };
      case 'css': return { parser: 'css', plugins: [parserCss] };
      case 'javascript': return { parser: 'babel', plugins: [parserJs] };
      default: return { parser: 'babel', plugins: [parserJs] };
    }
  };

  const processCode = async () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (mode === 'format') {
        const { parser, plugins } = getParser();
        const formatted = await prettier.format(input, {
          parser,
          plugins,
          printWidth: 80,
          tabWidth: 2,
        });
        setOutput(formatted);
      } else {
        // Simple minification
        let minified = input
          .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Remove comments
          .replace(/\s+/g, ' ') // Collapse whitespace
          .replace(/\s*([{};:,])\s*/g, '$1') // Remove spaces around delimiters
          .trim();
        setOutput(minified);
      }
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  useEffect(() => {
    processCode();
  }, [input, mode, language]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col h-full min-h-[400px]">
        <ToolHeader 
          title={`Input ${language.toUpperCase()}`} 
          onClear={() => setInput('')} 
          copyValue={input}
        />
        <CodeEditor 
          value={input} 
          onChange={setInput} 
          language={language === 'javascript' ? 'javascript' : language} 
          placeholder={`Paste your ${language.toUpperCase()} here...`}
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="flex flex-col h-full min-h-[400px]">
        <ToolHeader 
          title="Output" 
          copyValue={output}
        />
        {error ? (
          <div className="flex-1 p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-white overflow-auto font-mono text-sm">
            <p className="font-bold mb-2">Error Processing Code:</p>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        ) : (
          <CodeEditor 
            value={output} 
            readOnly 
            language={language === 'javascript' ? 'javascript' : language} 
            placeholder="Output will appear here..."
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
}

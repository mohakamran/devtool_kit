import React, { useEffect, useRef, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import { cn } from '../lib/utils';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  isDarkMode?: boolean;
}

export default function CodeEditor({ 
  value, 
  onChange, 
  language, 
  placeholder, 
  readOnly = false,
  className,
  isDarkMode = true
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Sync scroll between textarea and pre
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  // Highlight code using Prism.highlight (returns HTML string)
  const highlightedCode = useMemo(() => {
    const lang = language === 'javascript' ? Prism.languages.javascript :
                 language === 'css' ? Prism.languages.css :
                 language === 'html' || language === 'markup' ? Prism.languages.markup :
                 Prism.languages.plain;
    
    // Add a trailing newline to ensure the last line is rendered correctly
    const code = value + (value.endsWith('\n') ? ' ' : '');
    return Prism.highlight(code, lang, language);
  }, [value, language]);

  return (
    <div className={cn(
      "relative group h-full font-mono text-sm overflow-hidden rounded-md border transition-colors",
      isDarkMode ? "bg-[#161b22] border-gray-800" : "bg-gray-50 border-gray-200",
      className
    )}>
      {!readOnly ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          className={cn(
            "absolute inset-0 w-full h-full p-4 bg-transparent text-transparent resize-none z-10 focus:outline-none whitespace-pre overflow-auto font-mono leading-relaxed tracking-normal",
            isDarkMode ? "caret-white" : "caret-gray-900"
          )}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      ) : null}
      <pre 
        ref={preRef}
        className={cn(
          `language-${language} h-full p-4 m-0 overflow-auto font-mono leading-relaxed tracking-normal`,
          !readOnly && "pointer-events-none"
        )}
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
        aria-hidden="true"
      >
        <code 
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}

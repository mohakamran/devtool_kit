import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Github, 
  Moon, 
  Sun,
  Copy,
  Check,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TOOLS, Tool, ToolCategory } from './types';
import { cn } from './lib/utils';

import JsonTools from './components/JsonTools';
import CodeTools from './components/CodeTools';
import RegexTester from './components/RegexTester';
import Base64Tools from './components/Base64Tools';
import HashGenerator from './components/HashGenerator';
import PasswordGenerator from './components/PasswordGenerator';
import TimestampConverter from './components/TimestampConverter';
import UuidGenerator from './components/UuidGenerator';
import MarkdownPreviewer from './components/MarkdownPreviewer';
import DiffChecker from './components/DiffChecker';
import ApiTester from './components/ApiTester';
import HttpStatusCodes from './components/HttpStatusCodes';
import ColorTools from './components/ColorTools';
import CssGenerators from './components/CssGenerators';
import SnippetsManager from './components/SnippetsManager';
import UrlTools from './components/UrlTools';
import JwtDecoder from './components/JwtDecoder';
import GradientGenerator from './components/GradientGenerator';
import CodePlayground from './components/CodePlayground';

export default function App() {
  const [activeToolId, setActiveToolId] = useState<string>(TOOLS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const activeTool = useMemo(() => 
    TOOLS.find(t => t.id === activeToolId) || TOOLS[0], 
  [activeToolId]);

  const filteredTools = useMemo(() => {
    if (!searchQuery) return TOOLS;
    return TOOLS.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const groupedTools = useMemo(() => {
    const groups: Record<ToolCategory, Tool[]> = {} as any;
    filteredTools.forEach(tool => {
      if (!groups[tool.category]) groups[tool.category] = [];
      groups[tool.category].push(tool);
    });
    return groups;
  }, [filteredTools]);

  return (
    <div className={cn(
      "flex h-screen overflow-hidden font-sans transition-colors duration-300",
      isDarkMode ? "dark bg-[#0d1117] text-gray-300" : "bg-gray-50 text-gray-900"
    )}>
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className={cn(
          "border-r flex flex-col transition-all duration-300",
          isDarkMode ? "bg-[#161b22] border-gray-800" : "bg-white border-gray-200",
          !isSidebarOpen && "hidden md:flex"
        )}
      >
        <div className={cn(
          "p-4 border-b flex items-center justify-between",
          isDarkMode ? "border-gray-800" : "border-gray-200"
        )}>
          <div className={cn(
            "flex items-center gap-2 font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            <Terminal className="w-6 h-6 text-blue-500" />
            <span>DevToolKit</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className={cn(
              "p-1 rounded md:hidden",
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full border rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors",
                isDarkMode ? "bg-[#0d1117] border-gray-800 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-900"
              )}
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-6">
          {Object.entries(groupedTools).map(([category, tools]) => (
            <div key={category}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {category}
              </h3>
              <div className="space-y-1">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveToolId(tool.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group border",
                      activeToolId === tool.id 
                        ? (isDarkMode ? "bg-blue-600/10 text-blue-400 border-blue-600/20" : "bg-blue-50 text-blue-600 border-blue-200") 
                        : (isDarkMode ? "hover:bg-gray-800 text-gray-400 border-transparent" : "hover:bg-gray-50 text-gray-600 border-transparent")
                    )}
                  >
                    <tool.icon className={cn(
                      "w-4 h-4 shrink-0",
                      activeToolId === tool.id 
                        ? (isDarkMode ? "text-blue-400" : "text-blue-600") 
                        : (isDarkMode ? "text-gray-500 group-hover:text-gray-300" : "text-gray-400 group-hover:text-gray-600")
                    )} />
                    <div className="flex flex-col items-start min-w-0">
                      <span className="truncate font-medium">{tool.name}</span>
                      <span className={cn(
                        "text-[10px] truncate w-full",
                        activeToolId === tool.id
                          ? (isDarkMode ? "text-blue-400/70" : "text-blue-600/70")
                          : "text-gray-500"
                      )}>
                        {tool.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className={cn(
          "p-4 border-t flex items-center justify-between text-xs text-gray-500",
          isDarkMode ? "border-gray-800" : "border-gray-200"
        )}>
          <span>v1.0.0</span>
          <a href="#" className={cn(
            "transition-colors",
            isDarkMode ? "hover:text-white" : "hover:text-gray-900"
          )}>
            <Github className="w-4 h-4" />
          </a>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className={cn(
          "h-14 border-b flex items-center justify-between px-4 backdrop-blur-sm z-10 transition-colors",
          isDarkMode ? "bg-[#161b22]/50 border-gray-800" : "bg-white/80 border-gray-200"
        )}>
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"
                )}
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">{activeTool.category}</span>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className={cn(
                "font-medium",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>{activeTool.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={cn(
                "p-2 rounded-md transition-all duration-300",
                isDarkMode ? "hover:bg-gray-800 text-yellow-400" : "hover:bg-gray-100 text-blue-600"
              )}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Tool Area */}
        <div className={cn(
          "flex-1 overflow-auto p-6 transition-colors duration-300",
          isDarkMode ? "bg-[#0d1117]" : "bg-gray-50"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeToolId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ToolRenderer toolId={activeToolId} isDarkMode={isDarkMode} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function ToolRenderer({ toolId, isDarkMode }: { toolId: string, isDarkMode: boolean }) {
  switch (toolId) {
    case 'json-formatter': return <JsonTools mode="format" isDarkMode={isDarkMode} />;
    case 'json-minifier': return <JsonTools mode="minify" isDarkMode={isDarkMode} />;
    case 'json-validator': return <JsonTools mode="validate" isDarkMode={isDarkMode} />;
    
    case 'html-formatter': return <CodeTools mode="format" language="html" isDarkMode={isDarkMode} />;
    case 'css-formatter': return <CodeTools mode="format" language="css" isDarkMode={isDarkMode} />;
    case 'js-formatter': return <CodeTools mode="format" language="javascript" isDarkMode={isDarkMode} />;
    
    case 'html-minifier': return <CodeTools mode="minify" language="html" isDarkMode={isDarkMode} />;
    case 'css-minifier': return <CodeTools mode="minify" language="css" isDarkMode={isDarkMode} />;
    case 'js-minifier': return <CodeTools mode="minify" language="javascript" isDarkMode={isDarkMode} />;
    
    case 'regex-tester': return <RegexTester isDarkMode={isDarkMode} />;
    case 'base64-tools': return <Base64Tools isDarkMode={isDarkMode} />;
    case 'url-tools': return <UrlTools isDarkMode={isDarkMode} />;
    
    case 'hash-generator': return <HashGenerator isDarkMode={isDarkMode} />;
    case 'jwt-decoder': return <JwtDecoder isDarkMode={isDarkMode} />;
    
    case 'color-tools': return <ColorTools isDarkMode={isDarkMode} />;
    case 'gradient-generator': return <GradientGenerator isDarkMode={isDarkMode} />;
    case 'code-playground': return <CodePlayground isDarkMode={isDarkMode} />;
    case 'css-generators': return <CssGenerators isDarkMode={isDarkMode} />;
    
    case 'snippets-manager': return <SnippetsManager isDarkMode={isDarkMode} />;
    case 'markdown-previewer': return <MarkdownPreviewer isDarkMode={isDarkMode} />;
    case 'diff-checker': return <DiffChecker isDarkMode={isDarkMode} />;
    
    case 'api-tester': return <ApiTester isDarkMode={isDarkMode} />;
    case 'http-status': return <HttpStatusCodes isDarkMode={isDarkMode} />;
    
    case 'timestamp-converter': return <TimestampConverter isDarkMode={isDarkMode} />;
    case 'uuid-generator': return <UuidGenerator isDarkMode={isDarkMode} />;
    case 'password-generator': return <PasswordGenerator isDarkMode={isDarkMode} />;
    
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <Terminal className={cn(
            "w-16 h-16",
            isDarkMode ? "text-gray-700" : "text-gray-300"
          )} />
          <h2 className={cn(
            "text-2xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>Tool Under Construction</h2>
          <p className="text-gray-500 max-w-md">
            We are currently building this tool. Please check back soon or try another one from the sidebar.
          </p>
        </div>
      );
  }
}


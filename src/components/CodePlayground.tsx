import React, { useState, useEffect, useRef, useMemo } from 'react';
import ToolHeader from './ToolHeader';
import CodeEditor from './CodeEditor';
import { Play, RotateCcw, Maximize2, Minimize2, Layout, Eye, Save, Trash2, Plus, FolderOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { cn, copyToClipboard } from '../lib/utils';

interface Project {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  updatedAt: number;
}

export default function CodePlayground({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [html, setHtml] = useState('<h1>Hello World!</h1>\n<p>Start editing to see magic happen.</p>');
  const [css, setCss] = useState('body {\n  font-family: system-ui;\n  padding: 2rem;\n  background: #f0f2f5;\n  color: #1a202c;\n  text-align: center;\n}\n\nh1 {\n  color: #3182ce;\n}');
  const [js, setJs] = useState('console.log("Hello from JS!");\n\n// You can interact with the DOM\ndocument.querySelector("h1").style.fontSize = "3rem";');
  const [srcDoc, setSrcDoc] = useState('');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [copied, setCopied] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [projectName, setProjectName] = useState('Untitled Project');

  // Load projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dev-toolkit-playground-projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProjects(parsed);
      } catch (e) {
        console.error('Failed to parse projects', e);
      }
    }
  }, []);

  // Save projects to localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('dev-toolkit-playground-projects', JSON.stringify(projects));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [projects]);

  // Auto-save current project if active
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (activeProjectId) {
        setProjects(prev => prev.map(p => 
          p.id === activeProjectId 
            ? { ...p, html, css, js, updatedAt: Date.now() } 
            : p
        ));
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [html, css, js, activeProjectId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
    }, 300);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const handleCopy = () => {
    const val = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
    copyToClipboard(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setHtml('<h1>Hello World!</h1>\n<p>Start editing to see magic happen.</p>');
    setCss('body {\n  font-family: system-ui;\n  padding: 2rem;\n  background: #f0f2f5;\n  color: #1a202c;\n  text-align: center;\n}\n\nh1 {\n  color: #3182ce;\n}');
    setJs('console.log("Hello from JS!");\n\n// You can interact with the DOM\ndocument.querySelector("h1").style.fontSize = "3rem";');
    setActiveProjectId(null);
    setProjectName('Untitled Project');
  };

  const saveNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName || 'Untitled Project',
      html,
      css,
      js,
      updatedAt: Date.now(),
    };
    setProjects([newProject, ...projects]);
    setActiveProjectId(newProject.id);
    setIsProjectsOpen(false);
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(projects.filter(p => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(null);
      setProjectName('Untitled Project');
    }
  };

  const loadProject = (p: Project) => {
    setHtml(p.html);
    setCss(p.css);
    setJs(p.js);
    setActiveProjectId(p.id);
    setProjectName(p.name);
    setIsProjectsOpen(false);
  };

  return (
    <div className={cn(
      "flex flex-col gap-4 h-full relative",
      isFullscreen && "fixed inset-0 z-50 bg-[#0d1117] p-4"
    )}>
      <ToolHeader 
        title="Code Playground" 
        description="Real-time HTML/CSS/JS compiler for testing your code snippets."
      />

      <div className="flex items-center justify-between bg-[#161b22] border border-gray-800 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all border",
                isProjectsOpen ? "bg-blue-600 text-white border-blue-600" : "bg-[#0d1117] text-gray-400 border-gray-800 hover:text-white"
              )}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              {activeProjectId ? projects.find(p => p.id === activeProjectId)?.name : 'Projects'}
              {isProjectsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isProjectsOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#161b22] border border-gray-800 rounded-xl shadow-2xl z-50 py-2">
                <div className="px-3 pb-2 border-b border-gray-800 mb-2">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Project name..."
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="flex-1 bg-[#0d1117] border border-gray-800 rounded-md py-1 px-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={saveNewProject}
                      className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                      title="Save Current"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto px-2 space-y-1">
                  {projects.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => loadProject(p)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all group",
                        activeProjectId === p.id ? "bg-blue-600/10 text-blue-400" : "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                      )}
                    >
                      <span className="text-xs font-medium truncate flex-1">{p.name}</span>
                      <button 
                        onClick={(e) => deleteProject(p.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-4 text-[10px] text-gray-600 italic">No saved projects</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-gray-800 mx-1" />

          <button 
            onClick={() => setActiveTab('html')}
            className={cn(
              "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
              activeTab === 'html' ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" : "text-gray-500 hover:text-gray-300"
            )}
          >
            HTML
          </button>
          <button 
            onClick={() => setActiveTab('css')}
            className={cn(
              "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
              activeTab === 'css' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "text-gray-500 hover:text-gray-300"
            )}
          >
            CSS
          </button>
          <button 
            onClick={() => setActiveTab('js')}
            className={cn(
              "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
              activeTab === 'js' ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" : "text-gray-500 hover:text-gray-300"
            )}
          >
            JS
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLayout(layout === 'horizontal' ? 'vertical' : 'horizontal')}
            className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            title="Toggle Layout"
          >
            <Layout className={cn("w-4 h-4", layout === 'vertical' && "rotate-90")} />
          </button>
          <button 
            onClick={reset}
            className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className={cn(
        "flex-1 flex gap-4 min-h-0",
        layout === 'vertical' ? "flex-col" : "flex-col lg:flex-row"
      )}>
        <div className="flex-1 flex flex-col min-h-0 bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="px-4 py-2 bg-[#0d1117] border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Editor</span>
              <button 
                onClick={handleCopy}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-colors",
                  copied ? "text-green-500" : "text-blue-500 hover:text-blue-400"
                )}
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
            </div>
          </div>
          <div className="flex-1 min-h-0">
            {activeTab === 'html' && <CodeEditor language="html" value={html} onChange={setHtml} />}
            {activeTab === 'css' && <CodeEditor language="css" value={css} onChange={setCss} />}
            {activeTab === 'js' && <CodeEditor language="javascript" value={js} onChange={setJs} />}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 bg-white border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 bg-gray-200 rounded text-[9px] font-bold text-gray-500">100%</div>
            </div>
          </div>
          <iframe 
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            frameBorder="0"
            width="100%"
            height="100%"
            className="flex-1 bg-white"
          />
        </div>
      </div>
    </div>
  );
}

import { 
  Code2, 
  Search, 
  ShieldCheck, 
  Zap, 
  Brain, 
  Globe, 
  Calculator, 
  Palette, 
  FileJson, 
  Braces, 
  Hash, 
  Lock, 
  Link, 
  Type, 
  Layout, 
  Clock, 
  Fingerprint, 
  Key, 
  FileText, 
  Layers, 
  Split, 
  Network,
  Play,
  Paintbrush
} from 'lucide-react';

export type ToolCategory = 
  | 'JSON' 
  | 'Formatters' 
  | 'Minifiers' 
  | 'Debugging' 
  | 'Security' 
  | 'Frontend' 
  | 'Productivity' 
  | 'Network' 
  | 'Utilities';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: any;
}

export const TOOLS: Tool[] = [
  // JSON
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Pretty print JSON with indentation', category: 'JSON', icon: FileJson },
  { id: 'json-minifier', name: 'JSON Minifier', description: 'Compress JSON to a single line', category: 'JSON', icon: Braces },
  { id: 'json-validator', name: 'JSON Validator', description: 'Validate JSON and find syntax errors', category: 'JSON', icon: ShieldCheck },
  
  // Formatters
  { id: 'html-formatter', name: 'HTML Formatter', description: 'Format HTML code', category: 'Formatters', icon: Code2 },
  { id: 'css-formatter', name: 'CSS Formatter', description: 'Format CSS code', category: 'Formatters', icon: Palette },
  { id: 'js-formatter', name: 'JS Formatter', description: 'Format JavaScript code', category: 'Formatters', icon: Code2 },
  
  // Minifiers
  { id: 'html-minifier', name: 'HTML Minifier', description: 'Minify HTML code', category: 'Minifiers', icon: Zap },
  { id: 'css-minifier', name: 'CSS Minifier', description: 'Minify CSS code', category: 'Minifiers', icon: Zap },
  { id: 'js-minifier', name: 'JS Minifier', description: 'Minify JavaScript code', category: 'Minifiers', icon: Zap },
  
  // Debugging
  { id: 'regex-tester', name: 'Regex Tester', description: 'Test regular expressions in real-time', category: 'Debugging', icon: Search },
  { id: 'base64-tools', name: 'Base64 Tools', description: 'Encode/Decode Base64 text and images', category: 'Debugging', icon: Layers },
  { id: 'url-tools', name: 'URL Tools', description: 'Encode/Decode URLs and parse query strings', category: 'Debugging', icon: Link },
  
  // Security
  { id: 'hash-generator', name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256 hashes', category: 'Security', icon: Hash },
  { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode JSON Web Tokens', category: 'Security', icon: Lock },
  
  // Frontend
  { id: 'gradient-generator', name: 'Gradient Generator', description: 'Create beautiful CSS gradients', category: 'Frontend', icon: Paintbrush },
  { id: 'code-playground', name: 'Code Playground', description: 'Real-time HTML/CSS/JS compiler', category: 'Frontend', icon: Play },
  { id: 'color-tools', name: 'Color Tools', description: 'Picker, Converter, and Gradient Generator', category: 'Frontend', icon: Palette },
  { id: 'css-generators', name: 'CSS Generators', description: 'Shadows, Radius, Glassmorphism, Flexbox', category: 'Frontend', icon: Layout },
  
  // Productivity
  { id: 'snippets-manager', name: 'Snippets Manager', description: 'Save and manage code snippets', category: 'Productivity', icon: Brain },
  { id: 'markdown-previewer', name: 'Markdown Previewer', description: 'Real-time Markdown editor and previewer', category: 'Productivity', icon: FileText },
  { id: 'diff-checker', name: 'Diff Checker', description: 'Compare two texts for differences', category: 'Productivity', icon: Split },
  
  // Network
  { id: 'api-tester', name: 'API Tester', description: 'Test REST APIs (Mini Postman)', category: 'Network', icon: Network },
  { id: 'http-status', name: 'HTTP Status Codes', description: 'Reference for HTTP status codes', category: 'Network', icon: Globe },
  
  // Utilities
  { id: 'timestamp-converter', name: 'Timestamp Converter', description: 'Unix to Human-readable date converter', category: 'Utilities', icon: Clock },
  { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate unique IDs', category: 'Utilities', icon: Fingerprint },
  { id: 'password-generator', name: 'Password Generator', description: 'Generate secure passwords', category: 'Utilities', icon: Key },
];

import React, { useState } from 'react';
import axios from 'axios';
import ToolHeader from './ToolHeader';
import CodeEditor from './CodeEditor';
import { Play, Send, Loader2, AlertCircle } from 'lucide-react';

export default function ApiTester({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const parsedHeaders = JSON.parse(headers || '{}');
      const parsedBody = method !== 'GET' ? JSON.parse(body || '{}') : undefined;

      const res = await axios({
        method,
        url,
        headers: parsedHeaders,
        data: parsedBody,
        validateStatus: () => true, // Don't throw on error status codes
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: res.data,
        time: 'N/A', // Axios doesn't easily provide timing
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-4 bg-[#161b22] border border-gray-800 rounded-lg p-4">
        <select 
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="bg-[#0d1117] border border-gray-800 rounded-md py-2 px-4 text-blue-400 font-bold focus:outline-none"
        >
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input 
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="flex-1 bg-[#0d1117] border border-gray-800 rounded-md py-2 px-4 text-white focus:outline-none focus:border-blue-500"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 text-white px-6 py-2 rounded-md transition-colors font-bold"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col h-full space-y-6">
          <div className="flex-1 flex flex-col">
            <ToolHeader title="Headers (JSON)" copyValue={headers} />
            <CodeEditor language="json" value={headers} onChange={setHeaders} />
          </div>
          {method !== 'GET' && (
            <div className="flex-1 flex flex-col">
              <ToolHeader title="Body (JSON)" copyValue={body} />
              <CodeEditor language="json" value={body} onChange={setBody} />
            </div>
          )}
        </div>

        <div className="flex flex-col h-full">
          <ToolHeader title="Response" copyValue={response ? JSON.stringify(response.data, null, 2) : undefined} />
          {loading ? (
            <div className="flex-1 bg-[#161b22] border border-gray-800 rounded-md flex flex-col items-center justify-center text-gray-500 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <p>Sending request...</p>
            </div>
          ) : error ? (
            <div className="flex-1 bg-red-900/10 border border-red-900/30 rounded-md p-6 text-red-400 flex flex-col items-center justify-center text-center gap-4">
              <AlertCircle className="w-12 h-12" />
              <div>
                <p className="font-bold mb-1">Request Failed</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </div>
          ) : response ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-4 mb-4">
                <div className={`px-3 py-1 rounded text-xs font-bold ${response.status >= 200 && response.status < 300 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {response.status} {response.statusText}
                </div>
              </div>
              <CodeEditor 
                language="json" 
                value={JSON.stringify(response.data, null, 2)} 
                readOnly 
              />
            </div>
          ) : (
            <div className="flex-1 bg-[#161b22] border border-gray-800 rounded-md flex flex-col items-center justify-center text-gray-600 italic">
              <p>Response will appear here after sending request</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

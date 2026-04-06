import React, { useState } from 'react';
import { Search, Info, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../lib/utils';

const STATUS_CODES = [
  { code: 100, name: 'Continue', description: 'The server has received the request headers and the client should proceed to send the request body.' },
  { code: 101, name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols.' },
  { code: 200, name: 'OK', description: 'Standard response for successful HTTP requests.' },
  { code: 201, name: 'Created', description: 'The request has been fulfilled, resulting in the creation of a new resource.' },
  { code: 202, name: 'Accepted', description: 'The request has been accepted for processing, but the processing has not been completed.' },
  { code: 204, name: 'No Content', description: 'The server successfully processed the request and is not returning any content.' },
  { code: 301, name: 'Moved Permanently', description: 'This and all future requests should be directed to the given URI.' },
  { code: 302, name: 'Found', description: 'The resource was found, but at a different URI.' },
  { code: 304, name: 'Not Modified', description: 'Indicates that the resource has not been modified since the version specified by the request headers.' },
  { code: 400, name: 'Bad Request', description: 'The server cannot or will not process the request due to an apparent client error.' },
  { code: 401, name: 'Unauthorized', description: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.' },
  { code: 403, name: 'Forbidden', description: 'The request contained valid data and was understood by the server, but the server is refusing action.' },
  { code: 404, name: 'Not Found', description: 'The requested resource could not be found but may be available in the future.' },
  { code: 405, name: 'Method Not Allowed', description: 'A request method is not supported for the requested resource.' },
  { code: 408, name: 'Request Timeout', description: 'The server timed out waiting for the request.' },
  { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time.' },
  { code: 500, name: 'Internal Server Error', description: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.' },
  { code: 502, name: 'Bad Gateway', description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.' },
  { code: 503, name: 'Service Unavailable', description: 'The server cannot handle the request (because it is overloaded or down for maintenance).' },
  { code: 504, name: 'Gateway Timeout', description: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.' },
];

export default function HttpStatusCodes({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<number | null>(null);

  const filtered = STATUS_CODES.filter(s => 
    s.code.toString().includes(search) || 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (status: typeof STATUS_CODES[0]) => {
    const text = `${status.code} ${status.name}: ${status.description}`;
    copyToClipboard(text);
    setCopied(status.code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
          type="text"
          placeholder="Search by code or name (e.g. 404 or Not Found)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#161b22] border border-gray-800 rounded-xl py-4 pl-12 pr-6 text-lg text-white focus:outline-none focus:border-blue-500 shadow-xl"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((status) => (
          <div key={status.code} className="bg-[#161b22] border border-gray-800 rounded-xl p-6 flex flex-col sm:flex-row gap-6 hover:border-blue-500/50 transition-all group">
            <div className={`text-4xl font-black w-24 flex-shrink-0 flex items-center justify-center rounded-lg ${
              status.code < 300 ? 'text-green-500 bg-green-500/10' :
              status.code < 400 ? 'text-blue-500 bg-blue-500/10' :
              status.code < 500 ? 'text-orange-500 bg-orange-500/10' :
              'text-red-500 bg-red-500/10'
            }`}>
              {status.code}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{status.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{status.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleCopy(status)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-600 hover:text-white opacity-0 group-hover:opacity-100"
              >
                {copied === status.code ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
              <a 
                href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${status.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-600 hover:text-blue-400"
              >
                <Info className="w-5 h-5" />
              </a>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-600 italic">
            No status codes found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

import http from 'http';
import { URL } from 'url';

// Load .env automatically for local development (if present)
try {
  // top-level await is supported in modern Node; import dotenv dynamically
  const dotenv = await import('dotenv');
  dotenv.config();
  console.log('.env loaded');
} catch (e) {
  console.log('dotenv not loaded (running without .env)');
}

const PORT = process.env.PROXY_PORT || 3001;
// Use the correct Gemini REST API endpoint
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-pro';

console.log(`Starting GenAI proxy on port ${PORT}`);
console.log('GEMINI_API_KEY present?', !!GEMINI_API_KEY);

const getRequestBody = (req) => new Promise((resolve, reject) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => resolve(body));
  req.on('error', reject);
});

const server = http.createServer(async (req, res) => {
  // Basic CORS handling so browser can call localhost:3001 from vite dev server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'POST' && url.pathname === '/api/genai') {
    try {
      const bodyText = await getRequestBody(req);
      const bodyJson = bodyText ? JSON.parse(bodyText) : {};

      if (!GEMINI_API_KEY) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server not configured with GEMINI_API_KEY' }));
        return;
      }

      // Build proper Gemini REST API request
      const { prompt, systemInstruction } = bodyJson;
      const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      
      // For v1 API, combine system instruction with the user prompt
      const fullPrompt = systemInstruction 
        ? `${systemInstruction}\n\n${prompt}`
        : prompt;
      
      const requestBody = {
        contents: [{ 
          parts: [{ text: fullPrompt }] 
        }]
      };

      console.log('Forwarding to Gemini:', geminiUrl.replace(GEMINI_API_KEY, '***'));

      // Forward request to Google Gemini REST endpoint
      const fetchRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const json = await fetchRes.json();
      console.log('Gemini response status:', fetchRes.status);
      
      res.writeHead(fetchRes.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(json));
    } catch (err) {
      console.error('Proxy error', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'proxy error', detail: String(err) }));
    }
    return;
  }

  // Not found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(PORT, () => {
  console.log(`GenAI proxy listening on http://localhost:${PORT}/api/genai`);
});

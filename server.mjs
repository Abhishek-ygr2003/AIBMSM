import http from 'http';
import { URL } from 'url';

const PORT = process.env.PROXY_PORT || 3001;
const GEMINI_URL = 'https://api.generativeai.googleapis.com/v1/models/gemini-2.5-flash:generateText';

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

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server not configured with GEMINI_API_KEY' }));
        return;
      }

      // Forward request to Google GenAI REST endpoint
      const fetchRes = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(bodyJson)
      });

      const json = await fetchRes.json();
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

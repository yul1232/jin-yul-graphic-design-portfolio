const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const root = __dirname;
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml' };
http.createServer((req,res)=>{
  let file;
  try { const pathname = new URL(req.url,'http://localhost').pathname; file = path.resolve(root,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname)); } catch { res.writeHead(400).end(); return; }
  if (!file.startsWith(root+path.sep)) {res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);});
}).listen(4173,'127.0.0.1',()=>console.log('http://127.0.0.1:4173'));

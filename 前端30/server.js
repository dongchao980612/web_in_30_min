const http = require('http');
const https = require('https');
const url = require('url');
const cors = require('cors'); // 导入 cors 中间件

const BILIBILI_API_URL = 'https://api.bilibili.com/x/relation/stat?vmid=4848323';

const server = http.createServer((req, res) => {
  req, res, () => {

    cors()
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/getFans') {
      https.get(BILIBILI_API_URL, (bilibiliRes) => {
        let data = '';
        bilibiliRes.on('data', (chunk) => {
          data += chunk;
        });

        bilibiliRes.on('end', () => {
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(200);
          res.end(data);
        });
      }).on('error', (err) => {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      });
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  };
});

const port = 5000;
server.listen(port, () => {
  console.log('Server running at http://localhost:' + port + '/');
});
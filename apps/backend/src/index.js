import http from "node:http";

const port = process.env.PORT || 4000;

const server = http.createServer((_, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ status: "ok", service: "backend" }));
});

server.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

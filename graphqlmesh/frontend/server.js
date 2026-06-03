const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const publicDir = __dirname;
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

function resolveRequestPath(url) {
  const requestPath = url === "/" ? "/index.html" : url;
  const resolvedPath = path.normalize(path.join(publicDir, requestPath));

  if (!resolvedPath.startsWith(publicDir)) {
    return path.join(publicDir, "index.html");
  }

  return resolvedPath;
}

const server = http.createServer(async (request, response) => {
  const filePath = resolveRequestPath(new URL(request.url, "http://localhost").pathname);
  const extension = path.extname(filePath);

  try {
    const file = await fs.readFile(filePath);
    response.writeHead(200, {
      "content-type": contentTypes[extension] ?? "application/octet-stream"
    });
    response.end(file);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

const port = Number(process.env.FRONTEND_PORT ?? 5174);
server.listen(port, () => {
  console.log(`GraphQL Mesh frontend ready at http://localhost:${port}`);
});

module.exports = { server, resolveRequestPath };

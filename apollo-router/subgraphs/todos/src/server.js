const fs = require("node:fs/promises");
const path = require("node:path");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const cors = require("cors");
const express = require("express");
const { createSchema } = require("./schema");

async function start() {
  const port = Number(process.env.TODOS_PORT ?? 4001);
  const schemaPath = path.join(__dirname, "..", "schema.graphql");
  const app = express();
  const corsOptions = {
    origin: [
      "https://studio.apollographql.com",
      "https://studio-ui-deployments.apollographql.com",
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    allowedHeaders: ["content-type", "apollo-require-preflight", "authorization"],
    methods: ["GET", "POST", "OPTIONS"]
  };
  const server = new ApolloServer({
    schema: createSchema()
  });

  await server.start();

  app.get("/schema.graphql", async (_request, response, next) => {
    try {
      response.type("text/plain").send(await fs.readFile(schemaPath, "utf8"));
    } catch (error) {
      next(error);
    }
  });

  app.options("/", cors(corsOptions));
  app.post("/", cors(corsOptions), express.json(), expressMiddleware(server));

  await new Promise((resolve) => {
    app.listen(port, resolve);
  });

  console.log(`Todos subgraph ready at http://localhost:${port}/`);
  console.log(`Todos SDL ready at http://localhost:${port}/schema.graphql`);
}

if (require.main === module) {
  start().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { start };

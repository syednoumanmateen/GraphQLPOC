import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cors from 'cors';
import express from 'express';
import gql from 'graphql-tag';
import { resolvers } from './resolvers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sdl = readFileSync(resolve(__dirname, '..', 'schema.graphql'), 'utf8');
const typeDefs = gql(sdl);

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

const port = Number(process.env.TODOS_PORT || 4002);
const app = express();

await server.start();

app.get('/schema.graphql', (_request, response) => {
  response.type('text/plain').send(sdl);
});

app.options('/', cors());
app.post('/', cors(), express.json(), expressMiddleware(server));

await new Promise((resolve) => {
  app.listen(port, resolve);
});

console.log(`[todos] subgraph ready at http://localhost:${port}/`);
console.log(`[todos] SDL ready at http://localhost:${port}/schema.graphql`);

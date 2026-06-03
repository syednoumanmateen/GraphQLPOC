const { buildSubgraphSchema } = require("@apollo/subgraph");
const { resolvers } = require("./resolvers");
const { typeDefs } = require("./typeDefs");

function createSchema() {
  return buildSubgraphSchema({ typeDefs, resolvers });
}

module.exports = { createSchema, resolvers, typeDefs };

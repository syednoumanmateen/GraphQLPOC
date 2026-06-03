const fs = require("node:fs");
const path = require("node:path");
const { parse } = require("graphql");

const schemaPath = path.join(__dirname, "..", "schema.graphql");
const typeDefs = parse(fs.readFileSync(schemaPath, "utf8"));

module.exports = { typeDefs };

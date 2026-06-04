# GraphQLPOC

This workspace contains two separate Todo CRUD POCs:

1. `apollo-router`
2. `graphqlmesh`

Install and run them separately. Do not share commands between the two folders.

No `node_modules` folders are stored in the workspace. Run `npm install` inside the POC folder before starting it.

## Commands To Run Both Applications

Run these commands from the `GraphQLPOC` folder after cloning or after deleting `node_modules`.

### Install Both Applications

```bash
cd apollo-router
npm install
cd ../graphqlmesh
npm install
cd ..
```

### Start Apollo Router Application

Open terminal 1:

```bash
cd apollo-router
npm run dev:subgraph
```

Open terminal 2:

```bash
cd apollo-router
npm run apollo-rover
npm run apollo-router
```

Open terminal 3:

```bash
cd apollo-router
npm run dev:frontend
```

Apollo Router application URLs:

```text
Subgraph:       http://localhost:4001/
Subgraph SDL:   http://localhost:4001/schema.graphql
Apollo Router:  http://localhost:4000/graph
Frontend:       http://localhost:5173
```

### Start GraphQL Mesh Application

Open terminal 4:

```bash
cd graphqlmesh
npm run start:todos
```

Open terminal 5:

```bash
cd graphqlmesh
npm run start:mesh
```

Open terminal 6:

```bash
cd graphqlmesh
npm run start:frontend
```

GraphQL Mesh application URLs:

```text
Subgraph:       http://localhost:4002/
Subgraph SDL:   http://localhost:4002/schema.graphql
Mesh Gateway:   http://localhost:4010/graphql
Frontend:       http://localhost:5174
```

## Apollo Router POC

Folder:

```text
apollo-router/
```

Purpose:

```text
Todo subgraph -> Apollo Rover supergraph compose -> Apollo Router gateway
```

### Apollo Router Packages

| Location                        | Package                     | Purpose                                           |
| ------------------------------- | --------------------------- | ------------------------------------------------- |
| `apollo-router/router`          | `@apollo/rover`             | Compose supergraph and run Apollo Router tooling. |
| `apollo-router/subgraphs/todos` | `@apollo/server`            | Run the Todo GraphQL subgraph.                    |
| `apollo-router/subgraphs/todos` | `@apollo/subgraph`          | Build the federated subgraph schema.              |
| `apollo-router/subgraphs/todos` | `@as-integrations/express5` | Mount Apollo Server on Express 5.                 |
| `apollo-router/subgraphs/todos` | `express`                   | Serve GraphQL POST `/` and GET `/schema.graphql`. |
| `apollo-router/subgraphs/todos` | `cors`                      | Allow Apollo Studio and browser requests.         |
| `apollo-router/subgraphs/todos` | `graphql`                   | GraphQL runtime.                                  |

### Apollo Router Install

```bash
cd apollo-router
npm install
```

### Apollo Router Run Steps

Open three terminals.

Terminal 1: start the Todo subgraph.

```bash
cd apollo-router
npm run dev:subgraph
```

Subgraph URLs:

```text
GraphQL POST: http://localhost:4001/
Schema SDL:   http://localhost:4001/schema.graphql
```

Terminal 2: generate the supergraph.

```bash
cd apollo-router
npm run apollo-rover
```

Generated file:

```text
apollo-router/router/supergraph.graphql
```

Terminal 2: run Apollo Router.

```bash
npm run apollo-router
```

Apollo Router URL:

```text
http://localhost:4000/graph
```

Terminal 3: run the frontend.

```bash
cd apollo-router
npm run dev:frontend
```

Frontend URL:

```text
http://localhost:5173
```

### Apollo Router Test

Use Apollo Studio Sandbox:

```text
http://localhost:4000/graph
```

Query:

```graphql
query {
  todos {
    id
    title
    description
    completed
    priority
    createdAt
    updatedAt
  }
}
```

Create:

```graphql
mutation {
  createTodo(
    input: {
      title: "Apollo todo"
      description: "Created from Apollo Studio"
      priority: HIGH
    }
  ) {
    id
    title
    completed
    priority
  }
}
```

For more Apollo-specific details, read:

```text
apollo-router/README.md
```

## GraphQL Mesh POC

Folder:

```text
graphqlmesh/
```

Purpose:

```text
Todo subgraph -> GraphQL Mesh gateway
```

GraphQL Mesh does not use Apollo `supergraph.graphql`.

### GraphQL Mesh Packages

| Location                      | Package                 | Purpose                                           |
| ----------------------------- | ----------------------- | ------------------------------------------------- |
| `graphqlmesh/mesh`            | `@graphql-mesh/cli`     | Run the Mesh gateway.                             |
| `graphqlmesh/mesh`            | `@graphql-mesh/runtime` | Mesh runtime.                                     |
| `graphqlmesh/mesh`            | `@graphql-mesh/graphql` | Read a GraphQL source.                            |
| `graphqlmesh/mesh`            | `graphql`               | GraphQL runtime for Mesh.                         |
| `graphqlmesh/subgraphs/todos` | `@apollo/server`        | Run the Todo GraphQL subgraph.                    |
| `graphqlmesh/subgraphs/todos` | `@apollo/subgraph`      | Build the federated subgraph schema.              |
| `graphqlmesh/subgraphs/todos` | `graphql-tag`           | Parse SDL into type definitions.                  |
| `graphqlmesh/subgraphs/todos` | `express`               | Serve GraphQL POST `/` and GET `/schema.graphql`. |
| `graphqlmesh/subgraphs/todos` | `cors`                  | Allow Mesh and browser requests.                  |
| `graphqlmesh/subgraphs/todos` | `graphql`               | GraphQL runtime.                                  |

### GraphQL Mesh Install

```bash
cd graphqlmesh
npm install
```

### GraphQL Mesh Run Steps

Open three terminals.

Terminal 1: start the Todo subgraph.

```bash
cd graphqlmesh
npm run start:todos
```

Subgraph URLs:

```text
GraphQL POST: http://localhost:4002/
Schema SDL:   http://localhost:4002/schema.graphql
```

Terminal 2: start the Mesh gateway.

```bash
cd graphqlmesh
npm run start:mesh
```

Mesh Gateway URL:

```text
http://localhost:4010/graphql
```

Terminal 3: run the frontend.

```bash
cd graphqlmesh
npm run start:frontend
```

Frontend URL:

```text
http://localhost:5174
```

### GraphQL Mesh Test

Use GraphiQL, Postman, curl, or another GraphQL client:

```text
http://localhost:4010/graphql
```

Query:

```graphql
query {
  todos {
    id
    title
    completed
    userId
  }
}
```

Create:

```graphql
mutation {
  addTodo(input: { title: "Mesh todo", userId: "1" }) {
    id
    title
    completed
    userId
  }
}
```

For more GraphQL Mesh-specific details, read:

```text
graphqlmesh/README.md
```

## General Notes

- Use npm only. Do not manually download packages or binaries.
- A subgraph root URL can show `Cannot GET /` in a browser. That is normal because GraphQL requests use POST.
- Use `/schema.graphql` in a browser to view subgraph SDL.
- Keep Apollo Router and GraphQL Mesh commands separate.

## syed preference

t1: cd apollo-router; npm i
t1: cd apollo-router; npm run dev:subgraph
t2: cd apollo-router; npm run apollo-rover; npm run apollo-router
t3: cd apollo-router; npm run dev:frontend

t4: cd graphqlmesh; npm i
t4: cd graphqlmesh; npm run start:todos
t5: cd graphqlmesh; npm run start:mesh
t6: cd graphqlmesh; npm run start:frontend

# GraphQL Mesh Todo POC

This app demonstrates a Todo CRUD service using a federated Apollo subgraph behind a GraphQL Mesh gateway.

## Application Flow

1. The Todo subgraph runs on `http://localhost:4002/`.
2. The subgraph serves its SDL at `http://localhost:4002/schema.graphql`.
3. GraphQL Mesh reads the schema from `http://localhost:4002/schema.graphql`.
4. GraphQL Mesh runs a gateway on `http://localhost:4010/graphql`.
5. The frontend runs on `http://localhost:5174` and calls the Mesh gateway.

GraphQL Mesh does not generate or use Apollo `supergraph.graphql`.

## Folder Structure

```text
graphqlmesh/
  frontend/
    index.html
    server.js
    src/
      app.js
      styles.css
  mesh/
    .meshrc.yaml
    package.json
  subgraphs/
    todos/
      schema.graphql
      src/
        data.js
        resolvers.js
        server.js
```

## Packages Used

| Location | Package | Why It Is Used |
| --- | --- | --- |
| `mesh` | `@graphql-mesh/cli` | Runs the GraphQL Mesh gateway. |
| `mesh` | `@graphql-mesh/runtime` | Provides the Mesh runtime. |
| `mesh` | `@graphql-mesh/graphql` | Allows Mesh to read a GraphQL source. |
| `mesh` | `graphql` | GraphQL runtime dependency for Mesh. |
| `subgraphs/todos` | `@apollo/server` | Runs the Todo GraphQL API. |
| `subgraphs/todos` | `@apollo/subgraph` | Builds a federated Apollo subgraph schema. |
| `subgraphs/todos` | `graphql-tag` | Parses SDL into GraphQL type definitions. |
| `subgraphs/todos` | `express` | Hosts GraphQL POST `/` and schema GET `/schema.graphql`. |
| `subgraphs/todos` | `cors` | Allows Mesh and browser clients to call the subgraph. |
| `subgraphs/todos` | `graphql` | GraphQL runtime dependency. |

## Install

Run this once from the `graphqlmesh` folder:

```bash
npm install
```

This installs all packages for the root app, Mesh workspace, and Todo subgraph workspace.

## Step 1: Start The Todo Subgraph

Open terminal 1:

```bash
cd graphqlmesh
npm run start:todos
```

The subgraph runs here:

```text
http://localhost:4002/
```

The schema SDL is available here:

```text
http://localhost:4002/schema.graphql
```

The root URL is a GraphQL POST endpoint. If you open `http://localhost:4002/` in a browser and see `Cannot GET /`, that is expected.

## Step 2: Start GraphQL Mesh

Open terminal 2 after the subgraph is running:

```bash
cd graphqlmesh
npm run start:mesh
```

Mesh runs here:

```text
http://localhost:4010/graphql
```

Mesh reads the subgraph schema from `mesh/.meshrc.yaml`:

```yaml
sources:
  - name: todos
    handler:
      graphql:
        endpoint: http://localhost:4002/
        source: http://localhost:4002/schema.graphql
        subgraph: true
```

## Step 3: Run The Frontend

Open terminal 3:

```bash
cd graphqlmesh
npm run start:frontend
```

Open:

```text
http://localhost:5174
```

## Test The Mesh Gateway

Use GraphiQL, Postman, curl, or another GraphQL client with:

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
  addTodo(input: {
    title: "Mesh todo"
    userId: "1"
  }) {
    id
    title
    completed
    userId
  }
}
```

Update:

```graphql
mutation {
  updateTodo(input: {
    id: "t1"
    title: "Updated Mesh todo"
    completed: true
  }) {
    id
    title
    completed
    userId
  }
}
```

Delete:

```graphql
mutation {
  deleteTodo(id: "t1")
}
```

## Test The Subgraph Directly

Use a GraphQL client with:

```text
http://localhost:4002/
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

## Common Issues

If Mesh cannot start, check that:

- The Todo subgraph is running on `http://localhost:4002/`.
- The schema SDL URL works in a browser: `http://localhost:4002/schema.graphql`.
- `mesh/.meshrc.yaml` points to `http://localhost:4002/schema.graphql`.

If `http://localhost:4002/` shows `Cannot GET /`, use a GraphQL client or POST request instead. For browser schema viewing, open `http://localhost:4002/schema.graphql`.

# Apollo Router Todo POC

This app demonstrates a Todo CRUD service using Apollo Federation and Apollo Router.

## Application Flow

1. The Todo subgraph runs on `http://localhost:4001/`.
2. Apollo Rover reads the running subgraph schema from `http://localhost:4001/`.
3. Rover generates `router/supergraph.graphql`.
4. Apollo Router runs on `http://localhost:4000/graph`.
5. Apollo Router forwards Todo queries and mutations to the Todo subgraph.
6. The frontend runs on `http://localhost:5173` and calls Apollo Router.

## Folder Structure

```text
apollo-router/
  frontend/
    index.html
    server.js
    src/
      app.js
      styles.css
  router/
    router.yaml
    supergraph.yaml
  subgraphs/
    todos/
      schema.graphql
      src/
        data.js
        resolvers.js
        schema.js
        server.js
```

## Packages Used

| Location | Package | Why It Is Used |
| --- | --- | --- |
| `router` | `@apollo/rover` | Composes the supergraph and runs local Apollo Router tooling. |
| `subgraphs/todos` | `@apollo/server` | Runs the Todo GraphQL API. |
| `subgraphs/todos` | `@apollo/subgraph` | Builds a federated Apollo subgraph schema. |
| `subgraphs/todos` | `@as-integrations/express5` | Connects Apollo Server to Express 5. |
| `subgraphs/todos` | `express` | Hosts GraphQL POST `/` and schema GET `/schema.graphql`. |
| `subgraphs/todos` | `cors` | Allows Apollo Studio and browser clients to call the subgraph. |
| `subgraphs/todos` | `graphql` | GraphQL runtime dependency. |

## Install

Run this once from the `apollo-router` folder:

```bash
npm install
```

This installs all packages for the root app, router workspace, and Todo subgraph workspace.

## Step 1: Start The Todo Subgraph

Open terminal 1:

```bash
cd apollo-router
npm run dev:subgraph
```

The subgraph runs here:

```text
http://localhost:4001/
```

The schema SDL is available here:

```text
http://localhost:4001/schema.graphql
```

The root URL is a GraphQL POST endpoint. If you open `http://localhost:4001/` in a browser and see `Cannot GET /`, that is expected.

## Step 2: Generate The Supergraph

Open terminal 2 after the subgraph is running:

```bash
cd apollo-router
npm run apollo-rover
```

This command reads the subgraph schema from the running subgraph URL configured in `router/supergraph.yaml`:

```yaml
federation_version: =2.11.0
subgraphs:
  todos:
    routing_url: http://localhost:4001/
    schema:
      subgraph_url: http://localhost:4001/
```

It generates:

```text
router/supergraph.graphql
```

## Step 3: Run Apollo Router

In terminal 2, run:

```bash
npm run apollo-router
```

Apollo Router runs here:

```text
http://localhost:4000/graph
```

Use this endpoint in Apollo Studio Sandbox for the full federated graph.

## Step 4: Run The Frontend

Open terminal 3:

```bash
cd apollo-router
npm run dev:frontend
```

Open:

```text
http://localhost:5173
```

## Test In Apollo Studio

For the full Apollo Router graph, use:

```text
http://localhost:4000/graph
```

For direct subgraph testing, use:

```text
http://localhost:4001/
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
  createTodo(input: {
    title: "Apollo todo"
    description: "Created from Apollo Studio"
    priority: HIGH
  }) {
    id
    title
    completed
    priority
  }
}
```

Update:

```graphql
mutation {
  updateTodo(
    id: "todo-1"
    input: {
      title: "Updated Apollo todo"
      completed: true
      priority: MEDIUM
    }
  ) {
    id
    title
    completed
    priority
    updatedAt
  }
}
```

Delete:

```graphql
mutation {
  deleteTodo(id: "todo-1")
}
```

## CI/CD Notes

Because `router/supergraph.yaml` uses `subgraph_url`, CI/CD must start the Todo subgraph before composing.

Example:

```bash
npm ci
npm run dev:subgraph
npm run compose:ci
```

In a real pipeline, run the subgraph as a background service before `npm run compose:ci`.

## Common Issues

If Apollo Studio says `Failed to fetch`, check that:

- The subgraph is running on `http://localhost:4001/`.
- Apollo Router is running on `http://localhost:4000/graph`.
- You are using `http://localhost`, not `file:` or a browser file path.
- CORS is enabled in the subgraph and router config.

If `http://localhost:4001/` shows `Cannot GET /`, use Apollo Studio or a GraphQL POST request instead. For browser schema viewing, open `http://localhost:4001/schema.graphql`.

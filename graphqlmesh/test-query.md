# GraphQL Mesh – Test Queries & Mutations

Endpoint: **http://localhost:4010/graphql**

Seed ids: `t1`, `t2`, `t3`, `t4`. User ids: `1`, `2`, `3`.

Copy each operation body (between the `--- START ---` / `--- END ---` markers) and paste it into the Yoga GraphiQL **Operation** panel. Paste any variables block into the **Variables** panel.

> Do not copy any surrounding triple-backticks — Yoga GraphiQL rejects them with `Syntax Error: Unexpected character: "\`"`.

> Mesh-specific notes:
> - Create mutation is `addTodo` (not `createTodo`) and `userId` is required.
> - `updateTodo` takes `id` **inside** the input (no separate `id` argument).
> - The `Todo` type has no `description`, `priority`, or timestamps.

## Schema

    type Todo {
      id: ID!
      title: String!
      completed: Boolean!
      userId: ID!
    }

    input NewTodoInput {
      title: String!
      userId: ID!
    }

    input UpdateTodoInput {
      id: ID!
      title: String
      completed: Boolean
    }

    type Query {
      todos: [Todo!]!
      todo(id: ID!): Todo
      todosByUser(userId: ID!): [Todo!]!
    }

    type Mutation {
      addTodo(input: NewTodoInput!): Todo!
      updateTodo(input: UpdateTodoInput!): Todo!
      deleteTodo(id: ID!): Boolean!
    }

---

## Queries

### 1. List all todos

--- START ---
query AllTodos {
  todos {
    id
    title
    completed
    userId
  }
}
--- END ---

### 2. Get a single todo by id

--- START ---
query OneTodo($id: ID!) {
  todo(id: $id) {
    id
    title
    completed
    userId
  }
}
--- END ---

Variables:

--- START ---
{ "id": "t1" }
--- END ---

### 3. Todos for a specific user

--- START ---
query TodosForUser($userId: ID!) {
  todosByUser(userId: $userId) {
    id
    title
    completed
  }
}
--- END ---

Variables:

--- START ---
{ "userId": "1" }
--- END ---

---

## Mutations

### 4. Add a todo

--- START ---
mutation AddTodo {
  addTodo(input: {
    title: "Write GraphQL demo"
    userId: "1"
  }) {
    id
    title
    completed
    userId
  }
}
--- END ---

### 5. Mark a todo completed

--- START ---
mutation CompleteTodo {
  updateTodo(input: {
    id: "t2"
    completed: true
  }) {
    id
    title
    completed
  }
}
--- END ---

### 6. Rename a todo

--- START ---
mutation RenameTodo {
  updateTodo(input: {
    id: "t1"
    title: "Renamed task"
  }) {
    id
    title
    completed
  }
}
--- END ---

### 7. Delete a todo

--- START ---
mutation DeleteTodo($id: ID!) {
  deleteTodo(id: $id)
}
--- END ---

Variables:

--- START ---
{ "id": "t4" }
--- END ---

---

## curl example (PowerShell)

    $body = '{"query":"mutation { addTodo(input: { title: \"From curl\", userId: \"1\" }) { id title userId } }"}'
    Invoke-RestMethod -Uri http://localhost:4010/graphql -Method Post -ContentType 'application/json' -Body $body

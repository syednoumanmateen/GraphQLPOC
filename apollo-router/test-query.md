# Apollo Router – Test Queries & Mutations

Endpoint: **http://localhost:4000/graph**

Seed ids: `todo-1`, `todo-2`, `todo-3`.

Copy each operation body (between the `--- START ---` / `--- END ---` markers) and paste it into the Apollo Sandbox **Operation** panel. Paste any variables block into the **Variables** panel.

> Do not copy any surrounding triple-backticks — the GraphQL editor will reject them with `Syntax Error: Unexpected character: "\`"`.

## Schema

    enum TodoPriority { LOW MEDIUM HIGH }

    type Todo {
      id: ID!
      title: String!
      description: String
      completed: Boolean!
      priority: TodoPriority!
      createdAt: String!
      updatedAt: String!
    }

    input CreateTodoInput {
      title: String!
      description: String
      priority: TodoPriority = MEDIUM
    }

    input UpdateTodoInput {
      title: String
      description: String
      completed: Boolean
      priority: TodoPriority
    }

    type Query {
      todos: [Todo!]!
      todo(id: ID!): Todo
    }

    type Mutation {
      createTodo(input: CreateTodoInput!): Todo!
      updateTodo(id: ID!, input: UpdateTodoInput!): Todo!
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
    description
    completed
    priority
    createdAt
    updatedAt
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
    priority
  }
}
--- END ---

Variables:

--- START ---
{ "id": "todo-1" }
--- END ---

### 3. Lightweight list (id + title only)

--- START ---
query TodoTitles {
  todos { id title }
}
--- END ---

---

## Mutations

### 4. Create a todo (full input)

--- START ---
mutation CreateTodo {
  createTodo(input: {
    title: "Write GraphQL demo"
    description: "Add a federated query"
    priority: HIGH
  }) {
    id
    title
    description
    priority
    completed
    createdAt
  }
}
--- END ---

### 5. Create a minimal todo (defaults priority to MEDIUM)

--- START ---
mutation CreateMinimalTodo {
  createTodo(input: { title: "Buy milk" }) {
    id
    title
    priority
    completed
  }
}
--- END ---

### 6. Update a todo (mark completed + change priority)

--- START ---
mutation UpdateTodo($id: ID!) {
  updateTodo(id: $id, input: {
    completed: true
    priority: LOW
  }) {
    id
    title
    completed
    priority
    updatedAt
  }
}
--- END ---

Variables:

--- START ---
{ "id": "todo-2" }
--- END ---

### 7. Rename a todo

--- START ---
mutation RenameTodo($id: ID!) {
  updateTodo(id: $id, input: { title: "Renamed task" }) {
    id
    title
    updatedAt
  }
}
--- END ---

Variables:

--- START ---
{ "id": "todo-1" }
--- END ---

### 8. Delete a todo

--- START ---
mutation DeleteTodo($id: ID!) {
  deleteTodo(id: $id)
}
--- END ---

Variables:

--- START ---
{ "id": "todo-3" }
--- END ---

---

## curl example (PowerShell)

    $body = '{"query":"{ todos { id title completed priority } }"}'
    Invoke-RestMethod -Uri http://localhost:4000/graph -Method Post -ContentType 'application/json' -Body $body

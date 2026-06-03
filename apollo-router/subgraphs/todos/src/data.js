let nextId = 4;

const todos = [
  {
    id: "todo-1",
    title: "Review federated todo schema",
    description: "Confirm queries and mutations compose through Apollo Router.",
    completed: true,
    priority: "HIGH",
    createdAt: "2026-06-01T09:00:00.000Z",
    updatedAt: "2026-06-01T10:30:00.000Z"
  },
  {
    id: "todo-2",
    title: "Test createTodo mutation",
    description: "Run the mutation through the router endpoint.",
    completed: false,
    priority: "MEDIUM",
    createdAt: "2026-06-02T11:15:00.000Z",
    updatedAt: "2026-06-02T11:15:00.000Z"
  },
  {
    id: "todo-3",
    title: "Wire frontend refresh",
    description: "Keep the todo list in sync after every mutation.",
    completed: false,
    priority: "LOW",
    createdAt: "2026-06-03T08:45:00.000Z",
    updatedAt: "2026-06-03T08:45:00.000Z"
  }
];

function now() {
  return new Date().toISOString();
}

function normalizeTitle(title) {
  const value = title?.trim();
  if (!value) {
    throw new Error("Todo title is required.");
  }
  return value;
}

function listTodos() {
  return todos;
}

function getTodo(id) {
  return todos.find((todo) => todo.id === id) ?? null;
}

function createTodo(input) {
  const timestamp = now();
  const todo = {
    id: `todo-${nextId++}`,
    title: normalizeTitle(input.title),
    description: input.description?.trim() || null,
    completed: false,
    priority: input.priority ?? "MEDIUM",
    createdAt: timestamp,
    updatedAt: timestamp
  };

  todos.push(todo);
  return todo;
}

function updateTodo(id, input) {
  const todo = getTodo(id);
  if (!todo) {
    throw new Error(`Todo ${id} was not found.`);
  }

  if (input.title !== undefined) {
    todo.title = normalizeTitle(input.title);
  }

  if (input.description !== undefined) {
    todo.description = input.description?.trim() || null;
  }

  if (input.completed !== undefined) {
    todo.completed = input.completed;
  }

  if (input.priority !== undefined) {
    todo.priority = input.priority;
  }

  todo.updatedAt = now();
  return todo;
}

function deleteTodo(id) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return false;
  }

  todos.splice(index, 1);
  return true;
}

module.exports = { createTodo, deleteTodo, getTodo, listTodos, updateTodo };

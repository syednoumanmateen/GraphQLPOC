const GRAPHQL_ENDPOINT = "http://localhost:4000/graph";

const TODOS_QUERY = `
  query TodoList {
    todos {
      id
      title
      description
      completed
      priority
      updatedAt
    }
  }
`;

const CREATE_TODO_MUTATION = `
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
    }
  }
`;

const UPDATE_TODO_MUTATION = `
  mutation UpdateTodo($id: ID!, $input: UpdateTodoInput!) {
    updateTodo(id: $id, input: $input) {
      id
    }
  }
`;

const DELETE_TODO_MUTATION = `
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

async function graphQL(query, variables = {}) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables })
  });

  const payload = await response.json();
  if (!response.ok || payload.errors) {
    const message = payload.errors?.[0]?.message ?? "GraphQL request failed";
    throw new Error(message);
  }

  return payload.data;
}

async function fetchTodos() {
  const data = await graphQL(TODOS_QUERY);
  return data.todos;
}

function renderTodos(todos) {
  const todoList = document.getElementById("todos");
  todoList.innerHTML = todos
    .map(
      (todo) => `
        <article class="todo-card">
          <div class="card-header">
            <span>${todo.priority}</span>
            <button class="delete" type="button" data-delete="${todo.id}">Delete</button>
          </div>
          <label class="todo-title">
            <input type="checkbox" data-toggle="${todo.id}" ${todo.completed ? "checked" : ""} />
            <span>${todo.title}</span>
          </label>
          <p>${todo.description ?? ""}</p>
          <small>Updated ${new Date(todo.updatedAt).toLocaleString()}</small>
        </article>
      `
    )
    .join("");
}

async function loadTodos() {
  const status = document.getElementById("status");
  status.textContent = "Loading todos...";

  try {
    const todos = await fetchTodos();
    renderTodos(todos);
    status.textContent = `${todos.length} todos loaded from Apollo Router.`;
  } catch (error) {
    status.textContent = error.message;
  }
}

document.getElementById("refresh").addEventListener("click", loadTodos);
document.getElementById("todo-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  await graphQL(CREATE_TODO_MUTATION, {
    input: {
      title: formData.get("title"),
      description: formData.get("description") || null,
      priority: formData.get("priority")
    }
  });
  form.reset();
  await loadTodos();
});

document.getElementById("todos").addEventListener("click", async (event) => {
  const deleteId = event.target.dataset.delete;
  const toggleId = event.target.dataset.toggle;

  if (deleteId) {
    await graphQL(DELETE_TODO_MUTATION, { id: deleteId });
    await loadTodos();
  }

  if (toggleId) {
    await graphQL(UPDATE_TODO_MUTATION, {
      id: toggleId,
      input: { completed: event.target.checked }
    });
    await loadTodos();
  }
});

loadTodos();

if (typeof module !== "undefined") {
  module.exports = { GRAPHQL_ENDPOINT, TODOS_QUERY };
}

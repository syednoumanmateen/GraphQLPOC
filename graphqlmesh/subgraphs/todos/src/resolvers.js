import { todos, nextTodoId } from './data.js';

export const resolvers = {
  Query: {
    todo: (_, { id }) => todos.find(t => t.id === id) || null,
    todos: () => todos,
    todosByUser: (_, { userId }) => todos.filter(t => t.userId === userId)
  },

  Mutation: {
    addTodo: (_, { input }) => {
      const todo = { id: nextTodoId(), title: input.title, completed: false, userId: input.userId };
      todos.push(todo);
      return todo;
    },
    updateTodo: (_, { input }) => {
      const todo = todos.find(t => t.id === input.id);
      if (!todo) throw new Error(`Todo ${input.id} not found`);
      if (input.title != null) todo.title = input.title;
      if (input.completed != null) todo.completed = input.completed;
      return todo;
    },
    deleteTodo: (_, { id }) => {
      const i = todos.findIndex(t => t.id === id);
      if (i === -1) return false;
      todos.splice(i, 1);
      return true;
    }
  },

  Todo: {
    __resolveReference: (ref) => todos.find(t => t.id === ref.id) || null
  }
};

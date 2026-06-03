const { createTodo, deleteTodo, getTodo, listTodos, updateTodo } = require("./data");

const resolvers = {
  Todo: {
    __resolveReference(reference) {
      return getTodo(reference.id);
    }
  },
  Query: {
    todo(_, { id }) {
      return getTodo(id);
    },
    todos() {
      return listTodos();
    }
  },
  Mutation: {
    createTodo(_, { input }) {
      return createTodo(input);
    },
    updateTodo(_, { id, input }) {
      return updateTodo(id, input);
    },
    deleteTodo(_, { id }) {
      return deleteTodo(id);
    }
  }
};

module.exports = { resolvers };

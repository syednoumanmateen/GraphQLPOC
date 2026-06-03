export const todos = [
  { id: 't1', title: 'Write a difference engine note', completed: true,  userId: '1' },
  { id: 't2', title: 'Sketch Analytical Engine diagram', completed: false, userId: '1' },
  { id: 't3', title: 'Break Enigma',                    completed: true,  userId: '2' },
  { id: 't4', title: 'Write COBOL spec',                completed: false, userId: '3' }
];

let nextId = 5;
export const nextTodoId = () => `t${nextId++}`;

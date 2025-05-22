const BASE_URL = 'https://lab7-khomenko-default-rtdb.europe-west1.firebasedatabase.app';
const TODOS_URL = `${BASE_URL}/todos.json`;

const todoListElement = document.getElementById('todo-list');
const totalCountElement = document.getElementById('item-count');
const uncheckedCountElement = document.getElementById('unchecked-count');

let todoItems = [];

todoListElement.addEventListener('change', (event) => {
  if (event.target.classList.contains('todo-checkbox')) {
    const li = event.target.closest('li');
    const id = li.dataset.id;
    toggleTodoDone(id);
  }
});

todoListElement.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-btn')) {
    const li = event.target.closest('li');
    const id = li.dataset.id;
    deleteTodo(id)
      .then(() => {
        todoItems = todoItems.filter(todo => todo.id !== id);
        renderTodoList();
        updateCounters();
      });
  }
});

loadTodos();


// CRUD ФУНКЦІЇ

function addTodo(text) {
  return fetch(TODOS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ text, done: false })
  })
    .then(result => {
      if (!result.ok) throw new Error(`HTTP ${result.status}`);
      return result.json();
    })
    .then(data => data.name);
}

function loadTodos() {
  fetch(TODOS_URL)
    .then(result => {
      if (!result.ok) throw new Error(`HTTP ${result.status}`);
      return result.json();
    })
    .then(data => {
      todoItems = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
      renderTodoList();
      updateCounters();
    });
}

function deleteTodo(id) {
  const url = `${BASE_URL}/todos/${id}.json`;
  return fetch(url, { method: 'DELETE' }).then(result => {
    if (!result.ok) throw new Error(`HTTP ${result.status}`);
  });
}

function updateTodo(id, updates) {
  const url = `${BASE_URL}/todos/${id}.json`;
  return fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(updates)
  }).then(result => {
    if (!result.ok) throw new Error(`HTTP ${result.status}`);
    return result.json();
  });
}


// UI ФУНКЦІЇ

function createNewTodo() {
  const taskText = prompt("Введіть нову справу:");
  if (!taskText) return;

  addTodo(taskText)
    .then(newId => {
      todoItems.push({ id: newId, text: taskText, done: false });
      renderTodoList();
      updateCounters();
    });
}

function toggleTodoDone(id) {
  const todo = todoItems.find(t => t.id === id);
  if (!todo) return;

  const newDone = !todo.done;

  updateTodo(id, { done: newDone })
    .then(() => {
      todo.done = newDone;
      renderTodoList();
      updateCounters();
    });
}

function generateTodoHTML(todo) {
  return `
    <li class="list-group-item" data-id="${todo.id}">
      <input
        type="checkbox"
        class="form-check-input me-2 todo-checkbox"
        ${todo.done ? "checked" : ""}
      />
      <label>
        <span class="${todo.done ? 'text-success text-decoration-line-through' : ''}">
          ${todo.text}
        </span>
      </label>
      <button class="btn btn-danger btn-sm float-end delete-btn">delete</button>
    </li>
  `;
}

function renderTodoList() {
  todoListElement.innerHTML = todoItems.map(generateTodoHTML).join('');
}

function updateCounters() {
  totalCountElement.textContent = todoItems.length;
  uncheckedCountElement.textContent = todoItems.filter(todo => !todo.done).length;
}

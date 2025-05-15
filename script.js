const todoListElement = document.getElementById('todo-list');
const totalCountElement = document.getElementById('item-count');
const uncheckedCountElement = document.getElementById('unchecked-count');

let todoItems = [];

todoListElement.addEventListener('change', (event) =>
{
	if (event.target.classList.contains('todo-checkbox'))
	{
		const li = event.target.closest('li');
		const id = Number(li.dataset.id);
		toggleTodoDone(id);
	}
});

todoListElement.addEventListener('click', (event) =>
{
	if (event.target.classList.contains('delete-btn'))
	{
		const li = event.target.closest('li');
		const id = Number(li.dataset.id);
		removeTodo(id);
	}
});

loadTodosFromLocalStorage();
renderTodoList();
updateCounters();


function createNewTodo()
{
	const taskText = prompt("Введіть нову справу:");

	if (taskText)
	{
		const newTodo = {
			id: Date.now(),
			text: taskText,
			done: false
		};

		todoItems.push(newTodo);
		renderTodoList();
		updateCounters();
		saveTodosToLocalStorage();
	}
}

function generateTodoHTML(todo)
{
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
			<button class="btn btn-danger btn-sm float-end delete-btn">
				delete
			</button>
		</li>
	`;
}

function renderTodoList()
{
	todoListElement.innerHTML = todoItems.map(generateTodoHTML).join('');
}

function updateCounters()
{
	totalCountElement.textContent = todoItems.length;
	uncheckedCountElement.textContent = todoItems.filter(todo => !todo.done).length;
}

function removeTodo(id)
{
	todoItems = todoItems.filter(todo => todo.id !== id);
	renderTodoList();
	updateCounters();
	saveTodosToLocalStorage();
}

function toggleTodoDone(id)
{
	const todo = todoItems.find(todo => todo.id === id);

	if (todo)
	{
		todo.done = !todo.done;
		renderTodoList();
		updateCounters();
		saveTodosToLocalStorage();
	}
}

function saveTodosToLocalStorage()
{
	localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

function loadTodosFromLocalStorage()
{
	const stored = localStorage.getItem('todoItems');

	if (stored)
	{
		todoItems = JSON.parse(stored);
	}
}
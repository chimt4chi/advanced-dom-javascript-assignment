const todoList = document.getElementById("todoList");
const newTodoInput = document.getElementById("newTodo");
const addTodoBtn = document.getElementById("addTodoBtn");
const searchTodo = document.getElementById("searchTodo");
const filterTodos = document.getElementById("filterTodos");
const todoCounter = document.getElementById("todoCounter");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Display Todos
function displayTodos() {
  const searchText = searchTodo.value.toLowerCase();
  const filterValue = filterTodos.value;

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text.toLowerCase().includes(searchText);
    const matchesFilter =
      filterValue === "all" ||
      (filterValue === "active" && !todo.completed) ||
      (filterValue === "completed" && todo.completed);
    return matchesSearch && matchesFilter;
  });

  todoList.innerHTML = filteredTodos
    .map(
      (todo) => `
        <li class="${todo.completed ? "completed" : ""}">
            <input type="checkbox" ${
              todo.completed ? "checked" : ""
            } data-id="${todo.id}">
            ${todo.text}
            <span class="delete-btn" data-id="${todo.id}">Delete</span>
        </li>
    `
    )
    .join("");

  todoCounter.innerHTML = `${todos.length} total, ${
    todos.filter((todo) => todo.completed).length
  } completed`;
}

// Add New Todo
addTodoBtn.addEventListener("click", function () {
  const todoText = newTodoInput.value.trim();

  if (todoText !== "") {
    const newTodo = {
      id: Date.now(),
      text: todoText,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
    newTodoInput.value = "";
    displayTodos();
  } else {
    alert("Please enter a todo item!");
  }
});

// Toggle Todo Completion
todoList.addEventListener("change", function (event) {
  if (event.target.type === "checkbox") {
    const todoId = Number(event.target.getAttribute("data-id"));
    const todo = todos.find((todo) => todo.id === todoId);

    todo.completed = event.target.checked;
    localStorage.setItem("todos", JSON.stringify(todos));
    displayTodos();
  }
});

// Delete Todo
todoList.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const todoId = Number(event.target.getAttribute("data-id"));
    todos = todos.filter((todo) => todo.id !== todoId);
    localStorage.setItem("todos", JSON.stringify(todos));
    displayTodos();
  }
});

// Debounced Search
let debounceTimeout;
searchTodo.addEventListener("input", function () {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(displayTodos, 400);
});

// Filter Todos
filterTodos.addEventListener("change", displayTodos);

// Display Todos on Load
displayTodos();

const task_input = document.querySelectorAll("input");
const add_btn = document.querySelector(".add-task-button");
const todos_list = document.querySelector(".todos-list");
const alert_message = document.querySelector(".alert-message");
const delete_all_btn = document.querySelector(".delete-all-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

window.addEventListener("DOMContentLoaded", showAllTodos);

function getRandomId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function addToDo() {
  let task = {
    id: getRandomId(),
    task: task_input[0].value,
    completed: false,
    time: task_input[1].value,
  };
  todos.push(task);
}

add_btn.addEventListener("click", () => {
  if (task_input[0].value === "") {
    showAlertMessage("Please enter a task", "error");
  } else {
    addToDo();
    saveToLocalStorage();
    showAllTodos();
    task_input[0].value = "";
    showAlertMessage("Task added successfully", "success");
  }
});

delete_all_btn.addEventListener("click", clearAllTodos);

function showAllTodos() {
  todos_list.innerHTML = "";
  todos.forEach((todo) => {
    todos_list.innerHTML += `
      <li class="todo-item" data-id="${todo.id}">
        <input type="checkbox" class="checkbox" onchange="toggleComplete('${
          todo.id
        }', this)" ${todo.completed ? "checked" : ""}>
        <div>
          <p class="task-body ${todo.completed ? "completed" : ""}">
            ${todo.task}
          </p>
          <p class="task-body">
            ${todo.time}
          </p>
        </div>
        <div class="todo-actions">
          <button class="btn btn-success" onclick="editTodo('${todo.id}')">
            <i class="bx bx-edit-alt bx-sm"></i>
          </button>
          <button class="btn btn-error" onclick="deleteTodo('${todo.id}')">
            <i class="bx bx-trash bx-sm"></i>
          </button>
        </div>
      </li>
    `;
  });
}

function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlertMessage(message, type) {
  let alert_box = `
    <div class="alert alert-${type} shadow-lg mb-5 w-full">
      <div>
        <span>${message}</span>
      </div>
    </div>
  `;
  alert_message.innerHTML = alert_box;
  alert_message.classList.remove("hide");
  alert_message.classList.add("show");
  setTimeout(() => {
    alert_message.classList.remove("show");
    alert_message.classList.add("hide");
  }, 3000);
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveToLocalStorage();
  showAlertMessage("Todo deleted successfully", "success");
  showAllTodos();
}

function editTodo(id) {
  let todo = todos.find((todo) => todo.id === id);
  task_input.value = todo.task;
  todos = todos.filter((todo) => todo.id !== id);
  add_btn.innerHTML = "<i class='bx bx-check bx-sm'></i>";
  saveToLocalStorage();
  add_btn.addEventListener("click", () => {
    add_btn.innerHTML = "<i class='bx bx-plus bx-sm'></i>";
    showAlertMessage("Todo updated successfully", "success");
  });
}

function clearAllTodos() {
  if (todos.length > 0) {
    todos = [];
    saveToLocalStorage();
    showAlertMessage("All todos cleared successfully", "success");
    showAllTodos();
  } else {
    showAlertMessage("No todos to clear", "error");
  }
}

function toggleComplete(id, checkbox) {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = checkbox.checked;
  saveToLocalStorage();
  showAlertMessage("Task status updated successfully", "success");
  showAllTodos(); // Update the task list immediately
}

function formatDate(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return dateTime.toLocaleDateString("en-US", options);
}

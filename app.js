// - Объявление переменных, с которыми будем работать
let allTasks = sessionStorage.getItem("allTasks") || [];
// let completeTask = false;

const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector("#filter-todo");
const todoForm = document.querySelector("form");

onClickButton = async (event) => {
	// При нажатие на кнопку с типом "submit", form остылает данные на сервер и обновляет страницу.
	// Чтобы этого не происходило, нужно убрать стандартное поведение form/button
	// Или установить кнопку type="button"
	event.preventDefault();

	if (todoInput.value !== "") {
		allTasks.push({
			text: todoInput.value,
			isCheck: false,
		});
		const response = await fetch("http://localhost:8000/createTask", {
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=utf-8",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				text: todoInput.value,
				isCheck: false,
			}),
		});
		let result = await response.json();
		// allTasks = result.data;
		console.log("result: ", result);
		console.log("allTasks: ", allTasks);
	}
	sessionStorage.setItem("allTasks", JSON.stringify(allTasks));
	addToDo();
};

// - Вешаем прослушку событий на элементы
todoButton.addEventListener("click", onClickButton);
filterOption.addEventListener("click", filterToDo);

/** Fetch API предоставляет интерфейс JavaScript для работы с запросами и ответами HTTP.
 * fetch('src', metods);
 * src - API, на который отправляется запрос
 *  metods - методы обработки запроса
 */

window.onload = async function init() {
	const response = await fetch("http://localhost:8000/allTasks", {
		method: "GET",
	});

	let result = await response.json();
	allTasks = result.data;
	console.log("result.data: ", result.data);

	if (allTasks.length !== 0) {
		addToDo();
	}
};

function addToDo() {
	const todoContent = document.querySelector(".todo-list");
	while (todoContent.firstChild) {
		todoContent.removeChild(todoContent.firstChild);
	}

	allTasks.map((value, index, array) => {
		// - Создаем контейнер для задачи
		const todoDiv = document.createElement("div");
		todoDiv.classList.add("todo");

		// - Создаем саму задачу
		const newTodo = document.createElement("li");
		newTodo.innerText = value.text;
		newTodo.classList.add("todo-item");
		todoDiv.append(newTodo);

		// - Обнуляем input и возвращаем на него фокус
		todoInput.value = "";
		todoInput.focus();

		// - Создаем кнопку выполнения задачи
		const completedButton = document.createElement("button");
		completedButton.innerHTML = '<i class="fa-solid fa-check"></i>';
		completedButton.classList.add("complete-btn");
		todoDiv.append(completedButton);

		// - Создаем кнопку удаления задачи
		const trashButton = document.createElement("button");
		trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>'; // - Устанавливаем иконку на кнопку
		trashButton.classList.add("trash-btn"); // - Добавляем класс для button
		todoDiv.append(trashButton);

		// При переборе массива объектов, на каждый элемент по ОТДЕЛЬНОСТИ вешается событие клика кнопки
		completedButton.onclick = function (e) {
			checkTaskMassive(index);
			checkTaskWindow(e);
		};

		trashButton.onclick = function (e) {
			deleteTaskMassive(index);
			deleteTaskWindow(e);
		};

		if (value.isCheck) {
			todoDiv.classList.toggle("completed");
		}

		// - Выводим в window
		todoList.append(todoDiv);
	});
}

// - Создание функций по удалению задачи и её выполнению
checkTaskMassive = (index) => {
	// При первой итерации цикла - index = 0 - вешаем событие изменения isCheck
	// При второй итерации цикла - index = 1 - вешаем событие изменения isCheck
	// И т.д.
	allTasks[index].isCheck = !allTasks[index].isCheck;
	sessionStorage.setItem("allTasks", JSON.stringify(allTasks));
};

deleteTaskMassive = (index) => {
	allTasks.splice(index, 1);
	sessionStorage.setItem("allTasks", JSON.stringify(allTasks));
};

checkTaskWindow = (e) => {
	const item = e.target;
	// item = e.target; // - Свойство target является ссылкой на объект, который был инициатором события
	if (item.classList[0] === "complete-btn") {
		const todo = item.parentElement; // - Родительский элемент - div с классом todo (создается на строке 17-19)
		todo.classList.toggle("completed");
		todo.addEventListener("transitionend", () => {
			addToDo();
		});
	}
};

deleteTaskWindow = (e) => {
	const item = e.target;
	// item = e.target; // - Свойство target является ссылкой на объект, который был инициатором события
	if (item.classList[0] === "trash-btn") {
		const todo = item.parentElement; // - Родительский элемент - div с классом todo (создается на строке 17-19)
		todo.classList.add("fall");
		todo.addEventListener("transitionend", function () {
			// - Событие transitionend срабатывает, когда CSS transition закончил своё выполнение. То есть срабатывает, когда анимация завершена
			todo.remove();
			addToDo();
		});
	}
};

function filterToDo(e) {
	const todos = todoList.childNodes;
	/**
	 * Аттрибут childNodes возвращает коллекцию дочерних элементов данного элемента.
	 * В данном случае переменной todos присваивается коллекция дочерних элементов элемента todoList
	 */
	todos.forEach(function (todo) {
		switch (e.target.value) {
			case "All":
				todo.style.display = "flex";
				break;
			case "Completed":
				if (todo.classList.contains("completed")) {
					todo.style.display = "flex";
				} else {
					todo.style.display = "none";
				}
				break;
			case "Uncompleted":
				if (!todo.classList.contains("completed")) {
					todo.style.display = "flex";
				} else {
					todo.style.display = "none";
				}
				break;
		}
	});
}

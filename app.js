// - Объявление переменных, с которыми будем работать
const allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
completeTask = false;
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector("#filter-todo");

// - Вешаем прослушку событий на элементы
todoButton.addEventListener("click", addToDo);
todoList.addEventListener("click", checkTask);
filterOption.addEventListener("click", filterToDo);

/** localStorage и sessionStorage - хранилища браузера
 * 
// localStorage - используется, когда нужны постоянные изменения (переход на новую влкадку с тем же адресом, обновление страницы). Хранит значения в виде string
// sessionStorage - используется, когда данные должны быть доступны только на время работы приложения (при обновлении страницы, перезапуске компа, данные должны удалиться)
// Данные хранятся в виде "ключ, значение" - ('key', value)

// ----------------- Хранилище -----------------
// Так как в хранилище данные должны хранится в формате string, то данные нужно преобразовать => JSON.stringify(...);
localStorage.setItem("allTasks", JSON.stringify(allTasks));

//  Далее при получении данных их нужно спарсить JSON.parse(localStorage.getItem('...'));
//  Метод JSON.parse() разбирает строку JSON
const tasks = JSON.parse(localStorage.getItem("allTasks"));
console.log(tasks);
 */

// async function Func() {
// 	let response = await fetch("https://swapi.dev/api/people/4");
// 	const json = await response.json();
// 	return json;
// }

// window.onload = async function () {
// 	const response = await Func();
// 	localStorage.setItem("allTasks", response);
// };

/**
 * - Либо так:
 *& todoForm.addEventListener('submit', addToDo);
 */

function addToDo(event) {
	event.preventDefault(); // - Убираем стандартное поведение form

	// - Создаем контейнер для задачи
	const todoDiv = document.createElement("div");
	todoDiv.classList.add("todo");

	// - Создаем саму задачу
	const newTodo = document.createElement("li");
	newTodo.innerText = todoInput.value;
	newTodo.classList.add("todo-item");
	todoDiv.append(newTodo);
	allTasks.push({
		text: todoInput.value,
		isCheck: false,
	});
	localStorage.setItem("allTasks", JSON.stringify(allTasks));

	// - Обнуляем input и возвращаем на него фокус
	todoInput.value = "";
	todoInput.focus();

	// - Создаем кнопку выполнения задачи
	const completedButton = document.createElement("button");
	completedButton;
	completedButton.innerHTML = '<i class="fa-solid fa-check"></i>';
	completedButton.classList.add("complete-btn");
	todoDiv.append(completedButton);
	// - Создаем кнопку удаления задачи
	const trashButton = document.createElement("button");
	trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>'; // - Устанавливаем иконку на кнопку
	trashButton.classList.add("trash-btn"); // - Добавляем класс для button
	todoDiv.append(trashButton);

	// При переборе массива объектов, на каждый элемент по ОТДЕЛЬНОСТИ вешается событие клика кнопки
	allTasks.map((value, index, array) => {
		completedButton.onclick = function () {
			// При первой итерации цикла - index = 0 - вешаем событие изменения isCheck
			// При второй итерации цикла - index = 1 - вешаем событие изменения isCheck
			// И т.д.
			allTasks[index].isCheck = !allTasks[index].isCheck;
			localStorage.setItem("allTasks", JSON.stringify(allTasks));
		};
		trashButton.onclick = function () {
			allTasks.splice(index, 1);
			localStorage.setItem("allTasks", JSON.stringify(allTasks));
		};
	});

	// - Выводим в window
	todoList.append(todoDiv);
}

// - Создание функции по удалению задачи и её выполнению
function checkTask(e) {
	const item = e.target;
	// item = e.target; // - Свойство target является ссылкой на объект, который был инициатором события
	if (item.classList[0] === "trash-btn") {
		const todo = item.parentElement; // - Родительский элемент - div с классом todo (создается на строке 17-19)
		todo.classList.add("fall");
		todo.addEventListener("transitionend", function () {
			// - Событие transitionend срабатывает, когда CSS transition закончил своё выполнение. То есть срабатывает, когда анимация завершена
			todo.remove();
		});
	} else if (item.classList[0] === "complete-btn") {
		const todo = item.parentElement; // - Родительский элемент - div с классом todo (создается на строке 17-19)
		todo.classList.toggle("completed");
	}
	// console.log(item.isCheck);
}

/**
 * Свойство classList вовращает псевдомассив, который содержит все классы элемента.
 * Допустим у элемента есть два класса: 'class_1' и 'class_2'.
 * class_1 имеет индекс 0, class_2 - индекс 1.
 * Чтобы получить доступ к одному из этих классов, можно воспользоваться свойством classList: element.classList[...].
 * element.classList[0] вернет 'class_1', element.classList[1] вернет 'class_2'
 */

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

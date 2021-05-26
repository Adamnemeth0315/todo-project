'use strict';
import localDB from './localDB.js';

const chill = document.querySelector('.chill__box');
const container = document.querySelector('.container');
const bodyDay = document.querySelector('.body__day');
const bodyDate = document.querySelector('.body__date');
const addTodoBtn = document.querySelector('.todo__btn');
const todoInput = document.querySelector('.todo__input');
const todoListPending = document.querySelector('.todo__list--pending');
const todoListDone = document.querySelector('.todo__list--done');
const pendingItems = document.querySelector('.todo__number');
const showHideCompletedButton = document.querySelector('.footer__btn--complete');
const clearAllButton = document.querySelector('.footer__btn--clear');

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wesnessday', 'Thursday', 'Friday', 'Saturday'];

let todos = [];

const init = () => {
    showDate();
    setListeners();
    loadExistingTodos();
};

const loadExistingTodos = () => {
    const savedTodos = localDB.getItem('todos');
    if (savedTodos) {
        todos = savedTodos;
    }

    if (todos && Array.isArray(todos)) {
        todos.forEach(todo => showTodo(todo));
    }

    if (todos === []) {
        chill.classList.remove('hidden');
    }
    showPending();
};

function showDate() {
    const currentDate = new Date();
    const day = [currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    currentDate.getDate()]
        .map(num => num < 10 ? `0${num}` : num)
    const dayName = dayNames[currentDate.getDay()];
    bodyDay.textContent = dayName;
    bodyDate.textContent = day.join('-');
};


const setListeners = () => {
    addTodoBtn.addEventListener('click', addNewTodo);
    showHideCompletedButton.addEventListener('click', () => {
        container.classList.toggle('show-done');
    });
    clearAllButton.addEventListener('click', removeAllPendings);
};

//Save and add todo to the database.
const addNewTodo = () => {
    const value = todoInput.value;
    if (value === '') {
        alert('Please type a todo.');
        return;
    }

    const todo = {
        id: `todo-${Math.floor(Math.random() * 100000)}`,
        text: value,
        completed: false
    };

    todos.push(todo);

    localDB.setItem('todos', todos);
    showTodo(todo);
    showPending();
    todoInput.value = '';
};

//Show todo in the list.
const showTodo = todo => {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo__item');
    todoItem.setAttribute('data-todoid', todo.id);
    chill.classList.add('hidden');

    if (todo.completed) {
        todoListDone.appendChild(todoItem);
    } else {
        todoListPending.appendChild(todoItem);
    }

    todoItem.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked disabled' : ''}>
        <span> ${todo.text} </span>
        <button class="delBtn">
            <i class="fa fa-trash"></i>
        </button>
    `;

    const delBtn = todoItem.querySelector('button');
    delBtn.addEventListener('click', deleteTodo);

    const checkbox = todoItem.querySelector('input');
    checkbox.addEventListener('change', changeTodoDone);
};

//Change todo's done property.
const changeTodoDone = ev => {
    const input = ev.target;
    const inputParent = input.parentElement;
    const todoID = inputParent.getAttribute('data-todoid');
    const todoIndex = todos.findIndex(todo => todo.id === todoID);

    if (input.checked) {
        todoListDone.appendChild(inputParent);
        todos[todoIndex].completed = true;
    } else {
        todoListPending.appendChild(inputParent);
        todos[todoIndex].completed = false;
    }
    localDB.setItem('todos', todos);
    showPending();
};

//Delete todo item.
const deleteTodo = ev => {
    const button = ev.currentTarget;
    const btnParent = button.parentElement;
    const todoId = btnParent.getAttribute('data-todoid');
    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    btnParent.parentElement.removeChild(btnParent);
    todos.splice(todoIndex, 1);
    localDB.setItem('todos', todos);
    showPending();
};

//Count pending todos.
const showPending = () => {
    const pendingsNum = todos.filter(todo => !todo.completed).length;
    pendingItems.textContent = pendingsNum;
};

//Remove all pending todo.
const removeAllPendings = () => {
    const allPedings = todoListPending.querySelectorAll('.todo__item');
    allPedings.forEach(todoItem => {
        const todoID = todoItem.getAttribute('data-todoid');
        const todoIndex = todos.findIndex(todo => todo.id === todoID);
        todos.splice(todoIndex, 1);
        todoItem.parentElement.removeChild(todoItem);
    });
    localDB.setItem('todos', todos);
    chill.classList.remove('hidden');
    showPending();
}

init();
import './style.css'

const addBtn = document.querySelector<HTMLButtonElement>('#add-todo-button')
const todoInput = document.querySelector<HTMLInputElement>('#todo-input')
const errorTxt = document.querySelector<HTMLDivElement>('#errorText')
const tasksList = document.querySelector<HTMLUListElement>('#todo-elements')

if (
  addBtn === null ||
  todoInput === null ||
  errorTxt === null ||
  tasksList === null
) {
  throw new Error('Missing variables for app to start')
}
const addTodo = () => {
  if (todoInput.value.trim() === '') {
    errorTxt.innerText = 'Error input is empty'
  } else {
    errorTxt.innerText = ''
    const newTask = document.createElement('li')
    newTask.setAttribute('class', 'task border')
    tasksList.appendChild(newTask)
    newTask.innerText = todoInput.value
    todoInput.value = ''
  }
}

addBtn.addEventListener('click', addTodo)
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo()
  }
})

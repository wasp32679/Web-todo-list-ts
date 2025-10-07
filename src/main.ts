import './style.css'

const addBtn = document.querySelector<HTMLButtonElement>('#add-todo-button')
const todoInput = document.querySelector<HTMLInputElement>('#todo-input')
const errorTxt = document.querySelector<HTMLDivElement>('#errorText')
const tasksList = document.querySelector<HTMLUListElement>('#todo-elements')
interface Task {
  task: string
}
const arrOfTask: Task[] = []

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
    errorTxt.innerText = 'Can not add an empty task.'
  } else {
    errorTxt.innerText = ''
    const newTask = document.createElement('li')
    newTask.setAttribute('class', 'task border')
    tasksList.appendChild(newTask)
    newTask.innerText = todoInput.value
    todoInput.value = ''
    arrOfTask.push({ task: newTask.innerText })
    const JSONTaskList = JSON.stringify(arrOfTask)
    localStorage.setItem('taskList', JSONTaskList)
  }
}
const storedTaskListStr = localStorage.getItem('taskList')
const storedTaskListArr: Task[] = storedTaskListStr
  ? JSON.parse(storedTaskListStr)
  : []

addBtn.addEventListener('click', () => {
  addTodo()
})
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo()
  }
})

window.addEventListener('load', () => {
  if (storedTaskListArr !== null) {
    for (let i = 0; i < storedTaskListArr.length; i++) {
      const newTask = document.createElement('li')
      newTask.setAttribute('class', 'task border')
      tasksList.appendChild(newTask)
      newTask.innerText = storedTaskListArr[i].task
      arrOfTask.push({ task: newTask.innerText })
      const JSONTaskList = JSON.stringify(arrOfTask)
      localStorage.setItem('taskList', JSONTaskList)
    }
  }
})

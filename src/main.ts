import './style.css'

const addBtn = document.querySelector<HTMLButtonElement>('#add-todo-button')
const todoInput = document.querySelector<HTMLInputElement>('#todo-input')
const errorTxt = document.querySelector<HTMLDivElement>('#errorText')
const tasksList = document.querySelector<HTMLUListElement>('#todo-elements')
interface Task {
  task: string
  done: boolean
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

const createElements = (taskText: string, isDone = false) => {
  const newTask = document.createElement('li')
  newTask.setAttribute('class', 'task border')
  tasksList.appendChild(newTask)

  const taskContent = document.createElement('span')
  taskContent.className = 'tasktxt'
  newTask.appendChild(taskContent)
  taskContent.innerText = taskText
  if (isDone) {
    taskContent.classList.add('done')
  }

  const checkbox = document.createElement('input')
  const uniqueId = `checkbox-${Date.now()}`
  checkbox.setAttribute('type', 'checkbox')
  checkbox.id = uniqueId
  checkbox.checked = isDone

  const actionBox = document.createElement('div')
  actionBox.className = 'actionBox'

  const checkLabel = document.createElement('label')
  checkLabel.setAttribute('for', uniqueId)
  checkLabel.className = 'doneLabel'
  checkLabel.innerText = 'Done'

  newTask.appendChild(actionBox)
  actionBox.appendChild(checkLabel)
  actionBox.appendChild(checkbox)

  arrOfTask.push({
    task: taskText,
    done: checkbox.checked,
  })
  localStorage.setItem('taskList', JSON.stringify(arrOfTask))

  checkbox.addEventListener('change', () => {
    taskContent.classList.toggle('done', checkbox.checked)

    const taskIndex = arrOfTask.findIndex((t) => t.task === taskText)
    if (taskIndex !== -1) {
      arrOfTask[taskIndex].done = checkbox.checked.valueOf()
    }

    localStorage.setItem('taskList', JSON.stringify(arrOfTask))
  })
}

const addTodo = () => {
  if (todoInput.value.trim() === '') {
    errorTxt.innerText = 'Can not add an empty task.'
  } else {
    errorTxt.innerText = ''
    const taskText = todoInput.value.trim()
    createElements(taskText, false)
    todoInput.value = ''
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
  storedTaskListArr.forEach((task) => {
    createElements(task.task, task.done)
  })
})

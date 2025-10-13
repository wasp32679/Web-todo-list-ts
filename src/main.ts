import './style.css'

const addBtn = document.querySelector<HTMLButtonElement>('#add-todo-button')
const todoInput = document.querySelector<HTMLInputElement>('#todo-input')
const errorTxt = document.querySelector<HTMLDivElement>('#errorText')
const tasksList = document.querySelector<HTMLUListElement>('#todo-elements')
interface Task {
  id: number
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

const addTodoToStorage = (taskText: string): number => {
  const id = Date.now()

  arrOfTask.push({
    id: id,
    task: taskText,
    done: false,
  })
  localStorage.setItem('taskList', JSON.stringify(arrOfTask))
  return arrOfTask.findIndex((t) => t.id === id)
}

const removeTodoFromStorage = (taskIndex: number) => {
  if (taskIndex !== -1) {
    arrOfTask.splice(taskIndex, 1)
    localStorage.setItem('taskList', JSON.stringify(arrOfTask))
  }
}

const saveTodoCheckboxChangesOnStorage = (
  taskIndex: number,
  checkbox: HTMLInputElement,
) => {
  if (taskIndex !== -1) {
    arrOfTask[taskIndex].done = checkbox.checked
  }

  localStorage.setItem('taskList', JSON.stringify(arrOfTask))
}

const createElements = (
  taskText: string,
  taskIndex: number,
  isDone = false,
) => {
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

  const removeBtn = document.createElement('button')
  removeBtn.innerText = 'Remove'
  removeBtn.setAttribute('class', 'remove border')
  actionBox.appendChild(removeBtn)

  removeBtn.addEventListener('click', () => {
    removeTodoFromStorage(taskIndex)
    newTask.remove()
  })

  checkbox.addEventListener('change', () => {
    taskContent.classList.toggle('done', checkbox.checked)
    saveTodoCheckboxChangesOnStorage(taskIndex, checkbox)
  })
}

const addTodo = () => {
  if (todoInput.value.trim() === '') {
    errorTxt.innerText = 'Can not add an empty task.'
  } else {
    errorTxt.innerText = ''
    const taskText = todoInput.value.trim()
    const index = addTodoToStorage(taskText)
    createElements(taskText, index)
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
    createElements(task.task, task.id, task.done)
  })
})

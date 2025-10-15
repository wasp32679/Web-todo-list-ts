import './style.css'

const addBtn = document.querySelector<HTMLButtonElement>('#add-todo-button')
const todoInput = document.querySelector<HTMLInputElement>('#todo-input')
const errorTxt = document.querySelector<HTMLDivElement>('#errorText')
const tasksList = document.querySelector<HTMLUListElement>('#todo-elements')
const main = document.querySelector('main')
const dateInput = document.querySelector<HTMLInputElement>('#todo-date-input')
interface Task {
  id: number
  task: string
  done: boolean
  dueDate: string
}
const arrOfTask: Task[] = []

if (
  addBtn === null ||
  todoInput === null ||
  errorTxt === null ||
  tasksList === null ||
  main === null ||
  dateInput === null
) {
  throw new Error('Missing variables for app to start')
}

const currentDate = new Date().toISOString().slice(0, 10)

const addTodoToStorage = (taskText: string, taskDueDate: string): number => {
  const id = Date.now()

  arrOfTask.push({
    id: id,
    task: taskText,
    dueDate: taskDueDate,
    done: false,
  })
  localStorage.setItem('taskList', JSON.stringify(arrOfTask))
  return id
}

const findTaskIndexById = (taskId: number) =>
  arrOfTask.findIndex((t) => t.id === taskId)

const removeTodoFromStorage = (taskId: number) => {
  const taskIndex = findTaskIndexById(taskId)
  if (taskIndex !== -1) {
    arrOfTask.splice(taskIndex, 1)
    localStorage.setItem('taskList', JSON.stringify(arrOfTask))
  }
}

const saveTodoCheckboxChangesOnStorage = (
  taskId: number,
  checkbox: HTMLInputElement,
) => {
  const taskIndex = findTaskIndexById(taskId)
  if (taskIndex !== -1) {
    arrOfTask[taskIndex].done = checkbox.checked
  }

  localStorage.setItem('taskList', JSON.stringify(arrOfTask))
}

const clearTodos = () => {
  arrOfTask.length = 0
  localStorage.setItem('taskList', JSON.stringify(arrOfTask))
}

const createElements = (
  taskText: string,
  taskDueDate: string,
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

  const taskDelay = document.createElement('p')
  taskDelay.className = 'taskdate'
  if (taskDueDate !== 'no due date') {
    const taskDate = document.createElement('time')
    taskDate.dateTime = taskDueDate
    taskDate.innerText = taskDueDate
    taskDelay.appendChild(taskDate)
  } else {
    taskDelay.innerText = taskDueDate
  }
  newTask.appendChild(taskDelay)

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
    deleteAllBtnVisibility()
  })

  checkbox.addEventListener('change', () => {
    taskContent.classList.toggle('done', checkbox.checked)
    saveTodoCheckboxChangesOnStorage(taskIndex, checkbox)
  })
}

const createDeleteAllBtn = () => {
  const clearBtn = document.createElement('button')
  clearBtn.innerText = 'Delete All'
  clearBtn.setAttribute('class', 'border')
  clearBtn.setAttribute('id', 'delete-all')
  main.appendChild(clearBtn)
  clearBtn.addEventListener('click', () => {
    clearTodos()
    tasksList.innerHTML = ''
    deleteAllBtnVisibility()
  })
  return clearBtn
}

const deleteAllBtnVisibility = () => {
  const clearBtn = document.querySelector<HTMLButtonElement>('#delete-all')
  if (clearBtn && tasksList.innerHTML === '') {
    clearBtn.style.visibility = 'hidden'
  } else if (clearBtn && tasksList.innerHTML !== '') {
    clearBtn.style.visibility = 'visible'
  }
}

const haveDueDate = () => {
  return dateInput.value !== '' ? dateInput.value : 'no due date'
}

const addTodo = () => {
  if (
    todoInput.value.trim() === '' &&
    dateInput.value !== '' &&
    dateInput.value < currentDate
  ) {
    errorTxt.innerText = 'Can not add empty task with a past date.'
  } else if (todoInput.value.trim() === '') {
    errorTxt.innerText = 'Can not add empty task.'
  } else if (dateInput.value !== '' && dateInput.value < currentDate) {
    errorTxt.innerText = 'Can not add task with a past date.'
  } else {
    errorTxt.innerText = ''
    const taskText = todoInput.value.trim()
    const taskDueDate = haveDueDate()
    const id = addTodoToStorage(taskText, taskDueDate)
    createElements(taskText, taskDueDate, id)
    todoInput.value = ''
  }
  deleteAllBtnVisibility()
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
    arrOfTask.push(task)
    createElements(task.task, task.dueDate, task.id, task.done)
  })
  createDeleteAllBtn()
  deleteAllBtnVisibility()
})

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
  return id
}

const removeTodoFromStorage = (taskId: number) => {
  const taskIndex = arrOfTask.findIndex((t) => t.id === taskId)

  if (taskIndex !== -1) {
    arrOfTask.splice(taskIndex, 1)
    localStorage.setItem('taskList', JSON.stringify(arrOfTask))
  }
}

const saveTodoCheckboxChangesOnStorage = (
  taskId: number,
  checkbox: HTMLInputElement,
) => {
  const taskIndex = arrOfTask.findIndex((t) => t.id === taskId)
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

  if (document.querySelector('#delete-all')) {
    tasksList.insertBefore(newTask, document.querySelector('#delete-all'))
    return
  }
  const clearBtn = document.createElement('button')
  clearBtn.innerText = 'Delete All'
  clearBtn.setAttribute('class', 'remove border')
  clearBtn.setAttribute('id', 'delete-all')
  tasksList.appendChild(clearBtn)
  clearBtn.addEventListener('click', () => {
    clearTodos()
    tasksList.innerHTML = ''
  })
}

const addTodo = () => {
  if (todoInput.value.trim() === '') {
    errorTxt.innerText = 'Can not add an empty task.'
  } else {
    errorTxt.innerText = ''
    const taskText = todoInput.value.trim()
    const id = addTodoToStorage(taskText)
    createElements(taskText, id)
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
    arrOfTask.push(task)
    createElements(task.task, task.id, task.done)
  })
})

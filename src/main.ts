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
// interface Check {
//   check: string
// }
// const arrOfChecks: Check[] = []

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
    const taskText = todoInput.value.trim()
    const newTask = document.createElement('li')
    newTask.setAttribute('class', 'task border')
    tasksList.appendChild(newTask)

    const taskContent = document.createElement('span')
    taskContent.setAttribute('id', 'tasktxt')
    newTask.appendChild(taskContent)
    taskContent.innerText = taskText

    todoInput.value = ''

    const checkbox = document.createElement('input')
    checkbox.setAttribute('type', 'checkbox')

    const actionBox = document.createElement('div')
    actionBox.setAttribute('id', 'actionBox')

    const checkLabel = document.createElement('label')
    checkLabel.setAttribute('for', 'checkbox')
    checkLabel.innerText = 'Done'

    newTask.appendChild(actionBox)
    actionBox.appendChild(checkLabel)
    actionBox.appendChild(checkbox)

    arrOfTask.push({
      task: taskText,
      done: checkbox.checked.valueOf(),
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
}
const storedTaskListStr = localStorage.getItem('taskList')
const storedTaskListArr: Task[] = storedTaskListStr
  ? JSON.parse(storedTaskListStr)
  : []

// const saveCheckbox = () => {
//   const checkboxes = document.querySelectorAll('input[type="checkbox"]')
// }

const storedTaskListStr = localStorage.getItem('taskList')
const storedTaskListArr: Task[] = storedTaskListStr
  ? JSON.parse(storedTaskListStr)
  : []

// const storedChecks = localStorage.getItem('checkList')
// const storedChecksArr: Check[] = storedChecks ? JSON.parse(storedChecks) : []

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
    const newTask = document.createElement('li')
    newTask.setAttribute('class', 'task border')
    tasksList.appendChild(newTask)

    const taskContent = document.createElement('span')
    taskContent.setAttribute('id', 'tasktxt')
    newTask.appendChild(taskContent)
    taskContent.innerText = task.task

    const checkbox = document.createElement('input')
    checkbox.setAttribute('type', 'checkbox')
    checkbox.checked = task.done

    const actionBox = document.createElement('div')
    actionBox.setAttribute('id', 'actionBox')

    const checkLabel = document.createElement('label')
    checkLabel.setAttribute('for', 'checkbox')
    checkLabel.innerText = 'Done'

    newTask.appendChild(actionBox)
    actionBox.appendChild(checkLabel)
    actionBox.appendChild(checkbox)

    if (task.done) {
      taskContent.classList.toggle('done', checkbox.checked)
    }

    checkbox.addEventListener('change', () => {
      taskContent.classList.toggle('done', checkbox.checked)

      const taskIndex = arrOfTask.findIndex((t) => t.task === task.task)
      if (taskIndex !== -1) {
        arrOfTask[taskIndex].done = checkbox.checked.valueOf()
      }

      localStorage.setItem('taskList', JSON.stringify(arrOfTask))
    })
  })
})

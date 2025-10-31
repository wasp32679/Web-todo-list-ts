import './style.css'
import {
  addTodoToStorage,
  arrOfTask,
  initializeFromStorage,
} from './services/storage'
import { createDeleteAllBtn, createTaskElement } from './UI/createEl'
import { deleteAllBtnVisibility, dueDateUrgency, updateUI } from './UI/updateUi'
import { getCurrentDate } from './utils/date'
import { elements } from './utils/dom'

const { addBtn, todoInput, errorTxt, dateInput, tasksList } = elements

const haveDueDate = () => {
  return dateInput.value !== '' ? dateInput.value : 'no due date'
}

const addTodo = () => {
  const currentDate = getCurrentDate()
  if (
    todoInput.value.trim() === '' &&
    dateInput.value !== '' &&
    dateInput.value < currentDate
  ) {
    errorTxt.textContent = 'Can not add empty task with a past date.'
  } else if (todoInput.value.trim() === '') {
    errorTxt.textContent = 'Can not add empty task.'
  } else if (dateInput.value !== '' && dateInput.value < currentDate) {
    errorTxt.textContent = 'Can not add task with a past date.'
  } else {
    errorTxt.textContent = ''
    const taskText = todoInput.value.trim()
    const taskDueDate = haveDueDate()
    const id = addTodoToStorage(taskText, taskDueDate)
    const { newTask, dueDateParagraph } = createTaskElement(
      taskText,
      taskDueDate,
      id,
    )
    tasksList.appendChild(newTask)
    dueDateUrgency(dueDateParagraph, taskDueDate)
    todoInput.value = ''
  }
  deleteAllBtnVisibility()
}

addBtn.addEventListener('click', addTodo)

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo()
  }
})

window.addEventListener('load', () => {
  initializeFromStorage()

  arrOfTask.forEach((task) => {
    const { newTask, dueDateParagraph } = createTaskElement(
      task.task,
      task.dueDate,
      task.id,
      task.done,
    )
    tasksList.appendChild(newTask)
    dueDateUrgency(dueDateParagraph, task.dueDate)
  })
  createDeleteAllBtn()
  updateUI()
})

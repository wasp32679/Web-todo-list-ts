import './style.css'
import type { Task } from './types/task'
import { getCurrentDate, haveDueDate } from './utils/date'
import { arrOfTask } from './services/storage'
import { addTodoToStorage } from './services/storage'
import { updateUI, dueDateUrgency, deleteAllBtnVisibility } from './UI/updateUi'
import { createElements, createDeleteAllBtn } from './UI/createEl'
import { elements } from './utils/dom'
const { addBtn, todoInput, errorTxt, dateInput } = elements

const currentDate = getCurrentDate()

const addTodo = () => {
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
    const dueDateParagraph = createElements(taskText, taskDueDate, id)
    dueDateUrgency(dueDateParagraph, taskDueDate)
    todoInput.value = ''
  }
  deleteAllBtnVisibility()
}
const storedTaskListStr = localStorage.getItem('taskList')
const storedTaskListArr: Task[] = storedTaskListStr
  ? JSON.parse(storedTaskListStr)
  : []

addBtn.addEventListener('click', addTodo)

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo()
  }
})

window.addEventListener('load', () => {
  storedTaskListArr.forEach((task) => {
    arrOfTask.push(task)
    const dueDateParagraph = createElements(
      task.task,
      task.dueDate,
      task.id,
      task.done,
    )
    dueDateUrgency(dueDateParagraph, task.dueDate)
  })
  createDeleteAllBtn()
  updateUI()
})

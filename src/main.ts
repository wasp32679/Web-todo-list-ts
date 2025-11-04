import { addTodoToStorage } from './services/storage'
import { createTaskElement } from './UI/createEl'
import { deleteAllBtnVisibility, dueDateUrgency } from './UI/updateUi'
import { getCurrentDate } from './utils/date'
import { elements } from './utils/dom'
import './style.css'
import { arrOfTask, fetchUrl } from './services/storage'
import type { Task } from './types/task'
import { renderTodos } from './UI/updateUi'

const { addBtn, todoInput, errorTxt, dateInput, tasksList } = elements

const haveDueDate = () => {
  return dateInput.value !== '' ? dateInput.value : 'no due date'
}

const addTodo = async () => {
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
    const newTask = await addTodoToStorage(taskText, taskDueDate)
    if (newTask !== null) {
      const id = newTask.id
      const { newTask: newTaskEl, dueDateParagraph } = createTaskElement(
        taskText,
        taskDueDate,
        id,
      )
      tasksList.appendChild(newTaskEl)
      dueDateUrgency(dueDateParagraph, taskDueDate)
      todoInput.value = ''
    }
  }
  deleteAllBtnVisibility()
}

addBtn.addEventListener('click', addTodo)

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo()
  }
})

window.addEventListener('load', async () => {
  async function initializeFromStorage() {
    try {
      const resp = await fetch(fetchUrl, {
        headers: {
          'Content-type': 'application/json',
        },
      })

      if (!resp.ok) {
        throw new Error(`HTTP Error Status: ${resp.status}`)
      }

      const tasks: Task[] = await resp.json()
      arrOfTask.push(...tasks)
      renderTodos()
    } catch (error) {
      console.error(error)
      return []
    }
  }
  await initializeFromStorage()
})

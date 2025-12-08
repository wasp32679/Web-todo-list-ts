import { elements } from '../utils/dom'

const { tasksList, main } = elements

import {
  clearTodos,
  removeTodoFromApi,
  saveTodoCheckboxChangesOnApi,
} from '../services/todosApi'
import { updateOverdueMsg, updateTodoUI } from './updateTodosUi'

export const createTaskElement = (
  taskText: string,
  taskDueDate: string,
  taskId: number,
  taskCategory: string,
  isDone = false,
): { newTask: HTMLLIElement; dueDateParagraph: HTMLParagraphElement } => {
  const newTask = document.createElement('li')
  newTask.classList.add('taskAndCategory', 'border')

  const taskContent = document.createElement('span')
  taskContent.className = 'tasktxt'
  newTask.appendChild(taskContent)
  taskContent.textContent = taskText
  if (isDone) {
    taskContent.classList.add('done')
  }

  const categoryParagraph = document.createElement('p')
  categoryParagraph.className = 'taskcategory'
  categoryParagraph.textContent = taskCategory
  newTask.appendChild(categoryParagraph)

  const dueDateParagraph = document.createElement('p')
  dueDateParagraph.className = 'taskdate'
  if (taskDueDate !== 'no due date') {
    const taskDate = document.createElement('time')
    taskDate.classList.add('due-date-color', 'taskdate')
    taskDate.dateTime = taskDueDate
    taskDate.textContent = taskDueDate
    dueDateParagraph.appendChild(taskDate)
  } else {
    dueDateParagraph.textContent = taskDueDate
  }
  newTask.appendChild(dueDateParagraph)

  const checkbox = document.createElement('input')
  const uniqueId = `checkbox-${taskId}`
  checkbox.setAttribute('type', 'checkbox')
  checkbox.id = uniqueId
  checkbox.checked = isDone

  const actionBox = document.createElement('div')
  actionBox.className = 'actionBox'
  newTask.appendChild(actionBox)

  const checkLabel = document.createElement('label')
  checkLabel.setAttribute('for', uniqueId)
  checkLabel.className = 'doneLabel'
  checkLabel.textContent = 'Done'

  actionBox.appendChild(checkLabel)
  actionBox.appendChild(checkbox)

  const removeBtn = document.createElement('button')
  removeBtn.textContent = 'Remove'
  removeBtn.classList.add('remove', 'border', 'smallBtn')
  actionBox.appendChild(removeBtn)

  removeBtn.addEventListener('click', async () => {
    await removeTodoFromApi(taskId)
    newTask.remove()
    await updateTodoUI()
  })

  checkbox.addEventListener('change', async () => {
    taskContent.classList.toggle('done', checkbox.checked)
    saveTodoCheckboxChangesOnApi(taskId, checkbox)
    await updateOverdueMsg()
  })
  return {
    newTask,
    dueDateParagraph,
  }
}

export const createDeleteAllTodosBtn = () => {
  const clearBtn = document.createElement('button')
  clearBtn.textContent = 'Delete All'
  clearBtn.classList.add('border', 'delete-all')
  clearBtn.id = 'clear-todos'
  main.appendChild(clearBtn)
  clearBtn.addEventListener('click', async () => {
    await clearTodos()
    tasksList.replaceChildren()
    await updateTodoUI()
  })
  return clearBtn
}

import { elements } from '../utils/dom'

const { tasksList, main } = elements

import {
  clearTodos,
  removeTodoFromStorage,
  saveTodoCheckboxChangesOnStorage,
} from '../services/storage'
import { updateOverdueMsg, updateUI } from './updateUi'

export const createElements = (
  taskText: string,
  taskDueDate: string,
  taskIndex: number,
  isDone = false,
): HTMLParagraphElement => {
  const newTask = document.createElement('li')
  newTask.classList.add('task', 'border')
  tasksList.appendChild(newTask)

  const taskContent = document.createElement('span')
  taskContent.className = 'tasktxt'
  newTask.appendChild(taskContent)
  taskContent.textContent = taskText
  if (isDone) {
    taskContent.classList.add('done')
  }

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
  const uniqueId = `checkbox-${Date.now()}`
  checkbox.setAttribute('type', 'checkbox')
  checkbox.id = uniqueId
  checkbox.checked = isDone

  const actionBox = document.createElement('div')
  actionBox.className = 'actionBox'

  const checkLabel = document.createElement('label')
  checkLabel.setAttribute('for', uniqueId)
  checkLabel.className = 'doneLabel'
  checkLabel.textContent = 'Done'

  newTask.appendChild(actionBox)
  actionBox.appendChild(checkLabel)
  actionBox.appendChild(checkbox)

  const removeBtn = document.createElement('button')
  removeBtn.textContent = 'Remove'
  removeBtn.classList.add('remove', 'border')
  actionBox.appendChild(removeBtn)

  removeBtn.addEventListener('click', () => {
    removeTodoFromStorage(taskIndex)
    newTask.remove()
    updateUI()
  })

  checkbox.addEventListener('change', () => {
    taskContent.classList.toggle('done', checkbox.checked)
    saveTodoCheckboxChangesOnStorage(taskIndex, checkbox)
    updateOverdueMsg()
  })
  return dueDateParagraph
}

export const createDeleteAllBtn = () => {
  const clearBtn = document.createElement('button')
  clearBtn.textContent = 'Delete All'
  clearBtn.classList.add('border')
  clearBtn.id = 'delete-all'
  main.appendChild(clearBtn)
  clearBtn.addEventListener('click', () => {
    clearTodos()
    tasksList.innerHTML = ''
    updateUI()
  })
  return clearBtn
}

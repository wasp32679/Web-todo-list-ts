import { arrOfTask } from '../services/storage'
import { getCurrentDate, getFutureDateString } from '../utils/date'
import { elements } from '../utils/dom'
import { createDeleteAllBtn, createTaskElement } from './createEl'

const { tasksList, overdueMessageContainer } = elements

export const updateOverdueMsg = () => {
  const hasOverdueUndoneTasks = arrOfTask.some(
    (task) =>
      task.due_date !== 'no due date' &&
      task.due_date < getCurrentDate() &&
      !task.done,
  )
  const msgElement = document.getElementById('overdue-message')

  if (hasOverdueUndoneTasks && !msgElement) {
    const overdueMsg = document.createElement('p')
    overdueMsg.id = 'overdue-message'
    overdueMsg.textContent = 'You have overdue task(s)!'
    overdueMessageContainer.appendChild(overdueMsg)
  } else if (!hasOverdueUndoneTasks && msgElement) {
    msgElement.remove()
  }
}

export const deleteAllBtnVisibility = () => {
  const clearBtn = document.querySelector<HTMLButtonElement>('#delete-all')
  if (clearBtn) {
    clearBtn.style.visibility =
      tasksList.children.length === 0 ? 'hidden' : 'visible'
  }
}

export const updateUI = () => {
  deleteAllBtnVisibility()
  updateOverdueMsg()
}

const dueColorClasses = [
  'taskdate--overdue',
  'taskdate--today',
  'taskdate--soon',
  'taskdate--later',
]

const urgency_soon_treshold = 4

const getUrgencyClass = (dueDate: string): string | null => {
  const currentDate = getCurrentDate()
  const fourDaysAfterCurrentDate = getFutureDateString(urgency_soon_treshold)
  if (dueDate === 'no due date') return null
  if (dueDate < currentDate) return 'taskdate--overdue'
  if (dueDate === currentDate) return 'taskdate--today'
  if (dueDate <= fourDaysAfterCurrentDate) return 'taskdate--soon'
  return 'taskdate--later'
}

export const dueDateUrgency = (
  dueDateParagraph: HTMLParagraphElement,
  taskDueDate: string,
) => {
  const urgencyClass = getUrgencyClass(taskDueDate)
  if (urgencyClass) {
    dueDateParagraph.classList.remove(...dueColorClasses)
    dueDateParagraph.classList.add(urgencyClass)
  }
}

export const renderTodos = () => {
  arrOfTask.forEach((task) => {
    const { newTask, dueDateParagraph } = createTaskElement(
      task.content,
      task.due_date,
      task.id,
      task.done,
    )
    tasksList.appendChild(newTask)
    dueDateUrgency(dueDateParagraph, task.due_date)
  })

  createDeleteAllBtn()
  updateUI()
}

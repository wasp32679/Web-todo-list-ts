import { elements } from '../utils/dom'

const { tasksList, overdueMessageContainer } = elements

import { arrOfTask } from '../services/storage'
import { getCurrentDate, getFutureDateString } from '../utils/date'

export const updateOverdueMsg = () => {
  const hasOverdueUndoneTasks = arrOfTask.some(
    (task) =>
      task.dueDate !== 'no due date' &&
      task.dueDate < getCurrentDate() &&
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

const getUrgencyClass = (dueDate: string): string | null => {
  const currentDate = getCurrentDate()
  const fourDaysAfterCurrentDate = getFutureDateString(4)
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

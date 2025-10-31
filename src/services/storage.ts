import type { Task } from '../types/task'

export const arrOfTask: Task[] = []

const updateStorage = () => {
  localStorage.setItem('taskList', JSON.stringify(arrOfTask))
}

export const addTodoToStorage = (
  taskText: string,
  taskDueDate: string,
): number => {
  const id = Date.now()

  arrOfTask.push({
    id: id,
    task: taskText,
    dueDate: taskDueDate,
    done: false,
  })
  updateStorage()
  return id
}

const findTaskIndexById = (taskId: number) =>
  arrOfTask.findIndex((t) => t.id === taskId)

export const removeTodoFromStorage = (taskId: number) => {
  const taskIndex = findTaskIndexById(taskId)
  if (taskIndex !== -1) {
    arrOfTask.splice(taskIndex, 1)
    updateStorage()
  }
}

export const saveTodoCheckboxChangesOnStorage = (
  taskId: number,
  checkbox: HTMLInputElement,
) => {
  const taskIndex = findTaskIndexById(taskId)
  if (taskIndex !== -1) {
    arrOfTask[taskIndex].done = checkbox.checked
  }
  updateStorage()
}

export const clearTodos = () => {
  arrOfTask.length = 0
  updateStorage()
}

export const initializeFromStorage = () => {
  const storedTaskListStr = localStorage.getItem('taskList')
  const storedTaskListArr: Task[] = storedTaskListStr
    ? JSON.parse(storedTaskListStr)
    : []

  arrOfTask.push(...storedTaskListArr)

  return storedTaskListArr
}

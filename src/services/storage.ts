import type { Task, TaskInsert } from '../types/task'

export const arrOfTask: Task[] = []

export const arrOfTaskInsert: TaskInsert[] = []

const updateStorage = () => {
  localStorage.setItem('taskList', JSON.stringify(arrOfTask))
}
import { renderTodos } from '../UI/updateUi'

export async function addTodoToStorage(taskText: string, taskDueDate: string) {
  const response = await fetch('https://api.todos.in.jt-lab.ch/todos', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      title: taskText,
      content: taskText,
      due_date: taskDueDate,
      done: false,
    }),
  })

  arrOfTaskInsert.push({
    title: taskText,
    content: taskText,
    due_date: taskDueDate,
    done: false,
  })
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

export async function initializeFromStorage() {
  try {
    const resp = await fetch('https://api.todos.in.jt-lab.ch/todos', {
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
  }
}

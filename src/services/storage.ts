import type { Task, TaskInsert } from '../types/task'

export const arrOfTask: Task[] = []

export const arrOfTaskInsert: TaskInsert[] = []

import { renderTodos } from '../UI/updateUi'

const fetchUrl = 'https://api.todos.in.jt-lab.ch/todos'

export async function initializeFromStorage() {
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
    return tasks.map((t) => ({
      id: t.id,
      done: t.done,
    }))
  } catch (error) {
    console.error(error)
    return []
  }
}

async function updateStorage(id: number, done: boolean) {
  try {
    const resp = await fetch(`${fetchUrl}?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        done,
      }),
    })

    if (!resp.ok) {
      throw new Error(`HTTP Error Status: ${resp.status}`)
    }

    await resp.json()
  } catch (error) {
    console.error(error)
  }
}

export async function addTodoToStorage(
  taskText: string,
  taskDueDate: string,
): Promise<Task | null> {
  try {
    const resp = await fetch(fetchUrl, {
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

    if (!resp.ok) {
      throw new Error(`HTTP Error Status: ${resp.status}`)
    }

    const data: Task[] = await resp.json()
    const newTask = data[0]

    arrOfTask.push(newTask)

    return newTask
  } catch (error) {
    console.error(error)
    return null
  }
}

const findTaskIndexById = (taskId: number) =>
  arrOfTask.findIndex((t) => t.id === taskId)

export async function removeTodoFromStorage(taskId: number) {
  const taskIndex = findTaskIndexById(taskId)
  if (taskIndex !== -1) {
    arrOfTask.splice(taskIndex, 1)
    try {
      const resp = await fetch(`${fetchUrl}?id=eq.${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      })

      if (!resp.ok) {
        throw new Error(`Failed to delete task: ${resp.status}`)
      }
    } catch (error) {
      console.error(error)
    }
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
  updateStorage(taskId, checkbox.checked)
}

export async function clearTodos() {
  arrOfTask.forEach((task) => {
    try {
      fetch(`${fetchUrl}?id=eq.${task.id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      })
    } catch (error) {
      console.error(error)
    }
  })
  arrOfTask.length = 0
}

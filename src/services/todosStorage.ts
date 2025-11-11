import type { Task, TaskInsert } from '../types/task'

export const arrOfTask: Task[] = []

export const arrOfTaskInsert: TaskInsert[] = []

export const fetchUrlTodos = 'https://api.todos.in.jt-lab.ch/todos'

async function updateTodosStorage(id: number, done: boolean) {
  try {
    const resp = await fetch(`${fetchUrlTodos}?id=eq.${id}`, {
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
  } catch (error) {
    console.error(error)
  }
}

export async function addTodoToStorage(
  taskText: string,
  taskDueDate: string,
): Promise<Task | null> {
  try {
    const resp = await fetch(fetchUrlTodos, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        title: taskText,
        content: taskText,
        due_date:
          taskDueDate && taskDueDate !== 'no due date' ? taskDueDate : null,
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
    try {
      const resp = await fetch(`${fetchUrlTodos}?id=eq.${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      })

      if (!resp.ok) {
        throw new Error(`Failed to delete task: ${resp.status}`)
      }

      arrOfTask.splice(taskIndex, 1)
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
  updateTodosStorage(taskId, checkbox.checked)
}

export async function clearTodos() {
  const deletePromises = arrOfTask.map((task) => {
    return fetch(`${fetchUrlTodos}?id=eq.${task.id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    }).then((resp) => {
      if (!resp.ok) {
        throw new Error(`Failed to delete task ${task.id}: ${resp.status}`)
      }
    })
  })

  try {
    await Promise.all(deletePromises)
    arrOfTask.length = 0
    return true
  } catch (error) {
    console.error('One or more tasks could not be deleted:', error)
    return false
  }
}

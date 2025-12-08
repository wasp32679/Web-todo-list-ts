import type { Category_todo } from '../types/categories_todos'
import { elements } from '../utils/dom'

const { selectCategoryMenu } = elements
const fetchUrlCategoriesTodos =
  'https://api.todos.in.jt-lab.ch/categories_todos'

const selectCategory = (categoryId: number) => {
  selectCategoryMenu.value = String(categoryId)
  return selectCategoryMenu.value
}

export async function addCategoriesTodosApi(
  taskId: number,
  categoryId: number,
): Promise<Category_todo | null> {
  try {
    const resp = await fetch(`${fetchUrlCategoriesTodos}?id=eq.${taskId}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        category_id: selectCategory(categoryId),
        todo_id: taskId,
      }),
    })

    if (!resp.ok) {
      throw new Error(`Failed to delete task: ${resp.status}`)
    }
    const data: Category_todo = await resp.json()

    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function initializeCategoriesTodos() {
  try {
    const resp = await fetch(fetchUrlCategoriesTodos, {
      headers: {
        'Content-type': 'application/json',
      },
    })

    if (!resp.ok) {
      throw new Error(`HTTP Error Status: ${resp.status}`)
    }

    const data = await resp.json()
    return data
  } catch (error) {
    console.error(error)
    return
  }
}

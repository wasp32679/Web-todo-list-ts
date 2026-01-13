import type { Category_todo } from '../types/categories_todos'

const fetchUrlCategoriesTodos =
  'https://api.todos.in.jt-lab.ch/categories_todos'

export async function addCategoriesTodosApi(
  taskId: number,
  categoryId: number,
): Promise<Category_todo | null> {
  try {
    const resp = await fetch(fetchUrlCategoriesTodos, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        category_id: categoryId,
        todo_id: taskId,
      }),
    })

    if (!resp.ok) {
      throw new Error(`Failed to add category-todo link: ${resp.status}`)
    }
    const data: Category_todo = await resp.json()

    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function updateCategoryForTodoApi(
  taskId: number,
  newCategoryId: number,
) {
  try {
    const resp = await fetch(
      `${fetchUrlCategoriesTodos}?todo_id=eq.${taskId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          category_id: newCategoryId,
        }),
      },
    )

    const data = await resp.json()

    if (data.length === 0) {
      await fetch(fetchUrlCategoriesTodos, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          todo_id: taskId,
          category_id: newCategoryId,
        }),
      })
    }
  } catch (error) {
    console.error('Erreur update category', error)
  }
}

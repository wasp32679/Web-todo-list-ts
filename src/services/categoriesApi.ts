import type { Category, CategoryUpdate } from '../types/categories'
import { elements } from '../utils/dom'

const { selectCategoryMenu } = elements
export const arrOfCategories: Category[] = []

export const fetchUrlCategories = 'https://api.todos.in.jt-lab.ch/categories'

export async function updateCategoryToApi(
  categoryId: number,
  categoryName: string,
  categoryColor: string,
): Promise<CategoryUpdate | null> {
  try {
    const resp = await fetch(`${fetchUrlCategories}?id=eq.${categoryId}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        title: categoryName,
        color: categoryColor,
      }),
    })

    if (!resp.ok) {
      throw new Error(`HTTP Error Status: ${resp.status}`)
    }

    const data: CategoryUpdate[] = await resp.json()
    const updatedCategory = data[0]

    const categoryIndex = findCategoryIndexById(categoryId)
    if (categoryIndex !== -1) {
      arrOfCategories[categoryIndex] = {
        ...arrOfCategories[categoryIndex],
        ...updatedCategory,
      }
      if (updatedCategory.title) {
        const optionToUpdate = selectCategoryMenu.querySelector(
          `option[value="${categoryId}"]`,
        )
        if (optionToUpdate) {
          optionToUpdate.textContent = updatedCategory.title
        }
      }
    }
    return updatedCategory
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function addCategoryToApi(
  categoryName: string,
  categoryColor: string,
): Promise<Category | null> {
  try {
    const resp = await fetch(fetchUrlCategories, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        title: categoryName,
        color: categoryColor,
      }),
    })

    if (!resp.ok) {
      throw new Error(`HTTP Error Status: ${resp.status}`)
    }

    const data: Category[] = await resp.json()
    const newCategory = data[0]

    arrOfCategories.push(newCategory)

    return newCategory
  } catch (error) {
    console.error(error)
    return null
  }
}

export const findCategoryIndexById = (categoryId: number) =>
  arrOfCategories.findIndex((c) => c.id === categoryId)

export async function removeCategoryFromApi(categoryId: number) {
  const categoryIndex = findCategoryIndexById(categoryId)
  if (categoryIndex !== -1) {
    try {
      const resp = await fetch(`${fetchUrlCategories}?id=eq.${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      })

      if (!resp.ok) {
        throw new Error(`Failed to delete category: ${resp.status}`)
      }

      arrOfCategories.splice(categoryIndex, 1)
      const optionToRemove = selectCategoryMenu.querySelector(
        `option[value="${categoryId}"]`,
      )
      if (optionToRemove) {
        selectCategoryMenu.removeChild(optionToRemove)
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export async function clearCategories() {
  const deletePromises = arrOfCategories.map((category) => {
    return fetch(`${fetchUrlCategories}?id=eq.${category.id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    }).then((resp) => {
      if (!resp.ok) {
        throw new Error(`Failed to delete task ${category.id}: ${resp.status}`)
      }
    })
  })

  try {
    await Promise.all(deletePromises)
    arrOfCategories.length = 0
    return true
  } catch (error) {
    console.error('One or more tasks could not be deleted:', error)
    return false
  }
}

export async function getCategoryColor(categoryId: number) {
  try {
    const resp = await fetch(`${fetchUrlCategories}?id=eq.${categoryId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/vnd.pgrst.object+json',
      },
    })

    if (!resp.ok) {
      throw new Error(`Failed to fetch category color: ${resp.status}`)
    }
    const category: Category = await resp.json()
    return category.color
  } catch (error) {
    console.error(error)
  }
}

import {
  clearCategories,
  removeCategoryFromStorage,
} from '../services/categoriesStorage'
import { elements } from '../utils/dom'
import {
  deleteAllCategoriesBtnVisibility,
  showPopup,
} from './updateCategoriesUi'

const {
  categorySection,
  categoriesList,
  categoryColorInput2,
  categoryNameInput2,
} = elements

export const createCategoryElement = (
  categoryId: number,
  categoryName: string,
  categoryColor: string,
): { newCategory: HTMLLIElement } => {
  const newCategory = document.createElement('li')
  newCategory.classList.add('taskAndCategory', 'border')

  newCategory.dataset.categoryId = String(categoryId)

  const categoryContent = document.createElement('span')
  categoryContent.className = 'tasktxt'
  newCategory.appendChild(categoryContent)
  categoryContent.textContent = categoryName

  const categoryColorIndicator = document.createElement('span')
  categoryColorIndicator.className = 'color-of-category'
  categoryColorIndicator.style.backgroundColor = categoryColor
  newCategory.appendChild(categoryColorIndicator)

  const editBtn = document.createElement('button')
  editBtn.textContent = 'Edit'
  editBtn.classList.add('edit', 'border', 'smallBtn')
  newCategory.appendChild(editBtn)

  const removeBtn = document.createElement('button')
  removeBtn.textContent = 'Remove'
  removeBtn.classList.add('remove', 'border', 'smallBtn')
  newCategory.appendChild(removeBtn)

  editBtn.addEventListener('click', async () => {
    showPopup()
    categoryNameInput2.value = categoryName
    categoryColorInput2.value = categoryColor
    categoryNameInput2.dataset.categoryId = String(categoryId)
  })

  removeBtn.addEventListener('click', async () => {
    await removeCategoryFromStorage(categoryId)
    newCategory.remove()
    await deleteAllCategoriesBtnVisibility()
  })

  return {
    newCategory,
  }
}

export const createDeleteAllCategoriesBtn = () => {
  const clearCategoriesBtn = document.createElement('button')
  clearCategoriesBtn.textContent = 'Delete All'
  clearCategoriesBtn.classList.add('border', 'delete-all')
  clearCategoriesBtn.id = 'clear-categories'
  categorySection.appendChild(clearCategoriesBtn)
  clearCategoriesBtn.addEventListener('click', async () => {
    await clearCategories()
    categoriesList.replaceChildren()
    await deleteAllCategoriesBtnVisibility()
  })
  return clearCategoriesBtn
}

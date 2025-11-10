import { arrOfCategories } from '../services/categoriesStorage'
import { elements } from '../utils/dom'
import {
  createCategoryElement,
  createDeleteAllCategoriesBtn,
} from './createCategoriesEl'

const { categoriesList, categoryUpdatePopop, overlay } = elements

export const deleteAllCategoriesBtnVisibility = () => {
  const clearCategoriesBtn =
    document.querySelector<HTMLButtonElement>('#clear-categories')
  if (clearCategoriesBtn) {
    clearCategoriesBtn.style.visibility =
      categoriesList.children.length === 0 ? 'hidden' : 'visible'
  }
}

export const renderCategories = () => {
  arrOfCategories.forEach((category) => {
    const { newCategory } = createCategoryElement(
      category.id,
      category.title,
      category.color,
    )
    categoriesList.appendChild(newCategory)
  })

  createDeleteAllCategoriesBtn()
  deleteAllCategoriesBtnVisibility()
}

export const showPopup = () => {
  categoryUpdatePopop.style.display = 'inline-flex'
  overlay.style.display = 'inline-flex'
}

export const closePopup = () => {
  categoryUpdatePopop.style.display = 'none'
  overlay.style.display = 'none'
}

const renderUpdatedCategoryUi = async () => {}

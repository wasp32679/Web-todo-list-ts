import { arrOfCategories } from '../services/categoriesApi'
import { elements } from '../utils/dom'
import {
  createCategoryElement,
  createCategoryOption,
  createDeleteAllCategoriesBtn,
} from './createCategoriesEl'

const {
  categoriesList,
  categoryUpdatePopop,
  overlay,
  selectCategoryMenu,
  selectCategoryMenu2,
} = elements

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
    const newOption = createCategoryOption(category.id, category.title)
    selectCategoryMenu.appendChild(newOption)
    const newOption2 = newOption.cloneNode(true) as HTMLOptionElement
    selectCategoryMenu2.appendChild(newOption2)
  })

  createDeleteAllCategoriesBtn()
  deleteAllCategoriesBtnVisibility()
}

export const showCategoryPopup = () => {
  categoryUpdatePopop.style.display = 'inline-flex'
  overlay.style.display = 'inline-flex'
}

export const closeCategoryPopup = () => {
  categoryUpdatePopop.style.display = 'none'
  overlay.style.display = 'none'
}

import { addTodoToApi } from './services/todosApi'
import {
  createCategoryElement,
  createCategoryOption,
} from './UI/createCategoriesEl'
import { createTaskElement } from './UI/createTodosEl'
import { getCurrentDate } from './utils/date'
import { elements } from './utils/dom'
import './style.css'
import {
  addCategoryToApi,
  arrOfCategories,
  fetchUrlCategories,
  getCategoryColor,
  updateCategoryToApi,
} from './services/categoriesApi'
import { addCategoriesTodosApi } from './services/categoriesTodosApi'
import { arrOfTask, fetchUrlTodos } from './services/todosApi'
import type { Category } from './types/categories'
import type { Task } from './types/task'
import {
  closePopup,
  deleteAllCategoriesBtnVisibility,
  renderCategories,
} from './UI/updateCategoriesUi'
import {
  deleteAllTodosBtnVisibility,
  dueDateUrgency,
  renderTodos,
} from './UI/updateTodosUi'
import {
  categoryVisibility,
  loadPageInterface,
  todoVisibility,
} from './UI/updateUi'

const {
  addTodoBtn,
  todoInput,
  errorTxt,
  dateInput,
  tasksList,
  addCategoryBtn,
  categoriesList,
  categoryNameInput,
  categoryColorInput,
  categoryInterfaceBtn,
  todoInterfaceBtn,
  categoryNameInput2,
  categoryColorInput2,
  saveCategoryUpdateBtn,
  selectCategoryMenu,
} = elements

const haveDueDate = () => {
  return dateInput.value !== '' ? dateInput.value : 'no due date'
}

const getSelected = () => {
  return selectCategoryMenu.selectedOptions[0]
}

const haveCategory = () => {
  const selected = getSelected()
  if (!selected || selectCategoryMenu.value === '') return 'no category'
  return selected.textContent ?? 'no category'
}

const haveCategoryColor = async () => {
  const categoryId = Number(getSelected().value)
  if (categoryId !== 0) {
    const categoryColor = await getCategoryColor(categoryId)
    return categoryColor
  }
}

const haveCategoryId = (): number | null => {
  return selectCategoryMenu.value !== ''
    ? Number(selectCategoryMenu.value)
    : null
}

const addTodo = async () => {
  const currentDate = getCurrentDate()

  if (
    todoInput.value.trim() === '' &&
    dateInput.value !== '' &&
    dateInput.value < currentDate
  ) {
    errorTxt.textContent = 'Can not add empty task with a past date.'
  } else if (todoInput.value.trim() === '') {
    errorTxt.textContent = 'Can not add empty task.'
  } else if (dateInput.value !== '' && dateInput.value < currentDate) {
    errorTxt.textContent = 'Can not add task with a past date.'
  } else {
    errorTxt.textContent = ''
    const taskText = todoInput.value.trim()
    const taskDueDate = haveDueDate()
    const taskCategory = haveCategory()
    const taskCategoryId = haveCategoryId()
    const catColor = await haveCategoryColor()
    const newTask = await addTodoToApi(taskText, taskDueDate)
    if (newTask !== null) {
      const id = newTask.id
      const { newTask: newTaskEl, dueDateParagraph } = createTaskElement(
        taskText,
        taskDueDate,
        id,
        taskCategory,
      )
      if (taskCategoryId !== null) {
        await addCategoriesTodosApi(id, taskCategoryId)
        if (catColor) {
          newTaskEl.style.borderColor = catColor
        }
      }
      tasksList.appendChild(newTaskEl)
      dueDateUrgency(dueDateParagraph, taskDueDate)
      todoInput.value = ''
    }
  }
  deleteAllTodosBtnVisibility()
}

const addCategory = async () => {
  if (categoryNameInput.value.trim() === '') {
    errorTxt.textContent = 'Can not add empty category.'
  } else {
    errorTxt.textContent = ''
    const categoryColor = categoryColorInput.value
    const categoryName = categoryNameInput.value.trim()
    const newCategory = await addCategoryToApi(categoryName, categoryColor)
    if (newCategory !== null) {
      const categoryId = newCategory.id
      const { newCategory: newCategoryEl } = createCategoryElement(
        categoryId,
        categoryName,
        categoryColor,
      )
      categoriesList.appendChild(newCategoryEl)
      categoryNameInput.value = ''
      const newOption = createCategoryOption(categoryId, categoryName)
      selectCategoryMenu.appendChild(newOption)
    }
    deleteAllCategoriesBtnVisibility()
  }
}

addTodoBtn.addEventListener('click', addTodo)

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo()
  }
})

addCategoryBtn.addEventListener('click', addCategory)

categoryNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addCategory()
  }
})

categoryInterfaceBtn.addEventListener('click', () => {
  todoVisibility()
  errorTxt.textContent = ''
})

todoInterfaceBtn.addEventListener('click', () => {
  categoryVisibility()
  errorTxt.textContent = ''
})

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePopup()
  }
})

saveCategoryUpdateBtn.addEventListener('click', async () => {
  const categoryColor = categoryColorInput2.value
  const categoryName = categoryNameInput2.value.trim()
  const categoryId = Number(categoryNameInput2.dataset.categoryId)
  const updatedCategory = await updateCategoryToApi(
    categoryId,
    categoryName,
    categoryColor,
  )
  if (updatedCategory !== null) {
    const categoryId = updatedCategory.id
    const ogCategory = document.querySelector(
      `#categories-elements [data-category-id="${categoryId}"]`,
    )
    if (ogCategory) {
      const ogName = ogCategory.querySelector('.tasktxt')
      if (ogName) {
        ogName.textContent = categoryName
      }
      const ogColor =
        ogCategory.querySelector<HTMLDivElement>('.color-of-category')
      if (ogColor) {
        ogColor.style.backgroundColor = categoryColor
      }
    }
  }
  closePopup()
})

window.addEventListener('load', async () => {
  async function initializeFromApi(
    url: string,
    renderFunc: () => void,
    arr?: Task[] | Category[],
  ) {
    try {
      const resp = await fetch(url, {
        headers: {
          'Content-type': 'application/json',
        },
      })

      if (!resp.ok) {
        throw new Error(`HTTP Error Status: ${resp.status}`)
      }

      if (arr === arrOfTask) {
        const initialized: Task[] = await resp.json()
        arrOfTask.length = 0
        arrOfTask.push(...initialized)
      } else if (arr === arrOfCategories) {
        const initialized: Category[] = await resp.json()
        arrOfCategories.length = 0
        arrOfCategories.push(...initialized)
      }
      renderFunc()
    } catch (error) {
      console.error(error)
      return []
    }
  }
  await initializeFromApi(fetchUrlTodos, renderTodos, arrOfTask)
  await initializeFromApi(fetchUrlCategories, renderCategories, arrOfCategories)

  loadPageInterface()
})

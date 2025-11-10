import { addTodoToStorage } from './services/todosStorage'
import { createCategoryElement } from './UI/createCategoriesEl'
import { createTaskElement } from './UI/createTodosEl'
import { getCurrentDate } from './utils/date'
import { elements } from './utils/dom'
import './style.css'
import {
  addCategoryToStorage,
  arrOfCategories,
  fetchUrlCategories,
  updateCategoryToStorage,
} from './services/categoriesStorage'
import { arrOfTask, fetchUrlTodos } from './services/todosStorage'
import type { Category } from './types/categories'
import type { Task } from './types/task'
import {
  deleteAllCategoriesBtnVisibility,
  renderCategories,
  closePopup,
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
} = elements

const haveDueDate = () => {
  return dateInput.value !== '' ? dateInput.value : 'no due date'
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
    const newTask = await addTodoToStorage(taskText, taskDueDate)
    if (newTask !== null) {
      const id = newTask.id
      const { newTask: newTaskEl, dueDateParagraph } = createTaskElement(
        taskText,
        taskDueDate,
        id,
      )
      tasksList.appendChild(newTaskEl)
      dueDateUrgency(dueDateParagraph, taskDueDate)
      todoInput.value = ''
    }
  }
  deleteAllTodosBtnVisibility()
}

const addCategory = async () => {
  if (categoryNameInput.value.trim() === '') {
  }
  const categoryColor = categoryColorInput.value
  const categoryName = categoryNameInput.value.trim()
  const newCategory = await addCategoryToStorage(categoryName, categoryColor)
  if (newCategory !== null) {
    const categoryId = newCategory.id
    const { newCategory: newCategoryEl } = createCategoryElement(
      categoryId,
      categoryName,
      categoryColor,
    )
    categoriesList.appendChild(newCategoryEl)
    categoryNameInput.value = ''
  }
  deleteAllCategoriesBtnVisibility()
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

categoryInterfaceBtn.addEventListener('click', todoVisibility)

todoInterfaceBtn.addEventListener('click', categoryVisibility)

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePopup()
  }
})

saveCategoryUpdateBtn.addEventListener('click', async () => {
  const categoryColor = categoryColorInput2.value
  const categoryName = categoryNameInput2.value.trim()
  const categoryId = Number(categoryNameInput2.dataset.categoryId)
  const updatedCategory = await updateCategoryToStorage(
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
  async function initializeFromStorage(
    url: string,
    arr: Task[] | Category[],
    renderFunc: () => void,
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
        arrOfTask.push(...initialized)
      } else if (arr === arrOfCategories) {
        const initialized: Category[] = await resp.json()
        arrOfCategories.push(...initialized)
      }
      renderFunc()
    } catch (error) {
      console.error(error)
      return []
    }
  }
  await initializeFromStorage(fetchUrlTodos, arrOfTask, renderTodos)
  await initializeFromStorage(
    fetchUrlCategories,
    arrOfCategories,
    renderCategories,
  )

  loadPageInterface()
})

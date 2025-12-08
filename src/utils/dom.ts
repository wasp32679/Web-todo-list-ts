function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) {
    throw new Error(`Required element not found: ${selector}`)
  }
  return element
}

export const elements = {
  addTodoBtn: getRequiredElement<HTMLButtonElement>('#add-todo-button'),
  todoInput: getRequiredElement<HTMLInputElement>('#todo-input'),
  errorTxt: getRequiredElement<HTMLDivElement>('#errorText'),
  tasksList: getRequiredElement<HTMLUListElement>('#todo-elements'),
  main: getRequiredElement('main'),
  dateInput: getRequiredElement<HTMLInputElement>('#todo-date-input'),
  overdueMessageContainer: getRequiredElement<HTMLDivElement>(
    '#overdue-message-container',
  ),
  addCategoryBtn: getRequiredElement<HTMLButtonElement>('#add-category-button'),
  categoriesList: getRequiredElement<HTMLUListElement>('#categories-elements'),
  categoryNameInput: getRequiredElement<HTMLInputElement>(
    '#category-name-input',
  ),
  categoryNameInput2: getRequiredElement<HTMLInputElement>(
    '#category-name-input-2',
  ),
  categoryColorInput: getRequiredElement<HTMLInputElement>(
    '#category-color-input',
  ),
  categoryColorInput2: getRequiredElement<HTMLInputElement>(
    '#category-color-input-2',
  ),
  categoryInterfaceBtn: getRequiredElement<HTMLButtonElement>(
    '#category-interface',
  ),
  todoInterfaceBtn: getRequiredElement<HTMLButtonElement>('#todo-interface'),
  categorySection: getRequiredElement<HTMLDivElement>('#category-section'),
  categoryUpdatePopop: getRequiredElement<HTMLDivElement>(
    '#edit-category-popup',
  ),
  saveCategoryUpdateBtn: getRequiredElement<HTMLButtonElement>(
    '#update-category-button',
  ),
  overlay: getRequiredElement<HTMLDivElement>('#overlay'),
  selectCategoryMenu: getRequiredElement<HTMLSelectElement>(
    '#select-category-menu',
  ),
}

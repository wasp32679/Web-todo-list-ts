function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) {
    throw new Error(`Required element not found: ${selector}`)
  }
  return element
}

export const elements = {
  addBtn: getRequiredElement<HTMLButtonElement>('#add-todo-button'),
  todoInput: getRequiredElement<HTMLInputElement>('#todo-input'),
  errorTxt: getRequiredElement<HTMLDivElement>('#errorText'),
  tasksList: getRequiredElement<HTMLUListElement>('#todo-elements'),
  main: getRequiredElement('main'),
  dateInput: getRequiredElement<HTMLInputElement>('#todo-date-input'),
  overdueMessageContainer: getRequiredElement<HTMLDivElement>(
    '#overdue-message-container',
  ),
}

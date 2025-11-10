import { elements } from '../utils/dom'

const {
  main,
  categorySection,
  categoryInterfaceBtn,
  todoInterfaceBtn,
  categoryUpdatePopop,
  overlay,
} = elements

const loadBtnStyle = 'loadBtnStyle'

const removeLoadClass = () => {
  if (loadBtnStyle) {
    categoryInterfaceBtn.classList.remove('loadBtnStyle')
    todoInterfaceBtn.classList.remove('loadBtnStyle')
  }
}

export const todoVisibility = () => {
  main.style.display = 'none'
  categorySection.style.display = 'inline-flex'
  removeLoadClass()
}

export const categoryVisibility = () => {
  main.style.display = 'inline-flex'
  categorySection.style.display = 'none'
  removeLoadClass()
}

export const loadPageInterface = () => {
  main.style.display = 'none'
  categorySection.style.display = 'none'
  categoryUpdatePopop.style.display = 'none'
  overlay.style.display = 'none'
  categoryInterfaceBtn.classList.add('loadBtnStyle')
  todoInterfaceBtn.classList.add('loadBtnStyle')
}

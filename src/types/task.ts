export interface Task {
  id: number
  title: string
  content: string
  due_date: string
  done: boolean

  categories_todos?: {
    category_id: number
    categories: {
      title: string
      color: string
    }
  }[]
}

export interface TaskInsert {
  title: string
  content: string
  due_date: string
  done: boolean
}

export interface TaskUpdate {
  id: number
  title?: string
  due_date?: string

  categories_todos?: {
    category_id: number
    categories: {
      title: string
      color: string
    }
  }[]
}

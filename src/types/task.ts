export interface Task {
  id: number
  title: string
  content: string
  due_date: string
  done: boolean
}

export interface TaskInsert {
  title: string
  content: string
  due_date: string
  done: boolean
}

export interface TaskUpdate {
  id: number
  title: string
  content: string
  due_date: string
  done?: boolean
}

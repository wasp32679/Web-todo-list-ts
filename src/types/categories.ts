export interface Category {
  id: number
  title: string
  color: string
}

export interface CategoryInsert {
  title: string
  color: string
}

export interface CategoryUpdate {
  id: number
  title?: string
  color?: string
}

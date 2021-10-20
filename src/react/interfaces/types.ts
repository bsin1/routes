export interface FilterSection {
  title: string
  cells: BooleanFilterCell[]
}

export interface BooleanFilterCell {
  title: string
  value: boolean
  key: string
}

export interface FilterSection {
  title: string
  cells: BooleanFilterCell[]
}

export interface BooleanFilterCell {
  title: string
  value: boolean
  key: string
}

export interface Route {
  name: string
  geojson: any
  selectedNodes: string | null
}

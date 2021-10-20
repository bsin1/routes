import { useEffect, useState } from "react"
import { MapControllerState } from "src/react/interfaces/state"
import { FilterSection } from "src/react/interfaces/types"
import styles from "src/react/styles/MapController.module.css"
import Map from "./Map"
import MapSideMenu from "./MapSideMenu"

const MapController = () => {
  const [filters, setFilters] = useState<FilterSection[]>([
    {
      title: "Ores",
      cells: [
        {
          key: "iron",
          title: "Iron",
          value: false,
        },
        {
          key: "crystal",
          title: "Crystal",
          value: false,
        },
        {
          key: "gold",
          title: "Gold",
          value: false,
        },
        {
          key: "lodestone",
          title: "Lodestone",
          value: false,
        },
        {
          key: "orichalcum",
          title: "Orichalcum",
          value: false,
        },
        {
          key: "platinum",
          title: "Platinum",
          value: false,
        },
        {
          key: "oil",
          title: "Oil",
          value: false,
        },
        {
          key: "silver",
          title: "Silver",
          value: false,
        },
        {
          key: "starmetal",
          title: "Starmetal",
          value: false,
        },
      ],
    },
    {
      title: "Essences",
      cells: [
        {
          key: "air_essence",
          title: "Air Essense",
          value: false,
        },
        {
          key: "water_essence",
          title: "Water Essence",
          value: false,
        },
        {
          key: "earth_essence",
          title: "Earth Essence",
          value: false,
        },
        {
          key: "fire_essence",
          title: "Fire Essence",
          value: false,
        },
        {
          key: "life_essence",
          title: "Life Essence",
          value: false,
        },
        {
          key: "death_essence",
          title: "Death Essence",
          value: false,
        },
        {
          key: "spirit_essence",
          title: "Spirit Essence",
          value: false,
        },
      ],
    },
    {
      title: "Plants",
      cells: [
        {
          key: "hemp",
          title: "Hemp",
          value: false,
        },
        {
          key: "silkweed",
          title: "Silkweed",
          value: false,
        },
        {
          key: "wirefiber",
          title: "Wirefiber",
          value: false,
        },
        {
          key: "broccoli",
          title: "Broccoli",
          value: false,
        },
        {
          key: "blueberry",
          title: "Blueberry",
          value: false,
        },
        {
          key: "barley",
          title: "Barley",
          value: false,
        },
        {
          key: "cabbage",
          title: "Cabbage",
          value: false,
        },
        {
          key: "carrot",
          title: "Carrot",
          value: false,
        },
        {
          key: "corn",
          title: "Corn",
          value: false,
        },
        {
          key: "potato",
          title: "Potato",
          value: false,
        },
        {
          key: "squash",
          title: "Squash",
          value: false,
        },
        {
          key: "strawberry",
          title: "Strawberry",
          value: false,
        },
      ],
    },
  ])

  const onFilterChange = (sectionTitle: string, key: string) => {
    let sectionIndex = filters.findIndex(
      (filter) => filter.title == sectionTitle
    )
    let cellIndex = filters[sectionIndex]?.cells.findIndex(
      (cell) => cell.key == key
    )

    let newCells = [...filters[sectionIndex].cells]
    newCells[cellIndex].value = !newCells[cellIndex].value

    let newFilters = [...filters]
    newFilters[sectionIndex].cells = newCells

    setFilters(newFilters)
  }

  return (
    <div className={styles.MapController}>
      <MapSideMenu filters={filters} onFilterChange={onFilterChange} />
      <div className={styles.MapContentArea}>
        <div className={styles.MapActionBar}>Map Action Bar Here</div>
        <Map filters={filters} />
      </div>
    </div>
  )
}

export default MapController

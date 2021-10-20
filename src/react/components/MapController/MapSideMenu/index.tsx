import { filterProperties } from "@turf/clusters"
import { BooleanFilterCell, FilterSection } from "src/react/interfaces/types"
import styles from "src/react/styles/MapSideMenu.module.css"

interface MapSideMenuProps {
  filters: FilterSection[]
  onFilterChange: (sectionTitle: string, key: string) => void
}

const MapSideMenu = (props: MapSideMenuProps) => {
  const renderFilters = (): JSX.Element[] => {
    return props.filters.map((filter, index) => {
      return (
        <div key={index}>
          <div style={index > 0 ? { marginTop: 20 } : {}}>{filter.title}</div>
          {filter.cells.map((cell, index) => {
            return (
              <div
                key={index}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <div>{cell.title}</div>
                <input
                  type="checkbox"
                  id="topping"
                  name="topping"
                  value="Paneer"
                  checked={cell.value}
                  onChange={() => props.onFilterChange(filter.title, cell.key)}
                />
              </div>
            )
          })}
        </div>
      )
    })
  }

  return <div className={styles.MapSideMenu}>{renderFilters()}</div>
}

export default MapSideMenu

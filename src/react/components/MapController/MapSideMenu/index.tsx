import { FilterSection } from "src/react/interfaces/types"
import styles from "src/react/styles/MapSideMenu.module.css"
import { MapEditingState } from ".."

interface MapSideMenuProps {
  filters: FilterSection[]
  onFilterChange: (sectionTitle: string, key: string) => void
  editingState: MapEditingState
  setEditingState: (editingState: MapEditingState) => void
  setNodesVisibility: (visibility: boolean) => void
}

const MapSideMenu = (props: MapSideMenuProps) => {
  const renderFilters = (): JSX.Element[] => {
    return props.filters.map((filter, index) => {
      return (
        <div key={index} className={styles.FilterSection}>
          <div className={styles.FilterSectionTitle}>{filter.title}</div>
          {filter.cells.map((cell, index) => {
            return (
              <div key={index} className={styles.FilterCell}>
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

  const renderActionContent = (): JSX.Element => {
    switch (props.editingState) {
      case MapEditingState.Blank:
        return (
          <button
            className={styles.ActionButtonGreen}
            type="button"
            onClick={() => props.setEditingState(MapEditingState.Editing)}
          >
            Create Area
          </button>
        )
      case MapEditingState.Editing:
        return (
          <div style={{ whiteSpace: "pre-wrap" }}>
            {"Click to add polygon points.\nDouble click to close the polygon."}
          </div>
        )
      case MapEditingState.Complete:
        return (
          <div className={styles.CompleteContainer}>
            <button
              className={styles.ActionButtonRed}
              type="button"
              onClick={() => props.setEditingState(MapEditingState.Blank)}
            >
              Clear Area
            </button>
          </div>
        )
    }
  }

  const renderLowerContainer = (): JSX.Element => {
    return (
      <div className={styles.LowerButtonContainer}>
        <button
          className={styles.LowerButton}
          type="button"
          onClick={() => props.setNodesVisibility(true)}
        >
          Show All
        </button>
        <button
          className={styles.LowerButton}
          type="button"
          onClick={() => props.setNodesVisibility(false)}
        >
          Hide All
        </button>
      </div>
    )
  }

  return (
    <div className={styles.MapSideMenu}>
      <div className={styles.ActionContainer}>{renderActionContent()}</div>
      <div className={styles.FilterContainer}>{renderFilters()}</div>
      {renderLowerContainer()}
      <div className={styles.FooterContainer}>
        <div className={styles.Footer}>
          {"marker sprites created by     "}
          <a href="https://mapgenie.io/new-world/maps/aeternum">MapGenie</a>
        </div>
        {"\n"}
        <div className={styles.Footer}>
          {"node data from     "}
          <a href="https://www.newworld-map.com">New World Map</a>
        </div>
      </div>
    </div>
  )
}

export default MapSideMenu

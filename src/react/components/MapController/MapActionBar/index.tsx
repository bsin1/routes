import styles from "src/react/styles/MapActionBar.module.css"
import { MapEditingState } from ".."

interface MapActionBarProps {
  editingState: MapEditingState
  setEditingState: (editingState: MapEditingState) => void
}

const MapActionBar = (props: MapActionBarProps) => {
  const renderActionContent = (): JSX.Element => {
    switch (props.editingState) {
      case MapEditingState.Blank:
        return (
          <button
            style={{ width: 100 }}
            type="button"
            onClick={() => props.setEditingState(MapEditingState.Editing)}
          >
            Create Area
          </button>
        )
      case MapEditingState.Editing:
        return (
          <div>
            Click to add polygon points. Double click to close the polygon.
          </div>
        )
      case MapEditingState.Complete:
        return (
          <div className={styles.CompleteContainer}>
            <button
              style={{ width: 100 }}
              type="button"
              onClick={() => props.setEditingState(MapEditingState.Blank)}
            >
              Clear Area
            </button>
          </div>
        )
    }
  }

  return <div className={styles.MapActionBar}>{renderActionContent()}</div>
}

export default MapActionBar

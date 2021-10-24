import styles from "src/react/styles/Overlay.module.css"
import closeIcon from "src/react/styles/images/close.svg"
import { MapEditingState } from "../MapController"

interface OverlayProps {
  children: React.ReactNode
  editingState: MapEditingState
  setEditingState: (state: MapEditingState) => void
}

const Overlay = ({ children, editingState, setEditingState }: OverlayProps) => {
  const closeOverlay = () => {
    switch (editingState) {
      case MapEditingState.Exporting:
      case MapEditingState.Saving:
        setEditingState(MapEditingState.Complete)
        break
      default:
        setEditingState(MapEditingState.Blank)
        break
    }
  }

  return (
    <div className={styles.Overlay}>
      <div className={styles.CloseContainer}>
        <img
          src={closeIcon}
          alt="close"
          title="close"
          className={styles.CloseIcon}
          onClick={closeOverlay}
        />
      </div>

      {children}
    </div>
  )
}

export default Overlay

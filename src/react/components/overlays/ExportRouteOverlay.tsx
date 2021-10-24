import { Route } from "src/react/interfaces/types"
import styles from "src/react/styles/ExportRouteOverlay.module.css"
import Overlay from "../core/Overlay"
import { MapEditingState } from "../MapController"

interface ExportRouteOverlayProps {
  route: Route | null
  editingState: MapEditingState
  setEditingState: (state: MapEditingState) => void
}

const ExportRouteOverlay = ({
  route,
  editingState,
  setEditingState,
}: ExportRouteOverlayProps) => {
  //Buffer.from(code, "base64").toString()
  return (
    <Overlay editingState={editingState} setEditingState={setEditingState}>
      <div className={styles.ExportRouteOverlay}>
        <div className={styles.OverlayTitle}>Export Code</div>
        <div className={styles.CodeContainer}>
          {Buffer.from(JSON.stringify(route)).toString("base64")}
        </div>
      </div>
    </Overlay>
  )
}

export default ExportRouteOverlay

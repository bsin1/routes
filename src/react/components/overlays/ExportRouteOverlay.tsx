import { Route } from "src/react/interfaces/types"
import styles from "src/react/styles/ExportRouteOverlay.module.css"
import Overlay from "../core/Overlay"
import { MapEditingState } from "../MapController"
import { toast } from "react-toastify"

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
  const code = Buffer.from(JSON.stringify(route)).toString("base64")

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    toast.info("Export code copied to clipboard")
  }

  return (
    <Overlay editingState={editingState} setEditingState={setEditingState}>
      <div className={styles.ExportRouteOverlay}>
        <div className={styles.OverlayTitle}>Export Code</div>
        <div className={styles.CodeContainer}>{code}</div>
        <button type="button" onClick={copyCode} className={styles.CopyButton}>
          Copy Code
        </button>
      </div>
    </Overlay>
  )
}

export default ExportRouteOverlay

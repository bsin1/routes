import styles from "src/react/styles/ImportRouteOverlay.module.css"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import Overlay from "../core/Overlay"
import { Route } from "src/react/interfaces/types"
import { MapEditingState } from "../MapController"

interface ImportRouteOverlayProps {
  importRoute: (route: Route) => void
  editingState: MapEditingState
  setEditingState: (state: MapEditingState) => void
}

const ImportRouteOverlay = ({
  importRoute,
  editingState,
  setEditingState,
}: ImportRouteOverlayProps) => {
  const [code, setCode] = useState<string>("")
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value)
  }

  return (
    <Overlay editingState={editingState} setEditingState={setEditingState}>
      <div className={styles.ImportRouteOverlay}>
        <div className={styles.OverlayTitle}>Import Route</div>
        <TextField
          id="standard-basic"
          label="Import code"
          variant="standard"
          multiline
          value={code}
          onChange={handleChange}
          autoFocus
          style={{ width: 400, maxHeight: 400, overflowY: "auto" }}
        />
        <button
          type="button"
          onClick={() =>
            importRoute(JSON.parse(Buffer.from(code, "base64").toString()))
          }
          disabled={code == ""}
          className={styles.ImportButton}
        >
          Import
        </button>
      </div>
    </Overlay>
  )
}

export default ImportRouteOverlay

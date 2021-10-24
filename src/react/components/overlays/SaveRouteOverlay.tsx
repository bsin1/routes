import styles from "src/react/styles/SaveRouteOverlay.module.css"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import Overlay from "../core/Overlay"
import { MapEditingState } from "../MapController"

interface SaveRouteOverlayProps {
  saveRoute: (name: string) => void
  editingState: MapEditingState
  setEditingState: (state: MapEditingState) => void
}

const SaveRouteOverlay = ({
  saveRoute,
  editingState,
  setEditingState,
}: SaveRouteOverlayProps) => {
  const [name, setName] = useState<string>("")
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  return (
    <Overlay editingState={editingState} setEditingState={setEditingState}>
      <div className={styles.SaveRouteOverlay}>
        <div className={styles.OverlayTitle}>Save Route</div>
        <TextField
          id="standard-basic"
          label="Route Name"
          variant="standard"
          value={name}
          onChange={handleChange}
          autoFocus
        />
        <button
          type="button"
          onClick={() => saveRoute(name!)}
          disabled={name == ""}
          className={styles.SaveButton}
        >
          Save
        </button>
      </div>
    </Overlay>
  )
}

export default SaveRouteOverlay

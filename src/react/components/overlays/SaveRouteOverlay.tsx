import styles from "src/react/styles/SaveRouteOverlay.module.css"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import Overlay from "../core/Overlay"

interface SaveRouteOverlayProps {
  saveRoute: (name: string) => void
}

const SaveRouteOverlay = (props: SaveRouteOverlayProps) => {
  const [name, setName] = useState<string>("")
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  return (
    <Overlay>
      <div className={styles.SaveRouteOverlay}>
        <div className={styles.OverlayTitle}>Save Route</div>
        <TextField
          id="standard-basic"
          label="Route Name"
          variant="standard"
          value={name}
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => props.saveRoute(name!)}
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

import styles from "src/react/styles/ImportRouteOverlay.module.css"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import Overlay from "../core/Overlay"
import { Route } from "src/react/interfaces/types"
import { MapEditingState } from "../MapController"
import { toast } from "react-toastify"

interface ImportRouteOverlayProps {
  setNodesVisibility: (visibility: boolean, nodes?: string[]) => void
  setRoute: (route: Route) => void
  editingState: MapEditingState
  setEditingState: (state: MapEditingState) => void
}

const ImportRouteOverlay = ({
  setNodesVisibility,
  setRoute,
  editingState,
  setEditingState,
}: ImportRouteOverlayProps) => {
  const [code, setCode] = useState<string>("")
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value)
  }

  const parseRoute = () => {
    try {
      let data = JSON.parse(Buffer.from(code, "base64").toString())
      if (data && data.geojson && data.selectedNodes && data.filters) {
        setNodesVisibility(true, data.filters)
        setRoute(data)
        setEditingState(MapEditingState.Complete)
      } else {
        toast.error("Route Import Failed")
      }
    } catch (e) {
      toast.error("Route Import Failed")
    }
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
          onClick={parseRoute}
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

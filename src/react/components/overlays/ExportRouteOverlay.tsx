import { Route } from "src/react/interfaces/types"
import styles from "src/react/styles/ExportRouteOverlay.module.css"
import Overlay from "../core/Overlay"

interface ExportRouteOverlayProps {
  route: Route | null
}

const ExportRouteOverlay = ({ route }: ExportRouteOverlayProps) => {
  //Buffer.from(code, "base64").toString()
  return (
    <Overlay>
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

import styles from "src/react/styles/LoadRouteOverlay.module.css"
import TextField from "@mui/material/TextField"
import { useEffect, useState } from "react"
import Overlay from "../../core/Overlay"
import localforage from "localforage"
import { Route } from "src/react/interfaces/types"
import RouteCell from "./RouteCell"
import { MapEditingState } from "../../MapController"

interface LoadRouteOverlayProps {
  loadRoute: (name: string) => void
  editingState: MapEditingState
  setEditingState: (state: MapEditingState) => void
}

const LoadRouteOverlay = ({
  loadRoute,
  editingState,
  setEditingState,
}: LoadRouteOverlayProps) => {
  const [routes, setRoutes] = useState<Route[]>([])

  useEffect(() => {
    loadRoutes()
  }, [])

  const loadRoutes = async () => {
    let routes: Route[] = (await localforage.getItem("routes")) ?? []
    setRoutes(routes)
  }

  const renderRoutes = (): JSX.Element | JSX.Element[] => {
    if (routes.length == 0) {
      return <div>You have no saved routes.</div>
    }
    return routes.map((route, index) => (
      <RouteCell key={index} route={route} loadRoute={loadRoute} />
    ))
  }

  return (
    <Overlay editingState={editingState} setEditingState={setEditingState}>
      <div className={styles.LoadRouteOverlay}>
        <div className={styles.OverlayTitle}>Load Route</div>
        <div className={styles.RoutesContainer}>{renderRoutes()}</div>
      </div>
    </Overlay>
  )
}

export default LoadRouteOverlay

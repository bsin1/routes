import { Route } from "src/react/interfaces/types"
import styles from "src/react/styles/RouteCell.module.css"

interface RouteCellProps {
  loadRoute: (name: string) => void
  route: Route
}

const RouteCell = ({ route, loadRoute }: RouteCellProps) => {
  return (
    <div className={styles.RouteCell}>
      <div className={styles.Title}>{route.name}</div>
      <button type="button" onClick={() => loadRoute(route.name)}>
        Load
      </button>
    </div>
  )
}

export default RouteCell

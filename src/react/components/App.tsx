import React from "react"
import styles from "../styles/App.module.css"
import MapController from "./MapController"

const App = () => {
  return (
    <div className={styles.App}>
      <div className={styles.MainContainer}>
        <MapController />
      </div>
    </div>
  )
}

export default App

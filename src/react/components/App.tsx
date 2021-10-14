import React from "react"
import styles from "../styles/App.module.css"
import Map from "./Map"

const App = () => {
  return (
    <div className={styles.App}>
      <div className={styles.MainContainer}>
        <Map />
      </div>
    </div>
  )
}

export default App

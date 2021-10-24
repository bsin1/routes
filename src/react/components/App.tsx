import React from "react"
import styles from "../styles/App.module.css"
import MapController from "./MapController"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"

const App = () => {
  return (
    <div className={styles.App}>
      <div className={styles.MainContainer}>
        <MapController />
      </div>
      <ToastContainer />
    </div>
  )
}

export default App

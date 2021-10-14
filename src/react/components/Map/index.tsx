import { useEffect } from "react"
import styles from "src/react/styles/MapboxMap.module.css"
import mapboxgl from "mapbox-gl"

const MapboxMap = () => {
  useEffect(() => {
    loadMap()
  }, [])

  const loadMap = () => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN ?? ""
    handleMapLoading(true)
    let container = document.getElementById("main-map")!

    let newMap = new mapboxgl.Map({
      container: container,
      style: "mapbox://styles/mapbox/streets-v11",
      preserveDrawingBuffer: true,
      minZoom: 4,
    })

    !isMobileScreen &&
      newMap.addControl(new mapboxgl.NavigationControl(), "bottom-left")

    newMap.on("load", loadSources)

    newMap.on("dragend", showProperties)

    newMap.on("zoomend", showProperties)

    map.current = newMap
  }

  return (
    <div className={styles.MapboxMap}>
      <div className={styles.MainContainer} id="mainContainer">
        <div className={styles.MapContainer}>
          <div id="main-map" className={styles.Map} />
        </div>
      </div>
    </div>
  )
}

export default MapboxMap

import { useEffect } from "react"
import styles from "src/react/styles/MapboxMap.module.css"
import mapboxgl from "mapbox-gl"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import * as turf from "@turf/turf"
import { BACKEND_ROOT, mapStyle } from "src/react/config/constants"
import { dataGeojson } from "src/react/config/seed"

const MapboxMap = () => {
  let map: mapboxgl.Map
  let markers: mapboxgl.Marker[] = []
  let draw: MapboxDraw
  const defaultLat = 0.04092881639623261
  const defaultLng = 0.08654556598968949
  const defaultZoom = 12.5
  const city = { x: 0.07119048878516902, y: 0.017279328052012866 }

  useEffect(() => {
    console.log("USE EFFECT CALLED")
    loadMap()
  })

  const loadMap = () => {
    console.log("LOAD MAP")

    let token = process.env.REACT_APP_MAPBOX_TOKEN ?? ""
    console.log("GOT TOKEN: ", token)
    mapboxgl.accessToken = token
    let container = document.getElementById("main-map")!

    map = new mapboxgl.Map({
      container: container,
      style: mapStyle,
      preserveDrawingBuffer: true,
    })

    draw = new MapboxDraw()

    map.addControl(draw)

    map.on("draw.create", updateArea)
    // map.on("draw.delete", updateArea)
    // map.on("draw.update", updateArea)

    map.on("load", loadSources)
  }

  const updateArea = (event: any) => {
    console.log("GOT DRAW EVENT: ", event)

    let polygon = event.features[0]
    let selectedMarkers: any[] = []

    //create bounding box from polygon
    let polygonBoundingBox = turf.bbox(polygon)
    let southWest = map.project([polygonBoundingBox[0], polygonBoundingBox[1]])
    let northEast = map.project([polygonBoundingBox[2], polygonBoundingBox[3]])

    // find features within polygon
    let bboxFeatures: any[] = map.queryRenderedFeatures(
      [southWest, northEast]
      // {
      //   layers: ["choropleth"], //Update to use layers in user's map, tested with circle and choropleth
      // }
    )

    console.log("BBOX FEATURES: ", bboxFeatures)

    markers.forEach((marker) => {
      let lnglat = marker.getLngLat()
      if (turf.booleanContains(polygon, turf.point([lnglat.lng, lnglat.lat]))) {
        selectedMarkers.push(marker)
      }
    })

    console.log("MARKERS SIZE: ", markers.length)

    console.log("SELECTED MARKERS SIZE: ", selectedMarkers.length)
    console.log("SELECTED MARKERS: ", selectedMarkers)
  }

  const loadSymbols = () => {
    console.log("LOAD SYMBOLS")
    if (!map) {
      return
    }

    map.addSource("towns", dataGeojson.towns as any)

    map.addSource("iron", dataGeojson.ores.iron as any)

    map.addLayer({
      id: "townPoints",
      type: "symbol",
      source: "towns", // reference the data source
      layout: {
        "icon-allow-overlap": true,
        "icon-image": "outpost", // reference the image
        "icon-size": 1,
      },
    })

    map.addLayer({
      id: "ironPoints",
      type: "symbol",
      source: "iron", // reference the data source
      layout: {
        "icon-image": "iron", // reference the image
        "icon-size": 1,
        "icon-allow-overlap": true,
      },
    })

    // data.ores.iron.forEach((ore, i) => {
    //   if (i < 50) {
    //     let marker = new mapboxgl.Marker({ color: "#ff0000" })
    //       .setLngLat(new mapboxgl.LngLat(ore.x, ore.y))
    //       .addTo(map!)

    //     let markerDiv = marker.getElement()

    //     markerDiv.addEventListener("click", () =>
    //       console.log("CLICKED: ", marker.getLngLat())
    //     )

    //     markers.push(marker)
    //   }
    // })

    console.log("ORIGINAL MARKERS SIZE: ", markers.length)
  }

  const loadSources = () => {
    console.log("LOAD SOURCES")

    console.log("BACKEND ROOT: ", BACKEND_ROOT)

    if (map?.isStyleLoaded() === false) {
      console.log("STYLE NOT YET LOADED")
      setTimeout(() => {
        loadSources()
      }, 250)
    } else {
      loadSymbols()
      zoomToMapRegion(defaultLat, defaultLng, defaultZoom)
    }
  }

  const zoomToMapRegion = (
    latitude: number,
    longitude: number,
    zoom: number
  ) => {
    map?.flyTo({
      center: new mapboxgl.LngLat(longitude, latitude),
      zoom: zoom,
    })

    setTimeout(() => {
      console.log("CURRENT ZOOM: ", map?.getZoom())
    }, 5000)
  }

  return (
    <div className={styles.MapboxMap}>
      <div className={styles.MapContainer}>
        <div id="main-map" className={styles.Map} />
      </div>
    </div>
  )
}

export default MapboxMap

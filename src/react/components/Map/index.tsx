import { useEffect } from "react"
import styles from "src/react/styles/MapboxMap.module.css"
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "mapbox-gl"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import * as turf from "@turf/turf"
import { BACKEND_ROOT, mapStyle } from "src/react/config/constants"
import { dataGeojson } from "src/react/config/seed"

// eslint-disable-next-line import/no-webpack-loader-syntax
;(mapboxgl as any).workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default

const MapboxMap = () => {
  let map: mapboxgl.Map
  let markers: mapboxgl.Marker[] = []
  let draw: MapboxDraw
  const defaultLat = 0.04092881639623261
  const defaultLng = 0.08654556598968949
  const defaultZoom = 12.5

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

    let air = dataGeojson.essences.air_boid
    air.data.features.concat(dataGeojson.essences.air_plant.data.features)
    air.data.features.concat(dataGeojson.essences.air_stone.data.features)

    let fire = dataGeojson.essences.fire_boid
    fire.data.features.concat(dataGeojson.essences.fire_plant.data.features)
    fire.data.features.concat(dataGeojson.essences.fire_stone.data.features)

    let water = dataGeojson.essences.water_boid
    water.data.features.concat(dataGeojson.essences.water_plant.data.features)
    water.data.features.concat(dataGeojson.essences.water_stone.data.features)

    let earth = dataGeojson.essences.earth_boid
    earth.data.features.concat(dataGeojson.essences.earth_plant.data.features)
    earth.data.features.concat(dataGeojson.essences.earth_stone.data.features)

    let death = dataGeojson.essences.death_boid
    death.data.features.concat(dataGeojson.essences.death_plant.data.features)
    death.data.features.concat(dataGeojson.essences.death_stone.data.features)

    let life = dataGeojson.essences.life_boid
    life.data.features.concat(dataGeojson.essences.life_plant.data.features)
    life.data.features.concat(dataGeojson.essences.life_stone.data.features)

    let soul = dataGeojson.essences.soul_boid
    soul.data.features.concat(dataGeojson.essences.soul_plant.data.features)
    soul.data.features.concat(dataGeojson.essences.soul_stone.data.features)

    let mapData = [
      { imageId: "outpost", data: dataGeojson.towns },
      { imageId: "iron", data: dataGeojson.ores.iron },
      {
        imageId: "crystal",
        data: dataGeojson.ores.crystal,
      },
      {
        imageId: "gold",
        data: dataGeojson.ores.gold,
      },
      {
        imageId: "lodestone",
        data: dataGeojson.ores.lodestone,
      },
      {
        imageId: "orichalcum",
        data: dataGeojson.ores.orichalcum,
      },
      {
        imageId: "platinium",
        data: dataGeojson.ores.platinium,
      },
      {
        imageId: "oil",
        data: dataGeojson.ores.seeping_stone,
      },
      {
        imageId: "silver",
        data: dataGeojson.ores.silver,
      },
      {
        imageId: "starmetal",
        data: dataGeojson.ores.starmetal,
      },
      {
        imageId: "air_essence",
        data: air,
      },
      {
        imageId: "water_essence",
        data: water,
      },
      {
        imageId: "earth_essence",
        data: earth,
      },
      {
        imageId: "fire_essence",
        data: fire,
      },
      {
        imageId: "life_essence",
        data: life,
      },
      {
        imageId: "death_essence",
        data: death,
      },
      {
        imageId: "soul_essence",
        data: soul,
      },
      {
        imageId: "hemp",
        data: dataGeojson.plants.hemp,
      },
      {
        imageId: "silkweed",
        data: dataGeojson.plants.hemp_t4,
      },
      {
        imageId: "wirefiber",
        data: dataGeojson.plants.hemp_t5,
      },
      {
        imageId: "broccoli",
        data: dataGeojson.plants.broccoli,
      },
      {
        imageId: "blueberry",
        data: dataGeojson.plants.blueberry,
      },
      {
        imageId: "barley",
        data: dataGeojson.plants.barley,
      },
      {
        imageId: "cabbage",
        data: dataGeojson.plants.cabbage,
      },
      {
        imageId: "carrot",
        data: dataGeojson.plants.carrot,
      },
      {
        imageId: "corn",
        data: dataGeojson.plants.corn,
      },
      {
        imageId: "potato",
        data: dataGeojson.plants.potato,
      },
      {
        imageId: "squash",
        data: dataGeojson.plants.squash,
      },
      {
        imageId: "strawberry",
        data: dataGeojson.plants.strawberries,
      },
    ]

    mapData.forEach((item) => {
      map.addSource(item.imageId, item.data as any)
      map.addLayer({
        id: `${item.imageId}_points`,
        type: "symbol",
        source: item.imageId, // reference the data source
        layout: {
          "icon-allow-overlap": true,
          "icon-image": item.imageId, // reference the image
          "icon-size": 1,
        },
      })
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

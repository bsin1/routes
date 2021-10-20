import { useEffect, useRef, useState } from "react"
import styles from "src/react/styles/Map.module.css"
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "mapbox-gl"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import * as turf from "@turf/turf"
import { BACKEND_ROOT, mapStyle } from "src/react/config/constants"
import { dataGeojson } from "src/react/config/seed"
import { FilterSection } from "src/react/interfaces/types"
;(mapboxgl as any).workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default

interface MapProps {
  filters: FilterSection[]
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

let layers = [
  // "outpost_points",
  "iron_points",
  "crystal_points",
  "gold_points",
  "lodestone_points",
  "orichalcum_points",
  "platinum_points",
  "oil_points",
  "silver_points",
  "starmetal_points",
  "air_essence_points",
  "water_essence_points",
  "earth_essence_points",
  "fire_essence_points",
  "life_essence_points",
  "death_essence_points",
  "soul_essence_points",
  "hemp_points",
  "silkweed_points",
  "wirefiber_points",
  "broccoli_points",
  "blueberry_points",
  "barley_points",
  "cabbage_points",
  "carrot_points",
  "corn_points",
  "potatoe_points",
  "squash_points",
  "strawberry_points",
]

//   map.addLayer({
//     id: `${item.imageId}_points`,
//     type: "symbol",
//     source: item.imageId, // reference the data source
//     layout: {
//       "icon-allow-overlap": true,
//       "icon-image": item.imageId, // reference the image
//       "icon-size": 1,
//     },
//   })

const Map = ({ filters }: MapProps) => {
  const map = useRef<mapboxgl.Map | null>(null)
  let draw: MapboxDraw
  const defaultLat = 0.04092881639623261
  const defaultLng = 0.08654556598968949
  const defaultZoom = 12.5

  useEffect(() => {
    console.log("USE EFFECT CALLED")
    loadMap()
  }, [])

  useEffect(() => {
    updateLayers()
  }, [filters])

  const clearLayers = () => {
    console.log("MAP: ", map)
    layers.forEach((layer) => {
      if (map.current?.getLayer(layer) !== undefined) {
        map.current?.removeLayer(layer)
      }
    })
  }

  const loadMap = () => {
    console.log("LOAD MAP")

    let token = process.env.REACT_APP_MAPBOX_TOKEN ?? ""
    console.log("GOT TOKEN: ", token)
    mapboxgl.accessToken = token
    let container = document.getElementById("main-map")!

    let newMap = new mapboxgl.Map({
      container: container,
      style: mapStyle,
      preserveDrawingBuffer: true,
    })

    draw = new MapboxDraw()

    newMap.addControl(draw)

    newMap.on("draw.create", updateArea)
    // map.on("draw.delete", updateArea)
    // map.on("draw.update", updateArea)

    newMap.on("load", loadSymbols)
    map.current = newMap
  }

  const updateArea = (event: any) => {
    console.log("GOT DRAW EVENT: ", event)

    let polygon = event.features[0]
    let selectedMarkers: any[] = []

    //create bounding box from polygon
    let polygonBoundingBox = turf.bbox(polygon)
    let southWest = map.current?.project([
      polygonBoundingBox[0],
      polygonBoundingBox[1],
    ])
    let northEast = map.current?.project([
      polygonBoundingBox[2],
      polygonBoundingBox[3],
    ])

    // find features within polygon
    // let bboxFeatures: any[] = map?.queryRenderedFeatures(
    //   [southWest, northEast]
    //   // {
    //   //   layers: ["choropleth"], //Update to use layers in user's map, tested with circle and choropleth
    //   // }
    // )

    //console.log("BBOX FEATURES: ", bboxFeatures)

    // markers.forEach((marker) => {
    //   let lnglat = marker.getLngLat()
    //   if (turf.booleanContains(polygon, turf.point([lnglat.lng, lnglat.lat]))) {
    //     selectedMarkers.push(marker)
    //   }
    // })

    // console.log("MARKERS SIZE: ", markers.length)

    console.log("SELECTED MARKERS SIZE: ", selectedMarkers.length)
    console.log("SELECTED MARKERS: ", selectedMarkers)
  }

  const loadSymbols = () => {
    console.log("LOAD SYMBOLS")
    if (map.current?.isStyleLoaded() === false) {
      console.log("STYLE NOT YET LOADED")
      setTimeout(() => {
        loadSymbols()
      }, 250)
    } else {
      if (!map) {
        return
      }

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
          imageId: "platinum",
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
          imageId: "potatoe",
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
        map.current?.addSource(item.imageId, item.data as any)
      })

      map.current?.addLayer({
        id: `outpost_points`,
        type: "symbol",
        source: "outpost", // reference the data source
        layout: {
          "icon-allow-overlap": true,
          "icon-image": "outpost", // reference the image
          "icon-size": 1,
        },
      })

      updateLayers()
      zoomToMapRegion(defaultLat, defaultLng, defaultZoom)
    }

    // let geojson = {
    //   type: "geojson",
    //   data: {
    //     type: "FeatureCollection",
    //     features: [
    //       {
    //         type: "Feature",
    //         geometry: {
    //           type: "LineString",
    //           coordinates: [
    //             [0.08592853188624586, 0.056859315065987175],
    //             [0.07119048878516902, 0.017279328052012866],
    //           ],
    //         },
    //       },
    //     ],
    //   },
    // }

    // map.addSource("line", geojson as any)
    // map.addLayer({
    //   id: "route",
    //   type: "line",
    //   source: "line",
    //   layout: {
    //     "line-join": "round",
    //     "line-cap": "round",
    //   },
    //   paint: {
    //     "line-color": "#ff0000",
    //     "line-width": 5,
    //   },
    // })

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
  }

  const updateLayers = () => {
    clearLayers()

    filters.forEach((filter) => {
      filter.cells.forEach((cell) => {
        if (cell.value) {
          map.current?.addLayer({
            id: `${cell.key}_points`,
            type: "symbol",
            source: cell.key, // reference the data source
            layout: {
              "icon-allow-overlap": true,
              "icon-image": cell.key, // reference the image
              "icon-size": 1,
            },
          })
        }
      })
    })
  }

  const zoomToMapRegion = (
    latitude: number,
    longitude: number,
    zoom: number
  ) => {
    map.current?.flyTo({
      center: new mapboxgl.LngLat(longitude, latitude),
      zoom: zoom,
    })

    setTimeout(() => {
      console.log("CURRENT ZOOM: ", map.current?.getZoom())
    }, 5000)
  }

  return (
    // <div className={styles.MapContainer}>
    <div id="main-map" className={styles.Map} />
    // </div>
  )
}

export default Map

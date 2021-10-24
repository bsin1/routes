import { useEffect, useRef, useState } from "react"
import styles from "src/react/styles/Map.module.css"
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "mapbox-gl"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import * as turf from "@turf/turf"
import { mapStyle } from "src/react/config/constants"
import { dataGeojson } from "src/react/config/seed"
import { FilterSection, Route } from "src/react/interfaces/types"
import { MapEditingState } from ".."
import _ from "lodash"
;(mapboxgl as any).workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default

interface MapProps {
  filters: FilterSection[]
  editingState: MapEditingState
  setEditingState: (editingState: MapEditingState) => void
  setRoute: (route: any) => void
  route: Route | null
  // selectedNodes: string | null
  // setSelectedNodes: (selectedNodes: string) => void
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
  "spirit_essence_points",
  "hemp_points",
  "silkweed_points",
  "wirefiber_points",
  "broccoli_points",
  "blueberry_points",
  "barley_points",
  "cabbage_points",
  "carrot_points",
  "corn_points",
  "potato_points",
  "squash_points",
  "strawberry_points",
]

const Map = ({
  filters,
  editingState,
  setEditingState,
  route,
  setRoute,
}: MapProps) => {
  const map = useRef<mapboxgl.Map | null>(null)
  const draw = useRef<MapboxDraw | null>(null)
  const defaultLat = 0.04092881639623261
  const defaultLng = 0.08654556598968949
  const defaultZoom = 12.5

  useEffect(() => {
    loadMap()
  }, [])

  useEffect(() => {
    updateLayers()
  }, [filters])

  useEffect(() => {
    updateEditingState()
  }, [editingState])

  useEffect(() => {
    renderRoute()
  }, [route])

  const updateEditingState = () => {
    switch (editingState) {
      case MapEditingState.Editing: {
        draw.current?.changeMode("draw_polygon")
        break
      }
      case MapEditingState.Blank: {
        draw.current?.deleteAll()
        break
      }
    }
  }

  const clearLayers = () => {
    layers.forEach((layer) => {
      if (map.current?.getLayer(layer) !== undefined) {
        map.current?.removeLayer(layer)
      }
    })
  }

  const loadMap = () => {
    let token = process.env.REACT_APP_MAPBOX_TOKEN ?? ""
    mapboxgl.accessToken = token
    let container = document.getElementById("main-map")!

    let newMap = new mapboxgl.Map({
      container: container,
      style: mapStyle,
      preserveDrawingBuffer: true,
    })

    const NewSimpleSelect = _.extend(MapboxDraw.modes.SIMPLE_SELECT, {
      dragMove() {},
      toDisplayFeatures(state: any, geojson: any, display: any) {
        display(geojson)
      },
    })

    const NewDirectSelect = _.extend(MapboxDraw.modes.DIRECT_SELECT, {
      dragFeature() {},
    })

    let newDraw = new MapboxDraw({
      modes: {
        ...MapboxDraw.modes,
        simple_select: NewSimpleSelect,
        direct_select: NewDirectSelect,
      },
      displayControlsDefault: false,
    })

    newMap.addControl(newDraw)

    newMap.on("draw.create", updateArea)

    newMap.on("load", loadSymbols)

    map.current = newMap
    draw.current = newDraw
  }

  const updateArea = (event: any) => {
    let polygon = event.features[0]

    //create bounding box from polygon
    let polygonBoundingBox = turf.bbox(polygon)

    // find features within polygon
    if (map.current) {
      let southWest = map.current?.project([
        polygonBoundingBox[0],
        polygonBoundingBox[1],
      ])
      let northEast = map.current?.project([
        polygonBoundingBox[2],
        polygonBoundingBox[3],
      ])

      let activeLayers = layers.filter(
        (layer) => map.current?.getLayer(layer) !== undefined
      )

      activeLayers = [...activeLayers, "outpost_points"]

      let selectedFeatures: any[] = map.current
        .queryRenderedFeatures([southWest, northEast], {
          layers: activeLayers,
        })
        .filter((item) => {
          let coordinates = (item.geometry as any).coordinates
          return turf.booleanContains(polygon, turf.point(coordinates))
        })

      let coordinates = selectedFeatures.map(
        (item) => (item.geometry as any).coordinates
      )

      let orderedCords: any[] = []

      orderedCords.push(coordinates.pop())

      while (coordinates.length) {
        let node = orderedCords[orderedCords.length - 1]
        let shortest = 9999999999
        let index = -1

        coordinates.forEach((coordinate, i) => {
          let xdiff = Math.abs(node[0] - coordinate[0])
          let ydiff = Math.abs(node[1] - coordinate[1])
          let weight = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2))

          if (weight < shortest) {
            shortest = weight
            index = i
          }
        })

        if (index != -1) {
          let removed = coordinates.splice(index, 1)
          orderedCords.push(removed[0])
        }
      }

      let nodesByType = selectedFeatures.reduce((result, item) => {
        let source = item.layer.source
        if (!(source in result)) {
          result[source] = 1
        } else {
          result[source] += 1
        }
        return result
      }, {})

      let selectedNodesString = Object.entries(nodesByType)
        .map((item) => `${item[0]}: ${item[1]}`)
        .join("\n")

      let geojson = {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: orderedCords,
              },
            },
          ],
        },
      }

      let newRoute: Route = {
        name: "New Route",
        selectedNodes: `Selected Nodes\n${selectedNodesString}`,
        geojson: geojson,
      }

      setRoute(newRoute)
      setEditingState(MapEditingState.Complete)
      //setSelectedNodes(`Selected Nodes\n${selectedNodesString}`)
    }
  }

  const loadSymbols = () => {
    if (map.current?.isStyleLoaded() === false) {
      setTimeout(() => {
        loadSymbols()
      }, 250)
    } else {
      if (!map) {
        return
      }

      //draw.current?.changeMode("static")

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
          imageId: "spirit_essence",
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
        map.current?.addSource(item.imageId, item.data as any)
      })

      map.current?.addLayer(
        {
          id: `outpost_points`,
          type: "symbol",
          source: "outpost", // reference the data source
          layout: {
            "icon-allow-overlap": true,
            "icon-image": "outpost", // reference the image
            "icon-size": 1,
          },
        },
        "gl-draw-polygon-fill-inactive.cold"
      )

      updateLayers()
      zoomToMapRegion(defaultLat, defaultLng, defaultZoom)
    }
  }

  const updateLayers = () => {
    clearLayers()

    filters.forEach((filter) => {
      filter.cells.forEach((cell) => {
        if (cell.value) {
          map.current?.addLayer(
            {
              id: `${cell.key}_points`,
              type: "symbol",
              source: cell.key, // reference the data source
              layout: {
                "icon-allow-overlap": true,
                "icon-image": cell.key, // reference the image
                "icon-size": 1,
              },
            },
            "gl-draw-polygon-fill-inactive.cold"
          )
        }
      })
    })
  }

  const renderRoute = () => {
    if (route) {
      map.current?.addSource("route", route.geojson as any)
      map.current?.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff0000",
          "line-width": 5,
        },
      })
      // let activeLayers = layers.filter(
      //   (layer) => map.current?.getLayer(layer) !== undefined
      // )
      // activeLayers = [...activeLayers, "outpost_points"]
      // activeLayers.forEach((layer) => {
      //   map.current?.moveLayer("route", layer)
      // })
    } else {
      if (map.current?.getLayer("route") !== undefined) {
        map.current?.removeLayer("route")
      }
      if (map.current?.getSource("route") !== undefined) {
        map.current?.removeSource("route")
      }
    }
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
    <div id="main-map" className={styles.Map}>
      {route?.selectedNodes != null && (
        <div className={styles.SelectedNodes}>{route.selectedNodes}</div>
      )}
    </div>
  )
}

export default Map

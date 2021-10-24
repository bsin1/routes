import { useEffect, useState } from "react"
import { FilterSection, Route } from "src/react/interfaces/types"
import styles from "src/react/styles/MapController.module.css"
import Map from "./Map"
import MapSideMenu from "./MapSideMenu"
import Overlay from "src/react/components/core/Overlay"
import SaveRouteOverlay from "../overlays/SaveRouteOverlay"
import localforage from "localforage"
import { toast } from "react-toastify"
import LoadRouteOverlay from "../overlays/LoadRouteOverlay"

export enum MapEditingState {
  Blank = "BLANK", // No polygon created or loaded
  Editing = "EDITING", // Polygon being drawn
  Complete = "COMPLETE", // Polygon drawn or loaded and is visible
  Saving = "SAVING", // Saving a drawn polygon.  Overlay visible.
  Loading = "LOADING", // Loading a saved polygon.  Overlay visible
}

const MapController = () => {
  const [route, setRoute] = useState<any | null>(null)
  const [editingState, setEditingState] = useState<MapEditingState>(
    MapEditingState.Blank
  )
  const [selectedNodes, setSelectedNodes] = useState<string | null>(null)

  useEffect(() => {
    if (editingState === MapEditingState.Blank) {
      setRoute(null)
      setSelectedNodes(null)
    }
  }, [editingState])

  const [filters, setFilters] = useState<FilterSection[]>([
    {
      title: "Ores",
      cells: [
        {
          key: "iron",
          title: "Iron",
          value: false,
        },
        {
          key: "crystal",
          title: "Crystal",
          value: false,
        },
        {
          key: "gold",
          title: "Gold",
          value: false,
        },
        {
          key: "lodestone",
          title: "Lodestone",
          value: false,
        },
        {
          key: "orichalcum",
          title: "Orichalcum",
          value: false,
        },
        {
          key: "platinum",
          title: "Platinum",
          value: false,
        },
        {
          key: "oil",
          title: "Oil",
          value: false,
        },
        {
          key: "silver",
          title: "Silver",
          value: false,
        },
        {
          key: "starmetal",
          title: "Starmetal",
          value: false,
        },
      ],
    },
    {
      title: "Essences",
      cells: [
        {
          key: "air_essence",
          title: "Air Essense",
          value: false,
        },
        {
          key: "water_essence",
          title: "Water Essence",
          value: false,
        },
        {
          key: "earth_essence",
          title: "Earth Essence",
          value: false,
        },
        {
          key: "fire_essence",
          title: "Fire Essence",
          value: false,
        },
        {
          key: "life_essence",
          title: "Life Essence",
          value: false,
        },
        {
          key: "death_essence",
          title: "Death Essence",
          value: false,
        },
        {
          key: "spirit_essence",
          title: "Spirit Essence",
          value: false,
        },
      ],
    },
    {
      title: "Plants",
      cells: [
        {
          key: "hemp",
          title: "Hemp",
          value: false,
        },
        {
          key: "silkweed",
          title: "Silkweed",
          value: false,
        },
        {
          key: "wirefiber",
          title: "Wirefiber",
          value: false,
        },
        {
          key: "broccoli",
          title: "Broccoli",
          value: false,
        },
        {
          key: "blueberry",
          title: "Blueberry",
          value: false,
        },
        {
          key: "barley",
          title: "Barley",
          value: false,
        },
        {
          key: "cabbage",
          title: "Cabbage",
          value: false,
        },
        {
          key: "carrot",
          title: "Carrot",
          value: false,
        },
        {
          key: "corn",
          title: "Corn",
          value: false,
        },
        {
          key: "potato",
          title: "Potato",
          value: false,
        },
        {
          key: "squash",
          title: "Squash",
          value: false,
        },
        {
          key: "strawberry",
          title: "Strawberry",
          value: false,
        },
      ],
    },
  ])

  const onFilterChange = (sectionTitle: string, key: string) => {
    let sectionIndex = filters.findIndex(
      (filter) => filter.title == sectionTitle
    )
    let cellIndex = filters[sectionIndex]?.cells.findIndex(
      (cell) => cell.key == key
    )

    let newCells = [...filters[sectionIndex].cells]
    newCells[cellIndex].value = !newCells[cellIndex].value

    let newFilters = [...filters]
    newFilters[sectionIndex].cells = newCells

    setFilters(newFilters)
  }

  const setNodesVisibility = (visibility: boolean) => {
    let newFilters = filters.map((filter) => {
      let newCells = filter.cells.map((cell) => {
        return { ...cell, value: visibility }
      })
      return {
        title: filter.title,
        cells: newCells,
      }
    })
    setFilters(newFilters)
  }

  const saveRoute = async (name: string) => {
    console.log("SAVE ROUTE TO STORAGE: ", name)

    let newRoute: Route = {
      name: name,
      geojson: route,
      selectedNodes: selectedNodes,
    }

    let routes: Route[] = (await localforage.getItem("routes")) ?? []
    let index = routes.findIndex((route) => route.name === name)
    if (index == -1) {
      routes.push(newRoute)
    } else {
      routes[index] = newRoute
    }

    await localforage.setItem("routes", routes)
    toast.success("Route saved successfully")
    setEditingState(MapEditingState.Complete)
  }

  const loadRoute = async (name: string) => {
    console.log("LOAD ROUTE FROM STORAGE: ", name)
    let routes: Route[] = (await localforage.getItem("routes")) ?? []
    let route = routes.find((route) => route.name == name)
    if (route) {
      setSelectedNodes(route.selectedNodes)
      setRoute(route.geojson)
      setEditingState(MapEditingState.Complete)
    }
  }

  return (
    <div className={styles.MapController}>
      {editingState === MapEditingState.Saving && (
        <SaveRouteOverlay saveRoute={saveRoute} />
      )}
      {editingState === MapEditingState.Loading && (
        <LoadRouteOverlay loadRoute={loadRoute} />
      )}
      <MapSideMenu
        filters={filters}
        onFilterChange={onFilterChange}
        editingState={editingState}
        setEditingState={setEditingState}
        setNodesVisibility={setNodesVisibility}
      />
      <div className={styles.MapContentArea}>
        <Map
          filters={filters}
          editingState={editingState}
          setEditingState={setEditingState}
          setRoute={setRoute}
          route={route}
          selectedNodes={selectedNodes}
          setSelectedNodes={setSelectedNodes}
        />
      </div>
    </div>
  )
}

export default MapController

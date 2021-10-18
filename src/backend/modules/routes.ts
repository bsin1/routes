import fs from "fs"
import readline from "readline"
import * as turf from "@turf/turf"

interface Coordinate {
  x: number
  y: number
}

export const appStart = async () => {
  let data = fs.readFileSync("seed/data.json")
  let json = JSON.parse(data.toString())
  let city = json.pois.cutlass_keys.d1r
  let cityCord: Coordinate = { x: city.x, y: city.y }

  let keys = ["chests", "essences", "ores", "plants", "woods", "pois"]

  let ores: Coordinate[] = Object.values(json.ores.iron)

  /* ORDER ORES USING SHORTEST PATH */
  let orderedOres: Coordinate[] = []

  // orderedOres.push(cityCord)

  // console.log("ORES LENGTH: ", ores.length)

  // while (ores.length) {
  //   let node = orderedOres[orderedOres.length - 1]
  //   let shortest = 9999999999
  //   let index = -1

  //   ores.forEach((ore, i) => {
  //     let xdiff = Math.abs(node.x - ore.x)
  //     let ydiff = Math.abs(node.y - ore.y)

  //     let weight = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2))

  //     if (weight < shortest) {
  //       shortest = weight
  //       index = i
  //     }
  //   })

  //   if (index != -1) {
  //     let removed = ores.splice(index, 1)
  //     orderedOres.push({
  //       x: removed[0].x,
  //       y: removed[0].y,
  //     })
  //   } else {
  //     console.log("INDEX IS -1")
  //     console.log("ORES LENGTH: ", ores.length)
  //   }
  // }

  // orderedOres.push(cityCord)

  /***  CONVERT DATA TO WGS84 COORDINATE SYSTEM  ***/
  let wgsData: any = keys.reduce((result, key) => {
    result[key] = Object.entries(json[key]).reduce((result, item) => {
      let value: any = item[1]
      result[item[0]] = Object.values(value).reduce(
        (result: any, item: any) => {
          if (key == "pois" && item.name.includes("ui_poi_town") == false) {
            return result
          }
          let point = turf.point([item.y, item.x])
          let converted = turf.toWgs84(point)
          result.data.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                converted.geometry.coordinates[1],
                converted.geometry.coordinates[0],
              ],
            },
            properties: {},
          })
          return result
        },
        {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        }
      )
      return result
    }, {} as any)
    return result
  }, {} as any)

  wgsData.towns = Object.values(wgsData.pois).reduce(
    (result: any, item: any) => {
      if (item.data.features.length > 0) {
        result.data.features.push(item.data.features[0])
      }
      return result
    },
    {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    }
  )
  delete wgsData.pois

  /***  OUTPUT WGS84 CONVERTED ORES TO FILE TO CONSUME ON FRONT END  ***/
  fs.writeFileSync("./output.json", JSON.stringify(wgsData))
}

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

  let keys = ["chests", "essences", "ores", "plants", "woods", "pois"]

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

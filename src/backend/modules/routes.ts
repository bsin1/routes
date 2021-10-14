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
  let ores: Coordinate[] = Object.values(json.ores.iron)

  /* MAP GENIE  */
  // let data = fs.readFileSync("seed/mapgenie_data.json")
  // let locationList: any[] = JSON.parse(data.toString())
  // let ores: Coordinate[] = locationList
  //   .filter((item) => item.title.includes("Iron"))
  //   .map((item) => {
  //     return { x: item.latitude, y: item.longitude }
  //   })

  /* SELECTED NWDB NODES */
  // let reader = readline.createInterface({
  //   input: fs.createReadStream("seed/selected_nodes.csv"),
  // })
  // await new Promise((resolve, reject) => {
  //   reader.on("line", (text) => {
  //     console.log("GOT LINE: ", text)
  //     let split = text.split(",")
  //     ores.push({ x: parseFloat(split[0]), y: parseFloat(split[1]) })
  //   })
  //   reader.on("close", resolve)
  // })

  //let cityCord: Coordinate = { x: 7924.891, y: 1923.526 }

  // let cityCord: Coordinate = {
  //   x: 0.42279505170039,
  //   y: -0.81320934842705,
  // }
  let orderedOres: Coordinate[] = []

  orderedOres.push(cityCord)

  //let end = city

  console.log("ORES LENGTH: ", ores.length)

  while (ores.length) {
    let node = orderedOres[orderedOres.length - 1]
    let shortest = 9999999999
    let index = -1

    ores.forEach((ore, i) => {
      let xdiff = Math.abs(node.x - ore.x)
      let ydiff = Math.abs(node.y - ore.y)

      let weight = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2))

      if (weight < shortest) {
        shortest = weight
        index = i
      }
    })

    if (index != -1) {
      let removed = ores.splice(index, 1)
      orderedOres.push({
        x: removed[0].x,
        y: removed[0].y,
      })
    } else {
      console.log("INDEX IS -1")
      console.log("ORES LENGTH: ", ores.length)
    }
  }

  orderedOres.push(cityCord)

  let wgsOres: Coordinate[] = orderedOres.map((ore) => {
    let point = turf.point([ore.y, ore.x])
    let converted = turf.toWgs84(point)
    return {
      x: converted.geometry.coordinates[1],
      y: converted.geometry.coordinates[0],
    }
  })

  let writeStream = fs.createWriteStream("output.csv")

  wgsOres.forEach((ore, index) => {
    writeStream.write(`${ore.x},${ore.y}\n`)
  })
  writeStream.end()

  writeStream = fs.createWriteStream("output.json")
  writeStream.write("[")
  wgsOres.forEach((ore, index) => {
    writeStream.write(`{ x: ${ore.x}, y: ${ore.y} },\n`)
  })
  writeStream.write("]")
  writeStream.end()

  console.log("DONE")
}

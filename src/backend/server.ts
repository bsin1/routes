import express from "express"
import * as http from "http"
import { applyMiddleware } from "graphql-middleware"
import { appStart } from "./modules/routes"
import { markers } from "./config/constants"
import { applyCors } from "./config/cors"
import path from "path"

const isHeroku = process.env.NODE_ENV === "production"
const port = isHeroku ? process.env.PORT : 3001

const app = express()

app.get("/", function (req, res, next) {
  //res.send("LANDING HERE")
  res.sendFile(path.resolve(__dirname + "/../reactApp/index.html"))
})

app.get("/markers.png", function (_, res) {
  res.header("Access-Control-Allow-Origin", "*")
  res.sendFile(__dirname + "/../resources/markers.png")
})

app.get("/markers.json", function (_, res) {
  res.header("Access-Control-Allow-Origin", "*")
  res.send(JSON.stringify(markers))
})

//force restart on sigterm
process.on("SIGTERM", function () {
  process.exit(0)
})

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)")
  // some other closing procedures go here
  process.exit(1)
})

//await server.start()

app.use(express.json({ limit: "50mb" }))

app.use(express.static(path.resolve(__dirname + "/../resources")))

app.use(express.static(path.resolve(__dirname + "/../reactApp")))

app.use(express.static(path.resolve(__dirname + "/public")))
app.use(express.static(path.resolve(__dirname + "/resources")))

applyCors(app)

//server.applyMiddleware({ app })

console.log(`🚀 Server ready at http://localhost:${port}`)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  //appStart()
})

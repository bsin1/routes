import express from "express"
import * as http from "http"
import { applyMiddleware } from "graphql-middleware"
import { appStart } from "./modules/routes"
import { markers } from "./config/constants"
import { applyCors } from "./config/cors"
import path from "path"

const isProduction = process.env.NODE_ENV === "production"
const port = isProduction ? process.env.PORT : 3001

const app = express()

app.get("/", function (req, res, next) {
  res.sendFile(path.resolve(__dirname + "/../reactApp/index.html"))
})

app.get("/markers.png", function (_, res) {
  res.header("Access-Control-Allow-Origin", "*")
  res.sendFile(path.resolve("src/backend/resources/markers.png"))
})

app.get("/markers.json", function (_, res) {
  res.header("Access-Control-Allow-Origin", "*")
  res.send(JSON.stringify(markers))
})

app.get("/markers@2x.png", function (_, res) {
  res.header("Access-Control-Allow-Origin", "*")
  res.sendFile(path.resolve("src/backend/resources/markers.png"))
})

app.get("/markers@2x.json", function (_, res) {
  res.header("Access-Control-Allow-Origin", "*")
  res.send(JSON.stringify(markers))
})

//force restart on sigterm
process.on("SIGTERM", function () {
  process.exit(0)
})

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)")
  process.exit(1)
})

app.use(express.json({ limit: "50mb" }))

app.use(express.static(path.resolve(__dirname + "/../resources")))

app.use(express.static(path.resolve(__dirname + "/../reactApp")))

app.use(express.static(path.resolve(__dirname + "/public")))
app.use(express.static(path.resolve(__dirname + "/resources")))

app.use(function (req, res, next) {
  if (isProduction) {
    if (req.secure || req.get("x-forwarded-proto") == "https") {
      next()
    } else {
      res.redirect(`https://${req.hostname}${req.url}`)
    }
  } else {
    next()
  }
})

applyCors(app)

//server.applyMiddleware({ app })

app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`)
  //appStart()
})

import express from "express"
import { ApolloServer } from "apollo-server-express"
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import * as http from "http"
import { schema as baseSchema } from "./schema/schema"
import { applyMiddleware } from "graphql-middleware"
import { appStart } from "./modules/routes"
import { markers } from "./config/constants"
import { applyCors } from "./config/cors"
import path from "path"

const isHeroku = process.env.NODE_ENV === "production"
const port = isHeroku ? process.env.PORT : 3001

async function startServer() {
  const app = express()

  const httpServer = http.createServer(app)

  app.get("/", function (req, res, next) {
    res.sendFile(path.resolve(__dirname + "/../reactApp/index.html"))
  })

  app.get("*", function (req, res, next) {
    res.sendFile(path.resolve(__dirname + "/../reactApp/index.html"))
  })

  app.get("/markers.png", function (_, res) {
    res.header("Access-Control-Allow-Origin", "*")
    res.sendFile(__dirname + "/resources/markers.png")
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

  const schema = applyMiddleware(baseSchema)
  const server = new ApolloServer({
    //context: ({ req, connection }) => createBaseContext(req, connection),
    //dataSources: () => createDataSources(),
    schema,
  })

  await server.start()

  app.use(express.json({ limit: "50mb" }))

  applyCors(app)

  server.applyMiddleware({ app })

  await new Promise((resolve, reject) =>
    httpServer.listen({ port: port }, resolve as any)
  )

  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )

  appStart()

  return { server, app }
}

startServer()

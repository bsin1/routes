import express from "express"
import { ApolloServer } from "apollo-server-express"
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import * as http from "http"
import { schema as baseSchema } from "./schema/schema"
import { applyMiddleware } from "graphql-middleware"
import { appStart } from "./modules/routes"

const isHeroku = process.env.NODE_ENV === "production"
const port = isHeroku ? process.env.PORT : 3001

async function startServer() {
  const app = express()

  const httpServer = http.createServer(app)

  app.get("/", function (_, res) {
    res.send("Landing Page Here")
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

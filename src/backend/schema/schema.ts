//import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema"
import { makeSchema } from "nexus"
import * as types from "./types"

export const schema = makeSchema({
  types,
  //plugins: [nexusSchemaPrisma()],
  outputs: {
    schema: __dirname + "/../generated/schema.graphql",
    typegen: __dirname + "/../generated/nexus.ts",
  },
  contextType: {
    module: require.resolve(__dirname + "/../config/context"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
})

import {
  arg,
  queryType,
  stringArg,
  floatArg,
  booleanArg,
  intArg,
  nonNull,
  list,
} from "nexus"
import { NexusGenArgTypes, NexusGenInputs } from "../../generated/nexus"

export const Query = queryType({
  definition(t) {
    t.field("executeScript", {
      type: "Boolean",
      resolve: async (r, a, context, i) => {
        console.log("executeScript")

        console.log("SCRIPT FINISHED")

        return true
      },
    })
  },
})

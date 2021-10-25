import cors from "cors"
import { PRODUCTION_WHITELIST, STAGING_WHITELIST } from "../config/constants"

export function applyCors(app: any) {
  // var whitelist =
  //   process.env.DEV_ENVIRONMENT == "staging"
  //     ? STAGING_WHITELIST
  //     : PRODUCTION_WHITELIST

  var whitelist = STAGING_WHITELIST

  var corsOptions = {
    origin: function (origin: any, callback: any) {
      var originIsWhitelisted = whitelist.indexOf(origin) !== -1
      callback(null, originIsWhitelisted)
    },
    credentials: true,
    methods: ["GET,PUT,POST,DELETE,OPTIONS"],
    allowedHeaders: [
      "Access-Control-Allow-Headers",
      "Origin",
      "Access-Control-Allow-Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Cache-Control",
      "Authorization",
    ],
  }
  app.use(cors(corsOptions))
}

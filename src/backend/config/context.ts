//import { PrismaClient } from "@prisma/client"
// import {
//   PropelDataSources,
//   createDataSources
// } from "../datasources/PropelDataSources"
// import { verify } from "jsonwebtoken"
// import { Scripts } from "../utils/Scripts"
import { Request } from "express"
import { InMemoryLRUCache } from "apollo-server-caching"
//import { PubSub } from "apollo-server-express"
// import { RedisPubSub } from "graphql-redis-subscriptions"
// import * as Redis from "ioredis"
import { EventEmitter } from "events"

// const biggerEventEmitter = new EventEmitter()
// biggerEventEmitter.setMaxListeners(12)

//const prismaClient = new PrismaClient()
//const scripts = new Scripts(prismaClient)

//const pubsub = new PubSub({ eventEmitter: biggerEventEmitter })
// const pubsub = new RedisPubSub({
//   publisher: new Redis.default(process.env.REDIS_URL),
//   subscriber: new Redis.default(process.env.REDIS_URL)
// })
//scripts.prisma = prismaClient

export interface BaseContext {
  // prisma: PrismaClient
  // pubsub: RedisPubSub
  // scripts: Scripts
  // userId: string | null
}

export interface Token {
  userId: string
}

export interface Context extends BaseContext {
  //dataSources: PropelDataSources
}

// export function createBaseContext(req: any, connection?: any): BaseContext {
//   const userId = getUserIdFromRequest(req, connection)

//   let context: BaseContext = {
//     prisma: prismaClient,
//     pubsub: pubsub,
//     scripts: scripts,
//     userId: userId
//   }

//   return context
// }

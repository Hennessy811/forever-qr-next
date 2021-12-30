import superjson from "superjson"

import createRouter from "@backend/createRouter"

import projectsRouter from "./projects"
import usersRouter from "./users"

export const appRouter = createRouter()
  .transformer(superjson)

  .merge("users.", usersRouter)
  .merge("projects.", projectsRouter)

export type AppRouter = typeof appRouter

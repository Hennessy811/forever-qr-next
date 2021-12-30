import { TRPCError } from "@trpc/server"
import { pickBy } from "lodash"
import { z } from "zod"

import createRouter from "@backend/createRouter"

const projectsRouter = createRouter()
  .mutation("create", {
    input: z.object({
      name: z.string(),
      value: z.string(),
      backgroundColor: z.string(),
      qrColor: z.string(),
      type: z.string(),
    }),

    resolve: async ({ ctx, input }) => {
      const { user, prisma } = ctx
      const { name, value, backgroundColor, qrColor, type } = input
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" })
      const project = await prisma.project.create({
        data: {
          owner: { connect: { id: user.id } },
          name,
          value,
          backgroundColor,
          qrColor,
          type,
        },
      })
      return project
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      name: z.string(),
      value: z.string(),
      backgroundColor: z.string(),
      qrColor: z.string(),
      type: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const { user, prisma } = ctx
      const { id, name, value, backgroundColor, qrColor, type } = input
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" })
      // TODO: check if user is owner of project
      const d = await prisma.project.findFirst({
        where: { id },
      })
      if (d?.ownerId !== user.id) throw new TRPCError({ code: "UNAUTHORIZED" })

      const data = {
        name,
        value,
        backgroundColor,
        qrColor,
        type,
      }

      const clearData = pickBy(data, (v) => v !== undefined)
      const project = await prisma.project.update({
        where: { id },
        data: clearData,
      })
      return project
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const { user, prisma } = ctx
      const { id } = input
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" })
      const project = await prisma.project.delete({
        where: { id },
      })
      return id
    },
  })
  .query("list", {
    resolve: async ({ ctx }) => {
      const { user, prisma } = ctx
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" })
      const projects = await prisma.project.findMany({
        where: { owner: { id: user.id } },
      })
      return projects
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const { prisma } = ctx
      const project = await prisma.project.findFirst({
        where: { id: input.id },
      })
      return project
    },
  })

export default projectsRouter

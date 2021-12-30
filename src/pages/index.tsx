import React, { useState } from "react"

import { Project } from "@prisma/client"

import EditProjectDialog, {
  FormInputs,
} from "@components/pages/Main/components/EditProjectDialog"
import ProjectComponent from "@components/pages/Main/components/Project"
import Layout from "@components/shared/Layout"
import { decodeAddress, generateAddress } from "@utils/qrEncoder"
import trpc from "@utils/trpc"

const Loader = () => {
  return (
    <div className="w-full h-full my-12 font-mono text-2xl animate-pulse">
      Loading...
    </div>
  )
}

const Error = () => {
  return (
    <div className="w-full h-full font-mono text-2xl text-red-600">
      Error happened while loading...
    </div>
  )
}

function Home() {
  const utils = trpc.useContext()
  const [editingProject, setEditingProject] = useState<Project | undefined>()
  const mutationOptions = {
    onSuccess: () => utils.invalidateQueries(["projects.list"]),
  }

  const [isOpen, setIsOpen] = useState(false)

  const projectsList = trpc.useQuery(["projects.list"])
  const createProject = trpc.useMutation(["projects.create"], mutationOptions)
  const updateProject = trpc.useMutation(["projects.update"], mutationOptions)
  const deleteProject = trpc.useMutation(["projects.delete"], mutationOptions)

  const loading =
    projectsList.isLoading ||
    createProject.isLoading ||
    updateProject.isLoading ||
    deleteProject.isLoading

  return (
    <Layout protectedRoute>
      <div className="">
        <div className="container px-4 py-12 m-auto lg:px-0">
          <div className="m-auto prose prose-lg">
            <h1>Welcome to Dynastic QR</h1>
            <p className="-mt-4 text-xl font-light text-slate-500">
              Dynamic content for the static QR code
            </p>
            <p>
              Here you can generate dynamic QR codes, save it and you can be
              sure that it will be stored forever*
            </p>
            <p>
              You can edit link where this QR leads you, but picture will be the
              same, so you can print it (and place it in a wedding album, for
              example, <span className="underline">just like I did</span>)
            </p>
            <h2>Your Projects</h2>
            <div className="h-px border border-gray-200 rounded-full shadow-md" />

            {loading && <Loader />}
            {projectsList.isError && <Error />}

            <div className="grid max-w-4xl grid-flow-row grid-cols-1 gap-8 m-auto mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              {projectsList.data &&
                projectsList.data.map((project) => (
                  <ProjectComponent
                    key={project.id}
                    data={project}
                    id={project.id}
                    onDelete={() => deleteProject.mutate({ id: project.id })}
                    onEdit={() => {
                      setEditingProject(project)
                      setIsOpen(true)
                    }}
                  />
                ))}
            </div>

            <div className="mt-4">
              <button
                className="px-4 py-1 text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700 active:bg-blue-800"
                onClick={() => setIsOpen(true)}
              >
                Create new project
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditProjectDialog
        isOpen={isOpen}
        initialValues={
          editingProject && {
            ...decodeAddress(editingProject?.value),
            name: editingProject.name!,
          }
        }
        onCancel={() => {
          const sure = confirm("Are you sure you want to cancel?")
          if (sure) {
            setIsOpen(false)
            setEditingProject(undefined)
          }
        }}
        onSave={(data: FormInputs) => {
          const v = generateAddress(data)
          const d = {
            name: data.name,
            value: v,
            backgroundColor: data.bgColor,
            qrColor: data.qrColor,
            type: data.type,
          }

          if (editingProject)
            updateProject.mutate({
              id: editingProject.id,
              ...d,
            })
          else createProject.mutate(d)
          setIsOpen(false)
          setEditingProject(undefined)
        }}
      />
    </Layout>
  )
}
export default Home

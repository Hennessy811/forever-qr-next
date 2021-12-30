/* eslint-disable @next/next/no-img-element */
import React, { Fragment } from "react"

import { LinkIcon, ChevronDoubleDownIcon } from "@heroicons/react/outline"
import { Project } from "@prisma/client"
import { useQRCode } from "react-qrcodes"

import Dropdown from "@components/shared/Dropdown"

export type SupportedTypes = "url" | "wifi" | "phone" | "email"

export interface Values {
  type: SupportedTypes
  title: string
  url: string
  emailAddress: string
  emailSubject: string
  emailBody: string
  wifiSsid: string
  wifiPass: string
  wifiType: string
  phone: string
  bgColor: string
  qrColor: string
}

interface Props {
  id: string
  data: Project
  onDelete: () => void
  onEdit: () => void
}

export const basePath =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_URL || "https://dynastic-qr.vercel.app"

const Project = ({ id, data, onDelete, onEdit }: Props) => {
  const link = `${basePath}/open/${id}`
  const [inputRef] = useQRCode({
    text: link,
    options: {
      type: "image/jpeg",
      quality: 0.3,
      level: "M",
      margin: 3,
      scale: 4,
      width: 250,
      color: {
        dark: data.qrColor || "#000000",
        light: data.backgroundColor || "#ffffff",
      },
    },
  })

  const dropdownOptions = [
    {
      title: "Open",
      action: () => window.open(link, "_blank"),
    },
    {
      title: "Edit",
      action: onEdit,
    },
    {
      title: "Delete",
      action: onDelete,
    },
  ]

  const address = data.value

  return (
    <>
      <div className="flex flex-col w-full p-5 rounded-md shadow-md">
        <div className="relative w-full mb-2">
          <h2
            className="mt-0 mb-2 text-xl font-bold text-gray-800 truncate"
            title={data.name}
          >
            {data.name}
          </h2>

          <div className="absolute top-0 right-0">
            <Dropdown
              title={
                <ChevronDoubleDownIcon className="w-5 h-5 cursor-pointer " />
              }
              options={dropdownOptions}
            />
          </div>
        </div>
        <div>
          <img className="m-0" ref={inputRef as any} alt={data.name} />
        </div>
        <div className="my-2">
          <span className="flex items-center text-sm font-black">
            <a href={link} rel="noopener noreferrer" target="_blank">
              <LinkIcon className="w-4 h-4 mr-2 transition-colors cursor-pointer hover:text-gray-400" />
            </a>
            Now it leads to:
          </span>
          <div className="max-w-md text-sm truncate" title={address}>
            {address}
          </div>
        </div>
      </div>
    </>
  )
}

export default Project

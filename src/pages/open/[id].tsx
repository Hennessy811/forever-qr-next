import React, { useEffect, useState } from "react"

import { ClipboardCopyIcon } from "@heroicons/react/outline"
import { useRouter } from "next/router"
import { useQRCode } from "react-qrcodes"
import { useCopyToClipboard } from "react-use"

import { decodeAddress } from "@utils/qrEncoder"
import trpc from "@utils/trpc"

interface CopierProps {
  value: string
}

const Copier = ({ value }: CopierProps) => {
  const [state, copyToClipboard] = useCopyToClipboard()
  const [v, setV] = useState(state.value)

  useEffect(() => {
    setV(state.value)
  }, [value, state.value])

  const copy = () => {
    copyToClipboard(value)
    setTimeout(() => {
      setV(undefined)
    }, 2000)
  }

  return (
    <div className="">
      <ClipboardCopyIcon
        className="absolute w-5 h-5 cursor-pointer top-2 right-4"
        onClick={() => copy()}
      />
    </div>
  )
}

const Opener = () => {
  const { query } = useRouter()

  const project = trpc.useQuery([
    "projects.byId",
    { id: (query.id as string) || "" },
  ])

  const [inputRef] = useQRCode({
    text: project.data?.value || "",
    options: {
      type: "image/jpeg",
      quality: 0.3,
      level: "M",
      margin: 3,
      scale: 4,
      width: 250,
      color: {
        dark: project.data?.qrColor || "#000000",
        light: project.data?.backgroundColor || "#ffffff",
      },
    },
  })

  useEffect(() => {
    if (project.data?.type !== "wifi" && project.data?.value) {
      window.location.replace(project.data?.value)
    }
  }, [project.data])

  if (project.data?.type === "wifi")
    return (
      <div className="container px-4 m-auto mt-12 prose md:px-0">
        <h1>{project.data?.name}: Wi-Fi Info</h1>
        <span>
          This QR code should connect your device to wi-fi network, but
          unfortunately we cant do it from the browser.
          <br />
          <br />
          You can copy SSID and password to connect manually.
        </span>
        <div className="my-4">
          <span className="text-sm font-bold text-gray-700">SSID</span>
          <div className="relative w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none bg-gray-50">
            {decodeAddress(project.data?.value)?.wifiSsid}
            <Copier value={decodeAddress(project.data?.value)?.wifiSsid} />
          </div>
        </div>
        <div className="my-4">
          <span className="text-sm font-bold text-gray-700">Password</span>
          <div className="relative w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none bg-gray-50">
            {decodeAddress(project.data?.value)?.wifiPass}

            <Copier value={decodeAddress(project.data?.value)?.wifiPass} />
          </div>
        </div>
        <div className="my-4">
          <span className="text-sm font-bold text-gray-700">Network type</span>
          <div className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none bg-gray-50">
            {decodeAddress(project.data?.value)?.wifiType}
          </div>
        </div>

        <div className="mt-12">
          <span className="text-lg">
            But maybe this{" "}
            <span className="text-sm text-gray-400">
              (yes, one more QR code)
            </span>{" "}
            will help you to connect directly:
          </span>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={inputRef as any} alt="helper qr code" />
        </div>
      </div>
    )

  return (
    <div className="container flex items-center justify-center h-screen px-4 m-auto font-mono prose text-center lg:prose-2xl">
      <h1>
        Opening the{" "}
        <span className="font-light underline">{project.data?.name}</span>{" "}
        project...
      </h1>
    </div>
  )
}

export default Opener

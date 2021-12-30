import React, { Fragment, useEffect, useRef, useState } from "react"

import { Transition, Dialog } from "@headlessui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import { ChromePicker } from "react-color"
import { useForm } from "react-hook-form"
import { useClickAway } from "react-use"

import { emailSchema, phoneSchema, urlSchema, wifiSchema } from "./formSchemas"
import { SupportedTypes, Values } from "./Project"

interface Props {
  isOpen: boolean
  onSave: (d: FormInputs) => void
  onCancel: () => void
  initialValues?: FormInputs
}

const typeOptions: { title: string; value: SupportedTypes }[] = [
  { title: "URL or plain text", value: "url" },
  { title: "E-mail", value: "email" },
  { title: "Wi-Fi", value: "wifi" },
  { title: "Phone", value: "phone" },
]

export interface FormInputs extends Values {
  name: string
}

const schemaMap: Record<SupportedTypes, any> = {
  url: urlSchema,
  wifi: wifiSchema,
  email: emailSchema,
  phone: phoneSchema,
}
const EditProjectDialog = ({
  isOpen,
  initialValues,
  onSave,
  onCancel,
}: Props) => {
  const [type, setType] = useState<SupportedTypes>("url")

  const {
    register,
    watch,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(schemaMap[type]),
    defaultValues: initialValues,
  })

  console.log(errors)

  useEffect(() => {
    if (initialValues) {
      setType(initialValues.type)
      reset(initialValues)
    }
    reset()
  }, [initialValues, reset])

  const _type: SupportedTypes = watch("type")
  useEffect(() => {
    setType(_type)
    clearErrors()
  }, [_type, clearErrors])

  const [bgColor, setBgColor] = useState({
    open: false,
    color: "#000000",
  })
  const [qrColor, setQrColor] = useState({
    open: false,
    color: "#ffffff",
  })

  const ref = useRef(null)

  useClickAway(ref, () => {
    setBgColor({ ...bgColor, open: false })
    setQrColor({ ...qrColor, open: false })
  })

  const onSubmit = (data: FormInputs) =>
    onSave({ ...data, bgColor: bgColor.color, qrColor: qrColor.color })

  const urlFields = (
    <label className="block my-4 text-sm font-bold text-gray-700">
      <span className="block mb-2">URL</span>
      <input
        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        {...register("url")}
        placeholder="URL"
      />
      <span className="font-light text-red-500">{errors.url?.message}</span>
    </label>
  )

  const wifiFields = (
    <>
      <label className="block my-4 text-sm font-bold text-gray-700">
        <span className="block mb-2">Network name</span>
        <input
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          {...register("wifiSsid")}
          placeholder="Network name"
        />
        <span className="font-light text-red-500">
          {errors.wifiSsid?.message}
        </span>
      </label>

      <label className="block my-4 text-sm font-bold text-gray-700">
        <span className="block mb-2">Network password</span>
        <input
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          {...register("wifiPass")}
          placeholder="Network password"
        />
        <span className="font-light text-red-500">
          {errors.wifiPass?.message}
        </span>
      </label>

      <div className="relative inline-block w-full">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="wifitype"
        >
          Network Type
        </label>
        <select
          id="wifitype"
          {...register("wifiType")}
          className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline"
        >
          <option value="WEP">WEP</option>
          <option value="WPA">WPA/WPA2</option>
          <option value="nopass">Open</option>
        </select>
      </div>
    </>
  )

  // mailto:mitia2022@gmail.com?cc=123&subject=hello%20world
  const emailFields = (
    <>
      <label className="block my-4 text-sm font-bold text-gray-700">
        <span className="block mb-2">Email address</span>
        <input
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          {...register("emailAddress")}
          placeholder="Email address"
        />
        <span className="font-light text-red-500">
          {errors.emailAddress?.message}
        </span>
      </label>
      <label className="block my-4 text-sm font-bold text-gray-700">
        <span className="block mb-2">Subject</span>
        <input
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          {...register("emailSubject")}
          placeholder="Subject"
        />
        <span className="font-light text-red-500">
          {errors.emailSubject?.message}
        </span>
      </label>
      <label className="block my-4 text-sm font-bold text-gray-700">
        <span className="block mb-2">Body</span>
        <input
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          {...register("emailBody")}
          placeholder="Body"
        />
        <span className="font-light text-red-500">
          {errors.emailBody?.message}
        </span>
      </label>
    </>
  )

  const phoneFields = (
    <div className="my-4">
      <label
        className="block mb-2 text-sm font-bold text-gray-700"
        htmlFor="phone"
      >
        Phone
      </label>
      <input
        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        id="phone"
        type="tel"
        placeholder="Phone number"
        {...register("phone")}
      />
      <span className="font-light text-red-500">{errors.phone?.message}</span>
    </div>
  )

  const fieldsMap: Record<SupportedTypes, JSX.Element> = {
    url: urlFields,
    wifi: wifiFields,
    email: emailFields,
    phone: phoneFields,
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => {
          onCancel()
          reset()
        }}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-100 bg-opacity-60" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Edit project
              </Dialog.Title>

              <label className="block my-4 text-sm font-bold text-gray-700">
                <span className="block mb-2">Project name</span>
                <input
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  {...register("name")}
                  placeholder="Project name"
                />
                <span className="font-light text-red-500">
                  {errors.name?.message}
                </span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={() => setBgColor({ ...bgColor, open: true })}
                >
                  Background color
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={() => setQrColor({ ...qrColor, open: true })}
                >
                  QR color
                </button>

                <div ref={ref} className="absolute left-0 z-10 top-2">
                  {(bgColor.open || qrColor.open) && (
                    <ChromePicker
                      color={bgColor.open ? bgColor.color : qrColor.color}
                      onChange={(v) => {
                        if (bgColor.open)
                          setBgColor({ ...bgColor, color: v.hex })
                        if (qrColor.open)
                          setQrColor({ ...qrColor, color: v.hex })
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="relative inline-block w-full mt-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="type"
                >
                  Type
                </label>
                <select
                  id="type"
                  {...register("type")}
                  className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded shadow appearance-none hover:border-gray-500 focus:outline-none focus:shadow-outline"
                >
                  {typeOptions.map((i) => (
                    <option key={i.value} value={i.value}>
                      {i.title}
                    </option>
                  ))}
                </select>
              </div>

              {fieldsMap[type]}

              <div className="mt-4">
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                  onClick={() => {
                    onCancel()
                    reset()
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default EditProjectDialog

import React, { FC, Fragment, ReactNode } from "react"

import { Menu, Transition } from "@headlessui/react"

interface Props {
  title: ReactNode
  options: {
    title: string
    action: () => void
  }[]
}

const Dropdown: FC<Props> = ({ title, options }) => {
  return (
    <div className="">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full">
            {title}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-xl focus:outline-none">
            <div className="px-1 py-1 ">
              {options.map((option) => (
                <Menu.Item key={option.title}>
                  {({ active }) => (
                    <button
                      onClick={() => option.action()}
                      className={`${
                        active ? "bg-blue-400 text-white" : "text-gray-900"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      {option.title}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default Dropdown

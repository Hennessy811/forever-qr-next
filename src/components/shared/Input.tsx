import React, { FC } from "react"

interface InputProps {
  label: string
  [key: string]: any
  error?: string
}

const Input: FC<InputProps> = ({ label, error, ...props }) => (
  <div className="my-4">
    <label
      className="block mb-2 text-sm font-bold text-gray-700"
      htmlFor={label}
    >
      {label}
    </label>
    <input
      className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
      id={label}
      {...props}
    />
    <span className="font-light text-red-500">{error}</span>
  </div>
)

export default Input

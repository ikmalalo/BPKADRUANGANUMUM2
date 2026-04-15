import React from "react"

interface Props {
  label: string
  children: React.ReactNode
}

export default function FormField({ label, children }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}
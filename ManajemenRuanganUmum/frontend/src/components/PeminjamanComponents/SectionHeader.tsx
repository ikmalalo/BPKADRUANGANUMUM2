import React from "react"

interface Props {
  icon: React.ReactNode
  title: string
  divider?: boolean
}

export default function SectionHeader({ icon, title, divider = true }: Props) {
  return (
    <div className={`${divider ? "pt-6 border-t border-gray-200" : ""} mb-4`}>
      <div className="flex items-center gap-2">
        <span className="text-orange-500">{icon}</span>
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
      </div>
    </div>
  )
}
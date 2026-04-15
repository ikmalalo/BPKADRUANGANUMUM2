interface Props {
  label: string
  description: string
  selected: boolean
  onClick: () => void
}

export default function RadioCard({
  label,
  description,
  selected,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
            className={`
        flex-1
        flex
        items-start
        justify-between
        px-4
        py-3
        rounded-lg
        border-2
        text-left
        transition-all
        duration-300
        ${
          selected
            ? `
              border-orange-500
              bg-orange-50
              shadow-[0_0_20px_rgba(249,115,22,0.35)]
              ring-1
              ring-orange-300
              scale-[1.02]
            `
            : `
              border-gray-200
              bg-white
              hover:border-orange-400
              hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]
              hover:-translate-y-1
            `
        }
      `}
    >
      <div>
        <p className={`text-sm font-bold transition-colors ${selected ? "text-orange-600" : "text-gray-800"}`}>{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>

      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${
          selected ? "border-orange-500 bg-orange-500 shadow-sm" : "border-gray-400"
        }`}
      >
        {selected && (
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-sm" />
        )}
      </div>
    </button>
  )
}
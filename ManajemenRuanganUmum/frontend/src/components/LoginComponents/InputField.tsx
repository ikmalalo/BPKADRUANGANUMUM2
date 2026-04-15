interface Props {
  label: string
  type: string
  placeholder: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputField({ label, type, placeholder, value, onChange }: Props) {
  return (
    <div className="mb-4">
      <label className="text-sm text-gray-600">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
        w-full
        mt-1
        p-3
        border
        border-gray-300
        rounded-lg
        bg-gray-50
        transition-all
        duration-300
        hover:border-orange-400
        focus:outline-none
        focus:border-orange-400
        focus:ring-2
        focus:ring-orange-300/60
        focus:shadow-[0_0_18px_rgba(251,146,60,0.8)]
        "
      />
    </div>
  )
}
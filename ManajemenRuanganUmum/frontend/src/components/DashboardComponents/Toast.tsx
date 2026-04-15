interface Props {
  show: boolean
  message: string
  type?: 'success' | 'error'
}

export default function Toast({ show, message, type = 'success' }: Props) {

  if (!show) return null

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'
  const icon = type === 'success' ? '✓' : '✕'

  return (
    <div className={`
      fixed
      bottom-6
      right-6
      z-[9999]
      ${bgColor}
      text-white
      px-5
      py-3
      rounded-lg
      shadow-lg
      flex
      items-center
      gap-2
      animate-[slideUp_.35s_ease]
    `}>

      <span className="text-lg font-bold">{icon}</span>

      <p className="text-sm font-semibold">
        {message}
      </p>

    </div>
  )
}
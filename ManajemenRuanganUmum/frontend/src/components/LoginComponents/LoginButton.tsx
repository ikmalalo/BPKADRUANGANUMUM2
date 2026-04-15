interface Props {
  text: string
  onClick?: () => void
}

export default function LoginButton({ text, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
      w-3/4
      mx-auto
      block
      bg-orange-500
      text-white
      py-3
      rounded-lg
      font-semibold
      transition-all
      duration-300
      hover:bg-orange-600
      hover:scale-105
      hover:shadow-[0_0_18px_rgba(251,146,60,0.8)]
      "
    >
      {text}
    </button>
  )
}
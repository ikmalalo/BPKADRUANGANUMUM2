interface Props {
  title: string
  description: string
  icon: string
  color: string
  onClick?: () => void
}

export default function ServiceCard({ title, description, icon, color, onClick }: Props) {
  return (
    <div
    onClick={onClick}
    className="
    bg-white
    rounded-xl
    p-8
    h-auto
    min-h-[220px]
    md:h-[250px]
    shadow-lg
    hover:shadow-xl
    transition
    hover:scale-[1.02]
    cursor-pointer
    flex
    flex-col
    justify-between
    ">

      <div>
        <div className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4 ${color}`}>
          <span className="text-xl">{icon}</span>
        </div>

        <h2 className="text-xl font-semibold mb-2">
          {title}
        </h2>

        <p className="text-gray-500 mb-4">
          {description}
        </p>
      </div>

    </div>
  )
}
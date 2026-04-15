interface Props {
  number: string
  label: string
  color: string
}

export default function StatCard({ number, label, color }: Props) {
  return (
    <div
      className={`
        w-full
        p-3
        sm:p-4
        md:p-6
        rounded-xl
        bg-white
        border
        border-gray-200
        border-l-4
        sm:border-l-8
        ${color.split(' ')[0]}
        shadow-sm
        hover:shadow-md
        hover:-translate-y-1
        transition-all
        duration-300
      `}
    >

      <h1 className={`
        text-xl
        sm:text-2xl
        md:text-4xl
        font-bold
        mb-0.5
        md:mb-2
        ${color.split(' ')[1]}
      `}>
        {number}
      </h1>

      <p className="
        text-[10px]
        sm:text-xs
        md:text-base
        font-bold
        text-gray-500
        uppercase
        tracking-tight
        leading-tight
      ">
        {label}
      </p>

    </div>
  )
}
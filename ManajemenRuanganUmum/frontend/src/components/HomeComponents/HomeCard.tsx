import type { LucideIcon } from "lucide-react"

interface Props {
  title: string
  description: string
  Icon: LucideIcon
  badge: string
  badgeColor: string
  buttonText: string
  buttonIcon?: LucideIcon
  onClick?: () => void
  delay?: string
}

export default function HomeCard({ 
  title, 
  description, 
  Icon, 
  badge, 
  badgeColor, 
  buttonText, 
  buttonIcon: ButtonIcon,
  onClick,
  delay = "delay-0"
}: Props) {
  return (
    <div className={`h-full animate-in fade-in slide-in-from-bottom-10 fill-mode-forwards ${delay}`}>
      <div 
        onClick={onClick}
        className="bg-white rounded-[1.5rem] p-4 md:p-6 lg:p-7 shadow-xl border border-gray-100 flex flex-col h-full relative overflow-hidden group scale-100 hover:scale-[1.05] hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ff6b00]/40 hover:border-[#ff6b00]/40 cursor-pointer transition-spring transform-gpu"
      >
        
        {/* Subtle Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff6b00]/10" />
        
        {/* Badge and Icon */}
        <div className="flex justify-between items-center mb-4 md:mb-6 relative z-10 w-full">
          <span className={`${badgeColor} text-[7px] md:text-[9px] font-black tracking-[0.2em] px-2.5 py-1 md:px-3 md:py-1 rounded-full uppercase border border-black/5`}>
            {badge}
          </span>
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-50 group-hover:bg-[#ff6b00] rounded-lg border border-gray-100 group-hover:border-[#ff6b00] flex items-center justify-center text-[#ff6b00] group-hover:text-white group-hover:scale-105 group-hover:rotate-3 transition-spring transform-gpu">
            <Icon size={16} className="md:size-[20px]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow mb-6 md:mb-8 relative z-10 w-full">
          <h2 className="text-lg md:text-xl lg:text-2xl font-black text-[#111827] mb-2 tracking-tight group-hover:text-[#ff6b00] transition-colors leading-tight">
            {title}
          </h2>
          <div className="w-6 h-0.5 bg-[#ff6b00] mb-3 rounded-full opacity-40 group-hover:opacity-100 group-hover:w-10 transition-spring" />
          <p className="text-gray-500 text-[11px] md:text-xs lg:text-sm leading-relaxed max-w-[260px] transition-colors group-hover:text-gray-900 line-clamp-2 md:line-clamp-none">
            {description}
          </p>
        </div>

        {/* Button */}
        <div className="w-full bg-[#111827] group-hover:bg-[#ff6b00] text-white font-black py-3 md:py-4 px-5 rounded-lg flex items-center justify-center gap-2.5 transition-spring shadow-md group-hover:shadow-orange-500/15 transform-gpu">
          <span className="tracking-tight uppercase text-[8px] md:text-[10px] font-bold">{buttonText}</span>
          {ButtonIcon && <ButtonIcon size={14} />}
        </div>
        
      </div>
    </div>
  )
}

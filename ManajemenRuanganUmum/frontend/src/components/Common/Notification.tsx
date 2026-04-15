import { createPortal } from "react-dom"
import { CheckCircle2, XCircle, Info, X } from "lucide-react"

interface Props {
  show: boolean
  type: "success" | "error" | "info"
  title: string
  message: string
  onClose: () => void
}

export default function Notification({ show, type, title, message, onClose }: Props) {
  if (!show) return null

  const config = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: <CheckCircle2 className="text-emerald-500" size={24} />,
      btn: "bg-emerald-500 hover:bg-emerald-600",
      accent: "bg-emerald-500"
    },
    error: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: <XCircle className="text-rose-500" size={24} />,
      btn: "bg-rose-500 hover:bg-rose-600",
      accent: "bg-rose-500"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: <Info className="text-blue-500" size={24} />,
      btn: "bg-blue-500 hover:bg-blue-600",
      accent: "bg-blue-500"
    }
  }[type]

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`
        relative 
        w-full 
        max-w-md 
        ${config.bg} 
        ${config.border} 
        border-2 
        rounded-3xl 
        overflow-hidden
        shadow-2xl 
        p-6 
        animate-springPop
        flex 
        flex-col 
        items-center 
        text-center
      `}>
        {/* Top Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${config.accent}`} />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="mb-4">
          {config.icon}
        </div>

        {/* Text */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 font-medium leading-relaxed">
          {message}
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className={`
            w-full 
            py-3 
            rounded-xl 
            text-white 
            font-bold 
            shadow-lg 
            transition-all 
            active:scale-95
            ${config.btn}
          `}
        >
          OKE
        </button>
      </div>
    </div>,
    document.body
  )
}

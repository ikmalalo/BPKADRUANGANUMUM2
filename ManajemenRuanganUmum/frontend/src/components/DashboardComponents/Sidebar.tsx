import { LayoutDashboard, PlusCircle, History, LogOut, Eye, X, Award } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useRef } from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { path: "/rooms",      icon: LayoutDashboard, label: "Dashboard" },
  { path: "/peminjaman", icon: PlusCircle,       label: "Buat Peminjaman" },
  { path: "/preview",    icon: Eye,              label: "Preview Ruangan" },
  { path: "/riwayat",          icon: History,          label: "Riwayat" },
  { path: "/upload-sertifikat", icon: Award,            label: "Upload Sertifikat" },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const navRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const menuRefs = useRef<(HTMLDivElement | null)[]>([])
  const isFirstRef = useRef(true)

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate("/")
  }

  useEffect(() => {
    const index = menuItems.findIndex((item: any) => item.path === location.pathname)
    if (index === -1) return

    const el = menuRefs.current[index]
    const nav = navRef.current
    const highlight = highlightRef.current
    if (!el || !nav || !highlight) return

    const navRect = nav.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const top = elRect.top - navRect.top
    const height = elRect.height

    if (isFirstRef.current) {
      const originalTransition = highlight.style.transition
      highlight.style.transition = "none"
      highlight.style.top = top + "px"
      highlight.style.height = height + "px"
      highlight.style.opacity = "1"
      requestAnimationFrame(() => {
        highlight.style.transition = originalTransition
      })
      isFirstRef.current = false
    } else {
      highlight.style.top = top + "px"
      highlight.style.height = height + "px"
      highlight.style.opacity = "1"
    }
  }, [location.pathname])

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        w-64 bg-white border-r h-screen p-5 fixed left-0 top-0 flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* MOBILE CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="md:hidden absolute right-4 top-4 p-2 text-gray-500 hover:text-orange-500"
        >
          <X size={24} />
        </button>

        {/* PROFILE CARD */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-md mb-5 mt-4 md:mt-2">
          <div className="w-12 h-12 rounded-full bg-orange-200 text-orange-600 flex items-center justify-center font-bold text-lg">
            {(user.username || 'AD').substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-sm text-gray-800 truncate">
              {user.username || 'Admin'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.role || 'Administrator'}
            </p>
          </div>
        </div>

        <div className="border-b-2 border-gray-200 mb-5" />

      <nav ref={navRef} className="relative">

        <div
          ref={highlightRef}
          className="absolute left-0 w-full bg-orange-100 border-l-4 border-orange-500 rounded-lg pointer-events-none shadow-[0_2px_10px_rgba(249,115,22,0.1)]"
          style={{ 
            top: 0, 
            height: 0,
            transition: "top 450ms cubic-bezier(0.5, 0, 0, 1), height 450ms cubic-bezier(0.5, 0, 0, 1), opacity 300ms ease"
          }}
        />

        {menuItems.map((item: any, index: number) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <div
              key={item.path}
              ref={(el) => { menuRefs.current[index] = el }}
              onClick={() => {
                navigate(item.path);
                onClose(); // Auto close on mobile
              }}
              className={`
                relative flex items-center gap-3 p-3 rounded-lg cursor-pointer z-10
                transition-colors duration-200
                ${isActive ? "text-orange-600 font-medium" : "text-gray-600 hover:text-gray-800"}
              `}
            >
              <Icon size={18} />
              {item.label}
            </div>
          )
        })}

      </nav>

      <div className="mt-auto pt-6">
        <div className="border-t pt-4">
          <div 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 text-red-500 rounded-lg cursor-pointer hover:bg-red-50 transition-colors duration-150"
          >
            <LogOut size={18} />
            Logout
          </div>
        </div>
      </div>

    </div>
    </>
  )
}
import logo from "../../assets/images/logo.png"
import { Menu, User as UserIcon } from "lucide-react"
import { useLocation } from "react-router-dom"

interface TopbarProps {
  onMenuClick?: () => void
}

const routeTitles: { [key: string]: string } = {
  "/rooms": "Dashboard",
  "/peminjaman": "Buat Peminjaman",
  "/preview": "Preview Ruangan",
  "/riwayat": "Riwayat Peminjaman",
  "/konfirmasipeminjaman": "Konfirmasi Peminjaman",
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation()
  const currentTitle = routeTitles[location.pathname] || "Dashboard"
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="w-full">

      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
        pb-4
      ">

        {/* LEFT: Menu & Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <Menu size={22} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
              {currentTitle}
            </h1>
            <div className="hidden md:block h-1 w-12 bg-orange-500 rounded-full mt-1"></div>
          </div>
        </div>

        {/* RIGHT: Logo */}
        <div className="
          flex
          items-center
          justify-end
        ">

          <img
            src={logo}
            alt="BPKAD Logo"
            className="
              w-24
              md:w-32
              object-contain
              filter drop-shadow-sm
            "
          />

        </div>

      </div>

      {/* DIVIDER */}
      <div className="w-full h-[1px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 mb-8 rounded-full opacity-60"></div>

    </div>
  )
}
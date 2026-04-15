import { useState } from "react"
import { Filter, ChevronDown, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Props {
  setStatusFilter: (value: string) => void
  setTempatFilter: (value: string) => void
  setHariFilter: (value: string) => void
  selectedAgenda: any | null
}

const ruangOptions = [
  "Semua",
  "Mahakam",
  "Sekretariat TAPD",
  "Nusantara",
]

export default function DashboardFilter({
  setStatusFilter,
  setTempatFilter,
  setHariFilter,
  selectedAgenda
}: Props) {

  const navigate = useNavigate()

  const [statusText, setStatusText] = useState("Status: Semua")
  const [tempatText, setTempatText] = useState("Tempat: Semua")
  const [hariText, setHariText] = useState("Hari: Semua")

  const [openFilter, setOpenFilter] = useState<string | null>(null)

  const toggleFilter = (name: string) => {
    setOpenFilter(openFilter === name ? null : name)
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-4 mb-6">

      {/* FILTER AREA */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
        <div className="flex items-center gap-2 text-gray-700 font-bold mb-1 sm:mb-0">
          <Filter size={18} className="text-orange-500" />
          <span className="text-sm uppercase tracking-wider">Filter Data</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full lg:w-auto">
          {/* STATUS */}
          <div className="relative">
            <button
              onClick={() => toggleFilter("status")}
              className="w-full flex items-center justify-between gap-2 border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-xs font-bold hover:border-orange-400 hover:shadow-sm transition-all text-gray-700"
            >
              <span className="truncate">{statusText}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 flex-shrink-0 ${
                  openFilter === "status" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`
              absolute mt-2 w-full min-w-[140px] bg-white border rounded-xl shadow-xl z-20
              transform transition-all duration-200 origin-top
              ${openFilter === "status"
                ? "opacity-100 scale-y-100 translate-y-0"
                : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"}
              `}
            >
              {["Semua", "Berlangsung", "Terjadwal", "Selesai"].map((opt) => (
                <div 
                  key={opt}
                  onClick={()=>{setStatusFilter(opt);setStatusText(`Status: ${opt}`);setOpenFilter(null)}} 
                  className="px-4 py-2.5 hover:bg-orange-50 hover:text-orange-600 cursor-pointer text-xs font-semibold border-b last:border-0 border-gray-50 transition-colors"
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>

          {/* TEMPAT */}
          <div className="relative">
            <button
              onClick={() => toggleFilter("tempat")}
              className="w-full flex items-center justify-between gap-2 border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-xs font-bold hover:border-orange-400 hover:shadow-sm transition-all text-gray-700"
            >
              <span className="truncate">{tempatText}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 flex-shrink-0 ${
                  openFilter === "tempat" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`
              absolute mt-2 w-full min-w-[140px] bg-white border rounded-xl shadow-xl z-20
              transform transition-all duration-200 origin-top
              ${openFilter === "tempat"
                ? "opacity-100 scale-y-100 translate-y-0"
                : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"}
              `}
            >
              {ruangOptions.map((opt) => (
                <div 
                  key={opt}
                  onClick={()=>{setTempatFilter(opt);setTempatText(`Tempat: ${opt}`);setOpenFilter(null)}} 
                  className="px-4 py-2.5 hover:bg-orange-50 hover:text-orange-600 cursor-pointer text-xs font-semibold border-b last:border-0 border-gray-50 transition-colors"
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>

          {/* HARI */}
          <div className="relative col-span-2 sm:col-span-1">
            <button
              onClick={() => toggleFilter("hari")}
              className="w-full flex items-center justify-between gap-2 border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-xs font-bold hover:border-orange-400 hover:shadow-sm transition-all text-gray-700"
            >
              <span className="truncate">{hariText}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 flex-shrink-0 ${
                  openFilter === "hari" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`
              absolute mt-2 w-full min-w-[140px] bg-white border rounded-xl shadow-xl z-20
              transform transition-all duration-200 origin-top
              ${openFilter === "hari"
                ? "opacity-100 scale-y-100 translate-y-0"
                : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"}
              `}
            >
              {["Semua", "Terdekat", "Terjauh"].map((opt) => (
                <div 
                  key={opt}
                  onClick={()=>{setHariFilter(opt);setHariText(`Hari: ${opt}`);setOpenFilter(null)}} 
                  className="px-4 py-2.5 hover:bg-orange-50 hover:text-orange-600 cursor-pointer text-xs font-semibold border-b last:border-0 border-gray-50 transition-colors"
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BUTTON AREA */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 w-full lg:w-auto items-center">
        <button
          onClick={() => navigate("/peminjaman")}
          className="
            flex items-center justify-center gap-2
            bg-orange-500 hover:bg-orange-600
            text-white
            px-5 py-2.5
            rounded-xl
            text-sm font-bold
            shadow-md shadow-orange-100
            transition-all
            hover:scale-[1.02] active:scale-95
            w-full
            sm:w-auto
          "
        >
          <Plus size={18}/>
          Buat Peminjaman
        </button>

        <div className={`
          flex flex-col sm:flex-row gap-2 transition-all duration-500 ease-in-out w-full sm:w-auto overflow-hidden
          ${selectedAgenda ? "max-h-[200px] sm:max-w-[400px] opacity-100 scale-100" : "max-h-0 sm:max-w-0 opacity-0 scale-50 pointer-events-none"}
        `}>
          <button
            onClick={() => navigate("/peminjaman", { state: { ...selectedAgenda, isEdit: true } })}
            className="
              flex items-center justify-center gap-2
              bg-blue-600 hover:bg-blue-700
              text-white
              px-5 py-2.5
              rounded-xl
              text-sm font-bold
              shadow-md shadow-blue-100
              transition-all
              hover:scale-[1.02] active:scale-95
              w-full
              sm:w-auto
              whitespace-nowrap
            "
          >
            Edit Ruangan
          </button>
        </div>
      </div>

    </div>
  )
}
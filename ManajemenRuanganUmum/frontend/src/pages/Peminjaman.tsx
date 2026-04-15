import "../index.css"
import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

import { format } from "date-fns"
import { id } from "date-fns/locale"

import {
  Calendar,
  FileText,
  ClipboardList,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock,
  X
} from "lucide-react"

import SectionHeader from "../components/PeminjamanComponents/SectionHeader"
import FormField from "../components/PeminjamanComponents/FormField"
import RadioCard from "../components/PeminjamanComponents/RadioCard"

type JenisRuangan = "bpkad" | "pemkot"

interface FormData {
  jenisRuangan: JenisRuangan
  ruangan: string
  tanggal: string
  waktuMulai: string
  waktuSelesai: string
  namaAcara: string
  pelaksana: string
  dihadiri: string
}

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"

const ruangBpkad = [
  "Ruang Rapat Mahakam (Lt 4)",
  "Ruang Rapat Sekretariat TAPD (Lt 4)",
  "Ruang Rapat Nusantara (Lt 3)",
]

export default function Peminjaman() {
  const navigate = useNavigate()
  const location = useLocation()
  const editData = location.state as any

  const [form, setForm] = useState<FormData>({
    jenisRuangan: editData?.type?.toLowerCase() || "bpkad",
    ruangan: editData?.tempat || "",
    tanggal: editData?.tanggal || "",
    waktuMulai: editData?.pukul?.split(' - ')[0] || "",
    waktuSelesai: editData?.pukul?.split(' - ')[1] || "",
    namaAcara: editData?.acara || "",
    pelaksana: editData?.pelaksana || "",
    dihadiri: editData?.dihadiri || "",
  })

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    editData?.tanggal ? new Date(editData.tanggal) : undefined
  )

  const [openDropdown, setOpenDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [openCalendar, setOpenCalendar] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(false)
      }
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setOpenCalendar(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="flex flex-col pt-4">

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-7 space-y-8">
        {/* WAKTU & LOKASI */}
        <section>
          <SectionHeader
            icon={<Calendar className="w-5 h-5" />}
            title="Waktu & Lokasi"
            divider={false}
          />

          <div className="flex gap-3 mb-4">
            <RadioCard
              label="Ruangan BPKAD"
              description="Ruang rapat di lingkungan BPKAD"
              selected={form.jenisRuangan === "bpkad"}
              onClick={() => handleChange("jenisRuangan", "bpkad")}
            />
            <RadioCard
              label="Ruangan PEMKOT"
              description="Ruang rapat di lingkungan Pemkot"
              selected={form.jenisRuangan === "pemkot"}
              onClick={() => handleChange("jenisRuangan", "pemkot")}
            />
          </div>

          <FormField label="Ruangan yang Dipilih">
            {form.jenisRuangan === "bpkad" ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:border-orange-400 transition"
                >
                  <span className="text-gray-700">
                    {form.ruangan || "Pilih Ruangan"}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      openDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`absolute w-full mt-2 bg-white border rounded-lg shadow z-20 origin-top transform transition-all duration-200 ${
                    openDropdown
                      ? "opacity-100 scale-y-100 translate-y-0"
                      : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {ruangBpkad.map((r) => (
                    <div
                      key={r}
                      onClick={() => {
                        handleChange("ruangan", r)
                        setOpenDropdown(false)
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <input
                type="text"
                className={inputClass}
                placeholder="Isi nama ruangan pemkot"
                value={form.ruangan}
                onChange={(e) => handleChange("ruangan", e.target.value)}
              />
            )}
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setOpenCalendar(!openCalendar)}
                className="w-full h-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:border-orange-400 transition min-h-[40px]"
              >
                <span>
                  {selectedDate
                    ? format(selectedDate, "dd MMMM yyyy", { locale: id })
                    : "Pilih tanggal"}
                </span>
                <Calendar size={18} />
              </button>
              <div
                className={`absolute z-30 mt-2 bg-white rounded-xl shadow-lg border p-3 transition-all duration-200 ${
                  openCalendar
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    if (date) {
                      handleChange(
                        "tanggal",
                        format(date, "EEEE, dd MMM yyyy", { locale: id })
                      )
                    }
                    setOpenCalendar(false)
                  }}
                />
              </div>
            </div>

            <input
              type="time"
              className={inputClass}
              value={form.waktuMulai}
              onChange={(e) => handleChange("waktuMulai", e.target.value)}
            />

            <div className="flex flex-col gap-1">
              {form.waktuSelesai === "Selesai" ? (
                <div className="relative">
                  <div className={`${inputClass} bg-orange-50 border-orange-200 text-orange-600 font-bold flex items-center justify-between`}>
                    Sampai Selesai
                    <button 
                      type="button"
                      onClick={() => handleChange("waktuSelesai", "")}
                      className="p-1 hover:bg-orange-100 rounded-full transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="time"
                    className={inputClass}
                    value={form.waktuSelesai}
                    onChange={(e) => handleChange("waktuSelesai", e.target.value)}
                  />
                  <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              )}
              {form.waktuSelesai !== "Selesai" && (
                <button 
                  type="button"
                  onClick={() => handleChange("waktuSelesai", "Selesai")}
                  className="text-[10px] text-orange-500 font-bold uppercase hover:text-orange-600 transition-colors w-fit"
                >
                  + Sampai Selesai
                </button>
              )}
            </div>
          </div>
        </section>

        {/* INFORMASI ACARA */}
        <section>
          <SectionHeader
            icon={<FileText className="w-5 h-5" />}
            title="Informasi Acara"
          />
          <FormField label="Nama Acara">
            <input
              type="text"
              className={inputClass}
              value={form.namaAcara}
              onChange={(e) => handleChange("namaAcara", e.target.value)}
            />
          </FormField>
        </section>

        {/* PENANGGUNG JAWAB */}
        <section>
          <SectionHeader
            icon={<ClipboardList className="w-5 h-5" />}
            title="Penanggung Jawab"
          />
          <FormField label="Pelaksana">
            <input
              type="text"
              className={inputClass}
              placeholder="Contoh: Bagian Ekonomi"
              value={form.pelaksana}
              onChange={(e) => handleChange("pelaksana", e.target.value)}
            />
          </FormField>
          <div
            className={`
              overflow-hidden
              transition-all
              duration-300
              ease-in-out
              ${form.jenisRuangan === "pemkot"
                ? "max-h-40 opacity-100 mt-4"
                : "max-h-0 opacity-0"}
            `}
          >
            <FormField label="Dihadiri (Khusus Pemkot)">
              <input
                type="text"
                className={inputClass}
                placeholder="Contoh: Walikota Samarinda"
                value={form.dihadiri}
                onChange={(e) => handleChange("dihadiri", e.target.value)}
              />
            </FormField>
          </div>
        </section>

        {/* BUTTON */}
        <div className="flex justify-between pt-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2 border-2 border-orange-400 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition"
          >
            <ArrowLeft size={16}/>
            Kembali
          </button>
          <button 
            onClick={() => navigate('/konfirmasipeminjaman', { state: { ...form, id: editData?.id, isEdit: !!editData } })}
            className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition shadow-md"
          >
            Lanjut
            <ArrowRight size={16}/>
          </button>
        </div>
      </div>
    </div>
  )
}
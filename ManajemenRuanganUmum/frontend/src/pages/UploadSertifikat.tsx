import "../index.css"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { apiUrl } from "../lib/api"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { 
  Award, 
  User, 
  Image as ImageIcon, 
  ArrowLeft, 
  Upload,
  CheckCircle2,
  Calendar
} from "lucide-react"

import SectionHeader from "../components/PeminjamanComponents/SectionHeader"
import FormField from "../components/PeminjamanComponents/FormField"
import RadioCard from "../components/PeminjamanComponents/RadioCard"
import Toast from "../components/DashboardComponents/Toast"

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"

export default function UploadSertifikat() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    namaPenerima: "",
    penghargaan: "ASN TERBAIK",
    tanggal: format(new Date(), "EEEE, dd MMM yyyy", { locale: id }),
    foto: null as File | null
  })

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [openCalendar, setOpenCalendar] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [toast, setToast] = useState({ show: false, message: "", type: 'success' as 'success' | 'error' })

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm(prev => ({ ...prev, foto: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: any) => {
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

  const handleSubmit = async () => {
    try {
      const response = await fetch(apiUrl('/api/certificates'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          namaPenerima: form.namaPenerima,
          penghargaan: form.penghargaan,
          tanggal: form.tanggal,
          foto: preview,
        }),
      });

      if (response.ok) {
        setToast({ show: true, message: "Sertifikat berhasil diupload!", type: 'success' });
        // Reset form to blank instead of navigating
        setForm({
          namaPenerima: "",
          penghargaan: "ASN TERBAIK",
          tanggal: format(new Date(), "EEEE, dd MMM yyyy", { locale: id }),
          foto: null
        });
        setSelectedDate(new Date());
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const errorData = await response.json().catch(() => ({ message: "Ukuran file terlalu besar atau terjadi kesalahan server" }));
        setToast({ show: true, message: `Gagal upload: ${errorData.message}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error uploading certificate:', error);
      setToast({ show: true, message: "Terjadi kesalahan saat upload sertifikat.", type: 'error' });
    }
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  }

  return (
    <div className="flex flex-col pt-4 relative">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-7 space-y-8">
        
        {/* INFORMASI PENERIMA */}
        <section>
          <SectionHeader 
            icon={<User className="w-5 h-5" />} 
            title="Informasi Penerima" 
            divider={false} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Nama Penerima">
              <input 
                type="text" 
                className={inputClass}
                placeholder="Masukkan nama lengkap penerima"
                value={form.namaPenerima}
                onChange={(e) => handleChange("namaPenerima", e.target.value)}
              />
            </FormField>
            <FormField label="Tanggal Upload">
              <div className="relative" ref={calendarRef}>
                <button
                  type="button"
                  onClick={() => setOpenCalendar(!openCalendar)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:border-orange-400 transition min-h-[40px]"
                >
                  <span className="text-gray-700">
                    {selectedDate
                      ? format(selectedDate, "dd MMMM yyyy", { locale: id })
                      : "Pilih tanggal"}
                  </span>
                  <Calendar size={18} className="text-gray-400" />
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
            </FormField>
          </div>
        </section>

        {/* PENPENGHARGAAN */}
        <section>
          <SectionHeader 
            icon={<Award className="w-5 h-5" />} 
            title="Kategori Penghargaan" 
          />
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <RadioCard 
              label="ASN TERBAIK"
              description="Penghargaan untuk Aparatur Sipil Negara"
              selected={form.penghargaan === "ASN TERBAIK"}
              onClick={() => handleChange("penghargaan", "ASN TERBAIK")}
            />
            <RadioCard 
              label="PPPK Paruh Waktu Terbaik"
              description="Penghargaan untuk PPPK Paruh Waktu"
              selected={form.penghargaan === "PPPK Paruh Waktu Terbaik"}
              onClick={() => handleChange("penghargaan", "PPPK Paruh Waktu Terbaik")}
            />
          </div>
        </section>

        {/* LAMPIRAN FOTO */}
        <section>
          <SectionHeader 
            icon={<ImageIcon className="w-5 h-5" />} 
            title="Lampiran Foto Sertifikat" 
          />
          <div className="mt-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              
              {preview ? (
                <div className="relative w-full max-w-md">
                  <img src={preview} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <p className="text-white font-bold text-sm">Ganti Foto</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100 transition-colors">
                    <Upload className="text-gray-400 group-hover:text-orange-500 w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Klik untuk Upload Foto</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG atau JPEG (Max. 5MB)</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="flex justify-between pt-6 border-t border-gray-100">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2 border-2 border-gray-200 text-gray-500 font-bold rounded-lg hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} />
            Batal
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!form.namaPenerima || !form.foto}
            className={`
              flex items-center gap-2 px-8 py-2 font-bold rounded-lg shadow-lg transition-all
              ${(!form.namaPenerima || !form.foto) 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02]"}
            `}
          >
            Simpan Sertifikat
            <CheckCircle2 size={18} />
          </button>
        </div>

      </div>
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  )
}

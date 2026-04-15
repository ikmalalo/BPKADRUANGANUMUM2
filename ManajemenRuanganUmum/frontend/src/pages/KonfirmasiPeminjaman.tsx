import { useState } from "react"
import "../index.css"
import { ArrowLeft, ArrowRight, FileText } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import AppNotification from "../components/Common/Notification"
import { apiUrl } from "../lib/api"

export default function KonfirmasiPeminjaman() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [notification, setNotification] = useState<{
    show: boolean
    type: "success" | "error" | "info"
    title: string
    message: string
    onConfirm?: () => void
  }>({
    show: false,
    type: "info",
    title: "",
    message: ""
  })

  // Fallback data if state is missing
  const data = (state as any) || {
    ruangan: "-",
    tanggal: "-",
    waktuMulai: "-",
    waktuSelesai: "-",
    namaAcara: "-",
    pelaksana: "-",
    jenisRuangan: "bpkad",
    dihadiri: ""
  }

  return (
    <div className="flex flex-col pt-4">
      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-300 p-8">

        <div className="flex items-center gap-2 mb-8 text-gray-900">
          <FileText className="text-orange-500" size={24} />
          <h3 className="text-lg font-bold">Ringkasan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8 mb-10">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">RUANGAN</p>
            <p className="text-sm font-bold text-gray-900 uppercase">
              {data.jenisRuangan === "bpkad" ? "BPKAD" : "PEMKOT"} - {data.ruangan}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">TANGGAL & WAKTU</p>
            <p className="text-sm font-bold text-gray-900 uppercase">
              {data.tanggal}, {data.waktuMulai} - {data.waktuSelesai} WITA
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">NAMA KEGIATAN</p>
            <p className="text-sm font-bold text-gray-900 uppercase">{data.namaAcara}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">PENYELENGGARA</p>
            <p className="text-sm font-bold text-gray-900 uppercase">{data.pelaksana}</p>
          </div>
          {data.jenisRuangan === "pemkot" && data.dihadiri && (
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">DIHADIRI</p>
              <p className="text-sm font-bold text-gray-900 uppercase">{data.dihadiri}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4">
          <button
            onClick={() => navigate('/peminjaman')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-orange-400 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
          <button
            onClick={async () => {
              const isEdit = (data as any).isEdit;
              const url = isEdit 
                ? apiUrl(`/api/agendas/${(data as any).id}`) 
                : apiUrl('/api/agendas');
              const method = isEdit ? 'PUT' : 'POST';

              try {
                const response = await fetch(url, {
                  method: method,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                })

                if (response.ok) {
                  setNotification({
                    show: true,
                    type: "success",
                    title: isEdit ? "Perubahan Disimpan" : "Peminjaman Berhasil",
                    message: isEdit 
                      ? "Perubahan pada peminjaman ruangan Anda telah berhasil disimpan."
                      : "Permohonan peminjaman ruangan Anda telah berhasil dikirim.",
                    onConfirm: () => navigate('/riwayat')
                  })
                } else {
                  const errorData = await response.json()
                  setNotification({
                    show: true,
                    type: "error",
                    title: "Gagal Mengajukan",
                    message: errorData.message || "Terjadi kesalahan saat memproses data."
                  })
                }
              } catch (error) {
                setNotification({
                  show: true,
                  type: "error",
                  title: "Koneksi Gagal",
                  message: "Terjadi kesalahan saat menghubungkan ke server."
                })
              }
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition shadow-md shadow-orange-500/30"
          >
            Konfirmasi Peminjaman
            <ArrowRight size={18} />
          </button>
        </div>

      </div>

      <AppNotification 
        {...notification}
        onClose={() => {
          setNotification(prev => ({ ...prev, show: false }))
          if (notification.onConfirm) notification.onConfirm()
        }}
      />
    </div>
  )
}

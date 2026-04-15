import { useState } from "react"
import { Trash2, Calendar, User, Award, Eye, X } from "lucide-react"

interface Certificate {
  id: number
  nama_penerima: string
  penghargaan: string
  tanggal: string
  foto: string
}

interface Props {
  certificates: Certificate[]
  onDelete: (id: number) => void
}

export default function CertificateTable({ certificates, onDelete }: Props) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  return (
    <section className="mt-12">
      <h3 className="text-lg font-bold mb-4 text-gray-700 uppercase tracking-tight flex items-center gap-2">
        <div className="w-1.5 h-6 bg-yellow-500 rounded-full"></div>
        Daftar Sertifikat Terupload
      </h3>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-yellow-500 text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 text-center">NO</th>
                <th className="p-4 text-left">NAMA PENERIMA</th>
                <th className="p-4 text-left">PENGHARGAAN</th>
                <th className="p-4 text-center">TANGGAL</th>
                <th className="p-4 text-center">FOTO</th>
                <th className="p-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {certificates.length > 0 ? (
                certificates.map((cert, index) => (
                  <tr key={cert.id} className="border-b border-gray-100 hover:bg-yellow-50 transition-colors">
                    <td className="p-4 text-center font-bold text-gray-400">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <span className="font-bold text-gray-900">{cert.nama_penerima}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-yellow-600" />
                        <span className="font-medium">{cert.penghargaan}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-xs font-medium text-gray-500">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar size={12} />
                        {cert.tanggal}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedPhoto(cert.foto)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Lihat Sertifikat"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onDelete(cert.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                    Belum ada sertifikat yang diupload
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 md:p-10" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>
            <div className="p-2">
              <img src={selectedPhoto} alt="Sertifikat" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-center">
               <p className="text-sm text-gray-500 font-medium italic text-center">Pratinjau Sertifikat</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

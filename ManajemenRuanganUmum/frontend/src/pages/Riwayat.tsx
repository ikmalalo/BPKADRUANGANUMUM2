import { useState, useEffect } from "react"
import { apiUrl } from "../lib/api"
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react"

interface AgendaItem {
  id: number
  hari: string
  tanggal: string
  tempat: string
  pukul: string
  acara: string
  pelaksana: string
  status: string
  type: string
}

export default function Riwayat() {
  const [agendas, setAgendas] = useState<AgendaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  useEffect(() => {
    const fetchAgendas = async () => {
      try {
        const response = await fetch(apiUrl('/api/agendas'))
        const data = await response.json()
        // Sort by ID descending to show newest first (history)
        setAgendas([...data].reverse())
        setLoading(false)
      } catch (error) {
        console.error('Error fetching history:', error)
        setLoading(false)
      }
    }
    fetchAgendas()
  }, [])

  const handleClearHistory = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus semua riwayat peminjaman yang sudah selesai?")) return;
    
    try {
      const response = await fetch(apiUrl('/api/agendas/history'), {
        method: 'DELETE',
      });
      if (response.ok) {
        setAgendas(prev => prev.filter(a => a.status !== 'Selesai'));
      } else {
        alert("Gagal menghapus riwayat.");
      }
    } catch (error) {
      console.error('Error clearing history:', error);
      alert("Terjadi kesalahan saat menghapus riwayat.");
    }
  };

  const totalPages = Math.ceil(agendas.length / rowsPerPage)
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentAgendas = agendas.slice(indexOfFirstRow, indexOfLastRow)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Riwayat Peminjaman</h2>
        {agendas.some(a => a.status === 'Selesai') && (
          <button 
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-xs hover:bg-red-100 transition-colors shadow-sm border border-red-100"
          >
            <Trash2 size={14} />
            Hapus Semua Riwayat
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium">Memuat Riwayat...</p>
          </div>
        ) : agendas.length === 0 ? (
          <div className="p-20 text-center text-gray-400 font-medium">
            Belum ada riwayat peminjaman.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 border-b">
              <tr className="text-left text-gray-600 uppercase font-bold text-[11px] tracking-wider">
                <th className="p-4 w-12 text-center">NO</th>
                <th className="p-4">Hari / Tanggal</th>
                <th className="p-4">Ruangan</th>
                <th className="p-4">Pukul</th>
                <th className="p-4">Acara</th>
                <th className="p-4">Pelaksana</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {currentAgendas.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-center font-bold text-gray-400">{indexOfFirstRow + index + 1}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{item.hari}</div>
                    <div className="text-xs text-gray-400">{item.tanggal}</div>
                  </td>
                  <td className="p-4 font-medium">{item.tempat}</td>
                  <td className="p-4 text-orange-600 font-bold">{item.pukul}</td>
                  <td className="p-4 font-semibold uppercase text-xs max-w-xs">{item.acara}</td>
                  <td className="p-4 text-gray-500">{item.pelaksana}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase
                      ${item.status === "Berlangsung" ? "bg-green-100 text-green-600" : 
                        item.status === "Selesai" ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-600"}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && agendas.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-4 px-2">
          <div className="text-xs text-gray-500 font-medium">
            Menampilkan <span className="text-gray-900">{indexOfFirstRow + 1} - {Math.min(indexOfLastRow, agendas.length)}</span> dari <span className="text-gray-900">{agendas.length}</span> data
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
              className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50" 
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16}/>
            </button>
            <span className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-lg text-sm font-bold shadow-md shadow-orange-200">
              {currentPage}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
              className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50" 
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={16}/>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
import { useState, useEffect, useMemo, useRef } from "react"

declare global {
  interface Window {
    VANTA: any;
  }
}
import logo from "../assets/images/logo.png"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { apiUrl } from "../lib/api"

interface AgendaItem {
  id: number
  hari: string
  tanggal: string
  tempat: string
  pukul: string
  acara: string
  pelaksana: string
  dihadiri?: string
  status: "Berlangsung" | "Terjadwal"
  type: "BPKAD" | "PEMKOT"
}

interface CertificateItem {
  id: number
  nama_penerima: string
  penghargaan: string
  tanggal: string
  foto: string // base64
}

type SlideItem = { type: 'AGENDA'; data: AgendaItem[]; category: 'BPKAD' | 'PEMKOT'; startIndex: number } | { type: 'CERTIFICATE'; data: CertificateItem }

export default function PreviewHorizontal() {
  const navigate = useNavigate()
  const isVisitor = sessionStorage.getItem('isVisitor') === 'true'
  const [time, setTime] = useState(new Date())
  const [allAgendas, setAllAgendas] = useState<AgendaItem[]>([])
  const [allCertificates, setAllCertificates] = useState<CertificateItem[]>([])
  const [loading, setLoading] = useState(true)

  const vantaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let effect: any = null

    const init = () => {
      if (vantaRef.current && window.VANTA?.GLOBE) {
        effect = window.VANTA.GLOBE({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xff6a00,
          color2: 0xffffff,
          size: 0.9,
          backgroundColor: 0xffffff
        })
        return true
      }
      return false
    }

    if (!init()) {
      const poll = setInterval(() => {
        if (init()) clearInterval(poll)
      }, 100)
      return () => { clearInterval(poll); if (effect) effect.destroy() }
    }

    return () => { if (effect) effect.destroy() }
  }, [])

  const fetchData = async () => {
    try {
      const [respAgendas, respCerts] = await Promise.all([
        fetch(apiUrl('/api/agendas')),
        fetch(apiUrl('/api/certificates'))
      ])
      const agendas = await respAgendas.json()
      const certs = await respCerts.json()
      setAllAgendas(agendas)
      setAllCertificates(certs)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const refreshInterval = setInterval(fetchData, 30000)
    return () => clearInterval(refreshInterval)
  }, [])

  const itemsPerPageCount = 6

  const pages = useMemo(() => {
    const slides: SlideItem[] = []
    
    // Group Agendas
    const monthMap: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
      'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
    };

    const parseIndoDate = (dateStr: string) => {
      const match = dateStr.match(/, (\d{1,2}) (\w{3}) (\d{4})/);
      if (!match) return new Date(0);
      const day = parseInt(match[1]);
      const monthStr = match[2];
      const year = parseInt(match[3]);
      return new Date(year, monthMap[monthStr] || 0, day);
    };

    const parseTime = (pukul: string) => {
      const startTime = pukul.split(' - ')[0];
      const match = startTime.match(/(\d{1,2})[:.](\d{1,2})/);
      if (!match) return 0;
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    };

    const sortedAgendas = [...allAgendas]
      .filter(item => item.status !== "Selesai")
      .sort((a, b) => {
        const dateA = parseIndoDate(a.tanggal).getTime();
        const dateB = parseIndoDate(b.tanggal).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return parseTime(a.pukul) - parseTime(b.pukul);
      });

    const bpkad = sortedAgendas.filter(item => item.type === "BPKAD")
    const pemkot = sortedAgendas.filter(item => item.type === "PEMKOT")

    const chunk = (arr: AgendaItem[], size: number, category: 'BPKAD' | 'PEMKOT') => {
      for (let i = 0; i < arr.length; i += size) {
        slides.push({ type: 'AGENDA', data: arr.slice(i, i + size), category, startIndex: i })
      }
    }

    chunk(bpkad, itemsPerPageCount, 'BPKAD')
    chunk(pemkot, itemsPerPageCount, 'PEMKOT')

    // Add Certificates as individual slides
    allCertificates.forEach(cert => {
      slides.push({ type: 'CERTIFICATE', data: cert })
    })

    return slides
  }, [allAgendas, allCertificates])

  const [currentPage, setCurrentPage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (pages.length === 0) return
    const interval = 50
    // Agenda: 20 detik, Sertifikat: 15 detik
    const currentSlideType = pages[currentPage]?.type;
    const duration = currentSlideType === 'CERTIFICATE' ? 15000 : 20000;
    const step = (interval / duration) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentPage((oldPage) => (oldPage + 1) % pages.length)
          return 0
        }
        return prev + step
      })
    }, interval)
    return () => clearInterval(timer)
  }, [pages.length, currentPage])

  const handlePageClick = (index: number) => {
    setCurrentPage(index);
    setProgress(0); // Reset progress when manually changing page
  };

  const currentSlide = pages[currentPage]

  const pageTitle = useMemo(() => {
    if (!currentSlide) return "AGENDA RUANG RAPAT"
    if (currentSlide.type === 'AGENDA') return `AGENDA RUANG RAPAT ${currentSlide.category}`
    return "PENGHARGAAN & SERTIFIKAT"
  }, [currentSlide])

  if (loading && allAgendas.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-sm">Menghubungkan ke Database...</p>
      </div>
    )
  }

  return (
    <div className="bg-white/60 h-screen relative overflow-hidden flex flex-col">
      {/* Vanta DOTS Background */}
      <div ref={vantaRef} className="absolute inset-0 z-0"></div>
      <div className="relative z-10 h-full flex flex-col">
      <div className="fixed top-0 left-0 w-20 h-20 z-50 group flex items-start justify-start p-3">
        <button onClick={() => isVisitor ? navigate('/') : navigate('/preview')} className="bg-white/60 p-2 rounded-full shadow-2xl border border-gray-100 text-orange-500 transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 active:scale-90">
          <ArrowLeft size={18} strokeWidth={3} />
        </button>
      </div>

        <div className="flex-1 p-3 md:p-5 flex flex-col w-full max-w-[1920px] mx-auto overflow-hidden">
        <div className="flex justify-between items-center mb-2 pl-8 md:pl-0">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-gray-800 leading-none">{format(time, "HH:mm")}</span>
              <span className="text-xl md:text-2xl font-bold text-orange-500">WITA</span>
            </div>
            <span className="text-base md:text-lg font-bold text-orange-500 uppercase tracking-widest leading-none mt-1">
              {format(time, "EEEE, dd MMMM yyyy", { locale: id })}
            </span>
          </div>
          <img src={logo} alt="Logo" className="h-14 md:h-16 object-contain" />
        </div>

        <div className="w-full h-1.5 rounded-full overflow-hidden flex mb-3 shadow-inner bg-gray-200">
          <div className="bg-orange-500 h-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight uppercase leading-none">{pageTitle}</h1>
          <div className="flex gap-2">
            {pages.map((_, i) => (
              <div 
                key={i} 
                onClick={() => handlePageClick(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-150 ${i === currentPage ? "bg-orange-500 scale-125 shadow-lg shadow-orange-200" : "bg-gray-300 shadow-sm"}`}
              ></div>
            ))}
          </div>
        </div>

        <div className="bg-white/60 rounded-[1.2rem] shadow-xl overflow-hidden border border-gray-100 w-full flex-1 flex flex-col relative">
          <div 
            key={currentPage} 
            className="flex-1 flex flex-col w-full"
          >
            {currentSlide?.type === 'AGENDA' ? (
              <table className="w-full border-collapse flex-1 flex flex-col items-stretch">
              <thead className="animate-slide-right">
                <tr className="bg-orange-500 text-white flex w-full">
                  <th className="py-2 px-2 text-center text-[10px] md:text-sm font-black w-[5%] min-w-[40px] hidden md:flex items-center justify-center">NO</th>
                  <th className="py-2 px-4 text-left text-[9px] md:text-[14px] font-black w-[15%] min-w-[100px] flex items-center">HARI / TANGGAL</th>
                  <th className="py-2 px-4 text-left text-[8px] md:text-[13px] font-black flex-1 min-w-[120px] flex items-center">TEMPAT</th>
                  <th className="py-2 px-4 text-center text-[9px] md:text-[14px] font-black w-[10%] min-w-[90px] flex items-center justify-center">PUKUL</th>
                  <th className="py-2 px-6 text-left text-[9px] md:text-[14px] font-black flex-[2] min-w-[200px] flex items-center">ACARA</th>
                  <th className="py-2 px-4 text-left text-[9px] md:text-[14px] font-black w-[12%] min-w-[100px] hidden lg:flex items-center">PELAKSANA</th>
                  {currentSlide.category === 'PEMKOT' && (
                    <th className="py-2 px-4 text-left text-[9px] md:text-[14px] font-black w-[15%] min-w-[100px] hidden lg:flex items-center">DIHADIRI</th>
                  )}
                  <th className="py-2 px-2 md:px-4 text-center text-[10px] md:text-sm font-black w-[15%] min-w-[80px] flex items-center justify-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 flex-1 flex flex-col w-full overflow-hidden">
                {currentSlide.data.map((item, idx) => (
                  <tr 
                    key={`${currentPage}-${idx}`} 
                    className="hover:bg-orange-50/40 transition-all duration-300 flex w-full min-h-[80px] items-stretch animate-slide-right opacity-0"
                    style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
                  >
                    <td className="px-2 text-[10px] md:text-sm font-black text-gray-400 text-center w-[5%] min-w-[40px] hidden md:flex items-center justify-center">
                      {currentSlide.type === 'AGENDA' ? currentSlide.startIndex + idx + 1 : idx + 1}
                    </td>
                    <td className="px-4 w-[15%] min-w-[100px] flex flex-col justify-center min-w-0">
                      <span className="text-[9px] md:text-[11px] font-black text-gray-800 uppercase leading-none mb-1">{item.hari}</span>
                      <span className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider">{item.tanggal.split(', ')[1] || item.tanggal}</span>
                    </td>
                    <td className="px-4 flex-1 min-w-[120px] flex items-center font-black text-[9px] md:text-[11px] lg:text-[12px] text-gray-800 uppercase leading-tight">{item.tempat}</td>
                    <td className="px-4 w-[10%] min-w-[90px] flex items-center justify-center"><span className="text-[9px] md:text-[11px] lg:text-[12px] font-black text-orange-500 bg-orange-50 px-1.5 md:px-2.5 py-1 rounded-md whitespace-nowrap">{item.pukul}</span></td>
                    <td className="px-6 flex-[2] min-w-[200px] flex items-center font-black text-[9px] md:text-[11px] lg:text-[12px] text-gray-800 uppercase leading-tight">{item.acara}</td>
                    <td className="px-4 w-[12%] min-w-[100px] hidden lg:flex items-center font-black text-[10px] md:text-[11px] text-gray-800 uppercase">{item.pelaksana}</td>
                    {item.type === 'PEMKOT' && (
                      <td className="px-4 w-[15%] min-w-[100px] hidden lg:flex items-center font-black text-[10px] md:text-[11px] text-gray-800 uppercase">{item.dihadiri || '-'}</td>
                    )}
                    <td className="px-2 md:px-4 w-[15%] min-w-[80px] flex items-center justify-center">
                      <span className={`inline-flex items-center justify-center py-1 md:py-1.5 px-4 rounded-lg md:rounded-xl text-[9px] md:text-[11px] font-black text-white min-w-[85px] transition-all duration-300 ${item.status === 'Berlangsung' ? 'bg-[#10b981] animate-glow-green' : 'bg-[#3b82f6] animate-glow-blue'}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : currentSlide?.type === 'CERTIFICATE' ? (
            <div className="flex-1 flex items-center justify-center bg-white/0 overflow-hidden p-10 animate-slide-right">
                <img 
                  src={currentSlide.data.foto} 
                  alt="Sertifikat" 
                  style={{ maxHeight: '72vh', maxWidth: '85vw' }}
                  className="w-auto h-auto object-contain border-[12px] border-white rounded-lg" 
                />
            </div>
            ) : null}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

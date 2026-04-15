import { useState, useEffect, useMemo, useRef } from "react"
import { useLocation } from "react-router-dom"

declare global {
  interface Window {
    VANTA: any;
    __SLIDE_COUNT__: number;
    __SET_PROGRESS: (val: number) => void;
    __SET_PAGE: (idx: number) => void;
  }
}
import logo from "../assets/images/logo.png"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ArrowLeft, ChevronLeft, ChevronRight, Video, Loader2, Download } from "lucide-react"
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

type SlideItem = { type: 'AGENDA'; data: AgendaItem[]; category: 'BPKAD' | 'PEMKOT'; startIndex: number }

export default function PreviewVertikal() {
  const navigate = useNavigate()
  const location = useLocation()
  const isPuppet = new URLSearchParams(location.search).get('puppet') === '1'
  const slideDurationParam = new URLSearchParams(location.search).get('slideDuration')
  const isVisitor = sessionStorage.getItem('isVisitor') === 'true'
  const [time, setTime] = useState(new Date())
  const [allAgendas, setAllAgendas] = useState<AgendaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordDone, setRecordDone] = useState(false)

  const vantaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let effect: any = null

    const init = () => {
      // Jangan jalankan Vanta jika sedang direkam (Puppeteer) agar server Railway tidak berat/crash
      if (isPuppet) return true;

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
          size: 0.8,
          backgroundColor: 0xffffff
        })
        return true
      }
      return false
    }

    if (isPuppet) return; // Langsung keluar jika direkam

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
      const resp = await fetch(apiUrl('/api/agendas'))
      const agendas = await resp.json()
      setAllAgendas(agendas)
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

  const itemsPerPageCount = 2
  const SLIDE_DURATION = 20000

  const pages = useMemo(() => {
    const slides: SlideItem[] = []

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
      .filter(item => {
        if (item.status === "Selesai") return false;
        if (isPuppet) return item.status === "Terjadwal";
        return true;
      })
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

    return slides
  }, [allAgendas])

  // Expose slide count to window so Puppeteer can read it
  useEffect(() => {
    window.__SLIDE_COUNT__ = pages.length
  }, [pages.length])

  const [currentPage, setCurrentPage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null)
  const MIN_SWIPE_DISTANCE = 120

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Expand window object type implicitly or via any
    window.__SET_PROGRESS = (val: number) => setProgress(val)
    window.__SET_PAGE = (idx: number) => {
      setCurrentPage(idx)
      setProgress(0)
    }

    if (pages.length === 0) return
    const interval = 50
    // Gunakan durasi dari URL jika sedang direkam (Puppeteer), kalau tidak gunakan durasi default 20s
    const activeDuration = (isPuppet && slideDurationParam) ? parseInt(slideDurationParam) : SLIDE_DURATION
    const step = (interval / activeDuration) * 100
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Hanya pindah halaman otomatis di browser biasa, jangan saat direkam 
          // (karena Puppeteer yang mengatur pergerakan halamannya dari backend)
          if (!isPuppet) {
            setCurrentPage((oldPage) => (oldPage + 1) % pages.length)
            return 0
          }
          return 100 // Tahan di 100% saat direkam per halaman
        }
        return prev + step
      })
    }, interval)
    return () => clearInterval(timer)
  }, [pages.length, isPuppet, slideDurationParam])

  const handlePageClick = (index: number) => {
    setCurrentPage(index);
    setProgress(0);
  };

  const handleRecord = async () => {
    setIsRecording(true)
    setRecordDone(false)
    try {
      const frontendUrl = window.location.origin + '/preview-vertikal'
      // Durasi rekam per halaman: 20 detik (sudah aman karena Globe dimatikan)
      const RECORD_DURATION = 20000 
      const recordUrl = `${apiUrl('/api/record/portrait')}?url=${encodeURIComponent(frontendUrl)}&slideDuration=${RECORD_DURATION}&t=${Date.now()}`

      const response = await fetch(recordUrl)
      if (!response.ok) {
        let errMsg = 'Unknown error'
        try { const err = await response.json(); errMsg = err.error || errMsg } catch { }
        alert('Gagal merekam: ' + errMsg)
        setIsRecording(false)
        return
      }

      // Terima video MP4 dari Cloud sebagai file dan simpan ke Downloads user
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `Preview-Portrait-9-16.mp4`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(downloadUrl)

      setRecordDone(true)
      setTimeout(() => setRecordDone(false), 4000)
    } catch (e: any) {
      alert('Error: ' + e.message + '\n\nPerekaman butuh proses berat di server (sekitar 30-40 detik). Mohon ulangi jika gagal.')
    } finally {
      setIsRecording(false)
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchCurrent(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchCurrent(e.targetTouches[0].clientX)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    const touchEnd = e.changedTouches[0].clientX
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE

    if (isLeftSwipe) {
      // Next Page
      setCurrentPage((prev) => (prev + 1) % pages.length)
      setProgress(0)
    } else if (isRightSwipe) {
      // Prev Page
      setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length)
      setProgress(0)
    }

    setTouchStart(null)
    setTouchCurrent(null)
  }

  const currentSlide = pages[currentPage]

  const pageTitle = useMemo(() => {
    if (!currentSlide) return "AGENDA RUANG RAPAT"
    return `AGENDA RUANG RAPAT ${currentSlide.category}`
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
    <div
      className="bg-white h-screen relative overflow-hidden flex flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Vanta DOTS Background */}
      <div ref={vantaRef} className="absolute inset-0 z-0"></div>
      <div className="relative z-10 h-full flex flex-col">

        {/* Back button — hidden in puppet mode */}
        {!isPuppet && (
          <div className="fixed top-0 left-0 w-20 h-20 z-50 group flex items-start justify-start p-3">
            <button onClick={() => isVisitor ? navigate('/') : navigate('/preview')} className="bg-white p-2 rounded-full shadow-2xl border border-gray-100 text-orange-500 transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 active:scale-90">
              <ArrowLeft size={18} strokeWidth={3} />
            </button>
          </div>
        )}

        {/* Record button — hidden in puppet mode */}
        {!isPuppet && (
          <div className="fixed top-3 right-3 z-50">
            <button
              id="btn-record-portrait"
              onClick={handleRecord}
              disabled={isRecording || pages.length === 0}
              title="Rekam semua halaman sebagai MP4 Portrait 9:16"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-xl border transition-all duration-300
              ${recordDone
                  ? 'bg-green-500 border-green-400 text-white shadow-green-300/50 scale-95'
                  : isRecording
                    ? 'bg-orange-100 border-orange-300 text-orange-500 cursor-wait'
                    : pages.length === 0
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-orange-300 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-orange-300/50'
                }`
              }
            >
              {isRecording ? (
                <><Loader2 size={14} className="animate-spin" /><span>Merekam...</span></>
              ) : recordDone ? (
                <><Download size={14} /><span>Tersimpan!</span></>
              ) : (
                <><Video size={14} /><span>Rekam MP4</span></>
              )}
            </button>
          </div>
        )}

        <div className="flex-1 p-3 md:p-4 flex flex-col w-full mx-auto overflow-hidden">
          <div className="flex flex-col items-center mb-3 text-center">
            <img src={logo} alt="Logo" className="h-10 mb-2 object-contain" />
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl font-black text-gray-800">{format(time, "HH:mm")}</span>
                <span className="text-base md:text-lg font-bold text-orange-500">WITA</span>
              </div>
              <span className={`${isPuppet ? 'text-sm md:text-base mt-1' : 'text-xs md:text-sm mt-1'} font-bold text-orange-500 uppercase tracking-widest leading-none`}>
                {format(time, "EEEE, dd MMMM yyyy", { locale: id })}
              </span>
            </div>
          </div>

          <div className="w-full h-1.5 rounded-full overflow-hidden flex mb-3 shadow-inner bg-gray-200">
            <div className="bg-orange-500 h-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="flex flex-col items-center mb-3 text-center">
            <h1 className="text-base md:text-lg font-black text-gray-800 tracking-tight uppercase leading-tight mb-2 min-h-[1.5em]">{pageTitle}</h1>
            <div className="flex gap-1">
              {pages.map((_, i) => (
                <div
                  key={i}
                  data-slide-dot={i}
                  onClick={() => handlePageClick(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-150 ${i === currentPage ? "bg-orange-500 scale-110 shadow-lg shadow-orange-200" : "bg-gray-300 shadow-sm"}`}
                ></div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {currentSlide?.type === 'AGENDA' ? (
              <div key={currentPage} className="flex flex-col gap-4">
                {currentSlide.data.map((item, idx) => (
                  <div
                    key={`${currentPage}-${idx}`}
                    className="bg-white/50 rounded-2xl shadow-[0_8px_32px_rgba(251,146,60,0.1)] border border-orange-500/30 overflow-hidden flex flex-col relative translate-y-0 hover:-translate-y-1 transition-transform animate-slide-right opacity-0"
                    style={{ animationDelay: `${0.1 + idx * 0.2}s` }}
                  >
                    <div className={`absolute top-3 right-3 px-3 py-1 text-[10px] rounded-full font-black text-white shadow-md z-10 transition-all duration-300 ${item.status === "Berlangsung" ? "bg-[#10b981] animate-glow-green" : "bg-[#3b82f6] animate-glow-blue"}`}>
                      {item.status}
                    </div>
                    <div className={`bg-white/10 ${isPuppet ? 'p-2.5 gap-2.5' : 'p-3 gap-3'} border-b border-white/10 flex items-center`}>
                      <div className={`${isPuppet ? 'w-7 h-7 text-sm' : 'w-8 h-8 text-base'} rounded-xl bg-orange-500 flex items-center justify-center text-white font-black shadow-orange-200 shadow-lg`}>
                        {currentSlide.type === 'AGENDA' ? currentSlide.startIndex + idx + 1 : idx + 1}
                      </div>
                      <div>
                        <div className={`${isPuppet ? 'text-[8px]' : 'text-[9px]'} font-bold text-gray-400 uppercase tracking-wider leading-none`}>{item.hari}</div>
                        <div className={`${isPuppet ? 'text-[10px]' : 'text-[11px]'} font-black text-gray-600 uppercase mt-0.5`}>{item.tanggal.split(', ')[1] || item.tanggal}</div>
                        <div className={`${isPuppet ? 'text-sm' : 'text-sm'} font-black text-orange-500 leading-none mt-1`}>{item.pukul}</div>
                      </div>
                    </div>
                    <div className={`${isPuppet ? 'p-3' : 'p-4'} flex-1`}>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        {/* Row 1: Acara & Pelaksana */}
                        <div>
                          <div className={`${isPuppet ? 'text-[8px] mb-0.5' : 'text-[9px] mb-0.5'} font-bold text-orange-500 uppercase tracking-widest`}>ACARA / AGENDA</div>
                          <h3 className={`${isPuppet ? 'text-xs' : 'text-xs'} font-black text-gray-800 leading-tight uppercase line-clamp-5`}>{item.acara}</h3>
                        </div>
                        <div>
                          <div className={`${isPuppet ? 'text-[8px] mb-0.5' : 'text-[9px] mb-0.5'} font-bold text-orange-500 uppercase tracking-widest`}>PELAKSANA</div>
                          <div className={`${isPuppet ? 'text-[10px]' : 'text-xs'} font-black text-gray-700 uppercase leading-snug`}>{item.pelaksana}</div>
                        </div>

                        {/* Row 2: Tempat & Dihadiri */}
                        <div>
                          <div className={`${isPuppet ? 'text-[8px] mb-0.5' : 'text-[9px] mb-0.5'} font-bold text-orange-500 uppercase tracking-widest`}>TEMPAT</div>
                          <div className={`${isPuppet ? 'text-[10px]' : 'text-xs'} font-black text-gray-700 uppercase leading-snug`}>{item.tempat}</div>
                        </div>
                        <div>
                          {item.type === 'PEMKOT' && (
                            <>
                              <div className={`${isPuppet ? 'text-[8px] mb-0.5' : 'text-[9px] mb-0.5'} font-bold text-orange-500 uppercase tracking-widest`}>DIHADIRI</div>
                              <div className={`${isPuppet ? 'text-[10px]' : 'text-xs'} font-black text-gray-700 uppercase leading-snug`}>{item.dihadiri || '-'}</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Swipe Feedback Overlay (Dynamic Pull Only) */}
        {touchStart !== null && touchCurrent !== null ? (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100]">
            {/* Pulling Feedback */}
            {touchStart - touchCurrent > 20 && (
              <div
                className="fixed right-0 bg-orange-500/10 text-orange-500 p-4 rounded-l-3xl backdrop-blur-sm transition-all duration-75 flex items-center justify-center border-l-2 border-y-2 border-orange-500/20"
                style={{
                  opacity: Math.min((touchStart - touchCurrent) / 200, 0.8),
                  transform: `translateX(${Math.max(40 - (touchStart - touchCurrent) / 4, 0)}px)`
                }}
              >
                <ChevronRight size={60} strokeWidth={4} />
              </div>
            )}
            {touchCurrent - touchStart > 20 && (
              <div
                className="fixed left-0 bg-orange-500/10 text-orange-500 p-4 rounded-r-3xl backdrop-blur-sm transition-all duration-75 flex items-center justify-center border-r-2 border-y-2 border-orange-500/20"
                style={{
                  opacity: Math.min((touchCurrent - touchStart) / 200, 0.8),
                  transform: `translateX(${Math.min(-40 + (touchCurrent - touchStart) / 4, 0)}px)`
                }}
              >
                <ChevronLeft size={60} strokeWidth={4} />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

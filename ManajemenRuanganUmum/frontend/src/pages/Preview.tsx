import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, ArrowLeft } from "lucide-react"
import "../index.css"

declare global {
  interface Window {
    VANTA: any;
  }
}

export default function Preview() {
  const navigate = useNavigate()

  const [selectedLocation, setSelectedLocation] = useState<
    "landscape" | "portrait" | null
  >(null)

  const vantaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let effect: any = null

    const init = () => {
      if (vantaRef.current && window.VANTA?.DOTS) {
        effect = window.VANTA.DOTS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xff6a00,
          color2: 0xff6a00,
          backgroundColor: 0xffffff
        })
        return true
      }
      return false
    }

    if (!init()) {
      // Retry polling until VANTA is ready
      const poll = setInterval(() => {
        if (init()) clearInterval(poll)
      }, 100)
      return () => { clearInterval(poll); if (effect) effect.destroy() }
    }

    return () => { if (effect) effect.destroy() }
  }, [])

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Vanta DOTS Background */}
      <div ref={vantaRef} className="absolute inset-0 z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen py-10 px-4 md:px-8">
      
      {/* Header for Standalone View */}
      <div className="max-w-6xl mx-auto w-full mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">Pilih Mode Tampilan</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Silakan pilih orientasi layar untuk melanjutkan ke preview agenda.</p>
        </div>
        
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#ff6b00] transition-all group"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 md:gap-12 max-w-6xl mx-auto w-full mb-12">

        {/* Landscape */}
        <button
          onClick={() => setSelectedLocation("landscape")}
          className={`group flex-1 relative rounded-2xl p-8 md:p-10 text-left transition-all duration-300 border-2 overflow-hidden
          aspect-[4/3] md:aspect-auto md:h-96 flex flex-col justify-end
          ${
            selectedLocation === "landscape"
              ? "bg-orange-500 border-orange-500 text-white shadow-[0_20px_40px_rgba(249,115,22,0.4)] scale-[1.02]"
              : "bg-white border-gray-100 text-gray-900 hover:border-orange-500 hover:shadow-[0_15px_30px_rgba(249,115,22,0.2)] hover:-translate-y-2"
          }`}
        >
          <div className="relative z-10 mt-auto transition-transform duration-300 group-hover:translate-x-1">
            <h3
              className={`text-4xl md:text-6xl font-black mb-2 tracking-tighter ${
                selectedLocation === "landscape"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Landscape
            </h3>

            <p
              className={`text-lg md:text-xl font-bold ${
                selectedLocation === "landscape"
                  ? "text-orange-50"
                  : "text-gray-400"
              }`}
            >
              Layar Horizontal
            </p>
          </div>
          
          {/* Subtle Decorative Icon/Element */}
          <div className={`absolute top-0 right-0 p-8 transition-opacity duration-300 ${selectedLocation === 'landscape' ? 'opacity-20' : 'opacity-5'}`}>
             <div className="w-32 h-20 border-4 border-current rounded-lg opacity-40"></div>
          </div>
        </button>

        {/* Portrait */}
        <button
          onClick={() => setSelectedLocation("portrait")}
          className={`group flex-1 relative rounded-2xl p-8 md:p-10 text-left transition-all duration-300 border-2 overflow-hidden
          aspect-[4/3] md:aspect-auto md:h-96 flex flex-col justify-end
          ${
            selectedLocation === "portrait"
              ? "bg-orange-500 border-orange-500 text-white shadow-[0_20px_40px_rgba(249,115,22,0.4)] scale-[1.02]"
              : "bg-white border-gray-100 text-gray-900 hover:border-orange-500 hover:shadow-[0_15px_30px_rgba(249,115,22,0.2)] hover:-translate-y-2"
          }`}
        >
          <div className="relative z-10 mt-auto transition-transform duration-300 group-hover:translate-x-1">
            <h3
              className={`text-4xl md:text-6xl font-black mb-2 tracking-tighter ${
                selectedLocation === "portrait"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Portrait
            </h3>

            <p
              className={`text-lg md:text-xl font-bold ${
                selectedLocation === "portrait"
                  ? "text-orange-50"
                  : "text-gray-400"
              }`}
            >
              Layar Vertikal
            </p>
          </div>

          {/* Subtle Decorative Icon/Element */}
          <div className={`absolute top-0 right-0 p-8 transition-opacity duration-300 ${selectedLocation === 'portrait' ? 'opacity-20' : 'opacity-5'}`}>
             <div className="w-20 h-32 border-4 border-current rounded-lg opacity-40"></div>
          </div>
        </button>

      </div>

      {/* Button */}
      <div className="max-w-6xl mx-auto w-full flex justify-end">
        <button
          onClick={() => {
            if (selectedLocation === "landscape") {
              navigate("/preview-horizontal")
            } else if (selectedLocation === "portrait") {
              navigate("/preview-vertikal")
            }
          }}
          disabled={!selectedLocation}
          className={`flex items-center gap-2 px-10 py-4 rounded-xl font-black transition-all duration-300 shadow-sm text-lg
          ${
            selectedLocation
              ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          <span>Lanjut</span>
          <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      </div>
    </div>
  )
}
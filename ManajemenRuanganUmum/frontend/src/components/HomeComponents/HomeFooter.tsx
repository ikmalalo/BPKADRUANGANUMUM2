export default function HomeFooter() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-auto mb-6">
      <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 font-bold text-sm tracking-tight text-center md:text-left">
          BPKAD Kota Samarinda
        </p>
        
        <div className="flex items-center justify-center md:justify-end gap-6 text-[10px] md:text-sm font-black tracking-widest text-[#ff6b00] uppercase">
          <a href="#" className="hover:opacity-80 transition-opacity">Panduan Pengguna</a>
          <span className="text-gray-200 font-normal">|</span>
          <a href="#" className="hover:opacity-80 transition-opacity">Hubungi Kami</a>
        </div>
      </div>
    </div>
  )
}

export default function HomeHeader() {
  return (
    <div className="mt-[2vh] md:mt-6 text-center max-w-2xl px-4 flex flex-col items-center">
      <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#ff6b00] mb-1.5 md:mb-3 uppercase animate-in fade-in slide-in-from-top-4 duration-700 delay-300 fill-mode-both">
        Selamat Datang di Portal Resmi
      </p>
      
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#111827] mb-1.5 md:mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both leading-[1.1]">
        Pilih <span className="text-[#ff6b00]">Akses Layanan</span> Anda
      </h1>
      
      <p className="hidden md:block text-xs md:text-sm font-semibold lg:text-base text-gray leading-relaxed max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-700 fill-mode-both opacity-60">
        Silahkan pilih kategori pengguna untuk melanjutkan akses ke sistem 
        informasi dan pelayanan publik pemerintah kota Samarinda.
      </p>
    </div>
  )
}

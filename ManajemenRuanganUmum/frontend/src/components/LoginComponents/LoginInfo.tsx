import gedung from "../../assets/images/gedung.jpg"

export default function LoginInfo() {
  return (
    <div
      className="hidden md:flex md:w-1/2 bg-cover bg-center items-end justify-center pb-32 relative overflow-hidden"
      style={{ backgroundImage: `url(${gedung})` }}
    >

<div className="absolute inset-0 overflow-hidden pointer-events-none">

  <span className="particle w-2 h-2 left-[8%] bottom-[-40px]" style={{ animationDelay: "0s" }}></span>

  <span className="particle w-3 h-3 left-[15%] bottom-[-40px]" style={{ animationDelay: "1s" }}></span>

  <span className="particle w-2 h-2 left-[22%] bottom-[-40px]" style={{ animationDelay: "2s" }}></span>

  <span className="particle w-3 h-3 left-[30%] bottom-[-40px]" style={{ animationDelay: "3s" }}></span>

  <span className="particle w-2 h-2 left-[38%] bottom-[-40px]" style={{ animationDelay: "4s" }}></span>

  <span className="particle w-2 h-2 left-[45%] bottom-[-40px]" style={{ animationDelay: "1.5s" }}></span>

  <span className="particle w-4 h-4 left-[52%] bottom-[-40px]" style={{ animationDelay: "2.5s" }}></span>

  <span className="particle w-2 h-2 left-[60%] bottom-[-40px]" style={{ animationDelay: "3.5s" }}></span>

  <span className="particle w-3 h-3 left-[68%] bottom-[-40px]" style={{ animationDelay: "0.8s" }}></span>

  <span className="particle w-2 h-2 left-[75%] bottom-[-40px]" style={{ animationDelay: "2.2s" }}></span>

  <span className="particle w-4 h-4 left-[82%] bottom-[-40px]" style={{ animationDelay: "3.2s" }}></span>

  <span className="particle w-2 h-2 left-[90%] bottom-[-40px]" style={{ animationDelay: "4.2s" }}></span>

</div>

      <div className="
        bg-black/40
        backdrop-blur-sm
        border border-white/20
        text-white
        p-6
        md:p-10
        rounded-2xl
        w-[90%]
        max-w-[450px]
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        ">

        <div className="flex items-center gap-3 mb-2">

            <div
                className="
                w-4 h-4
                bg-orange-400
                rounded-full
                animate-pulse
                shadow-[0_0_20px_rgba(251,146,60,1)]
                "
            ></div>

            <p className="text-sm tracking-widest text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.9)]">
                LAYANAN UMUM DIGITAL
            </p>

            </div>

        <h1 className="text-3xl font-bold mb-4">
          Manajemen Administrasi Umum Terintegrasi
        </h1>

        <p className="text-sm text-gray-200">
          Sistem terpadu untuk pengelolaan peminjaman ruangan
          dan penggajian pegawai secara efisien, transparan,
          dan terkoordinasi guna mendukung kelancaran
          operasional di seluruh unit kerja.
        </p>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-orange-500/80 to-transparent"></div>

    </div>
  )
}
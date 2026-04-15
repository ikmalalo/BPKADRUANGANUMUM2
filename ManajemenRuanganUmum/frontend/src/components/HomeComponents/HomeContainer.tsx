import HomeCard from "./HomeCard"
import { useNavigate } from "react-router-dom"
import { User, ShieldCheck, Lock, ArrowRight } from "lucide-react"

export default function HomeContainer() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 md:gap-8 mt-[1vh] md:mt-4 w-full max-w-6xl mx-auto px-6 md:px-8 pb-8">

      {/* Pengunjung Card */}
      <div className="w-full md:w-[380px] lg:w-[420px] h-auto flex flex-col items-stretch">
        <HomeCard
          badge="Akses Publik"
          badgeColor="bg-blue-50 text-blue-600"
          title="Pengunjung"
          description="Akses cepat untuk melihat agenda dan jadwal penggunaan ruangan rapat secara real-time melalui panel informasi."
          Icon={User}
          buttonText="Mulai Akses"
          buttonIcon={ArrowRight}
          onClick={() => {
            sessionStorage.setItem('isVisitor', 'true')
            navigate("/preview")
          }}
          delay="delay-[800ms]"
        />
      </div>

      {/* Administrator Card */}
      <div className="w-full md:w-[380px] lg:w-[420px] h-auto flex flex-col items-stretch">
        <HomeCard
          badge="Internal Staf"
          badgeColor="bg-orange-50 text-orange-600"
          title="Administrator"
          description="Masuk ke dashboard manajemen BPKAD untuk mengelola reservasi, jadwal, dan koordinasi ruangan."
          Icon={ShieldCheck}
          buttonText="Login Sistem"
          buttonIcon={Lock}
          onClick={() => navigate("/login")}
          delay="delay-[1000ms]"
        />
      </div>

    </div>
  )
}

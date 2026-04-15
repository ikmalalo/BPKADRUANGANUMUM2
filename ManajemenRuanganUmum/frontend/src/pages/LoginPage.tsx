import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import LoginForm from "../components/LoginComponents/LoginForm"
import LoginInfo from "../components/LoginComponents/LoginInfo"
import "../index.css"

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white relative">
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-gray-600 hover:text-orange-500 rounded-full shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 backdrop-blur-sm"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold tracking-tight">KEMBALI KE BERANDA</span>
        </button>
      </div>

      {/* LEFT SIDE: FORM (Full on mobile, 50% on desktop) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        
        {/* Subtle decorative background element */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
        
        <div className="relative z-10 w-full flex justify-center mt-12 md:mt-0">
          <LoginForm />
        </div>
      </div>

      {/* RIGHT SIDE: INFO (Hidden on mobile, 50% on desktop) */}
      <LoginInfo />

    </div>
  )
}
import { useState } from "react"
import InputField from "./InputField"
import LoginButton from "./LoginButton"
import logo from "../../assets/images/logo.png"
import { useNavigate } from "react-router-dom"
import Notification from "../Common/Notification"
import { apiUrl } from "../../lib/api"

export default function LoginForm() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    type: "success" | "error" | "info"
    title: string
    message: string
    onConfirm?: () => void
  }>({
    show: false,
    type: "info",
    title: "",
    message: ""
  })

  const handleLogin = async () => {
    if (!username || !password) {
      setNotification({
        show: true,
        type: "error",
        title: "Input Kosong",
        message: "Harap isi username dan password Anda"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        sessionStorage.removeItem('isVisitor') // clear visitor flag on admin login
        setNotification({
          show: true,
          type: "success",
          title: "Login Berhasil",
          message: "Selamat datang kembali! Silakan pilih layanan.",
          onConfirm: () => navigate("/services")
        })
      } else {
        setNotification({
          show: true,
          type: "error",
          title: "Login Gagal",
          message: data.message || "Username atau password salah"
        })
        setPassword("")
      }
    } catch (error) {
      setNotification({
        show: true,
        type: "error",
        title: "Koneksi Bermasalah",
        message: "Terjadi kesalahan koneksi ke server"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="
    bg-white
    shadow-xl
    rounded-xl
    p-10
    w-full
    max-w-[420px]
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-[0_0_40px_rgba(251,146,60,0.35)]
    ">

      {/* LOGO */}
      <div className="flex justify-center mb-6">
        <img src={logo} className="w-28" alt="Logo BPKAD" />
      </div>

      <InputField
        label="NIP / Username"
        type="text"
        placeholder="Masukkan NIP atau Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <InputField
        label="Kata Sandi"
        type="password"
        placeholder="Masukkan kata sandi"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex items-center mb-6">
        <input type="checkbox" className="mr-2" />
        <span className="text-sm text-gray-500">
          Ingat Saya Di Perangkat Ini
        </span>
      </div>

      <LoginButton 
        text={loading ? "MEMPROSES..." : "MASUK"} 
        onClick={handleLogin} 
      />

      <Notification 
        {...notification}
        onClose={() => {
          setNotification(prev => ({ ...prev, show: false }))
          if (notification.onConfirm) notification.onConfirm()
        }}
      />

    </div>
  )
}
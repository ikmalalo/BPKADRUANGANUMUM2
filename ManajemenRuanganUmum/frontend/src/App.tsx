import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import ServiceSelect from "./pages/ServiceSelect"
import HomeSelect from "./pages/HomeSelect"
import RoomDashboard from "./pages/RoomDashboard"
import Peminjaman from "./pages/Peminjaman"
import KonfirmasiPeminjaman from "./pages/KonfirmasiPeminjaman"
import Preview from "./pages/Preview"
import PreviewHorizontal from "./pages/PreviewHorizontal"
import PreviewVertikal from "./pages/PreviewVertikal"
import Riwayat from "./pages/Riwayat"
import UploadSertifikat from "./pages/UploadSertifikat"
import LoadingScreen from "./components/LoadingScreen"
import DashboardLayout from "./components/DashboardComponents/DashboardLayout"
import ProtectedRoute from "./components/Common/ProtectedRoute"
import ConditionalPreviewLayout from "./layouts/ConditionalPreviewLayout"
import { useState, useEffect } from "react"

export default function App() {
  // Cek sessionStorage untuk menentukan state awal loading
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem('hasLoaded')
  })

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false)
        sessionStorage.setItem('hasLoaded', 'true')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [loading])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      {/* Portals */}
      <Route path="/" element={<HomeSelect />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Standalone Route (Visitor or Admin conditionally) */}
      <Route element={<ConditionalPreviewLayout />}>
        <Route path="/preview" element={<Preview />} />
      </Route>

      {/* Fullscreen Previews (Never show sidebar, even if logged in) */}
      <Route path="/preview-horizontal" element={<PreviewHorizontal />} />
      <Route path="/preview-vertikal" element={<PreviewVertikal />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/services" element={<ServiceSelect />} />
        
        {/* Admin Dashboard */}
        <Route element={<DashboardLayout />}>
          <Route path="/rooms" element={<RoomDashboard />} />
          <Route path="/peminjaman" element={<Peminjaman />} />
          <Route path="/riwayat" element={<Riwayat />} />
          <Route path="/upload-sertifikat" element={<UploadSertifikat />} />
          <Route path="/konfirmasipeminjaman" element={<KonfirmasiPeminjaman />} />
        </Route>
      </Route>

    </Routes>
  )
}
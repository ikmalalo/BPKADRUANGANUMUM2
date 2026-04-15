// src/layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom"
import Sidebar from "../components/DashboardComponents/Sidebar"

export default function DashboardLayout() {
  return (
    <div className="flex">
      {/* Sidebar render SEKALI di sini, tidak ikut re-mount saat navigasi */}
      <Sidebar />

      {/* Konten halaman ganti-ganti di sini */}
      <main className="ml-64 flex-1 min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
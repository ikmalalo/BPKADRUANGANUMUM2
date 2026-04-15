import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/DashboardComponents/Sidebar"
import { Menu } from "lucide-react"

export default function ConditionalPreviewLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isVisitor, setIsVisitor] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    const visitorFlag = sessionStorage.getItem('isVisitor') === 'true'

    setIsLoggedIn(!!user)
    setIsVisitor(visitorFlag)
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  // Visitor: either not logged in, or explicitly came as visitor (sessionStorage flag)
  if (!isLoggedIn || isVisitor) {
    return <Outlet />
  }

  // Admin/Petugas: logged in without visitor flag → show sidebar
  return (
    <div className="flex min-h-screen relative bg-gray-100">
      
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative overflow-hidden h-screen">
        
        <button 
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 right-4 z-[60] bg-white p-2.5 rounded-full shadow-lg border border-gray-200 text-gray-700 hover:text-orange-500 hover:border-orange-200 transition-all active:scale-95"
        >
          <Menu size={20} />
        </button>

        <main className="flex-1 h-full w-full overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

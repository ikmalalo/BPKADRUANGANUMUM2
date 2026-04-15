import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute() {
  const user = localStorage.getItem('user')
  
  if (!user) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />
  }

  // If logged in, render the child routes
  return <Outlet />
}

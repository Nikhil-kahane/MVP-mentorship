import { Link, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">Mentorship Platform</Link>
          <div className="flex gap-6 items-center">
            <Link to="/courses" className="text-gray-600 hover:text-indigo-600">Courses</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
                <Link to="/bookings" className="text-gray-600 hover:text-indigo-600">My Bookings</Link>
                <Link to="/profile" className="text-gray-600 hover:text-indigo-600">Profile</Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-indigo-600 font-medium">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8"><Outlet /></main>
    </div>
  )
}

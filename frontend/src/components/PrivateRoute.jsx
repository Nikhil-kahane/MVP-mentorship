import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />
  return children
}

import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { dashboardAPI } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import StudentDashboard from './StudentDashboard'
import MentorDashboard from './MentorDashboard'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      const api = user.role === 'student' ? dashboardAPI.getStudent : dashboardAPI.getMentor
      const res = await api()
      setDashboardData(res.data)
    }
    fetchData()
  }, [user])

  if (loading) return <p className="text-center py-10">Loading...</p>
  if (!user) return <Navigate to="/login" />

  if (user.role === 'student') return <StudentDashboard data={dashboardData} />
  if (user.role === 'mentor') return <MentorDashboard data={dashboardData} />
  return <Navigate to="/admin" />
}

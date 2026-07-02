import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../api/auth'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    authAPI.getProfile().then(res => setProfile(res.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const data = Object.fromEntries(form.entries())
    try {
      const res = await authAPI.updateProfile(data)
      setProfile(res.data)
      setUser(res.data)
      alert('Profile updated')
    } catch {
      alert('Update failed')
    }
  }

  if (!profile) return <p>Loading...</p>

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input name="first_name" defaultValue={profile.first_name} className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input name="last_name" defaultValue={profile.last_name} className="w-full p-3 border rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" defaultValue={profile.email} className="w-full p-3 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input name="phone_number" defaultValue={profile.phone_number || ''} className="w-full p-3 border rounded-lg" />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">Save Changes</button>
      </form>
    </div>
  )
}

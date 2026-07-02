import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password_confirm: '', first_name: '', last_name: '' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirm) return setError('Passwords do not match')
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.username?.[0] || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full p-3 border rounded-lg" required />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3 border rounded-lg" required />
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="First Name" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="p-3 border rounded-lg" />
          <input type="text" placeholder="Last Name" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="p-3 border rounded-lg" />
        </div>
        <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full p-3 border rounded-lg">
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
        </select>
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full p-3 border rounded-lg" required />
        <input type="password" placeholder="Confirm Password" value={form.password_confirm} onChange={e => setForm({...form, password_confirm: e.target.value})} className="w-full p-3 border rounded-lg" required />
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">Register</button>
      </form>
      <p className="text-center mt-4 text-gray-600">Already have an account? <Link to="/login" className="text-indigo-600">Login</Link></p>
    </div>
  )
}

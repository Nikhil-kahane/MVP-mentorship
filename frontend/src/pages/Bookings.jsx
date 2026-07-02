import { useEffect, useState } from 'react'
import { bookingsAPI } from '../api/auth'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingsAPI.getAll()
      .then(res => setBookings(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await bookingsAPI.cancel(id)
      setBookings(bookings.map(b => b.id === id ? {...b, status: 'cancelled'} : b))
    } catch {
      alert('Failed to cancel')
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      {bookings.length ? (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{b.course?.title}</p>
                <p className="text-gray-500">Mentor: {b.mentor_name}</p>
                <p className="text-gray-500">{new Date(b.session_date).toLocaleString()}</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${b.status === 'booked' ? 'bg-green-100 text-green-600' : b.status === 'cancelled' ? 'bg-red-100 text-red-600' : b.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>{b.status}</span>
                {['pending', 'booked'].includes(b.status) && <button onClick={() => handleCancel(b.id)} className="text-red-600 hover:underline">Cancel</button>}
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-500">No bookings yet</p>}
    </div>
  )
}

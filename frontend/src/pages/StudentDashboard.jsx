import { Link } from 'react-router-dom'

export default function StudentDashboard({ data }) {
  if (!data) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500">Total Bookings</h3>
          <p className="text-3xl font-bold text-indigo-600">{data.total_bookings}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
      {data.upcoming_sessions?.length ? (
        <div className="space-y-4">
          {data.upcoming_sessions.map(b => (
            <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between">
              <div>
                <p className="font-semibold">{b.course?.title}</p>
                <p className="text-gray-500">{new Date(b.session_date).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${b.status === 'booked' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{b.status}</span>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-500">No upcoming sessions</p>}

      <h2 className="text-xl font-bold mt-8 mb-4">Recent Bookings</h2>
      {data.recent_bookings?.length ? (
        <div className="space-y-4">
          {data.recent_bookings.map(b => (
            <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between">
              <div>
                <p className="font-semibold">{b.course?.title}</p>
                <p className="text-gray-500">{new Date(b.session_date).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${b.status === 'completed' ? 'bg-blue-100 text-blue-600' : b.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-500">No bookings yet</p>}
    </div>
  )
}

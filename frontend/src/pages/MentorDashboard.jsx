export default function MentorDashboard({ data }) {
  if (!data) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mentor Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500">Total Bookings</h3>
          <p className="text-3xl font-bold text-indigo-600">{data.total_bookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500">My Courses</h3>
          <p className="text-3xl font-bold text-indigo-600">{data.courses?.length || 0}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">My Courses</h2>
      {data.courses?.length ? (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {data.courses.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm">
              <p className="font-semibold">{c.title}</p>
              <p className="text-gray-500">{c.category}</p>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-500">No courses yet</p>}

      <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
      {data.upcoming_sessions?.length ? (
        <div className="space-y-4">
          {data.upcoming_sessions.map(b => (
            <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between">
              <div>
                <p className="font-semibold">{b.course?.title}</p>
                <p className="text-gray-500">Student: {b.student_name}</p>
                <p className="text-gray-500">{new Date(b.session_date).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm h-fit ${b.status === 'booked' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{b.status}</span>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-500">No upcoming sessions</p>}
    </div>
  )
}

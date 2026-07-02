import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { coursesAPI, bookingsAPI } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'

export default function CourseDetail() {
  const { slug } = useParams()
  const [course, setCourse] = useState(null)
  const [sessionDate, setSessionDate] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    coursesAPI.getBySlug(slug).then(res => setCourse(res.data))
  }, [slug])

  const handleBooking = async (e) => {
    e.preventDefault()
    try {
      const res = await bookingsAPI.create({ course: course.id, session_date: sessionDate })
      navigate(`/payment/${res.data.id}`)
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed')
    }
  }

  if (!course) return <p>Loading...</p>

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <img src={course.thumbnail || '/placeholder.jpg'} alt={course.title} className="w-full h-64 object-cover rounded-xl" />
        <span className="inline-block mt-4 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">{course.category}</span>
        <h1 className="text-3xl font-bold mt-2">{course.title}</h1>
        <p className="text-gray-600 mt-4">{course.description}</p>
        <p className="text-gray-500 mt-2">Duration: {course.duration}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
        <p className="text-gray-600 mb-2">Mentor</p>
        <p className="font-semibold">{course.mentor?.user?.name}</p>
        <p className="text-sm text-gray-500">{course.mentor?.expertise}</p>
        <p className="text-sm text-gray-500">{course.mentor?.experience_years} years experience</p>

        {user?.role === 'student' && (
          <form onSubmit={handleBooking} className="mt-6">
            <label className="block text-sm font-medium mb-2">Session Date</label>
            <input type="datetime-local" value={sessionDate} onChange={e => setSessionDate(e.target.value)} className="w-full p-3 border rounded-lg mb-4" required />
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">Book Session</button>
          </form>
        )}
      </div>
    </div>
  )
}

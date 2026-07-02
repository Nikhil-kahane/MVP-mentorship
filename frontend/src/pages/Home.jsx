import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { coursesAPI } from '../api/auth'

export default function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    coursesAPI.getHome()
      .then(res => setCourses(res.data.featured_courses))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="text-center py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl mb-10">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Mentor</h1>
        <p className="text-xl mb-8">Connect with experienced mentors to accelerate your learning</p>
        <Link to="/courses" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium">Browse Courses</Link>
      </section>

      <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white p-6 rounded-xl shadow-sm">
              <img src={course.thumbnail || '/placeholder.jpg'} alt={course.title} className="w-full h-40 object-cover rounded-lg mb-4" />
              <span className="text-sm text-indigo-600 font-medium">{course.category}</span>
              <h3 className="text-lg font-semibold mt-1">{course.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{course.description?.slice(0, 100)}...</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gray-500 text-sm">{course.mentor_name}</span>
                <Link to={`/courses/${course.slug}`} className="text-indigo-600 hover:underline">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

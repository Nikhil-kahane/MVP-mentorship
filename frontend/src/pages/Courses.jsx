import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { coursesAPI } from '../api/auth'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    coursesAPI.getCategories().then(res => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    coursesAPI.getAll({ category, search })
      .then(res => setCourses(res.data))
      .finally(() => setLoading(false))
  }, [category, search])

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 p-3 border rounded-lg" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="p-3 border rounded-lg">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white p-6 rounded-xl shadow-sm">
              <span className="text-sm text-indigo-600 font-medium">{course.category}</span>
              <h3 className="text-lg font-semibold mt-1">{course.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{course.description?.slice(0, 100)}...</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gray-500 text-sm">{course.mentor_name}</span>
                <Link to={`/courses/${course.slug}`} className="text-indigo-600 hover:underline">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

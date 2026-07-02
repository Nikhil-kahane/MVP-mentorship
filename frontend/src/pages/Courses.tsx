import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/auth';
import { Course } from '../api/simulation';
import { Search, Filter, BookOpen, Clock, User, ArrowRight } from 'lucide-react';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesAPI.getCategories()
      .then(res => setCategories(res.data))
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    setLoading(true);
    coursesAPI.getAll({ category, search })
      .then(res => setCourses(res.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="space-y-8 text-left animate-fade-in">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Explore Mentorship Courses</h1>
        <p className="text-gray-500 font-medium text-sm">Browse our curated listing of expert courses and direct developer coaching slots.</p>
      </div>

      {/* Filter and Search Layout Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search systems, frameworks, keywords..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 focus:border-indigo-500 focus:bg-white rounded-xl text-sm font-medium transition" 
          />
        </div>
        <div className="flex gap-3 justify-between items-center">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Filter className="w-4 h-4 text-indigo-500" />
            Filter By
          </span>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)} 
            className="p-3 border border-gray-200 focus:border-indigo-500 rounded-xl bg-white text-sm font-medium pr-8 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4 animate-pulse">
              <div className="bg-gray-100 rounded-xl w-full h-44"></div>
              <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              <div className="h-6 bg-gray-100 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl max-w-xl mx-auto space-y-4">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-gray-800">No Courses Match Filters</h3>
            <p className="text-sm text-gray-400 mt-1">Try adapting searching terms or select a different category option.</p>
          </div>
          <button 
            type="button" 
            onClick={() => { setSearch(''); setCategory(''); }} 
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map(course => (
            <div 
              key={course.id} 
              className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 text-left"
            >
              <div className="relative h-44 w-full bg-slate-50 overflow-hidden">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-pink-500/10 to-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <BookOpen className="w-10 h-10 stroke-1.5" />
                  </div>
                )}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-indigo-600 border border-indigo-100 font-bold text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {course.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-gray-400">
                  <span className="flex items-center gap-1 text-gray-500">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    {course.mentor_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </span>
                </div>

                <Link 
                  to={`/courses/${course.slug}`} 
                  className="w-full text-center py-2.5 bg-gray-50 hover:bg-indigo-600 hover:text-white rounded-xl font-bold text-xs text-gray-700 transition"
                >
                  View Blueprint
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;

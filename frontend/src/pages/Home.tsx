import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/auth';
import { Course } from '../api/simulation';
import { Sparkles, Users, Award, ArrowRight, BookOpen, GraduationCap, Clock } from 'lucide-react';

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesAPI.getHome()
      .then(res => setCourses(res.data.featured_courses))
      .catch(e => console.error("Error loading home:", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Immersive Landing Hero */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl py-20 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-indigo-100/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="flex-1 space-y-6 z-10 text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Voted #1 Online Career Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Find Your <span className="text-indigo-400">Perfect Mentor</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
            Accelerate your scaling. Unblock codebase architectures, learn dynamic digital marketing, or master data structures with direct, verified expert sessions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              to="/courses" 
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm tracking-wide text-white text-center shadow-lg shadow-indigo-600/35 hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2"
            >
              Examine Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 font-bold text-sm tracking-wide text-white text-center border border-slate-700/85 hover:border-slate-600 transition duration-200"
            >
              Sign up as Mentor
            </Link>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-2 gap-4 flex-1">
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 p-6 rounded-2xl space-y-3 transform scale-95 translate-y-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/25 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg">Verified Experts</h3>
            <p className="text-sm text-slate-400">Direct bookings validation against background credentials.</p>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/25 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg font-sans">Certificate System</h3>
            <p className="text-sm text-slate-400">Receive downloadable credential achievements on module completion.</p>
          </div>
        </div>
      </section>

      {/* Featured Courses Core List */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Featured Courses</h2>
            <p className="text-gray-500 mt-2 text-sm font-medium">Specially selected masterclasses trending on our mentorship platform this week.</p>
          </div>
          <Link 
            to="/courses" 
            className="group inline-flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition shrink-0"
          >
            Review all courses
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4 animate-pulse">
                <div className="bg-gray-100 rounded-xl w-full h-44"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map(course => (
              <div 
                key={course.id} 
                className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 text-left"
              >
                {/* Image Showcase */}
                <div className="relative h-48 w-full bg-slate-50 overflow-hidden">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-pink-500/10 to-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <BookOpen className="w-12 h-12 stroke-1.5" />
                    </div>
                  )}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-indigo-600 border border-indigo-100 font-bold text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                    {course.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-gray-500">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      {course.mentor_name}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration}
                    </span>
                  </div>

                  <Link 
                    to={`/courses/${course.slug}`} 
                    className="w-full text-center py-3 bg-gray-50 hover:bg-indigo-50 group-hover:bg-indigo-600 hover:text-indigo-700 group-hover:text-white rounded-xl font-bold text-xs text-gray-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

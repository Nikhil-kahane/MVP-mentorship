import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { coursesAPI, bookingsAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { Course } from '../api/simulation';
import { BookOpen, Calendar, User, Clock, ChevronLeft, Bookmark, Heart, Sparkles, CheckCircle, HelpCircle, Loader2 } from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Course Enroll/Save states
  const [isSaved, setIsSaved] = useState(false);
  const [enrollmentProgress, setEnrollmentProgress] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Booking states
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [availableSlots, setAvailableSlots] = useState<{ id: number; time: string; is_booked: boolean }[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    coursesAPI.getBySlug(slug)
      .then(res => {
        setCourse(res.data);
        setError('');

        // Query if student has enrollment or save details
        if (user && user.role === 'student') {
          coursesAPI.enrollAndComplete.getEnrollments()
            .then(enrollRes => {
              const matched = enrollRes.data.find((e: any) => e.course_id === res.data.id);
              if (matched) {
                setIsSaved(matched.saved);
                setEnrollmentProgress(matched.progress);
                setIsCompleted(matched.completed);
              }
            });
        }

        // Query available slots for the course mentor
        bookingsAPI.getMentorAvailabilities(res.data.mentor_id)
          .then(slotsRes => {
            setAvailableSlots(slotsRes.data);
          });
      })
      .catch(err => {
        console.error(err);
        setError("Unable to find the selected course syllabus.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, user]);

  const handleSaveToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!course) return;
    
    try {
      const nextSaved = !isSaved;
      await coursesAPI.enrollAndComplete.saveCourse(course.id, nextSaved);
      setIsSaved(nextSaved);
    } catch {
      // Direct optimistic state fallback if network error
      setIsSaved(!isSaved);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      setError("Only logged-in Students can schedule booking sessions.");
      return;
    }

    let finalDate = bookingDate;
    if (selectedSlotId) {
      const selected = availableSlots.find(s => s.id === selectedSlotId);
      if (selected) finalDate = selected.time;
    }

    if (!finalDate) {
      setError('Please select a specific scheduled date or mentor availability slot.');
      return;
    }

    setError('');
    setBookingLoading(true);
    try {
      const res = await bookingsAPI.create({
        course_slug: slug!,
        session_date: finalDate,
      });
      setBookingSuccess('Booking simulated successfully! Directing to Payment processing...');
      // Clean slots
      if (selectedSlotId) {
        setAvailableSlots(prev => prev.filter(s => s.id !== selectedSlotId));
      }
      setTimeout(() => {
        navigate(`/payment/${res.data.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Booking creation failed. Please verify dates.');
    } finally {
      setBookingLoading(false);
    }
  };

  const updateSimulatedProgress = async (val: number) => {
    if (!course) return;
    try {
      await coursesAPI.enrollAndComplete.updateProgress(course.id, val);
      setEnrollmentProgress(val);
      if (val >= 100) {
        setIsCompleted(true);
      }
    } catch {
      setEnrollmentProgress(val);
      if (val >= 100) setIsCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Acquiring course blueprints...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <HelpCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-gray-800">Syllabus Missing</h3>
        <p className="text-sm text-gray-400">{error || "The requested blueprints couldn't be indexed."}</p>
        <Link to="/courses" className="text-sm font-bold text-indigo-600 hover:underline">Return to Course Listings</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-left animate-fade-in max-w-5xl mx-auto px-4">
      {/* Back link */}
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-indigo-600 transition">
        <ChevronLeft className="w-4 h-4" />
        Back to listings
      </Link>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Core details column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Block card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg">
                  {course.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mt-2">{course.title}</h1>
              </div>

              {/* Save Course bookmark button */}
              <button 
                onClick={handleSaveToggle}
                className={`py-2 px-4 rounded-xl border font-bold text-xs flex items-center gap-1.5 hover:shadow-md transition cursor-pointer ${isSaved ? 'bg-pink-50 border-pink-200 text-pink-600' : 'bg-white border-gray-100 text-gray-500'}`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-pink-500 text-pink-600' : ''}`} />
                {isSaved ? 'Saved to Favorites' : 'Save To My List'}
              </button>
            </div>

            <div className="aspect-video w-full bg-slate-50 border border-gray-100 rounded-2xl overflow-hidden relative">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-pink-500/10 to-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <BookOpen className="w-16 h-16 stroke-1.5" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-2">Syllabus Overview</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{course.description}</p>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-50 text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
                <Clock className="w-4 h-4 text-indigo-500" />
                Duration: {course.duration}
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
                <User className="w-4 h-4 text-indigo-500" />
                Mentor: {course.mentor_name}
              </span>
            </div>
          </div>

          {/* Student Syllabus Progress Actions */}
          {user && user.role === 'student' && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-gray-900">Learning Progress Dashboard</h3>
              </div>

              {enrollmentProgress !== null ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                    <span>Course Progress Tracker</span>
                    <span className="text-indigo-600 font-extrabold">{enrollmentProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${enrollmentProgress}%` }}
                    ></div>
                  </div>

                  {isCompleted ? (
                    <div className="bg-emerald-50 border border-emerald-100/80 p-4 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">Course Completed Successfully!</p>
                        <p className="text-xs font-medium text-emerald-600 mt-0.5">Your achievements qualify you to claim certifications.</p>
                      </div>
                      <Link 
                        to="/profile" 
                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-100 transition whitespace-nowrap"
                      >
                        Claim Digital Certificate
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 items-center justify-between">
                      <span className="text-xs font-medium text-gray-400">Upgrade learning milestones in the sandbox:</span>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => updateSimulatedProgress(50)} 
                          className="flex-1 sm:flex-none py-1.5 px-3 bg-gray-50 border border-gray-200 hover:border-indigo-100 font-bold text-[11px] text-gray-600 hover:text-indigo-600 rounded-lg transition"
                        >
                          Mark 50%
                        </button>
                        <button 
                          onClick={() => updateSimulatedProgress(100)} 
                          className="flex-1 sm:flex-none py-1.5 px-3 bg-indigo-50 border border-indigo-200 hover:border-indigo-300 font-bold text-[11px] text-indigo-700 rounded-lg transition"
                        >
                          Complete Module
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    You have not yet booked any sessions for this course. Progress logs generate automatically when you schedule and settle custom bookings.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scheduling sidebars column */}
        <div className="space-y-6">
          <div className="bg-white border border-indigo-100 rounded-3xl p-6 shadow-xl shadow-indigo-100/10 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl -mr-8 -mt-8"></div>
            
            <div className="space-y-1 z-10 relative">
              <h3 className="font-extrabold text-lg text-gray-900">Schedule Sessions</h3>
              <p className="text-xs text-gray-400">Book dedicated hours with {course.mentor_name}</p>
            </div>

            {bookingSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs font-bold leading-relaxed">
                {bookingSuccess}
              </div>
            )}

            {error && !bookingSuccess && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-601 rounded-xl text-xs font-semibold leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-5 relative z-10">
              {availableSlots.length > 0 ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Available Mentor Slots</label>
                  <select 
                    value={selectedSlotId || ''} 
                    onChange={e => {
                      setSelectedSlotId(Number(e.target.value) || null);
                      setBookingDate('');
                    }}
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs font-semibold cursor-pointer bg-white"
                  >
                    <option value="">-- Choose custom pre-set slot --</option>
                    {availableSlots.map(s => (
                      <option key={s.id} value={s.id}>
                        {new Date(s.time).toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 font-medium">Select a slot already preset by the mentor.</p>
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 bg-gray-50 p-2 rounded border border-dashed border-gray-100 font-semibold text-center uppercase tracking-wider">
                  No preset slots available. Select date manually below:
                </p>
              )}

              {!selectedSlotId && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Select custom Date/Time</label>
                  <input 
                    type="datetime-local" 
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs font-semibold cursor-pointer"
                  />
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs font-bold">
                <span className="text-gray-400">Total Price</span>
                <span className="text-lg text-indigo-600 font-extrabold">$99.99</span>
              </div>

              <button 
                type="submit" 
                disabled={bookingLoading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-indigo-100/50 transition cursor-pointer flex justify-center items-center gap-1.5"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Confirm & Proceed
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

import React, { useEffect, useState } from 'react';
import { bookingsAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { Booking } from '../api/simulation';
import { Link } from 'react-router-dom';
import { Calendar, Clock, AlertTriangle, User, ArrowRight, Loader2 } from 'lucide-react';

const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [list, setList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<number | null>(null);

  useEffect(() => {
    bookingsAPI.getAll()
      .then(res => setList(res.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm("Are you sure you wish to cancel this appointment session reservation?")) return;
    setWorkingId(id);
    try {
      await bookingsAPI.cancel(id);
      setList(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (e) {
      console.error(e);
    } finally {
      setWorkingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" strokeWidth={2.5} />
        <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Syncing appointment calendars...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My Mentorship Bookings</h1>
        <p className="text-sm text-gray-500 font-medium">Coordinate scheduled hours, access active classes, or settle pending reservations.</p>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-gray-800">No Reservations Yet</h3>
            <p className="text-xs text-gray-400 mt-1">Book professional sessions on course pages to coordinate calendars.</p>
          </div>
          <Link to="/courses" className="py-2.5 px-5 bg-indigo-600 text-white rounded-xl font-bold text-xs inline-block shadow-sm">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map(b => (
            <div 
              key={b.id} 
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${b.status === 'booked' ? 'bg-green-50 border-green-150 text-green-700' : b.status === 'pending' ? 'bg-amber-50 border-amber-155 text-amber-700' : b.status === 'cancelled' ? 'bg-red-50 border-red-150 text-red-700' : 'bg-gray-50 border-gray-150 text-gray-500'}`}>
                    {b.status}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">REF #{b.id}</span>
                </div>
                
                <h3 className="text-base font-bold text-gray-900 leading-tight block">
                  {b.course_title || b.course?.title}
                </h3>

                <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-1 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {user?.role === 'student' ? `Mentor: ${b.mentor_name}` : `Student: ${b.student_name}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(b.session_date).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Action buttons based on reservation status */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto items-center justify-between md:justify-end border-t border-gray-50 md:border-none pt-4 md:pt-0">
                {b.status === 'pending' && user?.role === 'student' && (
                  <Link 
                    to={`/payment/${b.id}`} 
                    className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-indigo-100 flex items-center gap-1 shrink-0"
                  >
                    Proceed with Pago
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                
                {b.status === 'booked' && (
                  <span className="text-[11px] font-bold text-gray-400 bg-gray-50/50 p-2 rounded-xl border border-dashed border-gray-100 uppercase tracking-widest block shrink-0">
                    Syllabus Locked
                  </span>
                )}

                {(b.status === 'pending' || b.status === 'booked') && (
                  <button 
                    onClick={() => handleCancel(b.id)}
                    disabled={workingId === b.id}
                    className="py-2.5 px-3 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 font-bold text-xs rounded-xl border border-gray-150 hover:border-red-100 transition shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    Cancel Class
                  </button>
                )}

                {b.status === 'cancelled' && (
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Cancelled</span>
                )}
                
                {b.status === 'completed' && (
                  <span className="text-xs text-indigo-500 font-black uppercase tracking-widest block">Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;

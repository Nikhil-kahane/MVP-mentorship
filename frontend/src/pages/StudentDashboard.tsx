import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../api/auth';
import { Course, Enrollment } from '../api/simulation';
import { useAuth } from '../contexts/AuthContext';
import { Award, BookOpen, Clock, Heart, Calendar, ArrowRight, CheckCircle, Sparkles, AlertCircle, FileText, Download } from 'lucide-react';

interface StudentDashboardProps {
  data: any;
  refreshData: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ data, refreshData }) => {
  const { user } = useAuth();
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedCert, setSelectedCert] = useState<Course | null>(null);

  useEffect(() => {
    // Acquire courses and enrollments
    coursesAPI.getAll().then(res => setCoursesList(res.data));
    coursesAPI.enrollAndComplete.getEnrollments().then(res => setEnrollments(res.data));
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Derived lists
  const savedEnrollments = enrollments.filter(e => e.saved);
  const savedCourses = coursesList.filter(c => savedEnrollments.some(se => se.course_id === c.id));

  const completedEnrollments = enrollments.filter(e => e.completed || e.progress >= 100);
  const completedCourses = coursesList.filter(c => completedEnrollments.some(ce => ce.course_id === c.id));

  const inProgressEnrollments = enrollments.filter(e => !e.completed && e.progress > 0 && e.progress < 100);
  const inProgressCourses = coursesList.filter(c => inProgressEnrollments.some(ie => ie.course_id === c.id));

  const downloadCertificateMock = (courseTitle: string) => {
    // Simple mock receipt download triggers alert window with full custom stylings
    const certWindow = window.open("", "_blank");
    if (!certWindow) {
      alert("Please allow popups to retrieve digital certificates.");
      return;
    }
    certWindow.document.write(`
      <html>
        <head>
          <title>Completion Certificate - ${courseTitle}</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-h: 100vh; background-color: #F1F5F9; margin:0; }
            .cert-card { width: 750px; background: white; border: 15px solid #4F46E5; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1); position: relative; }
            .cert-card::before { content: ''; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 2px solid #E2E8F0; pointer-events: none; }
            h1 { font-family: 'Playfair Display', Georgia, serif; color: #1E293B; font-size: 38px; margin-bottom: 5px; }
            h2 { color: #4F46E5; font-size: 18px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0; }
            p { color: #64748B; font-size: 16px; margin: 15px 0; }
            .recipient { font-size: 26px; font-weight: 800; color: #0F172A; text-decoration: underline; margin: 25px 0; }
            .course-name { font-size: 22px; font-weight: 700; color: #4F46E5; margin: 20px 0; }
            .footer-grid { display: flex; justify-content: space-between; margin-top: 50px; border-t: 1px solid #E2E8F0; padding-top: 25px; }
            .sig-block { text-align: center; width: 45%; }
            .sig-line { border-bottom: 1.5px solid #94A3B8; margin-bottom: 8px; height: 35px; }
            .sig-title { font-size: 12px; font-weight: bold; color: #485563; }
            .badge { width: 80px; height: 80px; background: #6366F1; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; font-size: 10px; margin: 15px auto; }
            @media print { body { background: white; } .cert-card { border-width: 25px; box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="cert-card">
            <h2>Certificate of Achievement</h2>
            <div class="badge">VERIFIED</div>
            <p>This is to certify that professional candidate</p>
            <div class="recipient">${user?.first_name || 'Student'} ${user?.last_name || 'Demo'}</div>
            <p>has successfully completed the comprehensive core modules of</p>
            <div class="course-name">${courseTitle}</div>
            <p>with optimal marks on our Mentorship Academy Hub Platform.</p>
            
            <div class="footer-grid">
              <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-title">Mentorship Platform Coordinator</div>
              </div>
              <div class="sig-block">
                <div class="sig-line" style="font-family:'Brush Script MT', cursive; font-size:24px; color:#4F46E5; text-align:center;">Verified Hub</div>
                <div class="sig-title">Industry Partner Director</div>
              </div>
            </div>
            
            <button onclick="window.print()" style="margin-top: 30px; padding: 10px 20px; background: #4F46E5; border: none; color: white; font-weight: bold; border-radius: 6px; cursor: pointer;">Print Certificate</button>
          </div>
        </body>
      </html>
    `);
    certWindow.document.close();
  };

  return (
    <div className="space-y-10 text-left animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Student Hub</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Hello, {user?.first_name || 'Alex'}!</h1>
          <p className="text-sm text-gray-400 font-medium">Keep improving your development competencies and unblock workflows.</p>
        </div>
        <Link 
          to="/courses" 
          className="py-3 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-100 flex items-center gap-1.5 transition"
        >
          Browse Masterclass Syllabus
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Hero Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Total Bookings</span>
          <p className="text-3xl font-black text-indigo-600">{data.total_bookings}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">In Progress</span>
          <p className="text-3xl font-black text-yellow-600">{inProgressCourses.length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Modules Completed</span>
          <p className="text-3xl font-black text-emerald-600">{completedCourses.length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Saved Syllabus</span>
          <p className="text-3xl font-black text-pink-600">{savedCourses.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Work Progress */}
          {inProgressCourses.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-bold text-gray-900">Current Course Modules</h2>
              </div>
              <div className="space-y-4">
                {inProgressCourses.map(course => {
                  const enrollment = enrollments.find(e => e.course_id === course.id);
                  return (
                    <div key={course.id} className="p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-100 transition">
                      <div className="space-y-1 flex-1">
                        <Link to={`/courses/${course.slug}`} className="font-bold text-gray-900 hover:text-indigo-600 hover:underline text-sm leading-tight block">
                          {course.title}
                        </Link>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${enrollment?.progress || 0}%` }}></div>
                          </div>
                          <span className="text-[10px] font-extrabold text-indigo-600 block">{enrollment?.progress || 0}% complete</span>
                        </div>
                      </div>
                      <Link to={`/courses/${course.slug}`} className="py-2 px-3 text-indigo-600 hover:bg-indigo-50 text-xs font-bold rounded-lg border border-indigo-100 transition">
                        Resume Lesson
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming live appointments */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold text-gray-900">Scheduled Sessions (Upcoming)</h2>
            </div>
            {data.upcoming_sessions?.length ? (
              <div className="space-y-4">
                {data.upcoming_sessions.map((b: any) => (
                  <div key={b.id} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900 text-sm">{b.course_title || b.course?.title}</p>
                      <span className="text-gray-400 text-xs font-bold block">Mentor Expert: {b.mentor_name}</span>
                      <p className="text-gray-400 text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-300" />
                        {new Date(b.session_date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                      <span className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-100 rounded-lg px-2.5 py-1 uppercase tracking-wider uppercase">
                        {b.status}
                      </span>
                      <Link to={`/payment/${b.id}`} className="py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition">
                        View Payment Detail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-gray-150 rounded-2xl space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <div>
                  <p className="text-sm font-bold text-gray-700">No Upcoming live Hours scheduled.</p>
                  <p className="text-xs text-gray-400 mt-0.5">Choose a class and secure a direct appointment slot.</p>
                </div>
              </div>
            )}
          </div>

          {/* Session history bookings */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
              <Award className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold text-gray-900">Session History (Past Hours)</h2>
            </div>
            {data.recent_bookings?.length ? (
              <div className="space-y-4">
                {data.recent_bookings.map((b: any) => (
                  <div key={b.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center gap-4">
                    <div className="space-y-1 text-left">
                      <p className="font-bold text-gray-900 text-sm leading-tight">{b.course_title || b.course?.title}</p>
                      <span className="text-slate-400 text-[11px] font-bold block">Mentor: {b.mentor_name}</span>
                      <p className="text-gray-400 text-xs font-medium">Session: {new Date(b.session_date).toLocaleString()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${b.status === 'completed' ? 'bg-indigo-50 border border-indigo-100 text-indigo-600' : b.status === 'cancelled' ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-gray-50 border border-gray-150 text-gray-500'}`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-6">No historical records available.</p>
            )}
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="space-y-8">
          {/* Saved Courses Sidebar */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <h3 className="font-bold text-slate-800 text-sm">Saved Syllabi ({savedCourses.length})</h3>
            </div>
            {savedCourses.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {savedCourses.map(course => (
                  <div key={course.id} className="py-3 flex justify-between items-center gap-2">
                    <Link to={`/courses/${course.slug}`} className="text-xs font-bold text-gray-800 hover:text-indigo-600 hover:underline line-clamp-1 flex-1">
                      {course.title}
                    </Link>
                    <Link to={`/courses/${course.slug}`} className="text-[10px] font-extrabold text-indigo-600">
                      Syllabus
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 leading-relaxed font-semibold">Bookmarks are empty. Browse and heart syllabi to watch them here.</p>
            )}
          </div>

          {/* Achieved Digital Certificates List */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <Award className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-slate-800 text-sm">Downloadable Credentials</h3>
            </div>
            {completedCourses.length > 0 ? (
              <div className="space-y-3">
                {completedCourses.map(course => (
                  <div key={course.id} className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2 text-left">
                    <p className="text-[11px] font-bold text-emerald-900 leading-tight line-clamp-1">{course.title}</p>
                    <button 
                      onClick={() => downloadCertificateMock(course.title)}
                      className="w-full py-1.5 px-3 bg-white hover:bg-indigo-600 border border-emerald-200 hover:border-indigo-600 font-extrabold text-[10px] text-emerald-700 hover:text-white rounded-lg transition inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Certificate (PDF)
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">Completed syllabus qualifications trigger print-ready credentials automatically.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

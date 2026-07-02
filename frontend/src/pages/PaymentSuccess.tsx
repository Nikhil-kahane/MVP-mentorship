import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ShieldCheck, Printer, ArrowRight, ClipboardList, DollarSign } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const state = location.state as { booking: any; reference: string } | null;

  if (!state) {
    return <Navigate to="/dashboard" replace />;
  }

  const { booking, reference } = state;

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto my-12 text-left animate-fade-in px-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100 text-center space-y-8 relative overflow-hidden">
        
        {/* Confirmed Indicator */}
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-md">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-sans">Payment Confirmed!</h1>
          <p className="text-sm text-gray-400 font-medium">Your seat has been reserved successfully inside the course syllabus.</p>
        </div>

        {/* Invoice Summary */}
        <div className="bg-slate-50 border border-gray-100 rounded-2xl p-6 text-left space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1">
            <ClipboardList className="w-4 h-4 text-indigo-500" />
            Receipt Transcript
          </h3>

          <div className="divide-y divide-gray-150 text-xs font-semibold text-slate-500">
            <div className="py-2.5 flex justify-between gap-4">
              <span>Payment Reference ID</span>
              <span className="text-gray-900 tracking-wider font-mono">{reference}</span>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <span>Course Title</span>
              <span className="text-gray-900 text-right">{booking.course_title || booking.course?.title}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span>Mentor Expert</span>
              <span className="text-gray-900">{booking.mentor_name}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span>Appointment Session</span>
              <span className="text-gray-900">{new Date(booking.session_date).toLocaleString()}</span>
            </div>
            <div className="py-3 flex justify-between text-sm font-black text-gray-900">
              <span>Paid Amount</span>
              <span className="text-indigo-600 flex items-center font-black">
                <DollarSign className="w-4.5 h-4.5 -mr-1" />
                99.99
              </span>
            </div>
          </div>
        </div>

        {/* Actions row */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button 
            onClick={handlePrintReceipt}
            className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition hover:-translate-y-0.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Receipt / Invoice
          </button>
          
          <Link 
            to="/dashboard" 
            className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl font-bold text-xs tracking-wider flex items-center justify-center gap-1 transition hover:-translate-y-0.5"
          >
            Go to Student Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingsAPI, paymentsAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, ShieldCheck, HelpCircle, Loader2, DollarSign } from 'lucide-react';

const Payment: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Settle parameters
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCVV, setCardCVV] = useState('100');

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    bookingsAPI.getById(Number(bookingId))
      .then(res => {
        setBooking(res.data);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg('We are unable to allocate the requested session registration records.');
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setErrorMsg('');
    setConfirming(true);
    try {
      const payload = {
        booking_id: booking.id,
        amount: 99.99,
        payment_reference: `PAY-${booking.id}-${Date.now()}`
      };
      await paymentsAPI.create(payload);
      
      // Navigate to success screen
      navigate('/payment/success', { state: { booking, reference: payload.payment_reference } });
    } catch {
      setErrorMsg('Settle process rejected. Confirm credit parameters.');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Loading Invoice...</p>
      </div>
    );
  }

  if (errorMsg || !booking) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <HelpCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-gray-800 font-sans">Payment Unresolvable</h3>
        <p className="text-sm text-gray-400">{errorMsg || 'Failed to locate related scheduling items.'}</p>
        <Link to="/courses" className="text-sm font-bold text-indigo-600 hover:underline">Browse Courses</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left animate-fade-in px-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Settle Balance</h1>
        <p className="text-sm text-gray-500 font-medium">Verify your program registration and complete secure credit checkouts.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        
        {/* Core summary details card */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">Syllabus Invoice Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-start text-xs font-bold text-slate-500">
                <span>Course Blueprint</span>
                <span className="text-gray-900 text-right max-w-xs">{booking.course_title || booking.course?.title}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Instructor Coach</span>
                <span className="text-gray-900">{booking.mentor_name}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Reserve Scheduled Date</span>
                <span className="text-gray-900">{new Date(booking.session_date).toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-xs font-black">
              <span className="text-slate-450 uppercase tracking-wide">Total Charge Amount</span>
              <span className="text-2xl text-indigo-600 font-black flex items-center">
                <DollarSign className="w-5 h-5 -mr-1" />
                99.99
              </span>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-2xl flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium leading-relaxed">
              <strong>Secure checkout:</strong> All credential records transmit via sandbox mocks. Real API integration details support Stripe SDK logic securely in full-stack configurations.
            </p>
          </div>
        </div>

        {/* Credit details form */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            Card Information
          </h2>

          <form onSubmit={handlePay} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Credit Card Number</label>
              <input 
                type="text" 
                required
                value={cardNumber} 
                onChange={e => setCardNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 rounded-xl text-sm font-semibold tracking-widest bg-gray-50/25"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Expiry Code</label>
                <input 
                  type="text"
                  required 
                  value={cardExpiry} 
                  onChange={e => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 rounded-xl text-sm font-semibold text-center bg-gray-50/25"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">CVV Secure</label>
                <input 
                  type="password" 
                  required
                  value={cardCVV} 
                  onChange={e => setCardCVV(e.target.value)}
                  placeholder="•••"
                  className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-500 rounded-xl text-sm font-semibold text-center bg-gray-50/25"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={confirming}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold tracking-wide transition shadow-lg shadow-indigo-100/50 flex justify-center items-center gap-1.5 cursor-pointer mt-4"
            >
              {confirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Settle active invoice...
                </>
              ) : `Pay $99.99`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;

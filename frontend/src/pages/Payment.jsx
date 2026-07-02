import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { paymentsAPI, bookingsAPI } from '../api/auth'

export default function Payment() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    bookingsAPI.getById(bookingId).then(res => setBooking(res.data))
  }, [bookingId])

  const handlePayment = async () => {
    setLoading(true)
    try {
      await paymentsAPI.create({ booking: parseInt(bookingId), amount: 99.99 })
      navigate('/payment/success')
    } catch {
      alert('Payment failed')
    } finally {
      setLoading(false)
    }
  }

  if (!booking) return <p>Loading...</p>

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>
      <div className="mb-6">
        <p className="font-semibold">{booking.course?.title}</p>
        <p className="text-gray-500">{new Date(booking.session_date).toLocaleString()}</p>
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Session Fee</span>
          <span>$99.99</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>$99.99</span>
        </div>
      </div>
      <button onClick={handlePayment} disabled={loading} className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  )
}

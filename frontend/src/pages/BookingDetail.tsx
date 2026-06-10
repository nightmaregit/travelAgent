import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingById, type Booking } from '../services/bookingService';
import { processPayment } from '../services/paymentService';
import './Package.css';

export const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('Bank Transfer');
  const [proofImage, setProofImage] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getBookingById(id);
        setBooking(data);
        setError(null);
      } catch (err: any) {
        setError('Failed to load booking details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [id]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setPaymentLoading(true);
    try {
      await processPayment({
        booking_id: booking.id,
        payment_method: paymentMethod,
        amount_paid: booking.total_amount,
        proof_image: proofImage || 'https://via.placeholder.com/300x400?text=Payment+Proof'
      });
      setPaymentSuccess(true);
      // Refresh booking to get new payment status
      const data = await getBookingById(booking.id);
      setBooking(data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Number(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'confirmed':
        return '#2ecc71';
      case 'pending':
        return '#f39c12';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

  if (loading) return <div className="package-container">Loading booking details...</div>;
  if (error) return <div className="package-container"><div className="error-message">{error}</div></div>;
  if (!booking) return <div className="package-container">Booking not found.</div>;

  return (
    <div className="package-container">
      <Link to="/bookings" className="back-btn">← Back to My Bookings</Link>
      
      <div className="package-detail-container">
        {booking.status === 'confirmed' && (
          <div style={{ backgroundColor: '#e8f8f5', borderLeft: '5px solid #2ecc71', padding: '1rem', marginBottom: '2rem', borderRadius: '4px' }}>
            <h2 style={{ color: '#2ecc71', margin: '0 0 0.5rem 0' }}>✅ E-Ticket Confirmed</h2>
            <p style={{ margin: 0 }}>Your payment has been verified. Present this booking code to your tour guide.</p>
          </div>
        )}

        <div className="package-detail-header" style={{ borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h1>Booking Details</h1>
            <span style={{ 
              color: '#fff', 
              backgroundColor: getStatusColor(booking.status),
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {booking.status}
            </span>
          </div>
          <p style={{ fontSize: '1.2rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
            Code: <strong>{booking.booking_code}</strong>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="booking-info-group">
            <h3>Package Information</h3>
            <div className="info-item" style={{ marginBottom: '1rem' }}>
              <label>Tour Name</label>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{booking.package_title}</p>
            </div>
            <div className="info-item" style={{ marginBottom: '1rem' }}>
              <label>Destination</label>
              <p>📍 {booking.destination}</p>
            </div>
            <div className="info-item" style={{ marginBottom: '1rem' }}>
              <label>Schedule</label>
              <p>{booking.start_date ? formatDate(booking.start_date) : '-'} to {booking.end_date ? formatDate(booking.end_date) : '-'}</p>
            </div>
          </div>

          <div className="booking-info-group">
            <h3>Payer Information</h3>
            <div className="info-item" style={{ marginBottom: '1rem' }}>
              <label>Booking Date</label>
              <p>{formatDate(booking.booking_date)}</p>
            </div>
            <div className="info-item" style={{ marginBottom: '1rem' }}>
              <label>Total Pax</label>
              <p>{booking.total_pax} Persons</p>
            </div>
            <div className="info-item" style={{ marginBottom: '1rem' }}>
              <label>Total Payment</label>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>{formatPrice(booking.total_amount)}</p>
            </div>
          </div>
        </div>

        {booking.status === 'pending' && !booking.payment_status && !paymentSuccess && (
          <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Complete Your Payment</h3>
            <p>Please select a payment method and upload proof of transfer.</p>
            <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                >
                  <option value="Bank Transfer">Bank Transfer (BCA: 1234567890)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="E-Wallet">E-Wallet (OVO/Gopay: 08123456789)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Proof of Payment (URL)</label>
                <input 
                  type="text"
                  placeholder="Paste image URL here"
                  value={proofImage}
                  onChange={(e) => setProofImage(e.target.value)}
                  style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                />
              </div>
              <button 
                type="submit" 
                disabled={paymentLoading}
                className="view-detail-btn"
                style={{ backgroundColor: '#3498db', border: 'none', width: '100%', marginTop: '0.5rem' }}
              >
                {paymentLoading ? 'Processing...' : 'Submit Payment Proof'}
              </button>
            </form>
          </div>
        )}

        {(booking.payment_status === 'unpaid' || paymentSuccess) && booking.status === 'pending' && (
          <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '8px' }}>
            <h4 style={{ color: '#856404' }}>Payment Submitted</h4>
            <p style={{ color: '#856404', margin: '0 0 1rem 0' }}>Your payment proof has been submitted and is waiting for admin verification.</p>
            {booking.proof_image && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Proof uploaded:</p>
                <img src={booking.proof_image} alt="Payment Proof" style={{ maxWidth: '200px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingById, type Booking } from '../services/bookingService';
import './Package.css';

export const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

        <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#ebf5fb', borderRadius: '8px' }}>
          <h4>Important Note</h4>
          <p style={{ fontSize: '0.9rem', color: '#34495e', marginTop: '0.5rem' }}>
            Please keep your booking code for verification. If your status is still 'pending', please complete the payment within 24 hours. Contact our support if you have any questions.
          </p>
        </div>
      </div>
    </div>
  );
};

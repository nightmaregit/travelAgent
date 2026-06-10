import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBookings, type Booking } from '../services/bookingService';
import './Package.css';

export const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await getBookings();
        setBookings(data);
        setError(null);
      } catch (err: any) {
        setError('Failed to load your bookings. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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

  return (
    <div className="package-container">
      <div className="package-header">
        <h1>My Booking History</h1>
        <Link to="/packages" className="view-detail-btn" style={{ width: 'auto', backgroundColor: '#3498db' }}>
          Browse More Packages
        </Link>
      </div>

      {loading ? (
        <div className="loading">Loading your bookings...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="no-data" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>You haven't made any bookings yet.</p>
          <Link to="/packages" className="view-detail-btn" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking Code</th>
                <th>Package</th>
                <th>Booking Date</th>
                <th>Pax</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td><strong>{booking.booking_code}</strong></td>
                  <td>{booking.package_title || 'N/A'}</td>
                  <td>{formatDate(booking.booking_date)}</td>
                  <td>{booking.total_pax}</td>
                  <td>{formatPrice(booking.total_amount)}</td>
                  <td>
                    <span style={{ 
                      color: '#fff', 
                      backgroundColor: getStatusColor(booking.status),
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      textTransform: 'capitalize'
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/bookings/${booking.id}`} className="btn-edit" style={{ backgroundColor: '#3498db' }}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus, type Booking } from '../../services/bookingService';
import '../Package.css';

export const AdminBookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to load bookings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (window.confirm(`Change booking status to ${newStatus}?`)) {
      try {
        await updateBookingStatus(id, newStatus);
        alert('Booking status updated successfully');
        fetchBookings(); // Refresh the list
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to update booking status');
        console.error(err);
      }
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'confirmed':
      case 'paid':
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
    <div className="package-container" style={{ maxWidth: '1200px' }}>
      <div className="package-header">
        <h1>Manage Transactions</h1>
      </div>

      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking Code</th>
                <th>Package</th>
                <th>Date</th>
                <th>Pax</th>
                <th>Total Tagihan</th>
                <th>Payment</th>
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
                    {booking.payment_status ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold',
                          color: booking.payment_status === 'success' ? '#2ecc71' : '#f39c12'
                        }}>
                          {booking.payment_status.toUpperCase()}
                        </span>
                        {booking.proof_image && (
                          <a 
                            href={booking.proof_image} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.7rem', color: '#3498db' }}
                          >
                            View Proof
                          </a>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#95a5a6' }}>No Payment</span>
                    )}
                  </td>
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
                    <select 
                      value={booking.status} 
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm (Paid)</option>
                      <option value="cancelled">Cancel</option>
                    </select>
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBookings, type Booking } from '../../services/bookingService';
import '../Package.css';

export const AdminDashboard: React.FC = () => {
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
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const totalSuccess = bookings.filter(b => b.status === 'confirmed' || b.status === 'success' || b.status === 'paid').length;
  const pendingOrders = bookings.filter(b => b.status === 'pending').length;
  
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'success' || b.status === 'paid')
    .reduce((acc, curr) => acc + Number(curr.total_amount), 0);

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Number(price));
  };

  if (loading) return <div className="package-container">Loading dashboard...</div>;
  if (error) return <div className="package-container"><div className="error-message">{error}</div></div>;

  return (
    <div className="package-container">
      <Link to="/" className="back-btn">← Back to Home</Link>
      <div className="package-header" style={{ marginTop: '1rem' }}>
        <h1>Admin Dashboard</h1>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div style={{ flex: 1, minWidth: '200px', padding: '1.5rem', backgroundColor: '#e8f8f5', borderRadius: '8px', borderLeft: '5px solid #2ecc71' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2ecc71' }}>Total Revenue</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{formatPrice(totalRevenue)}</p>
        </div>

        <div style={{ flex: 1, minWidth: '200px', padding: '1.5rem', backgroundColor: '#ebf5fb', borderRadius: '8px', borderLeft: '5px solid #3498db' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#3498db' }}>Successful Bookings</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{totalSuccess}</p>
        </div>

        <div style={{ flex: 1, minWidth: '200px', padding: '1.5rem', backgroundColor: '#fef5e7', borderRadius: '8px', borderLeft: '5px solid #f39c12' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#f39c12' }}>Pending Orders</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{pendingOrders}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/admin/bookings" className="view-detail-btn" style={{ width: 'auto', backgroundColor: '#34495e' }}>
          Manage All Transactions
        </Link>
        <Link to="/admin/packages" className="view-detail-btn" style={{ width: 'auto', backgroundColor: '#8e44ad' }}>
          Manage Tour Packages
        </Link>
      </div>
    </div>
  );
};

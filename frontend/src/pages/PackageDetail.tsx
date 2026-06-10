import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPackageById, type Package } from '../services/packageService';
import { createBooking } from '../services/bookingService';
import './Package.css';

export const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Booking states
  const [totalPax, setTotalPax] = useState<number>(1);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getPackageById(id);
        setPkg(data);
        setError(null);
      } catch (err) {
        setError('Failed to load package details. It might not exist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first to book a package');
      navigate('/login');
      return;
    }

    if (totalPax < 1) {
      setBookingError('Total pax must be at least 1');
      return;
    }

    if (pkg && totalPax > pkg.quota) {
      setBookingError('Insufficient quota available');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    try {
      await createBooking({
        tour_package_id: id,
        total_pax: totalPax
      });
      alert('Booking successful!');
      navigate('/bookings');
    } catch (err: any) {
      setBookingError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      console.error(err);
    } finally {
      setBookingLoading(false);
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

  if (loading) return <div className="package-container">Loading details...</div>;
  if (error) return <div className="package-container"><div className="error-message">{error}</div></div>;
  if (!pkg) return <div className="package-container">Package not found.</div>;

  return (
    <div className="package-container">
      <Link to="/packages" className="back-btn">← Back to Catalog</Link>
      
      <div className="package-detail-container">
        <div className="package-detail-header">
          <h1>{pkg.title}</h1>
          <div className="package-destination">📍 {pkg.destination}</div>
        </div>

        <div className="package-info-grid">
          <div className="info-item">
            <label>Price</label>
            <span className="package-price">{formatPrice(pkg.price)}</span>
          </div>
          <div className="info-item">
            <label>Remaining Quota</label>
            <span>{pkg.quota} persons</span>
          </div>
          <div className="info-item">
            <label>Start Date</label>
            <span>{formatDate(pkg.start_date)}</span>
          </div>
          <div className="info-item">
            <label>End Date</label>
            <span>{formatDate(pkg.end_date)}</span>
          </div>
        </div>

        <div className="package-description">
          <h3>Description</h3>
          <p>{pkg.description}</p>
        </div>

        <div className="booking-section" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3>Book This Package</h3>
          {bookingError && <div className="error-message" style={{ marginBottom: '1rem' }}>{bookingError}</div>}
          <form onSubmit={handleBooking} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="totalPax">Number of Pax</label>
              <input 
                type="number" 
                id="totalPax"
                min="1" 
                max={pkg.quota}
                value={totalPax} 
                onChange={(e) => setTotalPax(parseInt(e.target.value))}
                required
                style={{ width: '100px' }}
              />
            </div>
            <button 
              type="submit"
              className="view-detail-btn" 
              style={{ backgroundColor: '#2ecc71', border: 'none', cursor: 'pointer', margin: 0, width: 'auto' }}
              disabled={bookingLoading || pkg.quota === 0}
            >
              {bookingLoading ? 'Processing...' : pkg.quota === 0 ? 'Sold Out' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPackageById, type Package } from '../services/packageService';
import './Package.css';

export const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

        <button 
          className="view-detail-btn" 
          style={{ backgroundColor: '#3498db', border: 'none', cursor: 'pointer' }}
          onClick={() => alert('Booking feature coming soon!')}
        >
          Book This Package
        </button>
      </div>
    </div>
  );
};

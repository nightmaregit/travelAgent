import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages, type Package } from '../services/packageService';
import './Package.css';

export const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchPackages = async (destination?: string) => {
    setLoading(true);
    try {
      const data = await getPackages(destination);
      setPackages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load packages. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPackages(searchTerm);
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Number(price));
  };

  return (
    <div className="package-container">
      <div className="package-header">
        <h1>Explore Our Tour Packages</h1>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading packages...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : packages.length === 0 ? (
        <div className="no-data">No packages found for your search.</div>
      ) : (
        <div className="package-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <div className="package-card-content">
                <h3>{pkg.title}</h3>
                <div className="package-destination">
                  📍 {pkg.destination}
                </div>
                <div className="package-price">
                  {formatPrice(pkg.price)}
                </div>
                <Link to={`/packages/${pkg.id}`} className="view-detail-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

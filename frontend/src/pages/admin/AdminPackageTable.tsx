import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages, deletePackage, type Package } from '../../services/packageService';
import '../Package.css';

export const AdminPackageTable: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await getPackages();
      setPackages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load packages.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deletePackage(id);
        alert('Package deleted successfully');
        fetchPackages(); // Refresh the list
      } catch (err) {
        alert('Failed to delete package');
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

  return (
    <div className="package-container">
      <div className="package-header">
        <h1>Manage Tour Packages</h1>
        <Link to="/admin/packages/new" className="view-detail-btn" style={{ width: 'auto', backgroundColor: '#3498db' }}>
          + Add New Package
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Destination</th>
                <th>Price</th>
                <th>Quota</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>{pkg.title}</td>
                  <td>{pkg.destination}</td>
                  <td>{formatPrice(pkg.price)}</td>
                  <td>{pkg.quota}</td>
                  <td>
                    <span style={{ color: pkg.is_active ? '#2ecc71' : '#e74c3c' }}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link to={`/admin/packages/edit/${pkg.id}`} className="btn-edit">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(pkg.id, pkg.title)} 
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
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

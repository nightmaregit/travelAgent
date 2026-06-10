import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createPackage, updatePackage, getPackageById, type PackageInput } from '../../services/packageService';
import '../Package.css';

export const PackageForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<PackageInput>({
    title: '',
    destination: '',
    description: '',
    price: 0,
    quota: 0,
    start_date: '',
    end_date: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchPackage = async () => {
        try {
          const data = await getPackageById(id);
          // Format dates to YYYY-MM-DD for input type="date"
          const formatDate = (dateStr: string) => new Date(dateStr).toISOString().split('T')[0];
          
          setFormData({
            title: data.title,
            destination: data.destination,
            description: data.description,
            price: Number(data.price),
            quota: data.quota,
            start_date: formatDate(data.start_date),
            end_date: formatDate(data.end_date),
          });
        } catch (err) {
          setError('Failed to load package data');
          console.error(err);
        }
      };
      fetchPackage();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quota' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.price < 0) {
      alert('Price cannot be negative');
      return;
    }
    if (formData.quota < 0) {
      alert('Quota cannot be negative');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await updatePackage(id, formData);
        alert('Package updated successfully');
      } else {
        await createPackage(formData);
        alert('Package created successfully');
      }
      navigate('/admin/packages');
    } catch (err) {
      setError('Failed to save package. Please check your data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="package-container">
      <Link to="/admin/packages" className="back-btn">← Back to Management</Link>
      
      <div className="package-detail-container">
        <h1>{isEditMode ? 'Edit Package' : 'Create New Package'}</h1>
        
        {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
        
        <form className="package-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Package Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Exotic Bali Summer"
            />
          </div>

          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              placeholder="e.g. Bali, Indonesia"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe the tour details..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (IDR)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="quota">Quota (Persons)</label>
              <input
                type="number"
                id="quota"
                name="quota"
                value={formData.quota}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update Package' : 'Create Package'}
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import heroImage from '../assets/hero.png';

const LandingPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-logo">TravelAgent</div>
        <div className="nav-links">
          <Link to="/packages">Paket Wisata</Link>
          {isLoggedIn ? (
            <Link to="/dashboard" className="nav-auth-btn">Dashboard</Link>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="nav-auth-btn">Daftar</Link>
            </>
          )}
        </div>
      </nav>

      <header className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})` }}>
        <div className="hero-content">
          <h1>Jelajahi Destinasi Impianmu Bersama Kami</h1>
          <Link to="/packages" className="cta-button">Lihat Paket Wisata</Link>
        </div>
      </header>

      <section className="guide-section">
        <h2>Panduan Penggunaan</h2>
        <div className="guide-container">
          <div className="guide-item">
            <div className="guide-number">1</div>
            <h3>Cari & Pilih Paket Wisata</h3>
            <p>Telusuri berbagai destinasi menarik yang kami tawarkan.</p>
          </div>
          <div className="guide-item">
            <div className="guide-number">2</div>
            <h3>Registrasi / Login Akun</h3>
            <p>Masuk ke akun Anda atau buat akun baru untuk mulai memesan.</p>
          </div>
          <div className="guide-item">
            <div className="guide-number">3</div>
            <h3>Masukkan Jumlah Pax & Lakukan Pemesanan</h3>
            <p>Tentukan jumlah peserta dan konfirmasi pesanan Anda.</p>
          </div>
          <div className="guide-item">
            <div className="guide-number">4</div>
            <h3>Unggah Bukti Pembayaran & Tunggu E-Tiket Terbit</h3>
            <p>Selesaikan pembayaran dan unggah buktinya untuk mendapatkan e-tiket.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 Travel Agent App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

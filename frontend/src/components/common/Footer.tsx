import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '4rem',
        paddingBottom: '2rem',
        marginTop: '5rem',
      }}
    >
      <div className="container">
        {/* Value Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '3rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.1)',
                color: 'var(--primary)',
              }}
            >
              <Award size={26} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>25+ Years of Trust</h4>
              <p style={{ fontSize: '0.85rem' }}>Proudly serving families & businesses</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(56, 189, 248, 0.1)',
                color: 'var(--accent-steel)',
              }}
            >
              <Truck size={26} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Safe Local Delivery</h4>
              <p style={{ fontSize: '0.85rem' }}>Careful transport for heavy furniture</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--success)',
              }}
            >
              <RotateCcw size={26} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Instant Exchange</h4>
              <p style={{ fontSize: '0.85rem' }}>Best scrap value on plastic & furniture</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(168, 85, 247, 0.1)',
                color: '#c084fc',
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Quality Assurance</h4>
              <p style={{ fontSize: '0.85rem' }}>Genuine parts, heavy-gauge steel & solid wood</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3px',
                  boxShadow: 'var(--primary-glow)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={logoImg}
                  alt="Anand Electronics Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>Anand</h3>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Premier showroom for Home Appliances, Coolers, TVs, Solid Wood & Heavy Steel Almirahs, Office Chairs & Repair Services.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <MapPin size={16} color="var(--primary)" />
                <span>Station Road / Main Market Square</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Phone size={16} color="var(--primary)" />
                <span>+91 98765 43210 / 0141-2345678</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Clock size={16} color="var(--primary)" />
                <span>Mon-Sat: 9:00 AM – 8:30 PM (Sun open)</span>
              </div>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Product Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/products?category=electronics" style={{ color: 'var(--text-secondary)' }}>Electronics & Coolers</Link></li>
              <li><Link to="/products?category=wood" style={{ color: 'var(--text-secondary)' }}>Solid Wood Furniture</Link></li>
              <li><Link to="/products?category=steel" style={{ color: 'var(--text-secondary)' }}>Heavy Steel Almirahs & Trunks</Link></li>
              <li><Link to="/products?category=plastic" style={{ color: 'var(--text-secondary)' }}>Plastic Furniture & Chairs</Link></li>
              <li><Link to="/products" style={{ color: 'var(--primary)' }}>Browse Complete Catalog →</Link></li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Customer Care</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/services" style={{ color: 'var(--text-secondary)' }}>Book Lock & Handle Repair</Link></li>
              <li><Link to="/services" style={{ color: 'var(--text-secondary)' }}>Sofa Upholstery & Cushioning</Link></li>
              <li><Link to="/services" style={{ color: 'var(--text-secondary)' }}>Cooler Pre-Season Overhaul</Link></li>
              <li><Link to="/exchange" style={{ color: 'var(--text-secondary)' }}>Old Plastic Chairs Exchange</Link></li>
              <li><Link to="/admin" style={{ color: 'var(--text-muted)' }}>Staff & Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <p>© {new Date().getFullYear()} Anand Electronics & Steel Furniture. All rights reserved.</p>
          <p>Designed with pride for durable Indian homes.</p>
        </div>
      </div>
    </footer>
  );
};

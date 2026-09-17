import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Store,
  Grid,
  Wrench,
  RotateCcw,
  ShieldCheck,
  Menu,
  X,
  PhoneCall,
} from 'lucide-react';

import logoImg from '../../assets/logo.png';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Store },
    { name: 'Catalog', path: '/products', icon: Grid },
    { name: 'Repair Services', path: '/services', icon: Wrench },
    { name: 'Exchange Program', path: '/exchange', icon: RotateCcw },
    { name: 'Admin Portal', path: '/admin', icon: ShieldCheck },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'all var(--transition-normal)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Brand Identity */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--primary-glow)',
              overflow: 'hidden',
              padding: '3px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
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
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              Anand
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Electronics & Steel Furniture
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            margin: '0 0.5rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.7rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                  background: active ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                  border: active ? '1px solid var(--border-highlight)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Contact Hotline, Theme Toggle & Mobile Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            flexShrink: 0,
          }}
        >
          {/* Visual separator between navigation and utilities */}
          <div
            className="desktop-divider"
            style={{
              width: '1px',
              height: '24px',
              background: 'var(--border-subtle)',
              margin: '0 0.25rem',
            }}
          />

          <ThemeToggle />

          <a
            href="tel:+919876543210"
            className="btn btn-outline btn-sm hotline-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              padding: '0.4rem 0.75rem',
            }}
            title="Call Support Hotline: +91 98765 43210"
          >
            <PhoneCall size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span className="hotline-text" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              +91 98765 43210
            </span>
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1rem 1.5rem',
          }}
          className="mobile-nav-pane"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    color: active ? 'var(--primary)' : 'var(--text-primary)',
                    background: active ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Theme Mode</span>
              <ThemeToggle showLabel />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1200px) {
          .hotline-text { display: none !important; }
          .hotline-btn { padding: 0.45rem !important; border-radius: var(--radius-pill) !important; }
        }
        @media (max-width: 980px) {
          .desktop-nav, .desktop-divider { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
};

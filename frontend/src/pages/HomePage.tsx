import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Tv,
  Armchair,
  Layers,
  Sparkles,
  Wrench,
  RotateCcw,
  ChevronRight,
  Search,
} from 'lucide-react';
import { productApi } from '../api/products';
import type { Product } from '../types';
import { ImagePlaceholder } from '../components/common/ImagePlaceholder';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const prods = await productApi.getProducts({ featured: true, limit: 8 }).catch(() => []);
        // If no featured products yet, fetch general products
        if (prods.length === 0) {
          const fallbackProds = await productApi.getProducts({ limit: 8 }).catch(() => []);
          setFeaturedProducts(fallbackProds);
        } else {
          setFeaturedProducts(prods);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryCards = [
    {
      title: 'Electronics & Coolers',
      desc: 'Heavy-duty steel & plastic coolers, LED TVs, mixers, fans, and cooktops.',
      icon: Tv,
      color: '#60a5fa',
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.25)',
      link: '/products?category=electronics',
    },
    {
      title: 'Solid Wood Furniture',
      desc: 'Handcrafted wooden beds, plush sofas, wardrobes, dining tables & study desks.',
      icon: Armchair,
      color: '#fb923c',
      bg: 'rgba(251, 146, 60, 0.1)',
      border: 'rgba(251, 146, 60, 0.25)',
      link: '/products?category=wood-furniture',
    },
    {
      title: 'Heavy Steel Furniture',
      desc: 'Ultra-durable security almirahs, galvanized trunks, storage racks & office lockers.',
      icon: Layers,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.1)',
      border: 'rgba(56, 189, 248, 0.25)',
      link: '/products?category=steel-furniture',
    },
    {
      title: 'Plastic Furniture',
      desc: 'Molded dining chairs, study tables, stackable chairs, and heavy-duty stools.',
      icon: Sparkles,
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.1)',
      border: 'rgba(52, 211, 153, 0.25)',
      link: '/products?category=plastic-furniture',
    },
    {
      title: 'Repair & Lock Services',
      desc: 'Expert on-site lock repairs, trunk welding, cooler motor rewinding & sofa revamping.',
      icon: Wrench,
      color: '#c084fc',
      bg: 'rgba(192, 132, 252, 0.1)',
      border: 'rgba(192, 132, 252, 0.25)',
      link: '/services',
    },
    {
      title: 'Old Item Exchange',
      desc: 'Exchange damaged plastic chairs and old metal items for instant store credits.',
      icon: RotateCcw,
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.1)',
      border: 'rgba(244, 63, 94, 0.25)',
      link: '/exchange',
    },
  ];

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          paddingTop: '4.5rem',
          paddingBottom: '5rem',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245, 158, 11, 0.18), transparent)',
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: 'var(--primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1.5rem',
              }}
            >
              <Sparkles size={16} /> Trusted Electronics & Steel Furniture Since 1998
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
                lineHeight: 1.15,
              }}
            >
              Built to Last.{' '}
              <span
                style={{
                  background: 'var(--primary-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Furnished with Pride.
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                maxWidth: '680px',
                marginInline: 'auto',
              }}
            >
              Discover high-grade security steel almirahs, solid teakwood beds, desert coolers, and certified on-site repair & exchange programs under one roof.
            </p>

            {/* Action Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'center',
                marginBottom: '2.5rem',
              }}
            >
              <Link to="/products" className="btn btn-primary">
                Explore Catalog <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn btn-secondary">
                <Wrench size={18} /> Book Lock & Repair Service
              </Link>
              <Link to="/exchange" className="btn btn-outline">
                <RotateCcw size={18} /> Exchange Old Chairs
              </Link>
            </div>

            {/* Quick Search Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              style={{
                maxWidth: '560px',
                margin: '0 auto',
                display: 'flex',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.4rem 0.6rem 0.4rem 1.25rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coolers, steel almirah, beds, sofa..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ borderRadius: 'var(--radius-pill)', padding: '0.5rem 1.2rem' }}
              >
                <Search size={16} /> Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Our Specialties
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>Browse by Department</h2>
            </div>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              View all products <ChevronRight size={18} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {categoryCards.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.title}
                  to={cat.link}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'inline-flex',
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: cat.bg,
                        color: cat.color,
                        border: `1px solid ${cat.border}`,
                        marginBottom: '1.25rem',
                      }}
                    >
                      <Icon size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{cat.title}</h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                      {cat.desc}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: cat.color,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    Explore department <ArrowRight size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-surface-subtle)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--accent-steel)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Top Picks
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>Featured Hardware & Furniture</h2>
            </div>
            <Link
              to="/products"
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              See All in Catalog <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              Loading products...
            </div>
          ) : featuredProducts.length === 0 ? (
            <div
              className="glass-card"
              style={{
                textAlign: 'center',
                padding: '3rem',
                border: '1px dashed var(--border-subtle)',
              }}
            >
              <Armchair size={42} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Catalog Ready for Stock</h3>
              <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                FastAPI database is connected! You can add products via the Admin Portal or view categories.
              </p>
              <Link to="/admin" className="btn btn-primary btn-sm">
                Open Admin Portal
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {featuredProducts.map((product) => {
                const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug || product.id}`}
                    className="glass-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      padding: 0,
                    }}
                  >
                    <div style={{ height: '200px', width: '100%', position: 'relative', background: 'var(--bg-img-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}>
                      <ImagePlaceholder
                        src={primaryImage?.image_path}
                        alt={product.title}
                        category={product.subcategory?.name || 'Furniture'}
                        objectFit="contain"
                      />
                      {product.in_stock ? (
                        <span
                          className="badge badge-emerald"
                          style={{ position: 'absolute', top: '10px', right: '10px' }}
                        >
                          In Stock
                        </span>
                      ) : (
                        <span
                          className="badge badge-rose"
                          style={{ position: 'absolute', top: '10px', right: '10px' }}
                        >
                          Pre-Order
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {product.subcategory?.name || 'General'}
                      </span>
                      <h4
                        style={{
                          fontSize: '1.1rem',
                          marginBottom: '0.5rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {product.title}
                      </h4>
                      {product.material && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          Material: {product.material}
                        </p>
                      )}
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Request'}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                          Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Dual Highlights: Repair Services & Exchange Banner */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Repair Callout */}
            <div
              className="glass-card card-highlight-repair"
              style={{ padding: '2.5rem' }}
            >
              <div className="icon-badge-purple">
                <Wrench size={30} />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
                Broken Lock? Jammed Almirah?
              </h3>
              <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Don't replace your heavy steel almirahs or sofas. Our specialized technicians repair lever locks, handles, cooler pumps, and restore sofa upholstery right at your doorstep.
              </p>
              <Link to="/services" className="btn btn-secondary">
                Book Repair Appointment →
              </Link>
            </div>

            {/* Exchange Callout */}
            <div
              className="glass-card card-highlight-exchange"
              style={{ padding: '2.5rem' }}
            >
              <div className="icon-badge-emerald">
                <RotateCcw size={30} />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
                Plastic Chair Exchange Program
              </h3>
              <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Bring your cracked or old plastic chairs, trunks, or damaged metal pieces and get immediate credit discounts towards brand-new furniture pieces.
              </p>
              <Link to="/exchange" className="btn btn-primary">
                Calculate Exchange Value →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

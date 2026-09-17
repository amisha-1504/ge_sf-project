import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Truck,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Images,
} from 'lucide-react';
import { productApi } from '../api/products';
import type { Product } from '../types';
import { ImagePlaceholder } from '../components/common/ImagePlaceholder';

export const ProductDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Zoom Lightbox State
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    if (!idOrSlug) return;
    setLoading(true);
    setError(null);

    productApi
      .getProduct(idOrSlug)
      .then((data) => {
        setProduct(data);
        const primary = data.images?.find((img) => img.is_primary) || data.images?.[0];
        setSelectedImage(primary?.image_path || null);
      })
      .catch((err) => {
        console.error('Failed to get product', err);
        setError('Product not found or unavailable');
      })
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  const currentImageIndex = product?.images?.findIndex((img) => img.image_path === selectedImage) ?? 0;

  const handlePrevImage = () => {
    if (!product?.images?.length) return;
    const idx = currentImageIndex <= 0 ? product.images.length - 1 : currentImageIndex - 1;
    setSelectedImage(product.images[idx].image_path);
  };

  const handleNextImage = () => {
    if (!product?.images?.length) return;
    const idx = (currentImageIndex + 1) % product.images.length;
    setSelectedImage(product.images[idx].image_path);
  };

  // Keyboard navigation for zoom modal
  useEffect(() => {
    if (!isZoomOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
        setZoomScale(1);
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === '+' || e.key === '=') {
        setZoomScale((s) => Math.min(s + 0.25, 3));
      } else if (e.key === '-') {
        setZoomScale((s) => Math.max(s - 0.25, 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen, selectedImage, product]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>{error || 'Product Not Found'}</h2>
        <p style={{ marginBottom: '2rem' }}>The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={18} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const phone = '9876543210';
  const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(
    `Hello Anand Electronics, I am interested in: ${product.title} (Price: ₹${product.price || 'N/A'}). Is it available?`
  )}`;

  return (
    <div className="product-detail-page container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline btn-sm"
        style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '3.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Image Viewer */}
        <div>
          <div
            className="glass-card"
            style={{
              padding: '1rem',
              overflow: 'hidden',
              height: '460px',
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--bg-img-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-in',
            }}
            onClick={() => {
              setIsZoomOpen(true);
              setZoomScale(1.25);
            }}
            title="Click to zoom image"
          >
            <ImagePlaceholder
              src={selectedImage}
              alt={product.title}
              category={product.subcategory?.name || 'Furniture'}
              aspectRatio="auto"
              objectFit="contain"
            />

            {product.is_featured && (
              <span
                className="badge badge-amber"
                style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}
              >
                <Sparkles size={12} /> Featured Item
              </span>
            )}

            {/* Click to Zoom Action Badge */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomOpen(true);
                setZoomScale(1.5);
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 2,
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <ZoomIn size={14} color="var(--primary)" /> Zoom Image
            </button>

            {/* Image X of Y counter */}
            {product.images && product.images.length > 1 && (
              <span
                className="badge"
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  right: '14px',
                  zIndex: 2,
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Images size={13} />
                Image {currentImageIndex + 1} of {product.images.length}
              </span>
            )}
          </div>

          {/* Gallery Thumbnails if multiple images */}
          {product.images && product.images.length > 1 && (
            <div style={{ marginTop: '1.25rem' }}>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Images size={14} color="var(--primary)" />
                Product Images ({product.images.length})
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  overflowX: 'auto',
                  paddingBottom: '0.5rem',
                  scrollbarWidth: 'thin',
                }}
              >
                {product.images.map((img, idx) => {
                  const isSelected = selectedImage === img.image_path;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedImage(img.image_path)}
                      title={`View Image ${idx + 1}`}
                      style={{
                        flexShrink: 0,
                        width: '74px',
                        height: '74px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        position: 'relative',
                        border: isSelected
                          ? '2px solid var(--primary)'
                          : '1px solid var(--border-subtle)',
                        boxShadow: isSelected ? '0 0 10px rgba(245, 158, 11, 0.35)' : 'none',
                        padding: '3px',
                        cursor: 'pointer',
                        background: 'var(--bg-elevated)',
                        transition: 'all 0.2s ease',
                        transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                      }}
                    >
                      <ImagePlaceholder
                        src={img.image_path}
                        alt={`${product.title} - Image ${idx + 1}`}
                        category={product.subcategory?.name}
                        objectFit="contain"
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '3px',
                          right: '4px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: isSelected ? 'var(--primary)' : 'rgba(0, 0, 0, 0.7)',
                          color: isSelected ? '#000' : '#fff',
                        }}
                      >
                        #{idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Order CTA */}
        <div>
          <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              className="badge badge-blue"
              style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}
            >
              {product.subcategory?.name || 'Catalog Item'}
            </span>

            {product.in_stock ? (
              <span className="badge badge-emerald">
                <CheckCircle size={12} /> In Stock Ready to Deliver
              </span>
            ) : (
              <span className="badge badge-rose">
                <XCircle size={12} /> Out of Stock / Made to Order
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem', lineHeight: 1.25 }}>
            {product.title}
          </h1>

          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--primary)',
              marginBottom: '1.5rem',
            }}
          >
            {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Inquiry'}
          </div>

          {product.description && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Description
              </h4>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                {product.description}
              </p>
            </div>
          )}

          {/* Specifications Table */}
          <div
            className="glass-card"
            style={{
              padding: '1.25rem',
              marginBottom: '2rem',
              background: 'var(--bg-surface-subtle)',
            }}
          >
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Product Specifications
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Material / Construction</span>
                <strong>{product.material || 'Premium Grade Standard'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Dimensions</span>
                <strong>{product.dimensions || 'Standard Showroom Size'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Stock Status</span>
                <strong style={{ color: product.in_stock ? 'var(--success)' : 'var(--danger)' }}>
                  {product.in_stock ? 'Available Immediately' : 'Book on Advance'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Item Code</span>
                <strong>GESF-P{product.id}</strong>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ fontSize: '1.05rem', padding: '0.9rem' }}
            >
              <MessageSquare size={20} /> Inquire via WhatsApp
            </a>
            <a
              href={`tel:+91${phone}`}
              className="btn btn-secondary"
              style={{ fontSize: '1rem', padding: '0.85rem' }}
            >
              <PhoneCall size={18} /> Call Showroom Directly (+91 {phone})
            </a>
          </div>

          {/* Guarantee Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span>100% Genuine product directly from manufacturer showroom</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={16} color="var(--accent-steel)" />
              <span>Safe delivery & on-site assembly assistance available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Lightbox Modal */}
      {isZoomOpen && (
        <div
          role="dialog"
          aria-label="Image Zoom Lightbox"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(5, 8, 18, 0.94)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.25rem',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => {
            setIsZoomOpen(false);
            setZoomScale(1);
          }}
        >
          {/* Top Control Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0.5rem 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>
                {product.title}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Image {currentImageIndex + 1} of {product.images.length || 1}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setZoomScale((s) => Math.min(s + 0.25, 3))}
                title="Zoom In (+)"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <ZoomIn size={16} />
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setZoomScale((s) => Math.max(s - 0.25, 1))}
                title="Zoom Out (-)"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <ZoomOut size={16} />
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setZoomScale(1)}
                title="Reset Zoom"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <RotateCcw size={15} />
              </button>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  minWidth: '46px',
                  textAlign: 'center',
                }}
              >
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsZoomOpen(false);
                  setZoomScale(1);
                }}
                title="Close (Esc)"
                style={{ padding: '0.4rem 0.75rem', marginLeft: '0.5rem' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Center Image Display with Navigation Arrows */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              margin: '1rem 0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Image Button */}
            {product.images && product.images.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  zIndex: 10,
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Main Zoomed Image */}
            <div
              style={{
                width: '90%',
                height: '70vh',
                maxWidth: '1000px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${zoomScale})`,
                transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
                cursor: zoomScale > 1 ? 'grab' : 'zoom-in',
              }}
              onClick={() => setZoomScale((s) => (s > 1 ? 1 : 1.75))}
              title={zoomScale > 1 ? 'Click to reset' : 'Click to zoom'}
            >
              <ImagePlaceholder
                src={selectedImage}
                alt={product.title}
                category={product.subcategory?.name}
                aspectRatio="auto"
                objectFit="contain"
              />
            </div>

            {/* Next Image Button */}
            {product.images && product.images.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  zIndex: 10,
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                title="Next Image (Right Arrow)"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip inside Zoom */}
          {product.images && product.images.length > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.6rem',
                overflowX: 'auto',
                padding: '0.5rem 0',
                maxWidth: '900px',
                margin: '0 auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {product.images.map((img, idx) => {
                const isSelected = selectedImage === img.image_path;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImage(img.image_path)}
                    style={{
                      flexShrink: 0,
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: isSelected
                        ? '2px solid var(--primary)'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '2px',
                      cursor: 'pointer',
                      background: 'rgba(0, 0, 0, 0.6)',
                      opacity: isSelected ? 1 : 0.6,
                      transition: 'all 0.2s ease',
                    }}
                    title={`Jump to Image ${idx + 1}`}
                  >
                    <ImagePlaceholder
                      src={img.image_path}
                      alt={`${product.title} - ${idx + 1}`}
                      category={product.subcategory?.name}
                      objectFit="contain"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

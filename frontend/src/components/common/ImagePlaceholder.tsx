import React, { useState } from 'react';
import {
  Tv,
  Package,
  Wrench,
  RotateCcw,
  Sparkles,
  Layers,
  Armchair
} from 'lucide-react';

interface ImagePlaceholderProps {
  src?: string | null;
  alt: string;
  category?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  fallbackText?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  src,
  alt,
  category,
  className = '',
  aspectRatio = 'square',
  fallbackText,
  objectFit = 'contain',
}) => {
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  // Normalize image URL: if starts with /static, prefix API server if needed
  const getFullImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If running in dev proxy, /static works directly, or use window.location.origin
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  };

  const resolvedSrc = getFullImageUrl(src);

  if (resolvedSrc && !hasError) {
    return (
      <img
        src={resolvedSrc}
        alt={alt}
        className={className}
        onError={() => setHasError(true)}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: objectFit,
          display: 'block',
        }}
      />
    );
  }

  // Choose icon based on category or alt
  const lowerCat = (category || alt).toLowerCase();
  let Icon = Package;
  let categoryTheme = {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    iconColor: '#94a3b8',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  };

  if (lowerCat.includes('electr') || lowerCat.includes('tv') || lowerCat.includes('cooler') || lowerCat.includes('fan')) {
    Icon = Tv;
    categoryTheme = {
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
      iconColor: '#60a5fa',
      borderColor: 'rgba(96, 165, 250, 0.2)',
    };
  } else if (lowerCat.includes('wood') || lowerCat.includes('bed') || lowerCat.includes('sofa') || lowerCat.includes('table')) {
    Icon = Armchair;
    categoryTheme = {
      gradient: 'linear-gradient(135deg, #451a03 0%, #1c1917 100%)',
      iconColor: '#fb923c',
      borderColor: 'rgba(251, 146, 60, 0.2)',
    };
  } else if (lowerCat.includes('steel') || lowerCat.includes('trunk') || lowerCat.includes('almirah') || lowerCat.includes('rack')) {
    Icon = Layers;
    categoryTheme = {
      gradient: 'linear-gradient(135deg, #1e293b 0%, #0284c7 100%)',
      iconColor: '#38bdf8',
      borderColor: 'rgba(56, 189, 248, 0.2)',
    };
  } else if (lowerCat.includes('repair') || lowerCat.includes('service') || lowerCat.includes('lock')) {
    Icon = Wrench;
    categoryTheme = {
      gradient: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
      iconColor: '#a78bfa',
      borderColor: 'rgba(167, 139, 250, 0.2)',
    };
  } else if (lowerCat.includes('exchange') || lowerCat.includes('plastic')) {
    Icon = RotateCcw;
    categoryTheme = {
      gradient: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
      iconColor: '#34d399',
      borderColor: 'rgba(52, 211, 153, 0.2)',
    };
  }

  const aspectStyles: React.CSSProperties = {
    aspectRatio:
      aspectRatio === 'square'
        ? '1 / 1'
        : aspectRatio === 'video'
        ? '16 / 9'
        : aspectRatio === 'wide'
        ? '21 / 9'
        : 'auto',
  };

  return (
    <div
      className={`image-placeholder-box ${className}`}
      style={{
        ...aspectStyles,
        background: categoryTheme.gradient,
        border: `1px dashed ${categoryTheme.borderColor}`,
        position: 'relative',
        overflow: 'hidden',
      }}
      data-testid="image-placeholder"
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          backgroundImage:
            'radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <div
          style={{
            padding: '0.75rem',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Icon size={28} color={categoryTheme.iconColor} />
        </div>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            maxWidth: '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {fallbackText || alt}
        </span>
        <span
          style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <Sparkles size={11} /> GESF Official Catalog
        </span>
      </div>
    </div>
  );
};

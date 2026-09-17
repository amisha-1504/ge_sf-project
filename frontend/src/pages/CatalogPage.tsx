import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  X,
  Package,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import { productApi } from '../api/products';
import { categoryApi } from '../api/categories';
import type { Category, Product } from '../types';
import { ImagePlaceholder } from '../components/common/ImagePlaceholder';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters from URL or state
  const selectedCategorySlug = searchParams.get('category') || '';
  const selectedSubcategoryId = searchParams.get('subcategory') ? Number(searchParams.get('subcategory')) : null;
  const initialSearch = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  // Load categories
  useEffect(() => {
    categoryApi
      .getCategories()
      .then((cats) => {
        const productCategories = cats.filter(
          (c) =>
            c.slug.toLowerCase() !== 'repair-services' &&
            c.slug.toLowerCase() !== 'exchange-program' &&
            !c.name.toLowerCase().includes('repair') &&
            !c.name.toLowerCase().includes('exchange')
        );
        setCategories(productCategories);
      })
      .catch(() => []);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Find category id if slug is selected
        let categoryId: number | undefined;
        if (selectedCategorySlug && categories.length > 0) {
          const matched = categories.find((c) => c.slug.toLowerCase() === selectedCategorySlug.toLowerCase());
          if (matched) categoryId = matched.id;
        }

        const data = await productApi.getProducts({
          category_id: categoryId,
          subcategory_id: selectedSubcategoryId || undefined,
          q: searchTerm.trim() || undefined,
          limit: 100,
        });
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategorySlug, selectedSubcategoryId, searchTerm, categories]);

  // Selected Category Object
  const currentCategory = useMemo(() => {
    return categories.find((c) => c.slug.toLowerCase() === selectedCategorySlug.toLowerCase());
  }, [categories, selectedCategorySlug]);

  // Filter & Sort in memory
  const processedProducts = useMemo(() => {
    let result = [...products];

    if (inStockOnly) {
      result = result.filter((p) => p.in_stock);
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      // Newest
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, inStockOnly, sortBy]);

  const handleCategorySelect = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
      newParams.delete('subcategory');
    } else {
      newParams.delete('category');
      newParams.delete('subcategory');
    }
    setSearchParams(newParams);
  };

  const handleSubcategorySelect = (subId: number | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (subId) {
      newParams.set('subcategory', String(subId));
    } else {
      newParams.delete('subcategory');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setInStockOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="catalog-page container animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Breadcrumb & Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--primary)' }}>Catalog</span>
          {currentCategory && (
            <>
              <ChevronRight size={14} />
              <span>{currentCategory.name}</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem' }}>
              {currentCategory ? currentCategory.name : 'All Products & Furniture'}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Showing {processedProducts.length} verified store items
            </p>
          </div>

          {/* Search bar inside catalog */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.4rem 1rem',
              width: '100%',
              maxWidth: '360px',
            }}
          >
            <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                const p = new URLSearchParams(searchParams);
                if (e.target.value) p.set('q', e.target.value);
                else p.delete('q');
                setSearchParams(p);
              }}
              placeholder="Filter by title, material..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                width: '100%',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  const p = new URLSearchParams(searchParams);
                  p.delete('q');
                  setSearchParams(p);
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.6rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => handleCategorySelect('')}
          className={`btn btn-sm ${!selectedCategorySlug ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: 'var(--radius-pill)' }}
        >
          All Departments
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategorySlug.toLowerCase() === cat.slug.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap' }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Subcategory Pills if Category selected */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
            padding: '1rem',
            background: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Subcategories:</span>
          <button
            onClick={() => handleSubcategorySelect(null)}
            className={`badge ${!selectedSubcategoryId ? 'badge-amber' : 'badge-blue'}`}
            style={{ cursor: 'pointer', border: 'none', padding: '0.35rem 0.75rem' }}
          >
            All in {currentCategory.name}
          </button>
          {currentCategory.subcategories.map((sub) => {
            const isSubSelected = selectedSubcategoryId === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => handleSubcategorySelect(sub.id)}
                className={`badge ${isSubSelected ? 'badge-amber' : 'badge-blue'}`}
                style={{
                  cursor: 'pointer',
                  border: isSubSelected ? '1px solid var(--primary)' : '1px solid transparent',
                  padding: '0.35rem 0.75rem',
                  opacity: isSubSelected ? 1 : 0.75,
                }}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Toolbar / Filters & Sorting */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <span>In Stock Only</span>
          </label>

          {(selectedCategorySlug || selectedSubcategoryId || searchTerm || inStockOnly) && (
            <button
              onClick={clearAllFilters}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
            >
              <X size={14} /> Clear Filters
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowUpDown size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          Loading catalog items...
        </div>
      ) : processedProducts.length === 0 ? (
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            maxWidth: '520px',
            margin: '2rem auto',
          }}
        >
          <Package size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Products Found</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            We couldn't find any products matching your current filters. Try changing your search query or department.
          </p>
          <button onClick={clearAllFilters} className="btn btn-primary btn-sm">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {processedProducts.map((product) => {
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
                  textDecoration: 'none',
                }}
              >
                <div style={{ height: '220px', width: '100%', position: 'relative', background: 'var(--bg-img-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}>
                  <ImagePlaceholder
                    src={primaryImage?.image_path}
                    alt={product.title}
                    category={product.subcategory?.name || 'Item'}
                    objectFit="contain"
                  />
                  {product.in_stock ? (
                    <span
                      className="badge badge-emerald"
                      style={{ position: 'absolute', top: '12px', right: '12px' }}
                    >
                      In Stock
                    </span>
                  ) : (
                    <span
                      className="badge badge-rose"
                      style={{ position: 'absolute', top: '12px', right: '12px' }}
                    >
                      Out of Stock
                    </span>
                  )}
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {product.subcategory?.name || 'General Product'}
                  </span>

                  <h3
                    style={{
                      fontSize: '1.15rem',
                      marginBottom: '0.5rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {product.title}
                  </h3>

                  {product.description && (
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '0.75rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </p>
                  )}

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {product.material && <div>Material: {product.material}</div>}
                    {product.dimensions && <div>Dimensions: {product.dimensions}</div>}
                  </div>

                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Contact for Price'}
                    </span>
                    <span className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.8rem' }}>
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

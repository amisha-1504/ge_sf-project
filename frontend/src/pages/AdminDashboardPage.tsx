import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Wrench,
  RotateCcw,
  Layers,
  Plus,
  Trash2,
  Pencil,
  LogOut,
  Filter,
  Palette,
} from 'lucide-react';
import { ThemeCustomizerTab } from '../components/admin/ThemeCustomizerTab';
import { authApi } from '../api/auth';
import { productApi } from '../api/products';
import { categoryApi } from '../api/categories';
import { serviceApi } from '../api/services';
import { exchangeApi } from '../api/exchanges';
import { getStoredToken } from '../api/client';
import type {
  Category,
  Product,
  ProductCreateInput,
  ServiceRequest,
  ExchangeRequest,
  User,
} from '../types';
import { ImagePlaceholder } from '../components/common/ImagePlaceholder';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'exchanges' | 'categories' | 'theme'>('products');
  const [loading, setLoading] = useState(true);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequest[]>([]);

  // Modals & form state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingProductImage, setEditingProductImage] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductCreateInput>({
    title: '',
    slug: '',
    subcategory_id: 1,
    description: '',
    price: 0,
    dimensions: '',
    material: '',
    in_stock: true,
    is_featured: false,
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Filter states
  const [serviceStatusFilter, setServiceStatusFilter] = useState<string>('');
  const [exchangeStatusFilter, setExchangeStatusFilter] = useState<string>('');

  // Category creation form
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubSlug, setNewSubSlug] = useState('');
  const [selectedParentCatId, setSelectedParentCatId] = useState<number>(1);

  // Authentication check
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    authApi
      .getMe()
      .then((user) => {
        setCurrentUser(user);
        loadAllData();
      })
      .catch(() => {
        authApi.logout();
        navigate('/admin/login');
      });
  }, [navigate]);

  // Keyboard shortcut: Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowProductModal(false);
        setShowCategoryModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Freeze background page scrolling and repaints while modals are open
  useEffect(() => {
    if (showProductModal || showCategoryModal) {
      document.body.classList.add('modal-open');
      return () => {
        document.body.classList.remove('modal-open');
      };
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [showProductModal, showCategoryModal]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prods, cats, servs, exchs] = await Promise.all([
        productApi.getProducts({ limit: 100 }).catch(() => []),
        categoryApi.getCategories().catch(() => []),
        serviceApi.listServiceRequests().catch(() => []),
        exchangeApi.listExchangeRequests().catch(() => []),
      ]);
      setProducts(prods);
      setCategories(cats);
      setServiceRequests(servs);
      setExchangeRequests(exchs);
      if (cats.length > 0 && cats[0].subcategories.length > 0) {
        setProductForm((prev) => ({ ...prev, subcategory_id: cats[0].subcategories[0].id }));
        setSelectedParentCatId(cats[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    navigate('/admin/login');
  };

  // Product Actions
  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setEditingProductImage(null);
    setSelectedImageFile(null);
    setProductForm({
      title: '',
      slug: '',
      subcategory_id: categories[0]?.subcategories[0]?.id || 1,
      description: '',
      price: 0,
      dimensions: '',
      material: '',
      in_stock: true,
      is_featured: false,
    });
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    const primaryImg = prod.images?.find((img) => img.is_primary) || prod.images?.[0];
    setEditingProductImage(primaryImg?.image_path || null);
    setSelectedImageFile(null);
    setProductForm({
      title: prod.title,
      slug: prod.slug,
      subcategory_id: prod.subcategory_id,
      description: prod.description || '',
      price: prod.price || 0,
      dimensions: prod.dimensions || '',
      material: prod.material || '',
      in_stock: prod.in_stock,
      is_featured: prod.is_featured,
    });
    setShowProductModal(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setFeedbackMessage(null);

    try {
      const slug =
        productForm.slug.trim() ||
        productForm.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');

      if (editingProductId) {
        // Update product
        const updated = await productApi.updateProduct(editingProductId, {
          ...productForm,
          slug,
          price: Number(productForm.price) || 0,
        });

        // If new image selected, upload it
        if (selectedImageFile) {
          await productApi.uploadProductImage(editingProductId, selectedImageFile, true);
        }

        setFeedbackMessage(`Product "${updated.title}" successfully updated.`);
      } else {
        // Create product
        const created = await productApi.createProduct({
          ...productForm,
          slug,
          price: Number(productForm.price) || 0,
        });

        if (selectedImageFile) {
          await productApi.uploadProductImage(created.id, selectedImageFile, true);
        }

        setFeedbackMessage(`Product "${created.title}" successfully added.`);
      }

      setShowProductModal(false);
      setEditingProductId(null);
      setEditingProductImage(null);
      setSelectedImageFile(null);
      loadAllData();
    } catch (err: any) {
      console.error('Failed to save product', err);
      alert('Error saving product: ' + (err.response?.data?.detail || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await productApi.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      setFeedbackMessage(`Deleted "${title}".`);
    } catch (err: any) {
      alert('Delete failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Service Request Actions
  const handleUpdateServiceStatus = async (id: number, status: string) => {
    try {
      const updated = await serviceApi.updateServiceRequestStatus(id, status);
      setServiceRequests(serviceRequests.map((s) => (s.id === id ? updated : s)));
      setFeedbackMessage(`Service ticket #${id} status updated to ${status}.`);
    } catch (err: any) {
      alert('Status update failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Exchange Request Actions
  const handleUpdateExchangeStatus = async (id: number, status: string, estimatedValue?: number) => {
    try {
      const updated = await exchangeApi.updateExchangeRequestStatus(id, {
        status,
        estimated_value: estimatedValue !== undefined ? estimatedValue : undefined,
      });
      setExchangeRequests(exchangeRequests.map((e) => (e.id === id ? updated : e)));
      setFeedbackMessage(`Exchange ticket #${id} updated.`);
    } catch (err: any) {
      alert('Exchange update failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Category Actions
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/\s+/g, '-');
      await categoryApi.createCategory({ name: newCatName, slug });
      setNewCatName('');
      setNewCatSlug('');
      setShowCategoryModal(false);
      loadAllData();
    } catch (err: any) {
      alert('Category creation failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    try {
      const slug = newSubSlug.trim() || newSubName.toLowerCase().replace(/\s+/g, '-');
      await categoryApi.createSubCategory({
        name: newSubName,
        slug,
        category_id: selectedParentCatId,
      });
      setNewSubName('');
      setNewSubSlug('');
      loadAllData();
      alert('Subcategory added successfully!');
    } catch (err: any) {
      alert('Subcategory creation failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Flattened all subcategories for product dropdown
  const allSubcategories = categories.flatMap((c) =>
    c.subcategories.map((sub) => ({ ...sub, categoryName: c.name }))
  );

  return (
    <div className="admin-page container animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Top Bar */}
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
        <div>
          <span className="badge badge-amber" style={{ marginBottom: '0.4rem' }}>
            Staff Administration
          </span>
          <h1 style={{ fontSize: '2rem' }}>Store Management Portal</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Logged in as <strong>{currentUser?.email}</strong> (Administrator)
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-outline btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {feedbackMessage && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            background: 'var(--success-bg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#34d399',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{feedbackMessage}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('products')}
          className={`btn btn-sm ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Package size={16} /> Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`btn btn-sm ${activeTab === 'services' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Wrench size={16} /> Repair Tickets ({serviceRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('exchanges')}
          className={`btn btn-sm ${activeTab === 'exchanges' ? 'btn-primary' : 'btn-outline'}`}
        >
          <RotateCcw size={16} /> Exchange Quotes ({exchangeRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`btn btn-sm ${activeTab === 'categories' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Layers size={16} /> Categories & Taxonomies
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`btn btn-sm ${activeTab === 'theme' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Palette size={16} /> Theme & Colors
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          Loading dashboard data...
        </div>
      ) : (
        <>
          {/* TAB 1: PRODUCTS INVENTORY */}
          {activeTab === 'products' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <h3>Catalog Products ({products.length})</h3>
                <button
                  onClick={handleOpenCreateModal}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {products.map((p) => {
                  const primaryImg = p.images?.find((img) => img.is_primary) || p.images?.[0];
                  return (
                    <div key={p.id} className="glass-card" style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                          <ImagePlaceholder
                            src={primaryImg?.image_path}
                            alt={p.title}
                            category={p.subcategory?.name}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.title}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                            {p.subcategory?.name || 'General'}
                          </span>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '0.2rem' }}>
                            {p.price ? `₹${p.price.toLocaleString('en-IN')}` : 'No price set'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', gap: '0.5rem' }}>
                        <span className={`badge ${p.in_stock ? 'badge-emerald' : 'badge-rose'}`}>
                          {p.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--primary)', borderColor: 'var(--border-highlight)', padding: '0.3rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            title={`Edit ${p.title}`}
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.3rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            title={`Delete ${p.title}`}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SERVICE REQUESTS */}
          {activeTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3>Repair Tickets ({serviceRequests.length})</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={16} color="var(--text-muted)" />
                  <select
                    value={serviceStatusFilter}
                    onChange={(e) => setServiceStatusFilter(e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {serviceRequests
                  .filter((s) => !serviceStatusFilter || s.status === serviceStatusFilter)
                  .map((s) => (
                    <div key={s.id} className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                            <strong style={{ fontSize: '1.1rem' }}>{s.customer_name}</strong>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({s.phone_number})</span>
                            <span className="badge badge-purple">{s.service_type}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Address: {s.address}
                          </p>
                        </div>
                        <span
                          className={`badge ${
                            s.status === 'completed'
                              ? 'badge-emerald'
                              : s.status === 'in_progress'
                              ? 'badge-blue'
                              : s.status === 'cancelled'
                              ? 'badge-rose'
                              : 'badge-amber'
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>

                      <div style={{ padding: '0.75rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <strong>Issue:</strong> {s.issue_description}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Logged: {new Date(s.created_at).toLocaleString()}
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {s.status !== 'in_progress' && s.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateServiceStatus(s.id, 'in_progress')}
                              className="btn btn-outline btn-sm"
                            >
                              Mark In Progress
                            </button>
                          )}
                          {s.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateServiceStatus(s.id, 'completed')}
                              className="btn btn-primary btn-sm"
                            >
                              Mark Completed
                            </button>
                          )}
                          {s.status !== 'cancelled' && (
                            <button
                              onClick={() => handleUpdateServiceStatus(s.id, 'cancelled')}
                              className="btn btn-outline btn-sm"
                              style={{ color: 'var(--danger)' }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: EXCHANGE REQUESTS */}
          {activeTab === 'exchanges' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3>Exchange Quotes ({exchangeRequests.length})</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={16} color="var(--text-muted)" />
                  <select
                    value={exchangeStatusFilter}
                    onChange={(e) => setExchangeStatusFilter(e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <option value="">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {exchangeRequests
                  .filter((e) => !exchangeStatusFilter || e.status === exchangeStatusFilter)
                  .map((e) => (
                    <div key={e.id} className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem' }}>{e.customer_name}</strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({e.phone_number})</span>
                          <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                            Item: {e.quantity}x {e.item_type}
                          </div>
                        </div>
                        <span className="badge badge-emerald">{e.status}</span>
                      </div>

                      <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <strong>Condition:</strong> {e.condition_details}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assigned Valuation:</span>
                          <input
                            type="number"
                            defaultValue={e.estimated_value || 0}
                            onBlur={(ev) => {
                              const val = parseFloat(ev.target.value);
                              if (!isNaN(val) && val !== e.estimated_value) {
                                handleUpdateExchangeStatus(e.id, e.status, val);
                              }
                            }}
                            className="form-input"
                            style={{ width: '110px', padding: '0.3rem 0.6rem', fontSize: '0.9rem' }}
                            placeholder="₹ Value"
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {e.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateExchangeStatus(e.id, 'approved', e.estimated_value || undefined)}
                              className="btn btn-outline btn-sm"
                            >
                              Approve
                            </button>
                          )}
                          {e.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateExchangeStatus(e.id, 'completed', e.estimated_value || undefined)}
                              className="btn btn-primary btn-sm"
                            >
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES & TAXONOMY */}
          {activeTab === 'categories' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Category Taxonomy ({categories.length})</h3>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={16} /> New Category
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {categories.map((cat) => (
                  <div key={cat.id} className="glass-card">
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{cat.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>
                      Slug: /{cat.slug}
                    </span>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Subcategories ({cat.subcategories.length}):
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                        {cat.subcategories.map((sub) => (
                          <span key={sub.id} className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Subcategory Inline Form */}
              <div className="glass-card" style={{ maxWidth: '600px' }}>
                <h4 style={{ marginBottom: '1rem' }}>Add Subcategory to Existing Category</h4>
                <form onSubmit={handleCreateSubcategory}>
                  <div className="form-group">
                    <label className="form-label">Parent Category</label>
                    <select
                      className="form-select"
                      value={selectedParentCatId}
                      onChange={(e) => setSelectedParentCatId(Number(e.target.value))}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subcategory Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Office Ergonomic Chairs"
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-secondary btn-sm">
                    Add Subcategory
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: THEME & COLOR STUDIO */}
          {activeTab === 'theme' && <ThemeCustomizerTab />}
        </>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {showProductModal &&
        createPortal(
          <div
            className="modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget && e.clientX < e.currentTarget.clientWidth) {
                setShowProductModal(false);
              }
            }}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem' }}>{editingProductId ? 'Edit Product Details' : 'Add New Product'}</h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitProduct}>
                <div className="form-group">
                  <label className="form-label">Product Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 7-Lever Heavy Steel Wardrobe"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subcategory *</label>
                  <select
                    className="form-select"
                    value={productForm.subcategory_id}
                    onChange={(e) => setProductForm({ ...productForm, subcategory_id: Number(e.target.value) })}
                  >
                    {allSubcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.categoryName} → {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 14500"
                      value={productForm.price || ''}
                      onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Material</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 18-Gauge CRC Steel"
                      value={productForm.material || ''}
                      onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Dimensions</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 78 x 36 x 20 inches"
                    value={productForm.dimensions || ''}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    placeholder="Key features, internal locker drawers, finish..."
                    value={productForm.description || ''}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  />
                </div>

                {/* Image Upload Input */}
                <div className="form-group">
                  <label className="form-label">Product Image</label>
                  {editingProductImage && !selectedImageFile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem', padding: '0.5rem 0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                        <ImagePlaceholder src={editingProductImage} alt="Current" category="Item" objectFit="contain" />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--text-primary)', display: 'block' }}>Current Primary Image</strong>
                        <span>Select a new file below if you wish to replace it.</span>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImageFile(e.target.files?.[0] || null)}
                    className="form-input"
                    style={{ padding: '0.4rem' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {editingProductId ? 'Optional: Upload new photo to replace current image.' : 'If no image is uploaded, a category placeholder will be generated automatically.'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productForm.in_stock}
                      onChange={(e) => setProductForm({ ...productForm, in_stock: e.target.checked })}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span>In Stock</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productForm.is_featured}
                      onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <span>Featured on Homepage</span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="btn btn-primary"
                  >
                    {actionLoading ? 'Saving...' : editingProductId ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* CREATE CATEGORY MODAL */}
      {showCategoryModal &&
        createPortal(
          <div
            className="modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget && e.clientX < e.currentTarget.clientWidth) {
                setShowCategoryModal(false);
              }
            }}
          >
            <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ marginBottom: '1rem' }}>Create Category</h3>
              <form onSubmit={handleCreateCategory}>
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Office Automation"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category Slug (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. office-automation"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="btn btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

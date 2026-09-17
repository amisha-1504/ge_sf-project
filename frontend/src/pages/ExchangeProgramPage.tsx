import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { exchangeApi } from '../api/exchanges';
import type { ExchangeRequest, ExchangeRequestCreateInput } from '../types';

export const ExchangeProgramPage: React.FC = () => {
  const [formData, setFormData] = useState<ExchangeRequestCreateInput>({
    customer_name: '',
    phone_number: '',
    item_type: 'Plastic Chairs',
    quantity: 2,
    condition_details: '',
    image_path: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedExchange, setSubmittedExchange] = useState<ExchangeRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const itemTypes = [
    'Plastic Chairs',
    'Steel Trunk / Box',
    'Old Desert Cooler',
    'Metal Bed / Frame',
    'Wooden Chair / Stool',
    'Other Furniture / Scrap',
  ];

  // Dynamic estimated value calculation rule of thumb
  const calculateGuidelineEstimate = () => {
    const qty = Math.max(1, formData.quantity || 1);
    switch (formData.item_type) {
      case 'Plastic Chairs':
        return `₹${qty * 80} – ₹${qty * 160}`;
      case 'Steel Trunk / Box':
        return `₹${qty * 250} – ₹${qty * 600}`;
      case 'Old Desert Cooler':
        return `₹${qty * 300} – ₹${qty * 850}`;
      case 'Metal Bed / Frame':
        return `₹${qty * 500} – ₹${qty * 1200}`;
      default:
        return 'Subject to showroom inspection';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.customer_name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phone_number.trim() || formData.phone_number.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.condition_details.trim()) {
      setErrorMessage('Please describe the condition (e.g. cracked leg, color faded, rusted corners).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await exchangeApi.submitExchangeRequest(formData);
      setSubmittedExchange(res);
    } catch (err: any) {
      console.error('Exchange request failed', err);
      const msg = err.response?.data?.detail || 'Failed to submit exchange request. Please check backend connection.';
      setErrorMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="exchange-page container animate-fade-in" style={{ padding: '3.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ maxWidth: '760px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.9rem',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: '#34d399',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          <RotateCcw size={16} /> Eco-Friendly Value Program
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>
          Old Furniture & Plastic Chairs Exchange
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
          Turn your cracked plastic chairs and broken metal trunks into direct cash discounts toward brand new premium furniture and home appliances.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          maxWidth: '1080px',
          margin: '0 auto',
        }}
      >
        {/* Left Column: Form or Result */}
        <div>
          {submittedExchange ? (
            <div
              className="glass-card card-highlight-success"
              style={{
                padding: '2.5rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(52, 211, 153, 0.2)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
                Exchange Evaluation Submitted!
              </h2>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Thank you, <strong>{submittedExchange.customer_name}</strong>. Your exchange ticket is registered under reference ID:
              </p>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '2rem',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Ticket ID:</span>{' '}
                  <strong style={{ color: '#34d399' }}>#GESF-EX-{submittedExchange.id}</strong>
                </div>
                <div style={{ marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Item & Quantity:</span>{' '}
                  <span>
                    {submittedExchange.quantity}x {submittedExchange.item_type}
                  </span>
                </div>
                <div style={{ marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Current Status:</span>{' '}
                  <span className="badge badge-emerald">{submittedExchange.status}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Initial Guide Value:</span>{' '}
                  <strong style={{ color: 'var(--primary)' }}>{calculateGuidelineEstimate()}</strong>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                You can bring your items directly to our showroom or our representative will inspect them during delivery.
              </p>

              <button
                onClick={() => {
                  setSubmittedExchange(null);
                  setFormData({
                    customer_name: '',
                    phone_number: '',
                    item_type: 'Plastic Chairs',
                    quantity: 2,
                    condition_details: '',
                    image_path: '',
                  });
                }}
                className="btn btn-outline"
              >
                Submit Another Item
              </button>
            </div>
          ) : (
            <div className="glass-card">
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                Get Exchange Credit
              </h3>

              {errorMessage && (
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'var(--danger-bg)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: '#f87171',
                    fontSize: '0.9rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="customer_name">Your Name *</label>
                  <input
                    id="customer_name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Suman Verma"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone_number">Contact Number *</label>
                  <input
                    id="phone_number"
                    type="tel"
                    className="form-input"
                    placeholder="10-digit mobile number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="item_type">Item for Exchange *</label>
                    <select
                      id="item_type"
                      className="form-select"
                      value={formData.item_type}
                      onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}
                    >
                      {itemTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="quantity">Quantity *</label>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      max={100}
                      className="form-input"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="condition_details">Condition Details *</label>
                  <textarea
                    id="condition_details"
                    rows={3}
                    className="form-textarea"
                    placeholder="e.g., 2 chairs have cracked backrests, 1 has broken leg; trunk has minor surface rust but handles intact."
                    value={formData.condition_details}
                    onChange={(e) => setFormData({ ...formData, condition_details: e.target.value })}
                    required
                  />
                </div>

                {/* Estimate Preview */}
                <div
                  style={{
                    padding: '1rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px dashed var(--border-highlight)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={18} color="var(--primary)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Estimated Credit Value:
                    </span>
                  </div>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>
                    {calculateGuidelineEstimate()}
                  </strong>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  {submitting ? 'Submitting Evaluation...' : 'Submit for Valuation'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: How Exchange Works */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              How the Exchange Program Works
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--primary-gradient)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <div>
                  <h5 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Fill Evaluation Form</h5>
                  <p style={{ fontSize: '0.85rem' }}>
                    Tell us what items you have and their condition to generate an initial price bracket.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--steel-gradient)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <div>
                  <h5 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Bring In or Pickup</h5>
                  <p style={{ fontSize: '0.85rem' }}>
                    Bring items to our showroom, or our team will inspect them when delivering your new order.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  3
                </div>
                <div>
                  <h5 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Instant Bill Deduction</h5>
                  <p style={{ fontSize: '0.85rem' }}>
                    Final evaluated credit is deducted on spot from your purchase of any furniture or appliances!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="glass-card"
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--success)' }}>
              <Sparkles size={18} />
              <strong style={{ fontSize: '0.95rem' }}>Eco Responsible Recycling</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              100% of collected plastics and scrap metals are sent to authorized industrial recyclers, keeping non-biodegradable waste out of municipal landfills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

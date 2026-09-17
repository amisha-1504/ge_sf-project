import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  PhoneCall,
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { serviceApi } from '../api/services';
import type { ServiceRequest, ServiceRequestCreateInput } from '../types';

export const ServiceRequestPage: React.FC = () => {
  const [formData, setFormData] = useState<ServiceRequestCreateInput>({
    customer_name: '',
    phone_number: '',
    address: '',
    service_type: 'Almirah Lock & Handle Repair',
    issue_description: '',
    attached_image: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const serviceOptions = [
    'Almirah Lock & Handle Repair',
    'Sofa Repair & Upholstery',
    'Cooler Servicing & Motor Check',
    'Trunk & Metal Welding',
    'Bed & Wooden Furniture Fixing',
    'General Electrical Appliance Repair',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!formData.customer_name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phone_number.trim() || formData.phone_number.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please provide your complete address.');
      return;
    }
    if (!formData.issue_description.trim()) {
      setErrorMessage('Please briefly describe the problem.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await serviceApi.submitServiceRequest(formData);
      setSubmittedRequest(result);
    } catch (err: any) {
      console.error('Failed to submit service request', err);
      const msg = err.response?.data?.detail || 'Failed to submit service request. Please check your connection.';
      setErrorMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="service-page container animate-fade-in" style={{ padding: '3.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ maxWidth: '750px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.9rem',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            color: '#c084fc',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          <Wrench size={16} /> Doorstep Repair & Maintenance
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>
          Furniture & Appliance Repair Service
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
          Almirah lock jammed? Cooler motor stopped? Sofa fabric torn? Schedule an experienced technician to visit your doorstep with genuine replacement parts.
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
        {/* Form or Confirmation */}
        <div>
          {submittedRequest ? (
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
                  background: 'rgba(16, 185, 129, 0.2)',
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
                Service Request Booked!
              </h2>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Thank you, <strong>{submittedRequest.customer_name}</strong>. Our service coordinator will call you shortly at <strong>{submittedRequest.phone_number}</strong> to confirm technician visit timing.
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
                  <span style={{ color: 'var(--text-muted)' }}>Ticket Reference:</span>{' '}
                  <strong style={{ color: 'var(--primary)' }}>#GESF-SR-{submittedRequest.id}</strong>
                </div>
                <div style={{ marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Service Category:</span>{' '}
                  <span>{submittedRequest.service_type}</span>
                </div>
                <div style={{ marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>{' '}
                  <span className="badge badge-amber">{submittedRequest.status}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Service Address:</span>{' '}
                  <span>{submittedRequest.address}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSubmittedRequest(null);
                  setFormData({
                    customer_name: '',
                    phone_number: '',
                    address: '',
                    service_type: 'Almirah Lock & Handle Repair',
                    issue_description: '',
                    attached_image: '',
                  });
                }}
                className="btn btn-outline"
              >
                Book Another Service
              </button>
            </div>
          ) : (
            <div className="glass-card">
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                Book Service Appointment
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
                  <label className="form-label" htmlFor="customer_name">Full Name *</label>
                  <input
                    id="customer_name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ramesh Sharma"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone_number">Contact Phone Number *</label>
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

                <div className="form-group">
                  <label className="form-label" htmlFor="service_type">Select Service Type *</label>
                  <select
                    id="service_type"
                    className="form-select"
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="address">Service Address / Landmark *</label>
                  <textarea
                    id="address"
                    rows={2}
                    className="form-textarea"
                    placeholder="House / Shop No., Colony, Landmark, City"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="issue_description">Describe the Issue *</label>
                  <textarea
                    id="issue_description"
                    rows={3}
                    className="form-textarea"
                    placeholder="e.g., Almirah safe lock key is not turning; Cooler pump water flow is very low."
                    value={formData.issue_description}
                    onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
                >
                  {submitting ? 'Submitting Ticket...' : 'Confirm Service Booking'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Benefits / FAQ / Emergency */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h4 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Why Choose Anand Repairs?
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Clock size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Same-Day Response:</strong> Quick dispatch for urgent lock repairs and cooler faults.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <ShieldCheck size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Original Hardware:</strong> Heavy brass lever keys, Godrej/equivalent lock sets & genuine copper motors.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Sparkles size={20} color="var(--accent-steel)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Transparent Estimates:</strong> Honest pricing with prior estimates before work begins.
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card card-highlight-urgent">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <div className="icon-badge-amber">
                <AlertCircle size={18} />
              </div>
              <h4 style={{ fontSize: '1.15rem', margin: 0 }}>
                Urgent Lockout Emergency?
              </h4>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              If your bank locker or master almirah is locked with critical documents, call our master locksmith directly:
            </p>
            <a
              href="tel:+919876543210"
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              <PhoneCall size={18} /> Call Locksmith (+91 98765 43210)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

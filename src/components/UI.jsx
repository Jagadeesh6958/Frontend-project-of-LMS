import React from 'react';
import { Loader2, AlertTriangle, Star } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";

export const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false, loading = false }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};

export const Input = ({ label, type = 'text', value, onChange, placeholder, required, error, multiline, min, max }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label} {required && '*'}</label>
    {multiline ? (
       <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 ${error ? 'border-red-500' : 'border-gray-300'}`} />
    ) : (
      <input type={type} min={min} max={max} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 ${error ? 'border-red-500' : 'border-gray-300'}`} />
    )}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// UPDATED: Changed border-gray-100 to border-gray-200 for better visibility
export const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>{children}</div>
);

export const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>{children}</span>;
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm p-6">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle size={24} />
          <h2 className="text-xl font-bold dark:text-white">{title}</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>Delete</Button>
        </div>
      </Card>
    </div>
  );
};

export const SimpleBarChart = ({ data, total }) => {
  if (total === 0) return <div className="text-gray-500 text-sm italic">No ratings yet.</div>;

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map(star => {
        const count = data[star] || 0;
        const percent = (count / total) * 100;
        return (
          <div key={star} className="flex items-center gap-3 text-sm">
            <div className="flex items-center w-8 gap-1">
              <span className="font-bold dark:text-gray-300">{star}</span>
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
            </div>
            <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${percent}%` }}></div>
            </div>
            <div className="w-8 text-right text-gray-500">{count}</div>
          </div>
        );
      })}
    </div>
  );
};

// NEW: Google ReCAPTCHA Component
export const Captcha = ({ onVerify }) => {
  const onChange = (token) => {
    // If token exists, user passed the check
    onVerify(!!token); 
  };

  return (
    <div className="mb-4 flex justify-center">
      <ReCAPTCHA
        sitekey="6LcXYBwsAAAAANP42YNBzfqzdMKc7kPaj8vNJwIX"
        onChange={onChange}
      />
    </div>
  );
};
import { useState } from 'react';
import { X, User, Mail, Phone, DollarSign, Home } from 'lucide-react';

export interface LeadCaptureData {
  name: string;
  email: string;
  phone?: string;
  budget: string;
  propertyPreferences: string;
}

interface LeadCaptureFormProps {
  isOpen: boolean;
  onSubmit: (data: LeadCaptureData) => void;
  onSkip: () => void;
  userMessage: string;
}

const LeadCaptureForm = ({ isOpen, onSubmit, onSkip, userMessage }: LeadCaptureFormProps) => {
  const [formData, setFormData] = useState<LeadCaptureData>({
    name: '',
    email: '',
    phone: '',
    budget: '',
    propertyPreferences: ''
  });

  const [errors, setErrors] = useState<Partial<LeadCaptureData>>({});

  const validateForm = () => {
    const newErrors: Partial<LeadCaptureData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget range is required';
    }

    if (!formData.propertyPreferences.trim()) {
      newErrors.propertyPreferences = 'Property preferences are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof LeadCaptureData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-luximo-600 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Skip form"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-2">Let's Find Your Perfect Property!</h2>
          <p className="text-sm text-luximo-100">
            Help us provide you with personalized property recommendations by sharing a few details.
          </p>
        </div>

        {/* User's Message Preview */}
        <div className="p-4 bg-gray-50 border-b">
          <p className="text-sm text-gray-600 mb-2">Your inquiry:</p>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-800 italic">"{userMessage}"</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone Field (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} className="inline mr-2" />
              Phone Number <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 transition-colors"
              placeholder="+359 xxx xxx xxx"
            />
          </div>

          {/* Budget Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign size={16} className="inline mr-2" />
              Budget Range *
            </label>
            <select
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 transition-colors ${
                errors.budget ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select your budget range</option>
              <option value="under-50k">Under €50,000</option>
              <option value="50k-100k">€50,000 - €100,000</option>
              <option value="100k-150k">€100,000 - €150,000</option>
              <option value="150k-200k">€150,000 - €200,000</option>
              <option value="200k-300k">€200,000 - €300,000</option>
              <option value="300k-500k">€300,000 - €500,000</option>
              <option value="500k-plus">€500,000+</option>
              <option value="flexible">Flexible / Need advice</option>
            </select>
            {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
          </div>

          {/* Property Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home size={16} className="inline mr-2" />
              Property Preferences *
            </label>
            <textarea
              value={formData.propertyPreferences}
              onChange={(e) => handleInputChange('propertyPreferences', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 transition-colors resize-none ${
                errors.propertyPreferences ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 2-bedroom apartment, city center, near public transport, parking space..."
            />
            {errors.propertyPreferences && <p className="text-red-500 text-xs mt-1">{errors.propertyPreferences}</p>}
          </div>

          {/* Privacy Notice */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Privacy Notice:</span> Your information will be used to provide personalized property recommendations and may be shared with our partner agents. We respect your privacy and won't spam you.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onSkip}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-luximo-600 text-white rounded-lg hover:bg-luximo-700 transition-colors font-medium"
            >
              Continue to Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadCaptureForm;

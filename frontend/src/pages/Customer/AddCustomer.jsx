import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCustomer } from '../../services/api';
import { motion } from 'framer-motion';
import { validateNIC, validatePhone, formatPhoneNumber, unformatPhoneNumber } from '../../utils/validation';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('personal');
  const [formProgress, setFormProgress] = useState(0);
  const [customer, setCustomer] = useState({
    name: '',
    nic: '',
    email: '',
    phoneNumber: '',
    address: { houseNo: '', street: '', city: '' },
  });
  const [nicError, setNicError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nic') {
      setNicError(validateNIC(value));
    }
    if (name === 'phoneNumber') {
      const cleanValue = value.replace(/\D/g, '').slice(0, 10);
      setPhoneError(validatePhone(cleanValue));
      setCustomer(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setCustomer({
        ...customer,
        address: { ...customer.address, [addressField]: value },
      });
    } else {
      setCustomer({ ...customer, [name]: value });
    }
  };

  const handleFocus = (section) => {
    setActiveSection(section);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const nicValidationError = validateNIC(customer.nic);
      if (nicValidationError) {
        setNicError(nicValidationError);
        setLoading(false);
        return;
      }
      await addCustomer(customer);
      setLoading(false);
      navigate('/customer');
    } catch (error) {
      console.error('Error adding customer:', error);
      setError('Failed to add customer. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header with Progress */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="bg-blue-600 text-white p-1 rounded mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
              Add New Customer
            </h1>
            <p className="text-gray-600 mt-1">Create a new customer account with this form</p>
          </div>

          {/* Progress Indicator */}
          <div className="w-full md:w-48">
            <div className="flex justify-between mb-1 text-xs text-gray-600">
              <span>Form Progress</span>
              <span>{formProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div 
                className="bg-blue-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${formProgress}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="hidden md:flex justify-center mb-8">
        <div className="flex bg-white rounded-lg shadow-sm p-1 space-x-1">
          <button 
            onClick={() => setActiveSection('personal')}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all duration-200 ${
              activeSection === 'personal' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Personal Info</span>
          </button>
          
          <button 
            onClick={() => setActiveSection('address')}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all duration-200 ${
              activeSection === 'address' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Address</span>
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 h-2"></div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-4 border-l-4 border-red-500 flex items-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Personal Information */}
          <section id="personal" className={`mb-8 transition-all duration-300 ${activeSection === 'personal' ? 'opacity-100' : 'opacity-60'}`}>
            <div 
              className="flex items-center mb-6 pb-4 border-b cursor-pointer"
              onClick={() => setActiveSection('personal')}
            >
              <div className={`mr-3 rounded-full p-2 transition-all duration-300 ${activeSection === 'personal' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={customer.name} 
                  onChange={handleChange} 
                  onFocus={() => handleFocus('personal')}
                  placeholder="Enter full name" 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  required 
                />
                {customer.name && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-8 right-3 text-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
              
              <div className="space-y-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  NIC <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="nic" 
                  value={customer.nic} 
                  onChange={handleChange}
                  placeholder="123456789V or 123456789012"
                  className={`w-full px-3 py-2 border ${nicError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {nicError && (
                  <p className="mt-1 text-sm text-red-600">{nicError}</p>
                )}
              </div>
              
              <div className="space-y-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-blue-500 text-xs font-normal">(recommended)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    name="email" 
                    value={customer.email} 
                    onChange={handleChange}
                    onFocus={() => handleFocus('personal')}
                    placeholder="Email address" 
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  />
                </div>
                {customer.email && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-8 right-3 text-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  type="tel" 
                  name="phoneNumber" 
                  value={formatPhoneNumber(customer.phoneNumber || '')}
                  onChange={handleChange}
                  placeholder="071 234 5678"
                  className={`w-full px-3 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
              </div>
            </div>
          </section>
              
          {/* Address Information */}
          <section id="address" className={`mb-8 transition-all duration-300 ${activeSection === 'address' ? 'opacity-100' : 'opacity-60'}`}>
            <div 
              className="flex items-center mb-6 pb-4 border-b cursor-pointer"
              onClick={() => setActiveSection('address')}
            >
              <div className={`mr-3 rounded-full p-2 transition-all duration-300 ${activeSection === 'address' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Address Information</h2>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-700 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Address information helps with customer management and delivery operations. City is especially useful for analytics and targeting.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">House No</label>
                <input 
                  type="text" 
                  name="address.houseNo" 
                  value={customer.address.houseNo} 
                  onChange={handleChange}
                  onFocus={() => handleFocus('address')}
                  placeholder="House/Apt Number" 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Street</label>
                <input 
                  type="text" 
                  name="address.street" 
                  value={customer.address.street} 
                  onChange={handleChange}
                  onFocus={() => handleFocus('address')}
                  placeholder="Street address" 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                />
              </div>
              
              <div className="space-y-2 md:col-span-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  City <span className="text-blue-500 text-xs font-normal">(recommended)</span>
                </label>
                <input 
                  type="text" 
                  name="address.city" 
                  value={customer.address.city} 
                  onChange={handleChange}
                  onFocus={() => handleFocus('address')}
                  placeholder="City" 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                />
                {customer.address.city && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-8 right-3 text-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </div>
          </section>

          {/* Customer Summary Card */}
          <div className="p-4 bg-gray-50 rounded-lg mb-8">
            <h3 className="font-medium text-gray-800 mb-2">Customer Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Name:</span> <span className="font-medium">{customer.name || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">NIC:</span> <span className="font-medium">{customer.nic || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span> <span className="font-medium">{customer.email || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span> <span className="font-medium">{customer.phoneNumber || '-'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500">Address:</span> <span className="font-medium">
                  {[customer.address.houseNo, customer.address.street, customer.address.city].filter(Boolean).join(', ') || '-'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate('/customer')}
                className="w-full sm:w-auto px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full sm:w-auto flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default AddCustomer;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStaff } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { validateNIC, validatePhone, formatPhoneNumber, unformatPhoneNumber, validatePassword } from '../../utils/validation';

const AddStaff = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeSection, setActiveSection] = useState('personal');
  const [formProgress, setFormProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [staff, setStaff] = useState({
    name: '',
    nic: '',
    role: 'Manager', 
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
    address: { 
      houseNo: '',
      street: '', 
      city: '' 
    }
  });
  const [nicError, setNicError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Calculate form completion percentage
  useEffect(() => {
    const requiredFields = ['name', 'nic', 'role', 'phoneNumber', 'email', 'username', 'password'];
    const completedFields = requiredFields.filter(field => staff[field]?.trim() !== '');
    const percentage = Math.round((completedFields.length / requiredFields.length) * 100);
    setFormProgress(percentage);
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nic') {
      setNicError(validateNIC(value));
    }
    if (name === 'phoneNumber') {
      const cleanValue = value.replace(/\D/g, '').slice(0, 10);
      setPhoneError(validatePhone(cleanValue));
      setStaff(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }
    if (name === 'password') {
      setPasswordError(validatePassword(value));
    }
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setStaff({
        ...staff,
        [parent]: { ...staff[parent], [child]: value }
      });
    } else {
      setStaff({ ...staff, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordValidationError = validatePassword(staff.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      setActiveSection('account');
      return;
    }
    if (staff.password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      setActiveSection('account');
      return;
    }
    
    setLoading(true);
    try {
      await addStaff(staff);
      setLoading(false);
      
      // Show success animation before navigating
      setTimeout(() => navigate('/employee'), 1500);
    } catch (error) {
      setLoading(false);
      console.error('Error adding staff:', error);
    }
  };

  const handleFocus = (sectionId) => {
    setActiveSection(sectionId);
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
              <span className="bg-indigo-600 text-white p-1 rounded mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
              Add New Employee
            </h1>
            <p className="text-gray-600 mt-1">Complete the form below to add a new employee to the system</p>
          </div>

          {/* Progress Indicator */}
          <div className="w-full md:w-48">
            <div className="flex justify-between mb-1 text-xs text-gray-600">
              <span>Progress</span>
              <span>{formProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div 
                className="bg-indigo-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${formProgress}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bubbles */}
      <div className="hidden md:flex justify-center mb-8">
        <div className="flex items-center bg-white shadow-sm rounded-full px-4 py-2 space-x-2">
          <button 
            onClick={() => setActiveSection('personal')}
            className={`relative rounded-full flex items-center justify-center w-10 h-10 ${
              activeSection === 'personal' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            } transition-all duration-300`}
          >
            <span className="text-sm">1</span>
            <AnimatePresence>
              {activeSection === 'personal' && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute whitespace-nowrap -bottom-8 font-medium text-xs bg-indigo-100 text-indigo-800 rounded-md px-2 py-1"
                >
                  Personal Info
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          
          <div className="w-12 h-0.5 bg-gray-200"></div>
          
          <button 
            onClick={() => setActiveSection('account')}
            className={`relative rounded-full flex items-center justify-center w-10 h-10 ${
              activeSection === 'account' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            } transition-all duration-300`}
          >
            <span className="text-sm">2</span>
            <AnimatePresence>
              {activeSection === 'account' && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute whitespace-nowrap -bottom-8 font-medium text-xs bg-indigo-100 text-indigo-800 rounded-md px-2 py-1"
                >
                  Account Details
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          
          <div className="w-12 h-0.5 bg-gray-200"></div>
          
          <button 
            onClick={() => setActiveSection('address')}
            className={`relative rounded-full flex items-center justify-center w-10 h-10 ${
              activeSection === 'address' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            } transition-all duration-300`}
          >
            <span className="text-sm">3</span>
            <AnimatePresence>
              {activeSection === 'address' && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute whitespace-nowrap -bottom-8 font-medium text-xs bg-indigo-100 text-indigo-800 rounded-md px-2 py-1"
                >
                  Address
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2"></div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Personal Information */}
          <section id="personal" className={`mb-8 transition-all duration-300 ${activeSection === 'personal' ? 'opacity-100' : 'opacity-60'}`}>
            <div 
              className="flex items-center mb-6 pb-4 border-b cursor-pointer"
              onClick={() => setActiveSection('personal')}
            >
              <div className={`mr-3 rounded-full p-2 transition-all duration-300 ${activeSection === 'personal' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
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
                  value={staff.name} 
                  onChange={handleChange} 
                  onFocus={() => handleFocus('personal')}
                  placeholder="Enter full name" 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                  required 
                />
                {staff.name && (
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
                  value={staff.nic} 
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
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={staff.email} 
                  onChange={handleChange}
                  onFocus={() => handleFocus('account')}
                  placeholder="Email address" 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                  required 
                />
                {staff.email && (
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
              {/* phone number input*/}
              <div className="space-y-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">+94</span>
                  </div>
                  <input 
                    type="tel" 
                    name="phoneNumber" 
                    value={staff.phoneNumber ? formatPhoneNumber(staff.phoneNumber) : ''} 
                    onChange={handleChange}
                    onFocus={() => handleFocus('account')}
                    placeholder="7X XXX XXXX" 
                    className={`w-full pl-12 pr-3 py-3 border ${phoneError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                    required 
                  />
                </div>
                {phoneError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {phoneError}
                  </motion.p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid Sri Lankan mobile number (10 digits)
                </p>
              </div>
            </div>              

          </section>
              
          {/* Account Information */}
          <section id="account" className={`mb-8 transition-all duration-300 ${activeSection === 'account' ? 'opacity-100' : 'opacity-60'}`}>
            <div 
              className="flex items-center mb-6 pb-4 border-b cursor-pointer"
              onClick={() => setActiveSection('account')}
            >
              <div className={`mr-3 rounded-full p-2 transition-all duration-300 ${activeSection === 'account' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Account Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">@</span>
                  </div>
                  <input 
                    type="text" 
                    name="username" 
                    value={staff.username} 
                    onChange={handleChange}
                    onFocus={() => handleFocus('account')}
                    placeholder="username" 
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                    required 
                  />
                </div>
                {staff.username && (
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
                <label className="block text-sm font-medium text-gray-700">
                  Role <span className="text-red-500">*</span>
                </label>
                <select 
                  name="role" 
                  value={staff.role} 
                  onChange={handleChange}
                  onFocus={() => handleFocus('account')}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-white" 
                  required
                >
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                  <option value="Clerk">Clerk</option>
                  <option value="Delivery">Delivery</option>
                </select>
                {/* Added a helper text for clarity */}
                <p className="text-xs text-gray-500 mt-1">
                  Only these specific role values are accepted by the system.
                </p>
              </div>
              
              
              
              <div className="space-y-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={staff.password} 
                    onChange={handleChange}
                    placeholder="Enter password"
                    className={`w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters with uppercase, lowercase, number and special character.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    onFocus={() => handleFocus('account')}
                    placeholder="Confirm password" 
                    className={`w-full px-3 py-3 border ${passwordError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {passwordError}
                  </motion.p>
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
              <div className={`mr-3 rounded-full p-2 transition-all duration-300 ${activeSection === 'address' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Address Information</h2>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Address information is optional but helps with staff management and physical mail delivery.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">House No</label>
                <input 
                  type="text" 
                  name="address.houseNo" 
                  value={staff.address.houseNo || ''} 
                  onChange={handleChange}
                  onFocus={() => handleFocus('address')}
                  placeholder="House/Apt Number" 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Street</label>
                <input 
                  type="text" 
                  name="address.street" 
                  value={staff.address.street} 
                  onChange={handleChange}
                  onFocus={() => handleFocus('address')}
                  placeholder="Street address" 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input 
                  type="text" 
                  name="address.city" 
                  value={staff.address.city} 
                  onChange={handleChange}
                  onFocus={() => handleFocus('address')}
                  placeholder="City" 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                />
              </div>
            </div>
          </section>

          {/* Form Summary - Just a visual aid */}
          <div className="p-4 bg-gray-50 rounded-lg mb-8">
            <h3 className="font-medium text-gray-800 mb-2">Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Name:</span> <span className="font-medium">{staff.name || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">Role:</span> <span className="font-medium">{staff.role}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span> <span className="font-medium">{staff.email || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span> <span className="font-medium">{staff.phoneNumber || '-'}</span>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-3 sm:mt-0">
            </div>
            
            <button 
              type="submit" 
              className={`w-full sm:w-auto flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddStaff;
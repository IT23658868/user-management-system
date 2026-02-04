import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStaffById, updateStaffRole, updateStaffAddress, updateStaffPhone, updateStaffEmail, updateStaffPassword, updateStaffName, updateStaffNic } from '../../services/api';
import { validateNIC } from '../../utils/validation';
import { validatePhone, formatPhoneNumber, unformatPhoneNumber } from '../../utils/validation';
import { validatePassword } from '../../utils/validation';

const EditStaff = () => {
  const { employeeId } = useParams(); 
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updateStatus, setUpdateStatus] = useState({ success: false, message: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nicError, setNicError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const roleOptions = ["Manager", "Clerk", "Delivery","Admin"];
  
  useEffect(() => {
    if (employeeId) {
      fetchStaff();
    }
  }, [employeeId]); 

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getStaffById(employeeId);
      
      if (!response || !response.data) {
        throw new Error('No staff data received');
      }
      
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load staff information');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    const formattedValue = formatPhoneNumber(value);
    setPhoneError(validatePhone(value));
    setStaff(prevStaff => ({ 
      ...prevStaff, 
      phone: value,
      phoneNumber: value,
      formattedPhone: formattedValue
    }));
  };

  const handleNICChange = (e) => {
    const value = e.target.value;
    setNicError(validateNIC(value));
    setStaff(prevStaff => ({ 
      ...prevStaff, 
      employeeId: value
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailError(validateEmail(value));
    setStaff(prevStaff => ({ 
      ...prevStaff, 
      email: value
    }));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPasswordError(validatePassword(newPassword));
    setStaff({ ...staff, password: newPassword });
  };

  const handleUpdate = async (field, value) => {
    try {
      setLoading(true);
      setUpdateStatus({ success: false, message: '' });
      
      if (field === 'password') {
        const passwordValidationError = validatePassword(value);
        if (passwordValidationError) {
          setPasswordError(passwordValidationError);
          setLoading(false);
          return;
        }
        if (value !== confirmPassword) {
          setPasswordError('Passwords do not match');
          setLoading(false);
          return;
        }
      }

      if (field === 'phone') {
        const unformattedPhone = unformatPhoneNumber(value);
        const phoneValidationError = validatePhone(unformattedPhone);
        if (phoneValidationError) {
          setPhoneError(phoneValidationError);
          setLoading(false);
          return;
        }
        value = unformattedPhone;
      }
      
      if (field === 'email') {
        const emailValidationError = validateEmail(value);
        if (emailValidationError) {
          setEmailError(emailValidationError);
          setLoading(false);
          return;
        }
      }

      if (field === 'employeeId') {
        const nicValidationError = validateNIC(value);
        if (nicValidationError) {
          setNicError(nicValidationError);
          setLoading(false);
          return;
        }
      }

      switch (field) {
        case 'name':
          await updateStaffName(employeeId, value);
          break;
        case 'nic':
          await updateStaffNic(employeeId, value);
          
          navigate(`/edit-employee/${value}`, { replace: true });
          break;
        case 'role':
          await updateStaffRole(employeeId, value);
          break;
        case 'address':
          await updateStaffAddress(employeeId, value);
          break;
        case 'phone':
          await updateStaffPhone(employeeId, value);
          break;
        case 'email':
          await updateStaffEmail(employeeId, value);
          break;
        case 'password':
          await updateStaffPassword(employeeId, value);
          setConfirmPassword('');
          setPasswordError('');
          break;
        default:
          break;
      }
      
      setUpdateStatus({ 
        success: true, 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully` 
      });
      
      if (field !== 'employeeId') {
        fetchStaff();
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      setUpdateStatus({ 
        success: false, 
        message: error.response?.data?.message || `Failed to update ${field}. Please try again.` 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading staff details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => {
            setError('');
            fetchStaff();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">No staff information found</p>
        <button
          onClick={() => navigate('/employee')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Back to Staff List
        </button>
      </div>
    );
  }

  const phoneValue = staff.phoneNumber || staff.phone || '';

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Edit Staff</h1>
            <p className="text-blue-100">Update staff information</p>
          </div>
          
          {updateStatus.message && (
            <div className={`p-4 ${updateStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {updateStatus.message}
            </div>
          )}
          
          <div className="p-6">
            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    type="text"
                    value={staff.name || ''}
                    onChange={(e) => setStaff({ ...staff, name: e.target.value })}
                    className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleUpdate('name', staff.name)}
                    disabled={loading}
                    className="w-full sm:w-1/3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Name'}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIC</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="w-full sm:w-2/3">
                    <input
                      type="text"
                      value={staff.nic || ''}
                      onChange={handleNICChange}
                      placeholder="123456789V or 123456789012"
                      className={`w-full px-3 py-2 border ${nicError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {nicError && (
                      <p className="mt-1 text-sm text-red-600">{nicError}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Enter either old format (9 digits + V) or new format (12 digits)
                    </p>
                  </div>
                  <button
                    onClick={() => handleUpdate('employeeId', staff.employeeId)}
                    disabled={loading || nicError}
                    className="w-full sm:w-1/3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update NIC'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <select
                    value={staff.role || ''}
                    onChange={(e) => setStaff({ ...staff, role: e.target.value })}
                    className="w-full sm:w-2/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {roleOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleUpdate('role', staff.role)}
                    disabled={loading}
                    className="w-full sm:w-1/3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Role'}
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="w-full sm:w-2/3">
                    <input
                      type="tel"
                      value={formatPhoneNumber(phoneValue)}
                      onChange={handlePhoneChange}
                      placeholder="071 234 5678"
                      className={`w-full px-3 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {phoneError && (
                      <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleUpdate('phone', phoneValue)}
                    disabled={loading || phoneError}
                    className="w-full sm:w-1/3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Phone'}
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="w-full sm:w-2/3">
                    <input
                      type="email"
                      value={staff.email || ''}
                      onChange={handleEmailChange}
                      placeholder="example@example.com"
                      className={`w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {emailError && (
                      <p className="mt-1 text-sm text-red-600">{emailError}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleUpdate('email', staff.email)}
                    disabled={loading || emailError}
                    className="w-full sm:w-1/3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Email'}
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 pr-10 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordError('');
                        }}
                        className={`w-full px-3 py-2 pr-10 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleUpdate('password', staff.password)}
                    disabled={loading || !staff.password || !confirmPassword}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">House No</label>
                    <input
                      type="text"
                      value={staff.address?.houseNo || ''}
                      onChange={(e) => setStaff({ 
                        ...staff, 
                        address: { ...staff.address, houseNo: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="House/Apt Number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                    <input
                      type="text"
                      value={staff.address?.street || ''}
                      onChange={(e) => setStaff({ 
                        ...staff, 
                        address: { ...staff.address, street: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Street address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={staff.address?.city || ''}
                      onChange={(e) => setStaff({ 
                        ...staff, 
                        address: { ...staff.address, city: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City"
                    />
                  </div>
                  
                  <button
                    onClick={() => handleUpdate('address', staff.address)}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Address'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => navigate('/employee')}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStaff;
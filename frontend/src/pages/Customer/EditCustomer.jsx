import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getCustomerById, 
  updateCustomerName, 
  updateCustomerNic, 
  updateCustomerEmail, 
  updateCustomerPhone, 
  updateCustomerAddress, 
  updateCustomerFirstDealDate, 
  updateCustomerLastDealDate 
} from '../../services/api';
import { validateNIC, validatePhone, formatPhoneNumber, unformatPhoneNumber } from '../../utils/validation';

const EditCustomer = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [nicError, setNicError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCustomerById(customerId);
      if (!response?.data) {
        throw new Error('Failed to load customer data');
      }
      setCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError(error.message || 'Failed to load customer information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'customerId') {
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

  const handleUpdate = async (field) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
      switch (field) {
        case 'name':
          await updateCustomerName(customerId, customer.name);
          break;
        case 'customerId':
          const nicValidationError = validateNIC(customer.nic);
          if (nicValidationError) {
            setNicError(nicValidationError);
            return;
          }
          await updateCustomerNic(customerId, customer.nic);
          break;
        case 'email':
          await updateCustomerEmail(customerId, customer.email);
          break;
        case 'phone':
          const phoneValidationError = validatePhone(customer.phoneNumber);
          if (phoneValidationError) {
            setPhoneError(phoneValidationError);
            return;
          }
          await updateCustomerPhone(customerId, customer.phoneNumber);
          break;
        case 'address':
          await updateCustomerAddress(customerId, customer.address);
          break;
        case 'firstDealDate':
          await updateCustomerFirstDealDate(customerId, customer.firstDateDeal);
          break;
        case 'lastDealDate':
          await updateCustomerLastDealDate(customerId, customer.lastDateDeal);
          break;
      }
      
      setSuccessMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      setError(`Failed to update ${field}. Please try again.`);
      
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Edit Customer</h1>
            <p className="text-blue-100 mt-1">Update customer information</p>
          </div>
          
          {/* Messages container with fixed height to prevent layout shift */}
          <div className="h-16 px-6 py-2">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md border-l-4 border-red-500 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md border-l-4 border-green-500 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                {successMessage}
              </div>
            )}
          </div>
          
          <form className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4">Personal Information</h2>
              </div>
              
              {/* Name Field */}
              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={customer.name || ''} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500" 
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => handleUpdate('name')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Name
                </button>
              </div>

              {/* NIC Field */}
              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">NIC</label>
                  <input 
                    type="text" 
                    name="nic" 
                    value={customer.nic || ''} 
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${nicError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {nicError && <p className="mt-1 text-sm text-red-600">{nicError}</p>}
                </div>
                <button 
                  type="button"
                  onClick={() => handleUpdate('nic')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update NIC
                </button>
              </div>

              {/* Email Field */}
              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={customer.email || ''} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => handleUpdate('email')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Email
                </button>
              </div>

              {/* Phone Field */}
              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber" 
                    value={formatPhoneNumber(customer.phoneNumber || '')}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
                </div>
                <button 
                  type="button"
                  onClick={() => handleUpdate('phone')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Phone
                </button>
              </div>

              {/* Address Section */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4">Address Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input 
                    type="text" 
                    name="address.houseNo" 
                    value={customer.address?.houseNo || ''} 
                    onChange={handleChange} 
                    placeholder="House No"
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input 
                    type="text" 
                    name="address.street" 
                    value={customer.address?.street || ''} 
                    onChange={handleChange} 
                    placeholder="Street"
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input 
                    type="text" 
                    name="address.city" 
                    value={customer.address?.city || ''} 
                    onChange={handleChange} 
                    placeholder="City"
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button 
                    type="button"
                    onClick={() => handleUpdate('address')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Address
                  </button>
                </div>
              </div>

              {/* Deal Dates */}
              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">First Deal Date</label>
                  <input 
                    type="date" 
                    name="firstDateDeal" 
                    value={customer.firstDateDeal || ''} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => handleUpdate('firstDealDate')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update First Deal
                </button>
              </div>

              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Last Deal Date</label>
                  <input 
                    type="date" 
                    name="lastDateDeal" 
                    value={customer.lastDateDeal || ''} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => handleUpdate('lastDealDate')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Last Deal
                </button>
              </div>
            </div>
            
            <div className="mt-8">
              <button 
                type="button" 
                onClick={() => navigate('/customer')}
                className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Customers
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;
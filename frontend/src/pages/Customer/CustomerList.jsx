import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCustomers, deleteCustomer, searchCustomer } from '../../services/api';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllCustomers();
        
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    try {
      setLoading(true);
      setError(null);
      
      if (term) {
        const response = await searchCustomer(term);
          
        setCustomers(response.data);
      } else {
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error searching customers:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        setError(null);
        await deleteCustomer(customerId);
        setCustomers(prevCustomers => prevCustomers.filter(customer => customer.customerId !== customerId));
      } catch (error) {
        console.error('Error deleting customer:', error);
        setError('Failed to delete customer. Please try again.');
      }
    }
  };

  const handleRestore = async (customerId) => {
    try {
      setError(null);
      
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.customerId === customerId ? { ...customer, deleted: false } : customer
        )
      );
    } catch (error) {
      console.error('Error restoring customer:', error);
      setError('Failed to restore customer. Please try again.');
    }
  };

  const toggleRowExpand = (customerId) => {
    setExpandedRows(prevState => ({
      ...prevState,
      [customerId]: !prevState[customerId]
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Customer Management</h1>
            <p className="text-blue-100 mt-1">Manage Customer accounts</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p>{error}</p>
                </div>
                <button 
                  onClick={fetchCustomers} 
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Try Again
                </button>
              </div>
            )}
          
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="w-full sm:w-2/3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, NIC, or ID..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/add-customer" 
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Customer
                </div>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-md">
                <p className="text-gray-500">No customers found</p>
                {searchTerm && (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      fetchCustomers();
                    }}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Clear search and show all customers
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NIC
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <React.Fragment key={customer.customerId || customer.userId}>
                        <tr className={`hover:bg-gray-50 ${customer.deleted ? 'bg-red-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => toggleRowExpand(customer.customerId)}
                              className="text-blue-600 hover:text-blue-900 focus:outline-none"
                            >
                              {expandedRows[customer.customerId] ? (
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium text-sm">
                                  {customer.name?.charAt(0) || '?'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 flex items-center">
                                  {customer.name}
                                  {customer.deleted && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Unavailable
                                    </span>
                                  )}
                                </div>
                                
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${customer.deleted ? 'text-gray-400' : 'text-gray-900'}`}>
                              {customer.customerId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${customer.deleted ? 'text-gray-400' : 'text-gray-900'}`}>
                              {customer.phoneNumber}
                            </div>
                            <div className={`text-sm ${customer.deleted ? 'text-gray-400' : 'text-gray-500'}`}>
                              {customer.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              {customer.deleted ? (
                                <span className="text-gray-400 italic text-xs">
                                  No actions available
                                </span>
                              ) : (
                                <>
                                  <Link
                                    to={`/edit-customer/${customer.customerId}`}
                                    className="text-yellow-600 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-md"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(customer.customerId)}
                                    className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                        {expandedRows[customer.customerId] && (
                          <tr className={`${customer.deleted ? 'bg-red-50' : 'bg-gray-50'}`}>
                            <td colSpan={6} className="px-6 py-4">
                              <div className={`${customer.deleted ? 'bg-white/90' : 'bg-white'} p-4 rounded-md shadow-sm`}>
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium text-gray-700 mb-3">Customer Details</h3>
                                  {customer.deleted && (
                                    <span className="text-xs font-medium text-red-600">
                                      This customer has been removed
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Customer ID:</span> {customer.customerId || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Full Name:</span> {customer.name || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">NIC:</span> {customer.nic || 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Phone Number:</span> {customer.phoneNumber || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Email:</span> {customer.email || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">First Deal Date:</span> {customer.firstDateDeal || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Last Deal Date:</span> {customer.lastDateDeal || 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">House No:</span> {customer.address?.houseNo || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Street:</span> {customer.address?.street || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">City:</span> {customer.address?.city || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerList;
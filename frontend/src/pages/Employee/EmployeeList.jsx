import React, { useState, useEffect } from 'react';
import { getAllStaff, deleteStaff, searchStaff } from '../../services/api';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 

// Error Alert Component
const ErrorAlert = ({ message, onRetry }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700"
  >
    <div className="flex items-center">
      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <p>{message}</p>
    </div>
    <button 
      onClick={onRetry} 
      className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
    >
      Try Again
    </button>
  </motion.div>
);

// Search Bar Component
const SearchBar = ({ value, onChange }) => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search by name, role, NIC"
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Empty State Component
const EmptyState = ({ searchTerm, onClearSearch }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-10 bg-gray-50 rounded-md"
  >
    <svg 
      className="mx-auto h-12 w-12 text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
      />
    </svg>    <p className="mt-2 text-gray-500">No employees found</p>
    {searchTerm && (
      <button 
        onClick={onClearSearch}
        className="mt-2 text-blue-600 hover:underline"
      >
        Clear search and show all employees
      </button>
    )}
  </motion.div>
);

// Staff Details Panel Component
const StaffDetailsPanel = ({ staff }) => (
  <div className="bg-white p-4 rounded-md shadow-sm">
    <h3 className="text-sm font-medium text-gray-700 mb-3">Staff Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Employee Id:</span> {staff.employeeId || 'N/A'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Full Name:</span> {staff.name || 'N/A'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">NIC:</span> {staff.nic || 'N/A'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Username:</span> {staff.username || 'N/A'}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Role:</span> {staff.role || 'N/A'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Phone Number:</span> {staff.phoneNumber || staff.phone || 'N/A'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Email:</span> {staff.email || 'N/A'}
        </p>
        {staff.joinDate && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Join Date:</span> {staff.joinDate}
          </p>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-600">
          <span className="font-medium">House No:</span> {staff.address?.houseNo || 'N/A'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Street:</span> {staff.address?.street || 'N/A'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">City:</span> {staff.address?.city || 'N/A'}
        </p>
        {staff.status && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Status:</span> 
            <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${staff.status === 'Active' ? 'bg-green-100 text-green-800' : 
                staff.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'}`}>
              {staff.status}
            </span>
          </p>
        )}
        {staff.lastLogin && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Last Active:</span> {new Date(staff.lastLogin).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
    
    {/* New section for additional details */}
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
          View Activity Log
        </button>
        <button className="px-3 py-1 text-xs bg-green-50 text-green-600 rounded-md hover:bg-green-100">
          Send Message
        </button>
        <button className="px-3 py-1 text-xs bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100">
          Reset Password
        </button>
      </div>
    </div>
  </div>
);

// Role Filter Component
const RoleFilter = ({ onFilterByRole, activeFilters, onClearFilter }) => {
  
  const roles = ['Manager', 'Admin', 'Clerk', 'Delivery'];
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Role:</h3>
      <div className="flex flex-wrap gap-2">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => onFilterByRole(role)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeFilters.includes(role)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {role}
            {activeFilters.includes(role) && (
              <span 
                className="ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFilter(role);
                }}
              >
                ×
              </span>
            )}
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button
            onClick={() => onClearFilter('all')}
            className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-full hover:bg-red-100"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

// Staff Table Component
const StaffTable = ({ staffList, expandedRows, onToggleExpand, onDelete }) => (
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
            Role
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
        {staffList.map((staff) => (
          <StaffTableRow
            key={staff.employeeId}
            staff={staff}
            isExpanded={expandedRows[staff.employeeId]}
            onToggleExpand={onToggleExpand}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  </div>
);

const StaffTableRow = ({ staff, isExpanded, onToggleExpand, onDelete }) => (
  <>
    <motion.tr 
      className="hover:bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <button 
          onClick={() => onToggleExpand(staff.employeeId)}
          className="text-blue-600 hover:text-blue-900 focus:outline-none"
        >
          {isExpanded ? (
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
            <span className="text-gray-600 font-medium text-sm">{staff.name?.charAt(0) || '?'}</span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{staff.name}</div>
            <div className="text-sm text-gray-500">NIC: {staff.nic}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${staff.role === 'Manager' ? 'bg-purple-100 text-purple-800' : 
            staff.role === 'Admin' ? 'bg-red-100 text-red-800' : 
            staff.role === 'IT Support' ? 'bg-green-100 text-green-800' : 
            staff.role === 'Clerk' ? 'bg-blue-100 text-blue-800' : 
            'bg-yellow-100 text-yellow-800'}`}>
          {staff.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{staff.phoneNumber || staff.phone}</div>
        <div className="text-sm text-gray-500">{staff.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex space-x-2">
          <Link
            to={`/edit-employee/${staff.employeeId}`}
            className="text-yellow-600 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-md"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(staff.employeeId)}
            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md"
          >
            Delete
          </button>
        </div>
      </td>
    </motion.tr>
    <AnimatePresence>
      {isExpanded && (
        <motion.tr 
          className="bg-gray-50"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <td colSpan={6} className="px-6 py-4">
            <StaffDetailsPanel staff={staff} />
          </td>
        </motion.tr>
      )}
    </AnimatePresence>
  </>
);

// Main Staff List Component
const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  
  useEffect(() => {
    fetchStaff();
  }, []);
  
  useEffect(() => {
    
    applyFilters();
  }, [staffList, activeFilters, searchTerm]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllStaff();
        
      setStaffList(response.data);
      setFilteredStaffList(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Failed to load employees. Please try again.');
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
        const response = await searchStaff(term);
          
        setStaffList(response.data);
      } else {
        fetchStaff();
      }
    } catch (error) {
      console.error('Error searching staff:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setError(null);
        
        await deleteStaff(employeeId);
        setStaffList(prevStaff => prevStaff.filter(staff => staff.employeeId !== employeeId));
        
      } catch (error) {
        console.error('Error deleting employee:', error);
        setError('Failed to delete employee. Please try again.');
      }
    }
  };

  const toggleRowExpand = (employeeId) => {
    setExpandedRows(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };
  
  const filterByRole = (role) => {
    if (!activeFilters.includes(role)) {
      setActiveFilters([...activeFilters, role]);
    }
  };
  
  const filterByStatus = (status) => {
    if (!activeFilters.includes(status)) {
      setActiveFilters([...activeFilters, status]);
    }
  };
  
  const clearFilters = (filter) => {
    if (filter === 'all') {
      setActiveFilters([]);
    } else {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    }
  };
  
  const applyFilters = () => {
    let result = [...staffList];
    
   
    if (searchTerm) {
      result = result.filter(staff => 
        (staff?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (staff?.nic || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (staff?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (staff?.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (staff?.phoneNumber || '').includes(searchTerm)
      );
    }
    
    // Apply role and status filters
    if (activeFilters.length > 0) {
      result = result.filter(staff => 
        activeFilters.includes(staff?.role) || activeFilters.includes(staff?.status)
      );
    }
    
    setFilteredStaffList(result);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    fetchStaff();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white shadow-md rounded-lg overflow-hidden">          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Employee Management</h1>
            <p className="text-blue-100 mt-1">Manage employees</p>
          </div>

          <div className="p-6">
            {error && <ErrorAlert message={error} onRetry={fetchStaff} />}
            
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="w-full sm:w-2/3">
                <SearchBar value={searchTerm} onChange={handleSearch} />
              </div>
              
              <Link 
                to="/add-employee" 
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Employee
                </div>
              </Link>
            </div>

            {/* Add Role Filter component */}
            <RoleFilter 
              onFilterByRole={filterByRole} 
              activeFilters={activeFilters}
              onClearFilter={clearFilters}
            />

            {loading ? (
              <LoadingSpinner />
            ) : filteredStaffList.length === 0 ? (
              <EmptyState searchTerm={searchTerm} onClearSearch={clearSearch} />
            ) : (
              <StaffTable 
                staffList={filteredStaffList}
                expandedRows={expandedRows}
                onToggleExpand={toggleRowExpand}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffList;
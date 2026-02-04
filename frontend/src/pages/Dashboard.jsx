import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAllCustomers, 
  getAllStaff, 
  searchCustomer, 
  searchStaff,
  getAllCustomersCount
} from '../services/api'; 
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Import mock data (for development/testing)
import { mockApiResponses } from '../mockData/dashboardMockData';

// Set this to true to use mock data instead of API calls
const USE_MOCK_DATA = false;

// Time period selector component
const PeriodSelector = ({ selectedPeriod, onChange }) => {
  const periods = ['Today', 'Week', 'Month', 'Year', 'All Time'];
  
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {periods.map(period => (
        <button
          key={period}
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            selectedPeriod === period
              ? 'bg-white shadow-sm text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onChange(period)}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

// Generate mock time series data for charts
const generateTimeSeriesData = (days, baseline, trend, volatility) => {
  const data = [];
  let value = baseline;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add trend and some random noise
    value = value + trend + (Math.random() * volatility * 2 - volatility);
    
    // Ensure value doesn't go below zero
    value = Math.max(0, value);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value)
    });
  }
  
  return data;
};

const generateDayOfWeekData = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return daysOfWeek.map(day => ({
    name: day,
    users: Math.floor(Math.random() * 50) + 10,
    staff: Math.floor(Math.random() * 10) + 1
  }));
};

const generateLocationData = (customers) => {
  if (!Array.isArray(customers)) return [];
  const cityCounts = {};
  customers.forEach(c => {
    const city = c.address?.city || 'Other';
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });
  
  const entries = Object.entries(cityCounts);
  if (entries.length > 5) {
    // Sort by count, keep top 4, rest as 'Other'
    entries.sort((a, b) => b[1] - a[1]);
    const top = entries.slice(0, 4);
    const otherCount = entries.slice(4).reduce((sum, [, count]) => sum + count, 0);
    return [
      ...top.map(([name, value]) => ({ name, value })),
      { name: 'Other', value: otherCount }
    ];
  }
  return entries.map(([name, value]) => ({ name, value }));
};


// Summary Card Component
const SummaryCard = ({ title, value, change, changeType, icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <div className={`flex items-center mt-1 ${
            changeType === 'increase' ? 'text-green-600' : 
            changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {changeType === 'increase' ? (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : changeType === 'decrease' ? (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : null}
            <span className="text-xs font-medium">{change}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('500', '100')} ${color.replace('border-', 'text-')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalStaff: 0,
    activeCustomers: 0,
    revenue: 0,
    newCustomers: 0,
    retentionRate: 0
  });
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [recentStaff, setRecentStaff] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [dayOfWeekData, setDayOfWeekData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let usersResponse, staffResponse,countActiveCustomers;
        
        if (USE_MOCK_DATA) {
          // Use mock data instead of actual API calls
          usersResponse = mockApiResponses.getAllUsers;
          staffResponse = mockApiResponses.getAllStaff;
          
          // Simulate network delay for testing loading states
          await new Promise(resolve => setTimeout(resolve, 800));
        } else {
          // Use actual API endpoints
          [usersResponse, staffResponse,countActiveCustomers] = await Promise.all([
            getAllCustomers(),
            getAllStaff(),
            getAllCustomersCount()
          ]);
        }
        
        setStats({
          totalCustomers: usersResponse.data.length || 0,
          totalStaff: staffResponse.data.length || 0,
          activeCustomers: countActiveCustomers.data,
          revenue: calculateRevenue(usersResponse.data),
          newCustomers: countNewCustomersThisWeek(usersResponse.data),
          retentionRate: calculateRetentionRate(usersResponse.data)
        });
        
        const sortedCustomers = [...usersResponse.data].sort((a, b) => {
    
          const dateA = a.lastDealDate ? new Date(a.lastDealDate) : new Date(0);
          const dateB = b.lastDealDate ? new Date(b.lastDealDate) : new Date(0);
          return dateB - dateA;
        }).slice(0, 5);
        
        const sortedStaff = [...staffResponse.data].slice(0, 5);
        
        setRecentCustomers(sortedCustomers);
        setRecentStaff(sortedStaff);
        
        setLocationData(generateLocationData(usersResponse.data));
        generateChartData(selectedPeriod, usersResponse.data);
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Generate chart data when period changes
  useEffect(() => {
    generateChartData(selectedPeriod, recentCustomers);
  }, [selectedPeriod, recentCustomers]);
  
  // Generate different datasets based on selected time period
  const generateChartData = (period, customers = recentCustomers) => {
    let days = 7;
    let baseline = 100;
    let trend = 1;
    
    switch(period) {
      case 'Today':
        days = 1;
        baseline = 80;
        trend = 0.5;
        break;
      case 'Week':
        days = 7;
        baseline = 100;
        trend = 1;
        break;
      case 'Month':
        days = 30;
        baseline = 80;
        trend = 1.5;
        break;
      case 'Year':
        days = 365;
        baseline = 20;
        trend = 0.3;
        break;
      case 'All Time':
        days = 730;
        baseline = 10;
        trend = 0.2;
        break;
      default:
        days = 7;
    }
    
    setTimeSeriesData(generateTimeSeriesData(days, baseline, trend, 5));
    setDayOfWeekData(generateDayOfWeekData());
    setLocationData(generateLocationData(customers));
  };

  // Calculate revenue (mock)
  const calculateRevenue = (customers) => {
    return Math.floor(customers.length * 50 + Math.random() * 1000);
  };
  
  // Calculate retention rate (mock)
  const calculateRetentionRate = (customers) => {
    return Math.floor(65 + Math.random() * 20);
  };

  const countNewCustomersThisWeek = (customers) => {
    if (!Array.isArray(customers)) return 0;
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    return customers.filter(customer => {
     
      const firstDealDate =
        customer.firstDealDate ||
        customer.firstDateDeal ||
        customer.firstdealdate;
      if (!firstDealDate) return false;
      const date = new Date(firstDealDate);
      return date >= weekAgo && date <= now;
    }).length;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm underline hover:text-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500">Insights and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <PeriodSelector 
            selectedPeriod={selectedPeriod} 
            onChange={setSelectedPeriod} 
          />
         
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <SummaryCard 
          title="Total Customers"
          value={stats.totalCustomers}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="border-blue-500"
        />
        <SummaryCard 
          title="Active Customers"
          value={stats.activeCustomers}
          
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="border-green-500"
        />
        <SummaryCard 
          title="New Customers"
          value={stats.newCustomers}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="border-purple-500"
        />
        <SummaryCard 
          title="Total Employee"
          value={stats.totalStaff}
          
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="border-yellow-500"
        />
        <SummaryCard 
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="border-indigo-500"
        />
        <SummaryCard 
          title="Retention Rate"
          value={`${stats.retentionRate}%`}
          
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="border-red-500"
        />
      </div>

      {/* Customer Growth Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Customer Growth Trend</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1.5"></div>
              <span className="text-xs text-gray-500">Customers</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeSeriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (selectedPeriod === 'Today') return date.toLocaleTimeString();
                  if (selectedPeriod === 'Year' || selectedPeriod === 'All Time') {
                    return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
                  }
                  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                }}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [value, name === 'value' ? 'Customers' : name]}
                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6, fill: '#2563EB' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity by Day of Week */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Activity by Day of Week</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dayOfWeekData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" name="Customer Activity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="staff" name="Employee Activity" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


          {/* Customer Distribution by Location */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Customers by Location</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {locationData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/add-Customer" 
            className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Add Customer</span>
          </Link>
          
          <Link 
            to="/add-employee" 
            className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Add Employee</span>
          </Link>
          
          <Link 
            to="/customer" 
            className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Customer List</span>
          </Link>
          
          <Link 
            to="/employee" 
            className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Employee List</span>
          </Link>
        </div>
      </div>

      {/* Recent Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Recent Customers</h2>
            <Link to="/customer" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          
          {recentCustomers.length > 0 ? (
            <div className="divide-y">
              {recentCustomers.map(customer => (
                <div key={customer.customerId || customer.customerId} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium">{customer.name?.charAt(0) || 'C'}</span>
                    </div>
                    <div>
                      <span className="font-medium">{customer.name || 'Unknown Customer'}</span>
                      {customer.email && <p className="text-xs text-gray-500">{customer.email}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">
                        Last active: {customer.lastDealDate ? new Date(customer.lastDealDate).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  <Link to={`/edit-customer/${customer._id || customer.id}`} className="text-sm text-blue-600 hover:underline">
                    Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No customers found. <Link to="/add-customer" className="text-blue-600 hover:underline">Add a customer</Link>
            </div>
          )}
        </div>

        {/* Recent Staff */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Recent Employee</h2>
            <Link to="/employee" className="text-sm text-green-600 hover:underline">View All</Link>
          </div>
          
          {recentStaff.length > 0 ? (
            <div className="divide-y">
              {recentStaff.map(staff => (
                <div key={staff.employeeId || staff._id || `staff-${staff.name}-${staff.email}`} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <span className="text-green-600 font-medium">{staff.name?.charAt(0) || 'S'}</span>
                    </div>
                    <div>
                      <span className="font-medium">{staff.name || 'Unknown Staff'}</span>
                      {staff.role && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {staff.role}
                        </span>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">{staff.email}</p>
                    </div>
                  </div>
                  <Link to={`/edit-employee/${staff._id || staff.id}`} className="text-sm text-green-600 hover:underline">
                    Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No Employee found. <Link to="/add-employee" className="text-green-600 hover:underline">Add Employee</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { Suspense, useState, useEffect, useCallback, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import Notifications from '../components/Notifications';

const Dashboard = lazy(() => import('./Dashboard'));
const CustomerList = lazy(() => import('./Customer/CustomerList'));
const AddCustomer = lazy(() => import('./Customer/AddCustomer'));
const EditCustomer = lazy(() => import('./Customer/EditCustomer'));
const StaffList = lazy(() => import('./Employee/EmployeeList'));
const AddStaff = lazy(() => import('./Employee/AddEmployee'));
const EditStaff = lazy(() => import('./Employee/EditEmployee'));
const NotFound = lazy(() => import('./NotFound'));
const Profile = lazy(() => import('./Profile'));


const SplashScreen = () => (
  <div className="fixed inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center z-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-white text-center"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "reverse", 
          duration: 1.5,
          ease: "easeInOut" 
        }}
        className="mb-6"
      >
        <svg className="w-24 h-24 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.25 11.5L4.75 14L12 18.25L19.25 14L14.6722 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
      <div className="text-4xl font-bold mb-4">Management<span className="font-extrabold">Pro</span></div>
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mx-auto"></div>
    </motion.div>
  </div>
);

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -8,
  },
};

const AppLayout = ({ children }) => {  const [notifications, setNotifications] = useState([]);

  
  return (
    <div className="flex flex-col w-screen min-h-screen bg-gray-100 transition-colors duration-200">
      <Navbar/>
      
      
      {/* Action Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <Breadcrumbs />
            <div className="flex items-center space-x-3">
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content - flex-grow to fill available space */}
      <div className="flex-grow flex flex-col">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 h-full"
          >
            {children}
          </motion.div>
        </div>
      </div>
      
      {/* Footer - will stay at bottom due to flexbox layout */}
      <footer className="bg-white border-gray-200 border-t py-4 transition-colors duration-200">
        <div className="container mx-auto px-4 text-center text-sm flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500">
            &copy; {new Date().getFullYear()} ManagementPro. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms</a>
            <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy</a>
            <a href="#" className="text-indigo-600 hover:text-indigo-500">Support</a>
            <span className="text-gray-400">v1.0.0</span>
          </div>
        </div>
      </footer>

  

      {/* Notification System */}
      <Notifications notifications={notifications} />
      
      {/* Toast Container for react-hot-toast */}
      <Toaster position="bottom-right" />
    </div>
  );
};

const LoadingFallback = () => (
  <div className="space-y-6 animate-pulse">
    {/* Skeleton for page header */}
    <div className="flex justify-between items-center">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/6"></div>
    </div>
    
    {/* Skeleton for content area */}
    <div className="space-y-4">
      <div className="h-24 bg-gray-200 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const PageTitle = () => {
  const location = useLocation();
  
  useEffect(() => {
  
    const getTitle = () => {
      const path = location.pathname;
      
      if (path === '/dashboard') return 'Dashboard';
      if (path === '/customer') return 'Customer List';
      if (path === '/add-customer') return 'Add Customer';
      if (path.startsWith('/edit-customer')) return 'Edit Customer';
      if (path === '/employee') return 'employee List';
      if (path === '/add-employee') return 'Add employee';
      if (path.startsWith('/edit-employee')) return 'Edit employee';
      if (path === '/profile') return 'Profile';
      
      return 'ManagementPro';
    };
    
    document.title = `${getTitle()} | ManagementPro`;
  }, [location]);
  
  return null; 
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const element = useCallback(
    (Component) => (
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.3 }}
      >
        <Component />
      </motion.div>
    ),
    [location.pathname]
  );
  
  return (
    <AnimatePresence mode="sync">
      <ScrollToTop key="scroll-top" />
      <Routes location={location} key={location.pathname}>
        {/* Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={<AppLayout>{element(Dashboard)}</AppLayout>} 
        />
        
        {/* Customer Routes */}
        <Route 
          path="/customer" 
          element={<AppLayout>{element(CustomerList)}</AppLayout>} 
        />
        <Route 
          path="/add-customer" 
          element={<AppLayout>{element(AddCustomer)}</AppLayout>} 
        />
        <Route 
          path="/edit-customer/:customerId" 
          element={<AppLayout>{element(EditCustomer)}</AppLayout>} 
        />

        {/* employee Routes */}
        <Route 
          path="/employee" 
          element={<AppLayout>{element(StaffList)}</AppLayout>} 
        />
        <Route 
          path="/add-employee" 
          element={<AppLayout>{element(AddStaff)}</AppLayout>} 
        />
        <Route 
          path="/edit-employee/:employeeId" 
          element={<AppLayout>{element(EditStaff)}</AppLayout>} 
        />
        
        {/* Profile Route */}
        <Route 
          path="/profile" 
          element={<AppLayout>{element(Profile)}</AppLayout>} 
        />
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 Not Found Route */}
        <Route 
          path="*" 
          element={<AppLayout>{element(NotFound)}</AppLayout>} 
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', event.error);
    
    });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', () => {});
    };
  }, []);

  return (
    <Router>
      <PageTitle />
      {loading ? (
        <SplashScreen />
      ) : (
        <Suspense fallback={<AppLayout><LoadingFallback /></AppLayout>}>
          <AnimatedRoutes />
        </Suspense>
      )}
    </Router>
  );
}

export default App;
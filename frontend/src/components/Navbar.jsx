import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  const handleLogout = () => {
  
  };
  
  return (
    <nav 
      className={`z-30 w-full transition-all duration-300 sticky top-0 ${
        scrolled 
          ? 'bg-white shadow-md' 
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Smaller on mobile */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-indigo-600 text-white rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                Management<span className="text-indigo-600">Pro</span>
              </h1>
            </Link>
          </div>

          {/* Main Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <NavMenu />
          </div>

          {/* Right side actions */}
          <div className="flex items-center">
            {/* Profile dropdown */}
            <div className="relative ml-3 profile-dropdown">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 sm:space-x-3 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <img 
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border-2 border-indigo-100" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="User avatar" 
                />
                <div className="hidden lg:block text-left">
                  <span className="text-sm font-medium text-gray-700">
                    Admin User
                  </span>
                  <span className="text-xs block text-gray-500">
                    Administrator
                  </span>
                </div>
                <svg 
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Profile Dropdown Menu with improved animation */}
              {profileDropdownOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transition-all transform duration-200 opacity-100 scale-100"
                >
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button - better touch target */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 ml-2 rounded-md text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with improved animation */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${isActive ? 'bg-white text-indigo-700 border border-indigo-100' : 'text-gray-700 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </NavLink>
          
          <div className="py-1 border-t">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Customers
            </div>
            <NavLink
              to="/customer"
              className={({ isActive }) =>
                `${isActive ? 'bg-white text-indigo-700 border border-indigo-100' : 'text-gray-700 hover:bg-gray-50'} block pl-6 pr-3 py-2 rounded-md text-sm font-medium`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Customer List
            </NavLink>
            <NavLink
              to="/add-customer"
              className={({ isActive }) =>
                `${isActive ? 'bg-white text-indigo-700 border border-indigo-100' : 'text-gray-700 hover:bg-gray-50'} block pl-6 pr-3 py-2 rounded-md text-sm font-medium`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Add Customer
            </NavLink>
          </div>
          
          <div className="py-1 border-t">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Staff
            </div>
            <NavLink
              to="/employee"
              className={({ isActive }) =>
                `${isActive ? 'bg-white text-indigo-700 border border-indigo-100' : 'text-gray-700 hover:bg-gray-50'} block pl-6 pr-3 py-2 rounded-md text-sm font-medium`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Staff List
            </NavLink>
            <NavLink
              to="/add-employee"
              className={({ isActive }) =>
                `${isActive ? 'bg-white text-indigo-700 border border-indigo-100' : 'text-gray-700 hover:bg-gray-50'} block pl-6 pr-3 py-2 rounded-md text-sm font-medium`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Add Employee
            </NavLink>
          </div>
        </div>
        
        {/* Mobile profile section - improved styling */}
        <div className="pt-4 pb-3 border-t border-gray-200 bg-white">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <img 
                className="h-10 w-10 rounded-full object-cover border-2 border-indigo-100" 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="User avatar" 
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">Admin User</div>
              <div className="text-sm font-medium text-gray-500">admin@example.com</div>
            </div>
          </div>
          <div className="mt-3 space-y-1 px-2">
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Your Profile
            </Link>
            <button
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};


const NavMenu = () => {
  return (
    <>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive 
              ? 'bg-white text-indigo-700 shadow-sm border border-indigo-100' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
          }`
        }
      >
        Dashboard
      </NavLink>
      
      <NavLink
        to="/customer"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive 
              ? 'bg-white text-indigo-700 shadow-sm border border-indigo-100' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
          }`
        }
      >
        Customers
      </NavLink>
      
      <NavLink
        to="/employee"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive 
              ? 'bg-white text-indigo-700 shadow-sm border border-indigo-100' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
          }`
        }
      >
        Employee
      </NavLink>
    </>
  );
};

export default Navbar;
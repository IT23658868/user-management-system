import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-32 w-32 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        {/* Message */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold text-gray-800 tracking-tight">Page not found</h2>
          <p className="mt-4 text-base text-gray-600">
            Sorry, we couldn't find the page you're looking for. The page might have been removed, 
            had its name changed, or is temporarily unavailable.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/dashboard" 
            className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Dashboard
          </Link>
          
          <Link 
            to="/user" 
            className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Management
          </Link>
        </div>
        
        {/* Help Section */}
        <div className="mt-6 border-t pt-6 border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact the administrator.
          </p>
          <div className="mt-3 flex justify-center space-x-4">
            <button 
              onClick={() => window.history.back()} 
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Go Back
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => window.location.reload()} 
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
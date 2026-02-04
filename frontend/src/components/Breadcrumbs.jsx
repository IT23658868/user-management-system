import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  

  const getRouteTitle = (path) => {
    switch(path) {
      case 'dashboard': return 'Dashboard';
      case 'user': return 'Users';
      case 'add-user': return 'Add User';
      case 'edit-user': return 'Edit User';
      case 'staff': return 'Employee';
      case 'add-staff': return 'Add Employee';
      case 'edit-staff': return 'Edit Employee';
      case 'customer': return 'Customers';
      case 'add-customer': return 'Add Customer';
      case 'edit-customer': return 'Edit Customer';
      default: return path;
    }
  };

  return (
    <nav className="text-sm">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-indigo-600 hover:text-indigo-800">
            Home
          </Link>
        </li>
          {pathnames.map((value, index) => {
          
          const isIdPart = index > 0 && 
            (pathnames[index-1].startsWith('edit-') || pathnames[index-1].startsWith('add-'));
          if (isIdPart) return null;
          
          if ((value === 'edit-user' || value === 'edit-staff' || value === 'edit-employee' || value === 'edit-customer') && index < pathnames.length - 1) {
            const id = pathnames[index + 1];
            return (
              <React.Fragment key={index}>
                <li className="text-gray-500">/</li>
                <li className="text-gray-500">
                  {getRouteTitle(value)}#{id}
                </li>
              </React.Fragment>
            );
          }       
 
          if (index > 0 && isIdPart) return null;
          
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          return (
            <React.Fragment key={index}>
              <li className="text-gray-500">/</li>
              <li>
                {isLast ? (
                  <span className="text-gray-500">{getRouteTitle(value)}</span>
                ) : (
                  <Link to={to} className="text-indigo-600 hover:text-indigo-800">
                    {getRouteTitle(value)}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
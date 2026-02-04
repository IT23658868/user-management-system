import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Settings = () => {
  
  const [activeTab, setActiveTab] = useState('general');
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'ManagementPro',
    companyName: 'Your Company',
    companyEmail: 'contact@example.com',
    language: 'en',
    timezone: 'UTC+0',
    dateFormat: 'MM/DD/YYYY'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    desktopNotifications: true,
    newUserAlert: true,
    systemUpdates: true,
    marketingEmails: false,
    reportFrequency: 'weekly'
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginAttempts: '5',
    requireStrongPassword: true
  });
  
  const [themeSettings, setThemeSettings] = useState({
    sidebarCollapsed: false,
    animationsEnabled: true,
    compactMode: false,
    highContrastMode: false,
    fontSize: 'medium'
  });
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleThemeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setThemeSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const saveSettings = async () => {
    setSaving(true);
    
    try {
     
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully');
      
      localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
      localStorage.setItem('themeSettings', JSON.stringify(themeSettings));
      
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Settings save error:', error);
    } finally {
      setSaving(false);
    }
  };
  
  const resetSettings = () => {
    const confirmReset = window.confirm('Are you sure you want to reset all settings to default values?');
    
    if (confirmReset) {
      setGeneralSettings({
        siteName: 'ManagementPro',
        companyName: 'Your Company',
        companyEmail: 'contact@example.com',
        language: 'en',
        timezone: 'UTC+0',
        dateFormat: 'MM/DD/YYYY'
      });
      
      setNotificationSettings({
        emailNotifications: true,
        desktopNotifications: true,
        newUserAlert: true,
        systemUpdates: true,
        marketingEmails: false,
        reportFrequency: 'weekly'
      });
      
      setSecuritySettings({
        twoFactorAuth: false,
        sessionTimeout: '30',
        passwordExpiry: '90',
        loginAttempts: '5',
        requireStrongPassword: true
      });
      
      setThemeSettings({
        sidebarCollapsed: false,
        animationsEnabled: true,
        compactMode: false,
        highContrastMode: false,
        fontSize: 'medium'
      });
      
      toast.success('Settings reset to defaults');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <button
            onClick={resetSettings}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Settings Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'general'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
            `}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'notifications'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
            `}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'security'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
            `}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'appearance'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
            `}
          >
            Appearance
          </button>
        </nav>
      </div>
      
      <div className="mt-8">
        {/* General Settings */}
        {activeTab === 'general' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">General Settings</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Basic information about your company and preferences.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Site Name
                    </label>
                    <input
                      type="text"
                      name="siteName"
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={handleGeneralChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      value={generalSettings.companyName}
                      onChange={handleGeneralChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      id="companyEmail"
                      value={generalSettings.companyEmail}
                      onChange={handleGeneralChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={generalSettings.language}
                      onChange={handleGeneralChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={generalSettings.timezone}
                      onChange={handleGeneralChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="UTC-12">UTC-12:00</option>
                      <option value="UTC-11">UTC-11:00</option>
                      <option value="UTC-10">UTC-10:00</option>
                      <option value="UTC-9">UTC-09:00</option>
                      <option value="UTC-8">UTC-08:00</option>
                      <option value="UTC-7">UTC-07:00</option>
                      <option value="UTC-6">UTC-06:00</option>
                      <option value="UTC-5">UTC-05:00</option>
                      <option value="UTC-4">UTC-04:00</option>
                      <option value="UTC-3">UTC-03:00</option>
                      <option value="UTC-2">UTC-02:00</option>
                      <option value="UTC-1">UTC-01:00</option>
                      <option value="UTC+0">UTC+00:00</option>
                      <option value="UTC+1">UTC+01:00</option>
                      <option value="UTC+2">UTC+02:00</option>
                      <option value="UTC+3">UTC+03:00</option>
                      <option value="UTC+4">UTC+04:00</option>
                      <option value="UTC+5">UTC+05:00</option>
                      <option value="UTC+6">UTC+06:00</option>
                      <option value="UTC+7">UTC+07:00</option>
                      <option value="UTC+8">UTC+08:00</option>
                      <option value="UTC+9">UTC+09:00</option>
                      <option value="UTC+10">UTC+10:00</option>
                      <option value="UTC+11">UTC+11:00</option>
                      <option value="UTC+12">UTC+12:00</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date Format
                    </label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      value={generalSettings.dateFormat}
                      onChange={handleGeneralChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="YYYY.MM.DD">YYYY.MM.DD</option>
                      <option value="DD-MMM-YYYY">DD-MMM-YYYY</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Notification Settings</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Configure how and when you receive notifications.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                        Email Notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">Receive notifications via email.</p>
                    </div>
                  </div>
                  
                  {/* Desktop Notifications */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="desktopNotifications"
                        name="desktopNotifications"
                        type="checkbox"
                        checked={notificationSettings.desktopNotifications}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="desktopNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                        Desktop Notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">Show desktop notifications when in the app.</p>
                    </div>
                  </div>
                  
                  {/* New User Alert */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="newUserAlert"
                        name="newUserAlert"
                        type="checkbox"
                        checked={notificationSettings.newUserAlert}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="newUserAlert" className="font-medium text-gray-700 dark:text-gray-300">
                        New User Alerts
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">Get notified when new users are added.</p>
                    </div>
                  </div>
                  
                  {/* System Updates */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="systemUpdates"
                        name="systemUpdates"
                        type="checkbox"
                        checked={notificationSettings.systemUpdates}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="systemUpdates" className="font-medium text-gray-700 dark:text-gray-300">
                        System Updates
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">Get notified about system updates and maintenance.</p>
                    </div>
                  </div>
                  
                  {/* Marketing Emails */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="marketingEmails"
                        name="marketingEmails"
                        type="checkbox"
                        checked={notificationSettings.marketingEmails}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketingEmails" className="font-medium text-gray-700 dark:text-gray-300">
                        Marketing Emails
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">Receive emails about new features and offers.</p>
                    </div>
                  </div>
                  
                  {/* Report Frequency */}
                  <div className="sm:col-span-2 mt-6">
                    <label htmlFor="reportFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Report Frequency
                    </label>
                    <select
                      id="reportFrequency"
                      name="reportFrequency"
                      value={notificationSettings.reportFrequency}
                      onChange={handleNotificationChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Security Settings */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Security Settings</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Configure security options for your account and users.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  {/* Two Factor Authentication */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">Two-factor authentication</h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button 
                        type="button"
                        onClick={() => 
                          setSecuritySettings({
                            ...securitySettings,
                            twoFactorAuth: !securitySettings.twoFactorAuth
                          })
                        }
                        className={`${
                          securitySettings.twoFactorAuth ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className={`${
                            securitySettings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-gray-200 shadow transform ring-0 transition ease-in-out duration-200`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  {/* Session Timeout */}
                  <div>
                    <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Session Timeout (minutes)
                    </label>
                    <select
                      id="sessionTimeout"
                      name="sessionTimeout"
                      value={securitySettings.sessionTimeout}
                      onChange={handleSecurityChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="240">4 hours</option>
                    </select>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Automatically log out after a period of inactivity
                    </p>
                  </div>
                  
                  {/* Password Expiry */}
                  <div>
                    <label htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password Expiry (days)
                    </label>
                    <select
                      id="passwordExpiry"
                      name="passwordExpiry"
                      value={securitySettings.passwordExpiry}
                      onChange={handleSecurityChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="never">Never</option>
                    </select>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Force password reset after this many days
                    </p>
                  </div>
                  
                  {/* Login Attempts */}
                  <div>
                    <label htmlFor="loginAttempts" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Maximum Login Attempts
                    </label>
                    <select
                      id="loginAttempts"
                      name="loginAttempts"
                      value={securitySettings.loginAttempts}
                      onChange={handleSecurityChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="3">3 attempts</option>
                      <option value="5">5 attempts</option>
                      <option value="10">10 attempts</option>
                    </select>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Lock account after this many failed login attempts
                    </p>
                  </div>
                  
                  {/* Strong Password */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="requireStrongPassword"
                        name="requireStrongPassword"
                        type="checkbox"
                        checked={securitySettings.requireStrongPassword}
                        onChange={handleSecurityChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="requireStrongPassword" className="font-medium text-gray-700 dark:text-gray-300">
                        Require Strong Passwords
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Passwords must have at least 8 characters, include uppercase, lowercase, numbers, and special characters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Appearance Settings</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Customize the look and feel of the application.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  {/* Sidebar Collapsed */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="sidebarCollapsed"
                        name="sidebarCollapsed"
                        type="checkbox"
                        checked={themeSettings.sidebarCollapsed}
                        onChange={handleThemeChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="sidebarCollapsed" className="font-medium text-gray-700 dark:text-gray-300">
                        Collapsed Sidebar
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Use a more compact sidebar to maximize screen space
                      </p>
                    </div>
                  </div>
                  
                  {/* Animations */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="animationsEnabled"
                        name="animationsEnabled"
                        type="checkbox"
                        checked={themeSettings.animationsEnabled}
                        onChange={handleThemeChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="animationsEnabled" className="font-medium text-gray-700 dark:text-gray-300">
                        Enable Animations
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Enable UI animations and transitions for a more dynamic experience
                      </p>
                    </div>
                  </div>
                  
                  {/* Compact Mode */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="compactMode"
                        name="compactMode"
                        type="checkbox"
                        checked={themeSettings.compactMode}
                        onChange={handleThemeChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="compactMode" className="font-medium text-gray-700 dark:text-gray-300">
                        Compact Mode
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Use less padding and spacing for a more compact UI
                      </p>
                    </div>
                  </div>
                  
                  {/* High Contrast */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="highContrastMode"
                        name="highContrastMode"
                        type="checkbox"
                        checked={themeSettings.highContrastMode}
                        onChange={handleThemeChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="highContrastMode" className="font-medium text-gray-700 dark:text-gray-300">
                        High Contrast Mode
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Improve visibility with higher contrast colors
                      </p>
                    </div>
                  </div>
                  
                  {/* Font Size */}
                  <div>
                    <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Font Size
                    </label>
                    <select
                      id="fontSize"
                      name="fontSize"
                      value={themeSettings.fontSize}
                      onChange={handleThemeChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Settings;
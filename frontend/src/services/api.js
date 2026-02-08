import axios from 'axios';

const API_URL = '/api'; // Adjust based on your backend URL

export const addStaff = (staff) => axios.post(`${API_URL}/employee/add-employee`, staff);
export const getAllStaff = () => axios.get(`${API_URL}/employee/get-employee`);
export const deleteStaff = (id) => axios.delete(`${API_URL}/employee/delete-employee/${id}`);
export const searchStaff = (search) => axios.get(`${API_URL}/employee/search-employee?search=${search}`);
export const getStaffById = (id) => axios.get(`${API_URL}/employee/get-employee/${id}`);
export const updateStaffRole = (id, role) => axios.put(`${API_URL}/employee/update-employee-Role/${id}?Role=${role}`);
export const updateStaffAddress = (id, address) => axios.put(`${API_URL}/employee/update-employee-Address/${id}`, address);
export const updateStaffPhone = (id, phone) => axios.put(`${API_URL}/employee/update-employee-Phone/${id}?phone=${phone}`);
export const updateStaffEmail = (id, email) => axios.put(`${API_URL}/employee/update-employee-Email/${id}?email=${email}`);
export const updateStaffPassword = (id, password) => axios.put(`${API_URL}/employee/update-employee-Password/${id}?password=${password}`);
export const updateStaffName = (id, name) => axios.put(`${API_URL}/employee/update-employee-Name/${id}?name=${name}`);
export const updateStaffNic = (id, newNic) => axios.put(`${API_URL}/employee/update-employee-Nic/${id}?newNic=${newNic}`);

export const addCustomer = (customer) => axios.post(`${API_URL}/Customer/add-Customer`, customer);
export const getAllCustomers = () => axios.get(`${API_URL}/Customer/all-Customers`);
export const deleteCustomer = (customerId) => axios.delete(`${API_URL}/Customer/delete-Customer/${customerId}`);
export const searchCustomer = (search) => axios.get(`${API_URL}/Customer/search-Customer?search=${search}`);
export const getCustomerById = (customerId) => axios.get(`${API_URL}/Customer/Customer/${customerId}`);
export const updateCustomerName = (customerId, name) => axios.put(`${API_URL}/Customer/update-Customer-name/${customerId}?name=${name}`);
export const updateCustomerNic = (customerId, newNic) => axios.put(`${API_URL}/Customer/update-Customer-Nic/${customerId}?newNic=${newNic}`);

export const updateCustomerEmail = (customerId, email) => axios.put(`${API_URL}/Customer/update-Customer-email/${customerId}?email=${email}`);
export const updateCustomerPhone = (customerId, phoneNumber) => axios.put(`${API_URL}/Customer/update-Customer-phone/${customerId}?phoneNumber=${phoneNumber}`);
export const updateCustomerAddress = (customerId, address) => axios.put(`${API_URL}/Customer/update-Customer-address/${customerId}`, address);
export const updateCustomerFirstDealDate = (customerId, date) => axios.put(`${API_URL}/Customer/update-Customer-fristdealdate/${customerId}?fristDealDate=${date}`);
export const updateCustomerLastDealDate = (customerId, date) => axios.put(`${API_URL}/Customer/update-Customer-lastdealdate/${customerId}?lastDealDate=${date}`);

export const getAllCustomersCount = () => axios.get(`${API_URL}/Customer/get-Active-Customer-Count`);





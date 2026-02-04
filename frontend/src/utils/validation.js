export const validateNIC = (nic) => {
  const oldNICRegex = /^\d{9}[Vv]$/;
  const newNICRegex = /^\d{12}$/;
  
  if (!nic) return 'NIC is required';
  if (!oldNICRegex.test(nic) && !newNICRegex.test(nic)) {
    return 'NIC must be either 9 digits followed by V/v or 12 digits';
  }
  return '';
};

export const validatePhone = (phone) => {
  const phoneRegex = /^07\d{8}$/;
  if (!phone) return 'Phone number is required';
  if (!phoneRegex.test(phone)) {
    return 'Phone number must be 10 digits and start with 07 (e.g., 0712345678)';
  }
  return '';
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
};

export const unformatPhoneNumber = (phone) => {
  return phone.replace(/\s/g, '');
};

export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!password) return 'Password is required';
  if (password.length < minLength) {
    return 'Password must be at least 8 characters long';
  }
  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!hasLowerCase) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!hasNumbers) {
    return 'Password must contain at least one number';
  }
  if (!hasSpecialChar) {
    return 'Password must contain at least one special character';
  }
  return '';
};

export const BLOOD_GROUPS = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
];

export const URGENCY_LEVELS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const COLORS = {
  PRIMARY: '#E63946',
  SECONDARY: '#457B9D',
  SUCCESS: '#06A77D',
  WARNING: '#F77F00',
  DANGER: '#DC3545',
  LIGHT: '#F8F9FA',
  DARK: '#212529',
  WHITE: '#FFFFFF',
  GRAY: '#6C757D',
};

export const BASE_URL = 'http://10.0.2.2:5000';
// export const BASE_URL = 'https://blood-doner-finder.techrevivals.net';
export const API_URL = `${BASE_URL}/api`;
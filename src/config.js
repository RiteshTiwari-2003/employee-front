const isDevelopment = true; // Set this to false for production

export const API_URL = isDevelopment 
    ? 'http://localhost:5000/api'
    : 'https://employee-backend-yz6s.onrender.com/api';

import {jwtDecode} from 'jwt-decode';

export const getToken = () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='));
  return token ? token.split('=')[1] : null;
};

export const getUserRoleFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);
    return decodedToken.role; // Assuming your payload has a structure like { user: { id: '...', role: '...' } }
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

export const removeToken = () => {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

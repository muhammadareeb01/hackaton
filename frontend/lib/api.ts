import Cookies from 'js-cookie';
import toast from '@/lib/toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = Cookies.get('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      Cookies.remove('token');
      // Only show toast if not already on login page to avoid spam
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'An error occurred with the API request');
    }

    return await response.json();
  } catch (error) {
    // console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

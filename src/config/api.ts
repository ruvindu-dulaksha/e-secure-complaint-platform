const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    },
    register: async (userData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      nicNumber: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      return response.json();
    },
  },
  complaints: {
    getAll: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }
      return response.json();
    },
    create: async (token: string, complaintData: {
      title: string;
      description: string;
      location: string;
      evidenceUrl?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData),
      });
      if (!response.ok) {
        throw new Error('Failed to create complaint');
      }
      return response.json();
    },
    updateStatus: async (token: string, complaintId: string, status: string) => {
      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update complaint status');
      }
      return response.json();
    },
  },
};

export default api;
// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

// API Service Class
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get authentication token
  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.getToken()) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.getToken()}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      if (!response.headers.get('content-type')?.includes('application/json')) {
        if (response.ok) {
          return {} as T;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'admin';
    studentId?: string;
    department?: string;
    year?: string;
  }) {
    const response = await this.request<{
      success: boolean;
      message: string;
      token: string;
      user: any;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      success: boolean;
      message: string;
      token: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    const response = await this.request<{
      success: boolean;
      message: string;
    }>('/auth/logout', {
      method: 'POST',
    });

    this.setToken(null);
    return response;
  }

  async getCurrentUser() {
    return this.request<{
      success: boolean;
      user: any;
    }>('/auth/me');
  }

  async updateUserDetails(userData: {
    name?: string;
    email?: string;
    department?: string;
    year?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      user: any;
    }>('/auth/updatedetails', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async updatePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      token: string;
    }>('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Event methods
  async getEvents(params?: {
    page?: number;
    limit?: number;
    department?: string;
    type?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      success: boolean;
      count: number;
      total: number;
      page: number;
      pages: number;
      data: any[];
    }>(endpoint);
  }

  async getUpcomingEvents(limit?: number) {
    const endpoint = `/events/upcoming${limit ? `?limit=${limit}` : ''}`;
    return this.request<{
      success: boolean;
      count: number;
      data: any[];
    }>(endpoint);
  }

  async getEventsByDepartment(department: string, status?: string) {
    const endpoint = `/events/department/${encodeURIComponent(department)}${status ? `?status=${status}` : ''}`;
    return this.request<{
      success: boolean;
      count: number;
      data: any[];
    }>(endpoint);
  }

  async getEvent(id: string) {
    return this.request<{
      success: boolean;
      data: any;
    }>(`/events/${id}`);
  }

  async createEvent(eventData: {
    title: string;
    description: string;
    type: 'academic' | 'sports' | 'extracurricular';
    points: number;
    department: string;
    date: string;
    maxParticipants?: number;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: any;
    }>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: string, eventData: any) {
    return this.request<{
      success: boolean;
      message: string;
      data: any;
    }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async participateInEvent(id: string) {
    return this.request<{
      success: boolean;
      message: string;
      pointsEarned: number;
    }>(`/events/${id}/participate`, {
      method: 'POST',
    });
  }

  async removeParticipation(id: string) {
    return this.request<{
      success: boolean;
      message: string;
      pointsRemoved: number;
    }>(`/events/${id}/participate`, {
      method: 'DELETE',
    });
  }

  // Achievement methods
  async getAchievements(params?: {
    page?: number;
    limit?: number;
    category?: string;
    rarity?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/achievements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      success: boolean;
      count: number;
      total: number;
      page: number;
      pages: number;
      data: any[];
    }>(endpoint);
  }

  async getAchievementsByCategory(category: string, rarity?: string) {
    const endpoint = `/achievements/category/${encodeURIComponent(category)}${rarity ? `?rarity=${rarity}` : ''}`;
    return this.request<{
      success: boolean;
      count: number;
      data: any[];
    }>(endpoint);
  }

  async getRareAchievements() {
    return this.request<{
      success: boolean;
      count: number;
      data: any[];
    }>('/achievements/rare');
  }

  async getUserAchievements(userId: string) {
    return this.request<{
      success: boolean;
      count: number;
      data: any[];
    }>(`/achievements/user/${userId}`);
  }


  async awardPointsForEvent(eventId: string, userId: string, points: number) {
    return this.request<{
      success: boolean;
      message: string;
      pointsAwarded: number;
      newLevel: number;
      newAchievements: Array<{
        title: string;
        description: string;
        points: number;
      }>;
    }>(`/events/${eventId}/award-points`, {
      method: 'POST',
      body: JSON.stringify({ userId, points }),
    });
  }

  async getAchievement(id: string) {
    return this.request<{
      success: boolean;
      data: any;
    }>(`/achievements/${id}`);
  }

  async createAchievement(achievementData: {
    title: string;
    description: string;
    category: 'academic' | 'sports' | 'extracurricular' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    points: number;
    requirements: {
      type: 'points' | 'events' | 'streak' | 'custom';
      value?: number;
      description?: string;
    };
    icon?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: any;
    }>('/achievements', {
      method: 'POST',
      body: JSON.stringify(achievementData),
    });
  }

  async updateAchievement(id: string, achievementData: any) {
    return this.request<{
      success: boolean;
      message: string;
      data: any;
    }>(`/achievements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(achievementData),
    });
  }

  async deleteAchievement(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/achievements/${id}`, {
      method: 'DELETE',
    });
  }

  async checkUserAchievements() {
    return this.request<{
      success: boolean;
      message: string;
      newAchievements: any[];
    }>('/achievements/check', {
      method: 'POST',
    });
  }

  // User methods
  async getUsers(params?: {
    page?: number;
    limit?: number;
    department?: string;
    role?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      success: boolean;
      count: number;
      total: number;
      page: number;
      pages: number;
      data: any[];
    }>(endpoint);
  }

  async getLeaderboard(params?: {
    department?: string;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/users/leaderboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{
      success: boolean;
      count: number;
      data: any[];
    }>(endpoint);
  }

  async getUserProfile(id: string) {
    return this.request<{
      success: boolean;
      data: any;
    }>(`/users/profile/${id}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request<{
      success: boolean;
      message: string;
      data: any;
    }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserStats() {
    return this.request<{
      success: boolean;
      data: any;
    }>('/users/stats');
  }

  // Health check

  async healthCheck() {
    return this.request<{
      success: boolean;
      message: string;
      timestamp: string;
      environment: string;
    }>('/health');
  }
}

// Create and export API instance
export const apiService = new ApiService(API_BASE_URL);
export default apiService;

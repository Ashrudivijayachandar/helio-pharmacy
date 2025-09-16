/**
 * API Service for Pharmacy Mobile App
 * Handles all backend communication and authentication
 */

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Storage keys
const TOKEN_KEY = 'pharmacy_access_token';
const REFRESH_TOKEN_KEY = 'pharmacy_refresh_token';

// Simple mock storage for development
class MockStorage {
  private data: Record<string, string> = {};

  async getItem(key: string): Promise<string | null> {
    return this.data[key] || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.data[key] = value;
  }

  async removeItem(key: string): Promise<void> {
    delete this.data[key];
  }
}

class ApiService {
  private storage = new MockStorage();

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const token = await this.storage.getItem(TOKEN_KEY);
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Token management methods
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await this.storage.setItem(TOKEN_KEY, accessToken);
    await this.storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  async clearTokens(): Promise<void> {
    await this.storage.removeItem(TOKEN_KEY);
    await this.storage.removeItem(REFRESH_TOKEN_KEY);
  }

  async getAccessToken(): Promise<string | null> {
    return await this.storage.getItem(TOKEN_KEY);
  }

  // Authentication APIs
  async login(email: string, password: string) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.access_token && response.refresh_token) {
      await this.setTokens(response.access_token, response.refresh_token);
    }
    
    return response;
  }

  async register(pharmacyData: {
    name: string;
    license_number: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    owner_name: string;
    gst_number?: string;
  }) {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(pharmacyData),
    });
    
    if (response.access_token && response.refresh_token) {
      await this.setTokens(response.access_token, response.refresh_token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    await this.clearTokens();
  }

  async getProfile() {
    return await this.makeRequest('/auth/profile');
  }

  // Inventory Management APIs
  async getInventory(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return await this.makeRequest(`/inventory${queryString}`);
  }

  async addInventoryItem(inventoryData: Record<string, any>) {
    return await this.makeRequest('/inventory', {
      method: 'POST',
      body: JSON.stringify(inventoryData),
    });
  }

  async updateInventoryItem(inventoryId: string, updateData: Record<string, any>) {
    return await this.makeRequest(`/inventory/${inventoryId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteInventoryItem(inventoryId: string) {
    return await this.makeRequest(`/inventory/${inventoryId}`, {
      method: 'DELETE',
    });
  }

  async getLowStockItems() {
    return await this.makeRequest('/inventory/low-stock');
  }

  async getExpiringItems(days: number = 30) {
    return await this.makeRequest(`/inventory/expiring-soon?days=${days}`);
  }

  // Medicine Management APIs
  async searchMedicines(query: string) {
    return await this.makeRequest(`/medicines/search?q=${encodeURIComponent(query)}`);
  }

  async getMedicines(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return await this.makeRequest(`/medicines${queryString}`);
  }

  async getMedicine(medicineId: string) {
    return await this.makeRequest(`/medicines/${medicineId}`);
  }

  // Prescription Management APIs
  async getPrescriptions(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return await this.makeRequest(`/prescriptions${queryString}`);
  }

  async getPrescription(prescriptionId: string) {
    return await this.makeRequest(`/prescriptions/${prescriptionId}`);
  }

  async updatePrescriptionStatus(prescriptionId: string, status: string) {
    return await this.makeRequest(`/prescriptions/${prescriptionId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Analytics and Dashboard APIs
  async getDashboardStats() {
    // Mock data for development - replace with actual API call in production
    return {
      totalMedicines: 1247,
      lowStockCount: 23,
      expiringSoonCount: 15,
      todaySales: 45680,
      weekSales: 298450,
      pendingPrescriptions: 12,
      criticalAlerts: 5,
    };
  }

  async getSalesReport(params: {
    startDate: string;
    endDate: string;
    groupBy?: 'day' | 'week' | 'month';
  }) {
    return await this.makeRequest('/analytics/sales', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getTopMedicines(period: 'week' | 'month' | 'year' = 'month') {
    return await this.makeRequest(`/analytics/top-medicines?period=${period}`);
  }

  // Utility methods
  async healthCheck() {
    return await this.makeRequest('/health');
  }

  async testConnection() {
    try {
      const result = await this.healthCheck();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error };
    }
  }
}

// Export singleton instance
export default new ApiService();
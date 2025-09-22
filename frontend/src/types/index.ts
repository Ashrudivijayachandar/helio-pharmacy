/**
 * TypeScript type definitions for Helio Pharmacy Management System
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Administrator' | 'Head Pharmacist' | 'Pharmacy Assistant' | 'Pharmacy Manager' | 'Pharmacy Intern' | 'admin' | 'pharmacist' | 'staff';
  pharmacy_id?: string;
  pharmacy?: string;
  created_at: string;
  updated_at: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  license_number: string;
  address: string;
  phone?: string;
  email?: string;
  owner_name: string;
  gst_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Medicine {
  id: string;
  name: string;
  generic_name?: string;
  brand_name?: string;
  manufacturer?: string;
  composition?: string;
  strength?: string;
  dosage_form?: string;
  therapeutic_class?: string;
  prescription_required: boolean;
  controlled_substance: boolean;
  storage_conditions?: string;
  category?: string;
  price?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  pharmacy_id: string;
  medicine_id: string;
  batch_number: string;
  manufacture_date: string;
  expiry_date: string;
  quantity_available: number;
  quantity_reserved: number;
  minimum_threshold: number;
  unit_price: number;
  mrp: number;
  supplier_name?: string;
  purchase_date?: string;
  is_low_stock: boolean;
  is_expired: boolean;
  days_to_expiry: number;
  created_at: string;
  updated_at: string;
  medicine?: Medicine;
}

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
  age?: number;
  gender?: string;
  address?: string;
  emergency_contact?: string;
  allergies?: string;
  medical_conditions?: string;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  pharmacy_id?: string;
  doctor_name: string;
  doctor_license?: string;
  prescription_date: string;
  date_prescribed: string;
  prescription_number?: string;
  diagnosis?: string;
  status: 'pending' | 'fulfilled' | 'cancelled';
  total_amount?: number;
  notes?: string;
  medicines?: any[];
  instructions?: string;
  date_fulfilled?: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
}

export interface Notification {
  id: string;
  pharmacy_id?: string;
  user_id?: string;
  type: string;
  notification_type: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  title: string;
  message: string;
  data?: any;
  read_status: boolean;
  is_read: boolean;
  action_required: boolean;
  expires_at?: string;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RareMedicineRequest {
  id: string;
  patient_id: string;
  medicine_name: string;
  generic_name?: string;
  strength?: string;
  dosage?: string;
  manufacturer?: string;
  quantity_needed: number;
  urgency_level: 'low' | 'normal' | 'high' | 'critical';
  doctor_prescription?: string;
  patient_notes?: string;
  patient_contact?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'declined' | 'completed' | 'cancelled';
  requested_date: string;
  response_date?: string;
  fulfilled_date?: string;
  date_completed?: string;
  estimated_cost?: number;
  estimated_delivery?: string;
  supplier_info?: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
}

export interface DashboardStats {
  totals: {
    medicines: number;
    patients: number;
    prescriptions: number;
  };
  recent_activity: {
    prescriptions_last_30_days: number;
  };
  alerts: {
    low_stock_items: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    total: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  per_page?: number;
}
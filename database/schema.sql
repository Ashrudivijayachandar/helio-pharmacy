-- Pharmacy Management System Database Schema
-- Professional medical-grade database design

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE ENTITIES
-- ============================================================================

-- Pharmacy information
CREATE TABLE pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    owner_name VARCHAR(255) NOT NULL,
    gst_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medicine master data
CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand_name VARCHAR(255),
    manufacturer VARCHAR(255),
    composition TEXT,
    strength VARCHAR(100),
    dosage_form VARCHAR(100), -- tablet, capsule, syrup, injection, etc.
    therapeutic_class VARCHAR(255),
    prescription_required BOOLEAN DEFAULT true,
    controlled_substance BOOLEAN DEFAULT false,
    storage_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique medicine identification
    UNIQUE(name, strength, manufacturer)
);

-- Medicine inventory with batch tracking
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
    batch_number VARCHAR(100) NOT NULL,
    manufacture_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_available INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER NOT NULL DEFAULT 0,
    minimum_threshold INTEGER NOT NULL DEFAULT 10,
    unit_price DECIMAL(10,2) NOT NULL,
    mrp DECIMAL(10,2) NOT NULL,
    supplier_name VARCHAR(255),
    purchase_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_positive_quantity CHECK (quantity_available >= 0),
    CONSTRAINT check_positive_reserved CHECK (quantity_reserved >= 0),
    CONSTRAINT check_valid_dates CHECK (expiry_date > manufacture_date),
    CONSTRAINT check_positive_prices CHECK (unit_price > 0 AND mrp > 0),
    
    -- Unique batch per pharmacy
    UNIQUE(pharmacy_id, medicine_id, batch_number)
);

-- Patients
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    address TEXT,
    emergency_contact VARCHAR(20),
    allergies TEXT,
    medical_conditions TEXT,
    preferred_language VARCHAR(20) DEFAULT 'English',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    pharmacy_id UUID REFERENCES pharmacies(id),
    doctor_name VARCHAR(255) NOT NULL,
    doctor_license VARCHAR(100),
    prescription_date DATE NOT NULL,
    prescription_number VARCHAR(100),
    diagnosis TEXT,
    status VARCHAR(50) DEFAULT 'Received' CHECK (status IN ('Received', 'Processing', 'Ready', 'Dispensed', 'Cancelled')),
    total_amount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prescription items
CREATE TABLE prescription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES medicines(id),
    inventory_id UUID REFERENCES inventory(id),
    quantity_prescribed INTEGER NOT NULL,
    quantity_dispensed INTEGER DEFAULT 0,
    dosage_instructions TEXT NOT NULL,
    duration VARCHAR(100),
    frequency VARCHAR(100),
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    substitute_allowed BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Available', 'Reserved', 'Dispensed', 'Substituted', 'Unavailable')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_positive_prescribed CHECK (quantity_prescribed > 0),
    CONSTRAINT check_valid_dispensed CHECK (quantity_dispensed >= 0 AND quantity_dispensed <= quantity_prescribed)
);

-- ============================================================================
-- RARE MEDICINE MANAGEMENT
-- ============================================================================

-- Rare medicine requests from patients
CREATE TABLE rare_medicine_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    strength VARCHAR(100),
    manufacturer VARCHAR(255),
    quantity_needed INTEGER NOT NULL,
    urgency_level VARCHAR(20) DEFAULT 'Normal' CHECK (urgency_level IN ('Low', 'Normal', 'High', 'Critical')),
    doctor_prescription TEXT,
    patient_notes TEXT,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Declined', 'Fulfilled', 'Cancelled')),
    requested_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP WITH TIME ZONE,
    fulfilled_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy responses to rare medicine requests
CREATE TABLE rare_medicine_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES rare_medicine_requests(id) ON DELETE CASCADE,
    pharmacy_id UUID REFERENCES pharmacies(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Accepted', 'Declined')),
    estimated_availability_date DATE,
    estimated_price DECIMAL(10,2),
    pharmacy_notes TEXT,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- One response per pharmacy per request
    UNIQUE(request_id, pharmacy_id)
);

-- ============================================================================
-- TRANSACTIONS AND SALES
-- ============================================================================

-- Sales transactions
CREATE TABLE sales_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id),
    prescription_id UUID REFERENCES prescriptions(id),
    transaction_number VARCHAR(100) UNIQUE NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Cash',
    payment_status VARCHAR(50) DEFAULT 'Paid' CHECK (payment_status IN ('Pending', 'Paid', 'Partial', 'Refunded')),
    cashier_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sales transaction items
CREATE TABLE sales_transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES sales_transactions(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES inventory(id),
    medicine_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100),
    quantity_sold INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_positive_quantity_sold CHECK (quantity_sold > 0),
    CONSTRAINT check_positive_unit_price CHECK (unit_price > 0)
);

-- ============================================================================
-- NOTIFICATIONS AND ALERTS
-- ============================================================================

-- System notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Low Stock', 'Expiry Alert', 'Rare Medicine', 'Prescription', 'System', 'Payment')),
    priority VARCHAR(20) DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High', 'Critical')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional structured data
    read_status BOOLEAN DEFAULT false,
    action_required BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- TRANSLATION CACHE
-- ============================================================================

-- Translation cache for multi-language support
CREATE TABLE translation_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_text TEXT NOT NULL,
    source_language VARCHAR(10) NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    translated_text TEXT NOT NULL,
    context VARCHAR(100), -- 'medicine', 'instruction', 'general'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique translation per language pair and context
    UNIQUE(source_text, source_language, target_language, context)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Inventory indexes
CREATE INDEX idx_inventory_pharmacy_medicine ON inventory(pharmacy_id, medicine_id);
CREATE INDEX idx_inventory_expiry_date ON inventory(expiry_date);
CREATE INDEX idx_inventory_low_stock ON inventory(pharmacy_id, quantity_available, minimum_threshold);

-- Prescription indexes
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_pharmacy ON prescriptions(pharmacy_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescriptions_date ON prescriptions(prescription_date);

-- Sales indexes
CREATE INDEX idx_sales_pharmacy_date ON sales_transactions(pharmacy_id, transaction_date);
CREATE INDEX idx_sales_patient ON sales_transactions(patient_id);

-- Notification indexes
CREATE INDEX idx_notifications_pharmacy_unread ON notifications(pharmacy_id, read_status);
CREATE INDEX idx_notifications_type_priority ON notifications(type, priority);

-- Medicine search indexes
CREATE INDEX idx_medicines_name ON medicines USING gin(name gin_trgm_ops);
CREATE INDEX idx_medicines_generic ON medicines USING gin(generic_name gin_trgm_ops);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply timestamp triggers
CREATE TRIGGER update_pharmacies_updated_at BEFORE UPDATE ON pharmacies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- ============================================================================

-- Function to check low stock items
CREATE OR REPLACE FUNCTION get_low_stock_items(p_pharmacy_id UUID)
RETURNS TABLE(
    medicine_name VARCHAR,
    current_stock INTEGER,
    minimum_threshold INTEGER,
    shortage INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.name,
        i.quantity_available,
        i.minimum_threshold,
        (i.minimum_threshold - i.quantity_available) as shortage
    FROM inventory i
    JOIN medicines m ON i.medicine_id = m.id
    WHERE i.pharmacy_id = p_pharmacy_id 
    AND i.quantity_available < i.minimum_threshold
    ORDER BY shortage DESC;
END;
$$ LANGUAGE plpgsql;
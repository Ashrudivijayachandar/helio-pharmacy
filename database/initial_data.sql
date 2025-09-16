-- Initial data for Pharmacy Management System
-- Sample data for development and testing

-- ============================================================================
-- SAMPLE PHARMACY DATA
-- ============================================================================

INSERT INTO pharmacies (id, name, license_number, address, phone, email, owner_name, gst_number) VALUES
(
    uuid_generate_v4(),
    'HealthCare Pharmacy',
    'PH-12345-2024',
    '123 Main Street, Medical Complex, City - 110001',
    '+91-9876543210',
    'healthcare@pharmacy.com',
    'Dr. Rajesh Kumar',
    '07AAACH7409R1Z5'
),
(
    uuid_generate_v4(),
    'MediPlus Store',
    'PH-67890-2024',
    '456 Healthcare Avenue, Shopping Mall, City - 110002',
    '+91-9876543211',
    'mediplus@store.com',
    'Priya Sharma',
    '07BBDCH7409R1Z6'
);

-- ============================================================================
-- SAMPLE MEDICINE DATA
-- ============================================================================

INSERT INTO medicines (name, generic_name, brand_name, manufacturer, composition, strength, dosage_form, therapeutic_class, prescription_required) VALUES
-- Common medicines
('Paracetamol', 'Paracetamol', 'Crocin', 'GSK Pharmaceuticals', 'Paracetamol 500mg', '500mg', 'Tablet', 'Analgesic, Antipyretic', false),
('Amoxicillin', 'Amoxicillin', 'Amoxil', 'Cipla Ltd', 'Amoxicillin 500mg', '500mg', 'Capsule', 'Antibiotic', true),
('Omeprazole', 'Omeprazole', 'Prilosec', 'Dr. Reddy''s', 'Omeprazole 20mg', '20mg', 'Capsule', 'Proton Pump Inhibitor', true),
('Metformin', 'Metformin HCl', 'Glucophage', 'Sun Pharma', 'Metformin HCl 500mg', '500mg', 'Tablet', 'Antidiabetic', true),
('Amlodipine', 'Amlodipine Besylate', 'Norvasc', 'Lupin Ltd', 'Amlodipine 5mg', '5mg', 'Tablet', 'Calcium Channel Blocker', true),

-- Indian Ayurvedic medicines
('Chyawanprash', 'Chyawanprash', 'Dabur Chyawanprash', 'Dabur India', 'Herbal Immunity Booster', '500g', 'Paste', 'Immunity Booster', false),
('Triphala Churna', 'Triphala', 'Patanjali Triphala', 'Patanjali Ayurved', 'Triphala Powder', '100g', 'Powder', 'Digestive', false),
('Ashwagandha', 'Withania Somnifera', 'Himalaya Ashwagandha', 'Himalaya Drug Company', 'Ashwagandha Extract 250mg', '250mg', 'Tablet', 'Adaptogen', false),

-- Emergency medicines
('Insulin', 'Human Insulin', 'Humulin', 'Eli Lilly', 'Human Insulin 100IU/ml', '100IU/ml', 'Injection', 'Antidiabetic', true),
('Salbutamol', 'Salbutamol Sulfate', 'Ventolin', 'GSK Pharmaceuticals', 'Salbutamol 100mcg', '100mcg', 'Inhaler', 'Bronchodilator', true),
('Diclofenac', 'Diclofenac Sodium', 'Voveran', 'Novartis', 'Diclofenac 50mg', '50mg', 'Tablet', 'NSAID', true),

-- Rare medicines
('Rituximab', 'Rituximab', 'MabThera', 'Roche', 'Rituximab 500mg/50ml', '500mg/50ml', 'Injection', 'Monoclonal Antibody', true),
('Adalimumab', 'Adalimumab', 'Humira', 'AbbVie', 'Adalimumab 40mg/0.8ml', '40mg/0.8ml', 'Injection', 'TNF Inhibitor', true);

-- ============================================================================
-- SAMPLE PATIENTS DATA
-- ============================================================================

INSERT INTO patients (first_name, last_name, phone, email, date_of_birth, gender, address, preferred_language, allergies, medical_conditions) VALUES
('Amit', 'Singh', '+91-9876543201', 'amit.singh@email.com', '1985-06-15', 'Male', 'Sector 15, Gurgaon, Haryana', 'Hindi', 'Penicillin', 'Diabetes Type 2'),
('Priya', 'Gupta', '+91-9876543202', 'priya.gupta@email.com', '1992-03-22', 'Female', 'Lajpat Nagar, New Delhi', 'English', NULL, 'Hypertension'),
('Rajesh', 'Kumar', '+91-9876543203', 'rajesh.kumar@email.com', '1978-11-08', 'Male', 'Model Town, Ludhiana, Punjab', 'Punjabi', 'Sulfa drugs', 'Asthma'),
('Sunita', 'Sharma', '+91-9876543204', 'sunita.sharma@email.com', '1988-09-12', 'Female', 'Civil Lines, Jaipur, Rajasthan', 'Hindi', NULL, NULL),
('Mohammed', 'Ali', '+91-9876543205', 'mohammed.ali@email.com', '1995-01-25', 'Male', 'Karol Bagh, New Delhi', 'English', NULL, NULL);

-- ============================================================================
-- SAMPLE INVENTORY DATA
-- ============================================================================

-- Get pharmacy IDs for inventory
DO $$
DECLARE
    pharmacy1_id UUID;
    pharmacy2_id UUID;
    medicine_ids UUID[];
BEGIN
    -- Get pharmacy IDs
    SELECT id INTO pharmacy1_id FROM pharmacies WHERE name = 'HealthCare Pharmacy' LIMIT 1;
    SELECT id INTO pharmacy2_id FROM pharmacies WHERE name = 'MediPlus Store' LIMIT 1;
    
    -- Get medicine IDs
    SELECT array_agg(id) INTO medicine_ids FROM medicines LIMIT 10;
    
    -- Insert inventory for first pharmacy
    INSERT INTO inventory (pharmacy_id, medicine_id, batch_number, manufacture_date, expiry_date, quantity_available, minimum_threshold, unit_price, mrp, supplier_name, purchase_date) 
    SELECT 
        pharmacy1_id,
        id,
        'BATCH' || LPAD((ROW_NUMBER() OVER())::text, 4, '0') || '2024',
        CURRENT_DATE - INTERVAL '6 months',
        CURRENT_DATE + INTERVAL '18 months',
        CASE 
            WHEN name LIKE '%Insulin%' OR name LIKE '%Rituximab%' THEN 5  -- Low stock for expensive medicines
            WHEN name LIKE '%Paracetamol%' THEN 500  -- High stock for common medicines
            ELSE 50 + (RANDOM() * 200)::INTEGER
        END,
        CASE 
            WHEN name LIKE '%Insulin%' OR name LIKE '%Rituximab%' THEN 2
            WHEN name LIKE '%Paracetamol%' THEN 100
            ELSE 10
        END,
        CASE 
            WHEN name LIKE '%Rituximab%' THEN 45000.00
            WHEN name LIKE '%Insulin%' THEN 350.00
            WHEN name LIKE '%Paracetamol%' THEN 1.50
            ELSE 10.00 + (RANDOM() * 500)
        END,
        CASE 
            WHEN name LIKE '%Rituximab%' THEN 50000.00
            WHEN name LIKE '%Insulin%' THEN 400.00
            WHEN name LIKE '%Paracetamol%' THEN 2.00
            ELSE 15.00 + (RANDOM() * 600)
        END,
        CASE (RANDOM() * 3)::INTEGER
            WHEN 0 THEN 'MediSupply Co.'
            WHEN 1 THEN 'PharmaDist Ltd.'
            ELSE 'HealthWholesale Inc.'
        END,
        CURRENT_DATE - (RANDOM() * 180)::INTEGER
    FROM medicines;
    
    -- Insert some inventory for second pharmacy (smaller quantities)
    INSERT INTO inventory (pharmacy_id, medicine_id, batch_number, manufacture_date, expiry_date, quantity_available, minimum_threshold, unit_price, mrp, supplier_name, purchase_date) 
    SELECT 
        pharmacy2_id,
        id,
        'MP' || LPAD((ROW_NUMBER() OVER())::text, 4, '0') || '2024',
        CURRENT_DATE - INTERVAL '4 months',
        CURRENT_DATE + INTERVAL '20 months',
        CASE 
            WHEN name LIKE '%Rituximab%' THEN 2  -- Very low stock for rare medicines
            WHEN name LIKE '%Paracetamol%' THEN 200
            ELSE 25 + (RANDOM() * 100)::INTEGER
        END,
        CASE 
            WHEN name LIKE '%Rituximab%' THEN 1
            WHEN name LIKE '%Paracetamol%' THEN 50
            ELSE 5
        END,
        CASE 
            WHEN name LIKE '%Rituximab%' THEN 44000.00
            WHEN name LIKE '%Insulin%' THEN 340.00
            WHEN name LIKE '%Paracetamol%' THEN 1.45
            ELSE 9.50 + (RANDOM() * 480)
        END,
        CASE 
            WHEN name LIKE '%Rituximab%' THEN 49000.00
            WHEN name LIKE '%Insulin%' THEN 390.00
            WHEN name LIKE '%Paracetamol%' THEN 1.95
            ELSE 14.50 + (RANDOM() * 580)
        END,
        'Regional Distributor',
        CURRENT_DATE - (RANDOM() * 120)::INTEGER
    FROM medicines 
    WHERE name NOT LIKE '%Adalimumab%'  -- This pharmacy doesn't have Adalimumab
    LIMIT 8;
END $$;

-- ============================================================================
-- SAMPLE PRESCRIPTIONS
-- ============================================================================

-- Insert sample prescriptions
DO $$
DECLARE
    patient_ids UUID[];
    pharmacy_id UUID;
    prescription_id UUID;
BEGIN
    -- Get patient IDs
    SELECT array_agg(id) INTO patient_ids FROM patients LIMIT 3;
    SELECT id INTO pharmacy_id FROM pharmacies WHERE name = 'HealthCare Pharmacy' LIMIT 1;
    
    -- Insert prescriptions
    INSERT INTO prescriptions (patient_id, pharmacy_id, doctor_name, doctor_license, prescription_date, prescription_number, diagnosis, status, notes)
    VALUES 
    (
        patient_ids[1], 
        pharmacy_id, 
        'Dr. Anil Sharma', 
        'MH-12345', 
        CURRENT_DATE, 
        'RX' || EXTRACT(year FROM CURRENT_DATE) || '001',
        'Type 2 Diabetes Mellitus, Hypertension',
        'Processing',
        'Patient has medication allergies - check before dispensing'
    ),
    (
        patient_ids[2], 
        pharmacy_id, 
        'Dr. Sunita Patel', 
        'DL-67890', 
        CURRENT_DATE - 1, 
        'RX' || EXTRACT(year FROM CURRENT_DATE) || '002',
        'Acute Respiratory Infection',
        'Ready',
        'Follow up required after 5 days'
    ),
    (
        patient_ids[3], 
        pharmacy_id, 
        'Dr. Ramesh Gupta', 
        'PB-11223', 
        CURRENT_DATE - 2, 
        'RX' || EXTRACT(year FROM CURRENT_DATE) || '003',
        'Chronic Asthma',
        'Dispensed',
        'Patient counseled on proper inhaler technique'
    );
END $$;

-- Insert prescription items
DO $$
DECLARE
    prescription_ids UUID[];
    medicine_metformin UUID;
    medicine_amlodipine UUID;
    medicine_amoxicillin UUID;
    medicine_salbutamol UUID;
BEGIN
    -- Get prescription IDs
    SELECT array_agg(id) INTO prescription_ids FROM prescriptions ORDER BY created_at LIMIT 3;
    
    -- Get specific medicine IDs
    SELECT id INTO medicine_metformin FROM medicines WHERE name = 'Metformin' LIMIT 1;
    SELECT id INTO medicine_amlodipine FROM medicines WHERE name = 'Amlodipine' LIMIT 1;
    SELECT id INTO medicine_amoxicillin FROM medicines WHERE name = 'Amoxicillin' LIMIT 1;
    SELECT id INTO medicine_salbutamol FROM medicines WHERE name = 'Salbutamol' LIMIT 1;
    
    -- Prescription 1 items (Diabetes + Hypertension)
    INSERT INTO prescription_items (prescription_id, medicine_id, quantity_prescribed, dosage_instructions, frequency, duration, substitute_allowed, status)
    VALUES 
    (prescription_ids[1], medicine_metformin, 60, 'Take 1 tablet twice daily after meals', 'Twice daily', '30 days', true, 'Available'),
    (prescription_ids[1], medicine_amlodipine, 30, 'Take 1 tablet once daily in the morning', 'Once daily', '30 days', true, 'Available');
    
    -- Prescription 2 items (Respiratory infection)
    INSERT INTO prescription_items (prescription_id, medicine_id, quantity_prescribed, dosage_instructions, frequency, duration, substitute_allowed, status)
    VALUES 
    (prescription_ids[2], medicine_amoxicillin, 21, 'Take 1 capsule three times daily for 7 days', 'Three times daily', '7 days', false, 'Reserved');
    
    -- Prescription 3 items (Asthma)
    INSERT INTO prescription_items (prescription_id, medicine_id, quantity_prescribed, dosage_instructions, frequency, duration, substitute_allowed, status)
    VALUES 
    (prescription_ids[3], medicine_salbutamol, 2, 'Use 2 puffs when needed for breathing difficulty', 'As needed', '3 months', false, 'Dispensed');
END $$;

-- ============================================================================
-- SAMPLE RARE MEDICINE REQUESTS
-- ============================================================================

DO $$
DECLARE
    patient_ids UUID[];
    pharmacy_ids UUID[];
BEGIN
    SELECT array_agg(id) INTO patient_ids FROM patients LIMIT 2;
    SELECT array_agg(id) INTO pharmacy_ids FROM pharmacies;
    
    -- Insert rare medicine requests
    INSERT INTO rare_medicine_requests (patient_id, medicine_name, generic_name, strength, manufacturer, quantity_needed, urgency_level, doctor_prescription, patient_notes, status)
    VALUES 
    (
        patient_ids[1], 
        'Rituximab', 
        'Rituximab', 
        '500mg/50ml', 
        'Roche', 
        4, 
        'High', 
        'Dr. Oncology Specialist prescribed for lymphoma treatment',
        'Urgent requirement for cancer treatment. Insurance approved.',
        'Pending'
    ),
    (
        patient_ids[2], 
        'Adalimumab', 
        'Adalimumab', 
        '40mg/0.8ml', 
        'AbbVie', 
        2, 
        'High', 
        'Rheumatologist prescribed for rheumatoid arthritis',
        'Patient has severe joint pain. Need immediate relief.',
        'Accepted'
    );
    
    -- Insert pharmacy response
    INSERT INTO rare_medicine_responses (request_id, pharmacy_id, status, estimated_availability_date, estimated_price, pharmacy_notes, contact_person, contact_phone)
    SELECT 
        r.id, 
        pharmacy_ids[1], 
        'Accepted', 
        CURRENT_DATE + 3, 
        200000.00, 
        'We can arrange this medicine in 3 days. Special order required.',
        'Mr. Rajesh Kumar',
        '+91-9876543210'
    FROM rare_medicine_requests r 
    WHERE r.medicine_name = 'Adalimumab';
END $$;

-- ============================================================================
-- SAMPLE NOTIFICATIONS
-- ============================================================================

DO $$
DECLARE
    pharmacy_id UUID;
BEGIN
    SELECT id INTO pharmacy_id FROM pharmacies WHERE name = 'HealthCare Pharmacy' LIMIT 1;
    
    INSERT INTO notifications (pharmacy_id, type, priority, title, message, action_required)
    VALUES 
    (
        pharmacy_id, 
        'Low Stock', 
        'High', 
        'Critical Stock Alert: Insulin',
        'Insulin stock is critically low (5 units remaining). Minimum threshold: 2 units. Please reorder immediately.',
        true
    ),
    (
        pharmacy_id, 
        'Expiry Alert', 
        'Normal', 
        'Medicines Expiring Soon',
        '3 medicines are expiring within next 30 days. Check expiry report for details.',
        true
    ),
    (
        pharmacy_id, 
        'Rare Medicine', 
        'High', 
        'New Rare Medicine Request',
        'Patient Amit Singh has requested Rituximab for cancer treatment. Review request urgently.',
        true
    ),
    (
        pharmacy_id, 
        'Prescription', 
        'Normal', 
        'New Prescription Received',
        'Prescription RX2024002 from Dr. Sunita Patel is ready for processing.',
        false
    );
END $$;

-- ============================================================================
-- UPDATE STATISTICS AND CONSTRAINTS
-- ============================================================================

-- Update prescription totals
UPDATE prescriptions SET total_amount = (
    SELECT COALESCE(SUM(pi.quantity_prescribed * i.unit_price), 0)
    FROM prescription_items pi
    LEFT JOIN inventory i ON pi.inventory_id = i.id
    WHERE pi.prescription_id = prescriptions.id
);

-- Analyze tables for better query performance
ANALYZE pharmacies;
ANALYZE medicines;
ANALYZE inventory;
ANALYZE patients;
ANALYZE prescriptions;
ANALYZE prescription_items;
ANALYZE rare_medicine_requests;
ANALYZE notifications;
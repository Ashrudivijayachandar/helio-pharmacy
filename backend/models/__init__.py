"""
SQLAlchemy Models for Pharmacy Management System
Professional medical-grade data models
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db

# Model aliases for route imports
InventoryItem = None  # Will be defined as alias after Inventory class

class BaseModel(db.Model):
    """Base model with common fields"""
    __abstract__ = True
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class Pharmacy(BaseModel):
    """Pharmacy information model"""
    __tablename__ = 'pharmacies'
    
    name = db.Column(db.String(255), nullable=False)
    license_number = db.Column(db.String(100), unique=True, nullable=False)
    address = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(255), unique=True)
    owner_name = db.Column(db.String(255), nullable=False)
    gst_number = db.Column(db.String(50))
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Relationships
    inventory = db.relationship('Inventory', backref='pharmacy', lazy='dynamic', cascade='all, delete-orphan')
    prescriptions = db.relationship('Prescription', backref='pharmacy', lazy='dynamic')
    notifications = db.relationship('Notification', backref='pharmacy', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': str(self.id),
            'name': self.name,
            'license_number': self.license_number,
            'address': self.address,
            'phone': self.phone,
            'email': self.email,
            'owner_name': self.owner_name,
            'gst_number': self.gst_number,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Pharmacy {self.name}>'

class Medicine(BaseModel):
    """Medicine master data model"""
    __tablename__ = 'medicines'
    
    name = db.Column(db.String(255), nullable=False)
    generic_name = db.Column(db.String(255))
    brand_name = db.Column(db.String(255))
    manufacturer = db.Column(db.String(255))
    composition = db.Column(db.Text)
    strength = db.Column(db.String(100))
    dosage_form = db.Column(db.String(100))  # tablet, capsule, syrup, etc.
    therapeutic_class = db.Column(db.String(255))
    prescription_required = db.Column(db.Boolean, default=True)
    controlled_substance = db.Column(db.Boolean, default=False)
    storage_conditions = db.Column(db.Text)
    category = db.Column(db.String(255))  # Added for route compatibility
    price = db.Column(db.Numeric(10, 2))  # Added for route compatibility
    description = db.Column(db.Text)  # Added for route compatibility
    
    # Relationships
    inventory_items = db.relationship('Inventory', backref='medicine', lazy='dynamic')
    prescription_items = db.relationship('PrescriptionItem', backref='medicine', lazy='dynamic')
    
    # Constraints
    __table_args__ = (
        db.UniqueConstraint('name', 'strength', 'manufacturer', name='unique_medicine'),
    )
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': str(self.id),
            'name': self.name,
            'generic_name': self.generic_name,
            'brand_name': self.brand_name,
            'manufacturer': self.manufacturer,
            'composition': self.composition,
            'strength': self.strength,
            'dosage_form': self.dosage_form,
            'therapeutic_class': self.therapeutic_class,
            'prescription_required': self.prescription_required,
            'controlled_substance': self.controlled_substance,
            'storage_conditions': self.storage_conditions,
            'category': self.category,
            'price': float(self.price) if self.price else None,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Medicine {self.name} {self.strength}>'

class Inventory(BaseModel):
    """Medicine inventory model with batch tracking"""
    __tablename__ = 'inventory'
    
    pharmacy_id = db.Column(UUID(as_uuid=True), db.ForeignKey('pharmacies.id', ondelete='CASCADE'), nullable=False)
    medicine_id = db.Column(UUID(as_uuid=True), db.ForeignKey('medicines.id', ondelete='CASCADE'), nullable=False)
    batch_number = db.Column(db.String(100), nullable=False)
    manufacture_date = db.Column(db.Date, nullable=False)
    expiry_date = db.Column(db.Date, nullable=False)
    quantity_available = db.Column(db.Integer, nullable=False, default=0)
    quantity_reserved = db.Column(db.Integer, nullable=False, default=0)
    minimum_threshold = db.Column(db.Integer, nullable=False, default=10)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    mrp = db.Column(db.Numeric(10, 2), nullable=False)
    supplier_name = db.Column(db.String(255))
    purchase_date = db.Column(db.Date)
    
    # Relationships
    prescription_items = db.relationship('PrescriptionItem', backref='inventory_item', lazy='dynamic')
    transaction_items = db.relationship('SalesTransactionItem', backref='inventory_item', lazy='dynamic')
    
    # Constraints
    __table_args__ = (
        db.CheckConstraint('quantity_available >= 0', name='check_positive_quantity'),
        db.CheckConstraint('quantity_reserved >= 0', name='check_positive_reserved'),
        db.CheckConstraint('expiry_date > manufacture_date', name='check_valid_dates'),
        db.CheckConstraint('unit_price > 0 AND mrp > 0', name='check_positive_prices'),
        db.UniqueConstraint('pharmacy_id', 'medicine_id', 'batch_number', name='unique_batch_per_pharmacy'),
    )
    
    @property
    def is_low_stock(self):
        """Check if item is below minimum threshold"""
        return self.quantity_available < self.minimum_threshold
    
    @property
    def is_expired(self):
        """Check if item is expired"""
        return self.expiry_date < datetime.now().date()
    
    @property
    def days_to_expiry(self):
        """Calculate days until expiry"""
        return (self.expiry_date - datetime.now().date()).days
    
    @property
    def quantity(self):
        """Alias for quantity_available for backward compatibility"""
        return self.quantity_available
    
    @property
    def min_threshold(self):
        """Alias for minimum_threshold for backward compatibility"""
        return self.minimum_threshold
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': str(self.id),
            'pharmacy_id': str(self.pharmacy_id),
            'medicine_id': str(self.medicine_id),
            'batch_number': self.batch_number,
            'manufacture_date': self.manufacture_date.isoformat() if self.manufacture_date else None,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'quantity_available': self.quantity_available,
            'quantity_reserved': self.quantity_reserved,
            'minimum_threshold': self.minimum_threshold,
            'unit_price': float(self.unit_price) if self.unit_price else None,
            'mrp': float(self.mrp) if self.mrp else None,
            'supplier_name': self.supplier_name,
            'purchase_date': self.purchase_date.isoformat() if self.purchase_date else None,
            'is_low_stock': self.is_low_stock,
            'is_expired': self.is_expired,
            'days_to_expiry': self.days_to_expiry,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Inventory {self.medicine.name if self.medicine else "Unknown"} - Batch: {self.batch_number}>'

# Create alias for backward compatibility
InventoryItem = Inventory

class Patient(BaseModel):
    """Patient information model"""
    __tablename__ = 'patients'
    
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), unique=True)
    email = db.Column(db.String(255))
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(10))
    address = db.Column(db.Text)
    emergency_contact = db.Column(db.String(20))
    allergies = db.Column(db.Text)
    medical_conditions = db.Column(db.Text)
    preferred_language = db.Column(db.String(20), default='English')
    
    # Relationships
    prescriptions = db.relationship('Prescription', backref='patient', lazy='dynamic')
    rare_medicine_requests = db.relationship('RareMedicineRequest', backref='patient', lazy='dynamic')
    transactions = db.relationship('SalesTransaction', backref='patient', lazy='dynamic')
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self):
        if self.date_of_birth:
            return (datetime.now().date() - self.date_of_birth).days // 365
        return None
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': str(self.id),
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'phone': self.phone,
            'email': self.email,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'age': self.age,
            'gender': self.gender,
            'address': self.address,
            'emergency_contact': self.emergency_contact,
            'allergies': self.allergies,
            'medical_conditions': self.medical_conditions,
            'preferred_language': self.preferred_language,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Patient {self.full_name}>'

class Prescription(BaseModel):
    """Prescription model"""
    __tablename__ = 'prescriptions'
    
    patient_id = db.Column(UUID(as_uuid=True), db.ForeignKey('patients.id', ondelete='CASCADE'), nullable=False)
    pharmacy_id = db.Column(UUID(as_uuid=True), db.ForeignKey('pharmacies.id'))
    doctor_name = db.Column(db.String(255), nullable=False)
    doctor_license = db.Column(db.String(100))
    prescription_date = db.Column(db.Date, nullable=False)
    prescription_number = db.Column(db.String(100))
    diagnosis = db.Column(db.Text)
    status = db.Column(db.String(50), default='Received')  # Received, Processing, Ready, Dispensed, Cancelled
    total_amount = db.Column(db.Numeric(10, 2), default=0)
    notes = db.Column(db.Text)
    # Add fields for route compatibility
    medicines = db.Column(db.JSON)  # For storing medicine list
    instructions = db.Column(db.Text)  # For storing general instructions
    date_prescribed = db.Column(db.Date)  # Alias for prescription_date
    date_fulfilled = db.Column(db.DateTime(timezone=True))  # When prescription was fulfilled
    
    # Relationships
    items = db.relationship('PrescriptionItem', backref='prescription', lazy='dynamic', cascade='all, delete-orphan')
    transaction = db.relationship('SalesTransaction', backref='prescription', uselist=False)
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': str(self.id),
            'patient_id': str(self.patient_id),
            'pharmacy_id': str(self.pharmacy_id) if self.pharmacy_id else None,
            'doctor_name': self.doctor_name,
            'doctor_license': self.doctor_license,
            'prescription_date': self.prescription_date.isoformat() if self.prescription_date else None,
            'date_prescribed': self.date_prescribed.isoformat() if self.date_prescribed else (self.prescription_date.isoformat() if self.prescription_date else None),
            'prescription_number': self.prescription_number,
            'diagnosis': self.diagnosis,
            'status': self.status,
            'total_amount': float(self.total_amount) if self.total_amount else None,
            'notes': self.notes,
            'medicines': self.medicines,
            'instructions': self.instructions,
            'date_fulfilled': self.date_fulfilled.isoformat() if self.date_fulfilled else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Prescription {self.prescription_number} - {self.status}>'

class PrescriptionItem(BaseModel):
    """Prescription item model"""
    __tablename__ = 'prescription_items'
    
    prescription_id = db.Column(UUID(as_uuid=True), db.ForeignKey('prescriptions.id', ondelete='CASCADE'), nullable=False)
    medicine_id = db.Column(UUID(as_uuid=True), db.ForeignKey('medicines.id'))
    inventory_id = db.Column(UUID(as_uuid=True), db.ForeignKey('inventory.id'))
    quantity_prescribed = db.Column(db.Integer, nullable=False)
    quantity_dispensed = db.Column(db.Integer, default=0)
    dosage_instructions = db.Column(db.Text, nullable=False)
    duration = db.Column(db.String(100))
    frequency = db.Column(db.String(100))
    unit_price = db.Column(db.Numeric(10, 2))
    total_price = db.Column(db.Numeric(10, 2))
    substitute_allowed = db.Column(db.Boolean, default=True)
    status = db.Column(db.String(50), default='Pending')  # Pending, Available, Reserved, Dispensed, Substituted, Unavailable
    
    # Constraints
    __table_args__ = (
        db.CheckConstraint('quantity_prescribed > 0', name='check_positive_prescribed'),
        db.CheckConstraint('quantity_dispensed >= 0 AND quantity_dispensed <= quantity_prescribed', name='check_valid_dispensed'),
    )
    
    def __repr__(self):
        return f'<PrescriptionItem {self.medicine.name if self.medicine else "Unknown"} x{self.quantity_prescribed}>'

class RareMedicineRequest(BaseModel):
    """Rare medicine request model"""
    __tablename__ = 'rare_medicine_requests'
    
    patient_id = db.Column(UUID(as_uuid=True), db.ForeignKey('patients.id', ondelete='CASCADE'), nullable=False)
    medicine_name = db.Column(db.String(255), nullable=False)
    generic_name = db.Column(db.String(255))
    strength = db.Column(db.String(100))
    manufacturer = db.Column(db.String(255))
    quantity_needed = db.Column(db.Integer, nullable=False)
    urgency_level = db.Column(db.String(20), default='Normal')  # Low, Normal, High, Critical
    doctor_prescription = db.Column(db.Text)
    patient_notes = db.Column(db.Text)
    status = db.Column(db.String(50), default='Pending')  # Pending, Accepted, Declined, Fulfilled, Cancelled
    requested_date = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    response_date = db.Column(db.DateTime(timezone=True))
    fulfilled_date = db.Column(db.DateTime(timezone=True))
    # Add fields for route compatibility
    dosage = db.Column(db.String(100))  # Alias for strength
    patient_contact = db.Column(db.String(100))  # Patient contact info
    notes = db.Column(db.Text)  # General notes
    estimated_cost = db.Column(db.Numeric(10, 2))  # Estimated cost
    estimated_delivery = db.Column(db.Date)  # Estimated delivery date
    supplier_info = db.Column(db.Text)  # Supplier information
    date_completed = db.Column(db.DateTime(timezone=True))  # When request was completed
    
    # Relationships
    responses = db.relationship('RareMedicineResponse', backref='request', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': str(self.id),
            'patient_id': str(self.patient_id),
            'medicine_name': self.medicine_name,
            'generic_name': self.generic_name,
            'strength': self.strength,
            'dosage': self.dosage or self.strength,
            'manufacturer': self.manufacturer,
            'quantity_needed': self.quantity_needed,
            'urgency_level': self.urgency_level,
            'doctor_prescription': self.doctor_prescription,
            'patient_notes': self.patient_notes,
            'patient_contact': self.patient_contact,
            'notes': self.notes or self.patient_notes,
            'status': self.status,
            'requested_date': self.requested_date.isoformat() if self.requested_date else None,
            'response_date': self.response_date.isoformat() if self.response_date else None,
            'fulfilled_date': self.fulfilled_date.isoformat() if self.fulfilled_date else None,
            'date_completed': self.date_completed.isoformat() if self.date_completed else None,
            'estimated_cost': float(self.estimated_cost) if self.estimated_cost else None,
            'estimated_delivery': self.estimated_delivery.isoformat() if self.estimated_delivery else None,
            'supplier_info': self.supplier_info,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<RareMedicineRequest {self.medicine_name} - {self.status}>'

class RareMedicineResponse(BaseModel):
    """Pharmacy response to rare medicine request"""
    __tablename__ = 'rare_medicine_responses'
    
    request_id = db.Column(UUID(as_uuid=True), db.ForeignKey('rare_medicine_requests.id', ondelete='CASCADE'), nullable=False)
    pharmacy_id = db.Column(UUID(as_uuid=True), db.ForeignKey('pharmacies.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String(50), nullable=False)  # Accepted, Declined
    estimated_availability_date = db.Column(db.Date)
    estimated_price = db.Column(db.Numeric(10, 2))
    pharmacy_notes = db.Column(db.Text)
    contact_person = db.Column(db.String(255))
    contact_phone = db.Column(db.String(20))
    
    # Constraints
    __table_args__ = (
        db.UniqueConstraint('request_id', 'pharmacy_id', name='unique_response_per_pharmacy'),
    )
    
    def __repr__(self):
        return f'<RareMedicineResponse {self.status} - {self.pharmacy.name if self.pharmacy else "Unknown"}>'

class SalesTransaction(BaseModel):
    """Sales transaction model"""
    __tablename__ = 'sales_transactions'
    
    pharmacy_id = db.Column(UUID(as_uuid=True), db.ForeignKey('pharmacies.id', ondelete='CASCADE'), nullable=False)
    patient_id = db.Column(UUID(as_uuid=True), db.ForeignKey('patients.id'))
    prescription_id = db.Column(UUID(as_uuid=True), db.ForeignKey('prescriptions.id'))
    transaction_number = db.Column(db.String(100), unique=True, nullable=False)
    transaction_date = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    tax_amount = db.Column(db.Numeric(10, 2), default=0)
    discount_amount = db.Column(db.Numeric(10, 2), default=0)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(50), default='Cash')
    payment_status = db.Column(db.String(50), default='Paid')  # Pending, Paid, Partial, Refunded
    cashier_name = db.Column(db.String(255))
    notes = db.Column(db.Text)
    
    # Relationships
    items = db.relationship('SalesTransactionItem', backref='transaction', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<SalesTransaction {self.transaction_number} - ₹{self.total_amount}>'

class SalesTransactionItem(BaseModel):
    """Sales transaction item model"""
    __tablename__ = 'sales_transaction_items'
    
    transaction_id = db.Column(UUID(as_uuid=True), db.ForeignKey('sales_transactions.id', ondelete='CASCADE'), nullable=False)
    inventory_id = db.Column(UUID(as_uuid=True), db.ForeignKey('inventory.id'))
    medicine_name = db.Column(db.String(255), nullable=False)
    batch_number = db.Column(db.String(100))
    quantity_sold = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Constraints
    __table_args__ = (
        db.CheckConstraint('quantity_sold > 0', name='check_positive_quantity_sold'),
        db.CheckConstraint('unit_price > 0', name='check_positive_unit_price'),
    )
    
    def __repr__(self):
        return f'<SalesTransactionItem {self.medicine_name} x{self.quantity_sold}>'

class Notification(BaseModel):
    """Notification model"""
    __tablename__ = 'notifications'
    
    pharmacy_id = db.Column(UUID(as_uuid=True), db.ForeignKey('pharmacies.id', ondelete='CASCADE'), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # Low Stock, Expiry Alert, Rare Medicine, Prescription, System, Payment
    priority = db.Column(db.String(20), default='Normal')  # Low, Normal, High, Critical
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    data = db.Column(db.JSON)  # Additional structured data
    read_status = db.Column(db.Boolean, default=False)
    action_required = db.Column(db.Boolean, default=False)
    expires_at = db.Column(db.DateTime(timezone=True))
    read_at = db.Column(db.DateTime(timezone=True))
    # Add fields for route compatibility
    user_id = db.Column(UUID(as_uuid=True))  # For user-specific notifications
    notification_type = db.Column(db.String(50))  # Alias for type
    is_read = db.Column(db.Boolean, default=False)  # Alias for read_status
    
    def mark_as_read(self):
        """Mark notification as read"""
        self.read_status = True
        self.is_read = True
        self.read_at = datetime.utcnow()
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': str(self.id),
            'pharmacy_id': str(self.pharmacy_id) if self.pharmacy_id else None,
            'user_id': str(self.user_id) if self.user_id else str(self.pharmacy_id) if self.pharmacy_id else None,
            'type': self.type,
            'notification_type': self.notification_type or self.type,
            'priority': self.priority,
            'title': self.title,
            'message': self.message,
            'data': self.data,
            'read_status': self.read_status,
            'is_read': self.is_read or self.read_status,
            'action_required': self.action_required,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'read_at': self.read_at.isoformat() if self.read_at else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Notification {self.type} - {self.title}>'

class TranslationCache(BaseModel):
    """Translation cache model for multi-language support"""
    __tablename__ = 'translation_cache'
    
    source_text = db.Column(db.Text, nullable=False)
    source_language = db.Column(db.String(10), nullable=False)
    target_language = db.Column(db.String(10), nullable=False)
    translated_text = db.Column(db.Text, nullable=False)
    context = db.Column(db.String(100))  # medicine, instruction, general
    
    # Constraints
    __table_args__ = (
        db.UniqueConstraint('source_text', 'source_language', 'target_language', 'context', name='unique_translation'),
    )
    
    def __repr__(self):
        return f'<Translation {self.source_language}->{self.target_language}: {self.source_text[:50]}>'
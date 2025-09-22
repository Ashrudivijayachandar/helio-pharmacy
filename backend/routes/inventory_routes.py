"""
Inventory management routes for Pharmacy Management System
Professional inventory tracking with batch management
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError, validate
from datetime import datetime, date
from sqlalchemy import func, and_, or_

from extensions import db
from models import Inventory, Medicine, Pharmacy, Notification

inventory_bp = Blueprint('inventory', __name__)

class InventorySchema(Schema):
    """Schema for inventory validation"""
    medicine_id = fields.UUID(required=True)
    batch_number = fields.Str(required=True, validate=lambda x: len(x) >= 3)
    manufacture_date = fields.Date(required=True)
    expiry_date = fields.Date(required=True)
    quantity_available = fields.Int(required=True, validate=validate.Range(min=0))
    minimum_threshold = fields.Int(required=True, validate=validate.Range(min=1))
    unit_price = fields.Decimal(required=True, validate=validate.Range(min=0.01))
    mrp = fields.Decimal(required=True, validate=validate.Range(min=0.01))
    supplier_name = fields.Str(allow_none=True)
    purchase_date = fields.Date(allow_none=True)

class InventoryUpdateSchema(Schema):
    """Schema for inventory updates"""
    quantity_available = fields.Int(validate=validate.Range(min=0))
    minimum_threshold = fields.Int(validate=validate.Range(min=1))
    unit_price = fields.Decimal(validate=validate.Range(min=0.01))
    mrp = fields.Decimal(validate=validate.Range(min=0.01))
    supplier_name = fields.Str(allow_none=True)

@inventory_bp.route('/', methods=['GET'])
@jwt_required()
def get_inventory():
    """
    Get pharmacy inventory with filtering and pagination
    
    Query Parameters:
    - page: Page number (default: 1)
    - per_page: Items per page (default: 20, max: 100)
    - medicine_name: Filter by medicine name (partial match)
    - low_stock: Filter low stock items (true/false)
    - expiry_days: Filter items expiring within X days
    - batch_number: Filter by batch number
    """
    current_pharmacy_id = get_jwt_identity()
    
    # Parse query parameters
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    medicine_name = request.args.get('medicine_name', '').strip()
    low_stock = request.args.get('low_stock', '').lower() == 'true'
    expiry_days = request.args.get('expiry_days', type=int)
    batch_number = request.args.get('batch_number', '').strip()
    
    # Build query
    query = db.session.query(Inventory).join(Medicine).filter(
        Inventory.pharmacy_id == current_pharmacy_id
    )
    
    # Apply filters
    if medicine_name:
        query = query.filter(Medicine.name.ilike(f'%{medicine_name}%'))
    
    if low_stock:
        query = query.filter(Inventory.quantity_available < Inventory.minimum_threshold)
    
    if expiry_days is not None:
        expiry_date = datetime.now().date()
        if expiry_days > 0:
            from datetime import timedelta
            expiry_date = datetime.now().date() + timedelta(days=expiry_days)
        query = query.filter(Inventory.expiry_date <= expiry_date)
    
    if batch_number:
        query = query.filter(Inventory.batch_number.ilike(f'%{batch_number}%'))
    
    # Execute query with pagination
    inventory_items = query.order_by(Medicine.name, Inventory.expiry_date).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    # Format response
    items = []
    for item in inventory_items.items:
        items.append({
            'id': str(item.id),
            'medicine': {
                'id': str(item.medicine.id),
                'name': item.medicine.name,
                'generic_name': item.medicine.generic_name,
                'brand_name': item.medicine.brand_name,
                'strength': item.medicine.strength,
                'dosage_form': item.medicine.dosage_form
            },
            'batch_number': item.batch_number,
            'manufacture_date': item.manufacture_date.isoformat() if item.manufacture_date else None,
            'expiry_date': item.expiry_date.isoformat() if item.expiry_date else None,
            'quantity_available': item.quantity_available,
            'quantity_reserved': item.quantity_reserved,
            'minimum_threshold': item.minimum_threshold,
            'unit_price': float(item.unit_price),
            'mrp': float(item.mrp),
            'supplier_name': item.supplier_name,
            'purchase_date': item.purchase_date.isoformat() if item.purchase_date else None,
            'is_low_stock': item.is_low_stock,
            'is_expired': item.is_expired,
            'days_to_expiry': item.days_to_expiry,
            'created_at': item.created_at.isoformat() if item.created_at else None,
            'updated_at': item.updated_at.isoformat() if item.updated_at else None
        })
    
    return jsonify({
        'inventory': items,
        'pagination': {
            'page': inventory_items.page,
            'pages': inventory_items.pages,
            'per_page': inventory_items.per_page,
            'total': inventory_items.total,
            'has_next': inventory_items.has_next,
            'has_prev': inventory_items.has_prev
        },
        'status_code': 200
    })

@inventory_bp.route('/', methods=['POST'])
@jwt_required()
def add_inventory():
    """
    Add new inventory item
    
    Request Body:
    {
        "medicine_id": "uuid",
        "batch_number": "BATCH001",
        "manufacture_date": "2024-01-15",
        "expiry_date": "2026-01-15",
        "quantity_available": 100,
        "minimum_threshold": 10,
        "unit_price": 25.50,
        "mrp": 30.00,
        "supplier_name": "Medical Supplies Co.",
        "purchase_date": "2024-09-15"
    }
    """
    current_pharmacy_id = get_jwt_identity()
    
    try:
        schema = InventorySchema()
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({
            'error': 'Validation Error',
            'messages': err.messages,
            'status_code': 400
        }), 400
    
    # Validate dates
    if data['expiry_date'] <= data['manufacture_date']:
        return jsonify({
            'error': 'Validation Error',
            'message': 'Expiry date must be after manufacture date.',
            'status_code': 400
        }), 400
    
    # Check if medicine exists
    medicine = Medicine.query.get(data['medicine_id'])
    if not medicine:
        return jsonify({
            'error': 'Not Found',
            'message': 'Medicine not found.',
            'status_code': 404
        }), 404
    
    # Check if batch already exists for this pharmacy and medicine
    existing_batch = Inventory.query.filter_by(
        pharmacy_id=current_pharmacy_id,
        medicine_id=data['medicine_id'],
        batch_number=data['batch_number']
    ).first()
    
    if existing_batch:
        return jsonify({
            'error': 'Duplicate Entry',
            'message': f'Batch {data["batch_number"]} already exists for this medicine.',
            'status_code': 409
        }), 409
    
    try:
        # Create inventory item
        inventory_item = Inventory(
            pharmacy_id=current_pharmacy_id,
            medicine_id=data['medicine_id'],
            batch_number=data['batch_number'],
            manufacture_date=data['manufacture_date'],
            expiry_date=data['expiry_date'],
            quantity_available=data['quantity_available'],
            minimum_threshold=data['minimum_threshold'],
            unit_price=data['unit_price'],
            mrp=data['mrp'],
            supplier_name=data.get('supplier_name'),
            purchase_date=data.get('purchase_date', datetime.now().date())
        )
        
        db.session.add(inventory_item)
        db.session.commit()
        
        # Check if low stock notification needed
        if inventory_item.is_low_stock:
            create_low_stock_notification(current_pharmacy_id, inventory_item)
        
        return jsonify({
            'message': 'Inventory item added successfully',
            'inventory_item': {
                'id': str(inventory_item.id),
                'medicine_name': medicine.name,
                'batch_number': inventory_item.batch_number,
                'quantity_available': inventory_item.quantity_available,
                'minimum_threshold': inventory_item.minimum_threshold
            },
            'status_code': 201
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Creation Failed',
            'message': 'An error occurred while adding the inventory item.',
            'status_code': 500
        }), 500

@inventory_bp.route('/<inventory_id>', methods=['PUT'])
@jwt_required()
def update_inventory(inventory_id):
    """
    Update inventory item
    
    Request Body:
    {
        "quantity_available": 150,
        "minimum_threshold": 15,
        "unit_price": 26.00,
        "mrp": 32.00,
        "supplier_name": "New Supplier"
    }
    """
    current_pharmacy_id = get_jwt_identity()
    
    try:
        schema = InventoryUpdateSchema()
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({
            'error': 'Validation Error',
            'messages': err.messages,
            'status_code': 400
        }), 400
    
    # Find inventory item
    inventory_item = Inventory.query.filter_by(
        id=inventory_id,
        pharmacy_id=current_pharmacy_id
    ).first()
    
    if not inventory_item:
        return jsonify({
            'error': 'Not Found',
            'message': 'Inventory item not found.',
            'status_code': 404
        }), 404
    
    try:
        # Update fields
        old_quantity = inventory_item.quantity_available
        
        for field, value in data.items():
            if value is not None:
                setattr(inventory_item, field, value)
        
        db.session.commit()
        
        # Check for notifications
        if inventory_item.is_low_stock and old_quantity >= inventory_item.minimum_threshold:
            create_low_stock_notification(current_pharmacy_id, inventory_item)
        
        return jsonify({
            'message': 'Inventory item updated successfully',
            'inventory_item': {
                'id': str(inventory_item.id),
                'medicine_name': inventory_item.medicine.name,
                'quantity_available': inventory_item.quantity_available,
                'minimum_threshold': inventory_item.minimum_threshold,
                'is_low_stock': inventory_item.is_low_stock
            },
            'status_code': 200
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Update Failed',
            'message': 'An error occurred while updating the inventory item.',
            'status_code': 500
        }), 500

@inventory_bp.route('/<inventory_id>', methods=['DELETE'])
@jwt_required()
def delete_inventory(inventory_id):
    """
    Delete inventory item
    """
    current_pharmacy_id = get_jwt_identity()
    
    # Find inventory item
    inventory_item = Inventory.query.filter_by(
        id=inventory_id,
        pharmacy_id=current_pharmacy_id
    ).first()
    
    if not inventory_item:
        return jsonify({
            'error': 'Not Found',
            'message': 'Inventory item not found.',
            'status_code': 404
        }), 404
    
    # Check if item has reserved quantity or is linked to prescriptions
    if inventory_item.quantity_reserved > 0:
        return jsonify({
            'error': 'Cannot Delete',
            'message': 'Cannot delete inventory item with reserved quantity.',
            'status_code': 409
        }), 409
    
    try:
        medicine_name = inventory_item.medicine.name
        batch_number = inventory_item.batch_number
        
        db.session.delete(inventory_item)
        db.session.commit()
        
        return jsonify({
            'message': f'Inventory item {medicine_name} (Batch: {batch_number}) deleted successfully',
            'status_code': 200
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Deletion Failed',
            'message': 'An error occurred while deleting the inventory item.',
            'status_code': 500
        }), 500

@inventory_bp.route('/low-stock', methods=['GET'])
@jwt_required()
def get_low_stock_items():
    """
    Get all low stock items for the pharmacy
    """
    current_pharmacy_id = get_jwt_identity()
    
    low_stock_items = db.session.query(Inventory).join(Medicine).filter(
        and_(
            Inventory.pharmacy_id == current_pharmacy_id,
            Inventory.quantity_available < Inventory.minimum_threshold
        )
    ).order_by(
        func.greatest(0, Inventory.minimum_threshold - Inventory.quantity_available).desc(),
        Medicine.name
    ).all()
    
    items = []
    for item in low_stock_items:
        shortage = max(0, item.minimum_threshold - item.quantity_available)
        items.append({
            'id': str(item.id),
            'medicine': {
                'id': str(item.medicine.id),
                'name': item.medicine.name,
                'strength': item.medicine.strength,
                'dosage_form': item.medicine.dosage_form
            },
            'batch_number': item.batch_number,
            'quantity_available': item.quantity_available,
            'minimum_threshold': item.minimum_threshold,
            'shortage': shortage,
            'unit_price': float(item.unit_price),
            'mrp': float(item.mrp),
            'expiry_date': item.expiry_date.isoformat() if item.expiry_date else None,
            'days_to_expiry': item.days_to_expiry
        })
    
    return jsonify({
        'low_stock_items': items,
        'total_items': len(items),
        'status_code': 200
    })

@inventory_bp.route('/expiring-soon', methods=['GET'])
@jwt_required()
def get_expiring_items():
    """
    Get items expiring within specified days
    
    Query Parameters:
    - days: Number of days to check (default: 30)
    """
    current_pharmacy_id = get_jwt_identity()
    days = request.args.get('days', 30, type=int)
    
    from datetime import timedelta
    expiry_threshold = datetime.now().date() + timedelta(days=days)
    
    expiring_items = db.session.query(Inventory).join(Medicine).filter(
        and_(
            Inventory.pharmacy_id == current_pharmacy_id,
            Inventory.expiry_date <= expiry_threshold,
            Inventory.expiry_date >= datetime.now().date()
        )
    ).order_by(Inventory.expiry_date, Medicine.name).all()
    
    items = []
    for item in expiring_items:
        items.append({
            'id': str(item.id),
            'medicine': {
                'id': str(item.medicine.id),
                'name': item.medicine.name,
                'strength': item.medicine.strength,
                'dosage_form': item.medicine.dosage_form
            },
            'batch_number': item.batch_number,
            'quantity_available': item.quantity_available,
            'expiry_date': item.expiry_date.isoformat(),
            'days_to_expiry': item.days_to_expiry,
            'unit_price': float(item.unit_price),
            'mrp': float(item.mrp),
            'total_value': float(item.quantity_available * item.unit_price)
        })
    
    return jsonify({
        'expiring_items': items,
        'total_items': len(items),
        'total_value': sum(item['total_value'] for item in items),
        'threshold_days': days,
        'status_code': 200
    })

def create_low_stock_notification(pharmacy_id, inventory_item):
    """Create a low stock notification"""
    try:
        shortage = inventory_item.minimum_threshold - inventory_item.quantity_available
        priority = 'Critical' if inventory_item.quantity_available == 0 else 'High'
        
        notification = Notification(
            pharmacy_id=pharmacy_id,
            type='Low Stock',
            priority=priority,
            title=f'Low Stock Alert: {inventory_item.medicine.name}',
            message=f'{inventory_item.medicine.name} stock is low. Current: {inventory_item.quantity_available}, Minimum: {inventory_item.minimum_threshold}. Shortage: {shortage} units.',
            action_required=True,
            data={
                'inventory_id': str(inventory_item.id),
                'medicine_id': str(inventory_item.medicine.id),
                'current_stock': inventory_item.quantity_available,
                'minimum_threshold': inventory_item.minimum_threshold,
                'shortage': shortage,
                'batch_number': inventory_item.batch_number
            }
        )
        
        db.session.add(notification)
        db.session.commit()
        
    except Exception as e:
        # Log error but don't fail the main operation
        print(f"Error creating low stock notification: {e}")
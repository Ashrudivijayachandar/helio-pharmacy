"""
Medicine Routes - Handle medicine catalog, search and management
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Medicine
from extensions import db

medicine_bp = Blueprint('medicine', __name__)

@medicine_bp.route('/', methods=['GET'])
def get_medicines():
    """Get all medicines with optional search and filters"""
    try:
        search = request.args.get('search', '')
        category = request.args.get('category', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        query = Medicine.query
        
        if search:
            query = query.filter(Medicine.name.ilike(f'%{search}%'))
        
        if category:
            query = query.filter(Medicine.category == category)
        
        medicines = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [medicine.to_dict() for medicine in medicines.items],
            'pagination': {
                'page': page,
                'pages': medicines.pages,
                'per_page': per_page,
                'total': medicines.total
            }
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@medicine_bp.route('/<int:medicine_id>', methods=['GET'])
def get_medicine(medicine_id):
    """Get specific medicine"""
    try:
        medicine = Medicine.query.get_or_404(medicine_id)
        return jsonify({
            'success': True,
            'data': medicine.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 404

@medicine_bp.route('/', methods=['POST'])
@jwt_required()
def create_medicine():
    """Create new medicine"""
    try:
        data = request.get_json()
        
        medicine = Medicine(
            name=data.get('name'),
            generic_name=data.get('generic_name'),
            manufacturer=data.get('manufacturer'),
            category=data.get('category'),
            dosage_form=data.get('dosage_form'),
            strength=data.get('strength'),
            price=data.get('price'),
            description=data.get('description')
        )
        
        db.session.add(medicine)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Medicine created successfully',
            'data': medicine.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@medicine_bp.route('/<int:medicine_id>', methods=['PUT'])
@jwt_required()
def update_medicine(medicine_id):
    """Update medicine"""
    try:
        medicine = Medicine.query.get_or_404(medicine_id)
        data = request.get_json()
        
        medicine.name = data.get('name', medicine.name)
        medicine.generic_name = data.get('generic_name', medicine.generic_name)
        medicine.manufacturer = data.get('manufacturer', medicine.manufacturer)
        medicine.category = data.get('category', medicine.category)
        medicine.dosage_form = data.get('dosage_form', medicine.dosage_form)
        medicine.strength = data.get('strength', medicine.strength)
        medicine.price = data.get('price', medicine.price)
        medicine.description = data.get('description', medicine.description)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Medicine updated successfully',
            'data': medicine.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@medicine_bp.route('/<int:medicine_id>', methods=['DELETE'])
@jwt_required()
def delete_medicine(medicine_id):
    """Delete medicine"""
    try:
        medicine = Medicine.query.get_or_404(medicine_id)
        db.session.delete(medicine)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Medicine deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@medicine_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all medicine categories"""
    try:
        categories = db.session.query(Medicine.category).distinct().all()
        category_list = [cat[0] for cat in categories if cat[0]]
        
        return jsonify({
            'success': True,
            'data': category_list
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

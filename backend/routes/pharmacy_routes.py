"""
Pharmacy Routes - Handle pharmacy registration, management and search
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Pharmacy
from extensions import db

pharmacy_bp = Blueprint('pharmacy', __name__)

@pharmacy_bp.route('/', methods=['GET'])
def get_pharmacies():
    """Get all pharmacies"""
    try:
        pharmacies = Pharmacy.query.all()
        return jsonify({
            'success': True,
            'data': [pharmacy.to_dict() for pharmacy in pharmacies]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@pharmacy_bp.route('/<int:pharmacy_id>', methods=['GET'])
def get_pharmacy(pharmacy_id):
    """Get specific pharmacy"""
    try:
        pharmacy = Pharmacy.query.get_or_404(pharmacy_id)
        return jsonify({
            'success': True,
            'data': pharmacy.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 404

@pharmacy_bp.route('/', methods=['POST'])
@jwt_required()
def create_pharmacy():
    """Create new pharmacy"""
    try:
        data = request.get_json()
        
        pharmacy = Pharmacy(
            name=data.get('name'),
            address=data.get('address'),
            phone=data.get('phone'),
            email=data.get('email'),
            license_number=data.get('license_number')
        )
        
        db.session.add(pharmacy)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Pharmacy created successfully',
            'data': pharmacy.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@pharmacy_bp.route('/<int:pharmacy_id>', methods=['PUT'])
@jwt_required()
def update_pharmacy(pharmacy_id):
    """Update pharmacy"""
    try:
        pharmacy = Pharmacy.query.get_or_404(pharmacy_id)
        data = request.get_json()
        
        pharmacy.name = data.get('name', pharmacy.name)
        pharmacy.address = data.get('address', pharmacy.address)
        pharmacy.phone = data.get('phone', pharmacy.phone)
        pharmacy.email = data.get('email', pharmacy.email)
        pharmacy.license_number = data.get('license_number', pharmacy.license_number)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Pharmacy updated successfully',
            'data': pharmacy.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@pharmacy_bp.route('/<int:pharmacy_id>', methods=['DELETE'])
@jwt_required()
def delete_pharmacy(pharmacy_id):
    """Delete pharmacy"""
    try:
        pharmacy = Pharmacy.query.get_or_404(pharmacy_id)
        db.session.delete(pharmacy)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Pharmacy deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

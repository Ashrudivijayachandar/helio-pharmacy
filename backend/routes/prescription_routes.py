"""
Prescription Routes - Handle prescription management and processing
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Prescription
from extensions import db

prescription_bp = Blueprint('prescription', __name__)

@prescription_bp.route('/', methods=['GET'])
@jwt_required()
def get_prescriptions():
    """Get all prescriptions"""
    try:
        patient_id = request.args.get('patient_id')
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        query = Prescription.query
        
        if patient_id:
            query = query.filter(Prescription.patient_id == patient_id)
        
        if status:
            query = query.filter(Prescription.status == status)
        
        prescriptions = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [prescription.to_dict() for prescription in prescriptions.items],
            'pagination': {
                'page': page,
                'pages': prescriptions.pages,
                'per_page': per_page,
                'total': prescriptions.total
            }
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@prescription_bp.route('/<int:prescription_id>', methods=['GET'])
@jwt_required()
def get_prescription(prescription_id):
    """Get specific prescription"""
    try:
        prescription = Prescription.query.get_or_404(prescription_id)
        return jsonify({
            'success': True,
            'data': prescription.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 404

@prescription_bp.route('/', methods=['POST'])
@jwt_required()
def create_prescription():
    """Create new prescription"""
    try:
        data = request.get_json()
        
        prescription = Prescription(
            patient_id=data.get('patient_id'),
            doctor_name=data.get('doctor_name'),
            doctor_license=data.get('doctor_license'),
            medicines=data.get('medicines'),
            instructions=data.get('instructions'),
            date_prescribed=data.get('date_prescribed'),
            status='pending'
        )
        
        db.session.add(prescription)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Prescription created successfully',
            'data': prescription.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@prescription_bp.route('/<int:prescription_id>', methods=['PUT'])
@jwt_required()
def update_prescription(prescription_id):
    """Update prescription"""
    try:
        prescription = Prescription.query.get_or_404(prescription_id)
        data = request.get_json()
        
        prescription.medicines = data.get('medicines', prescription.medicines)
        prescription.instructions = data.get('instructions', prescription.instructions)
        prescription.status = data.get('status', prescription.status)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Prescription updated successfully',
            'data': prescription.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@prescription_bp.route('/<int:prescription_id>/fulfill', methods=['POST'])
@jwt_required()
def fulfill_prescription(prescription_id):
    """Mark prescription as fulfilled"""
    try:
        prescription = Prescription.query.get_or_404(prescription_id)
        prescription.status = 'fulfilled'
        prescription.date_fulfilled = db.func.now()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Prescription fulfilled successfully',
            'data': prescription.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@prescription_bp.route('/<int:prescription_id>', methods=['DELETE'])
@jwt_required()
def delete_prescription(prescription_id):
    """Delete prescription"""
    try:
        prescription = Prescription.query.get_or_404(prescription_id)
        db.session.delete(prescription)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Prescription deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

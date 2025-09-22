"""
Patient Routes - Handle patient registration and management
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Patient
from extensions import db

patient_bp = Blueprint('patient', __name__)

@patient_bp.route('/', methods=['GET'])
@jwt_required()
def get_patients():
    """Get all patients"""
    try:
        search = request.args.get('search', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        query = Patient.query
        
        if search:
            query = query.filter(
                Patient.first_name.ilike(f'%{search}%') |
                Patient.last_name.ilike(f'%{search}%') |
                Patient.phone.ilike(f'%{search}%')
            )
        
        patients = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [patient.to_dict() for patient in patients.items],
            'pagination': {
                'page': page,
                'pages': patients.pages,
                'per_page': per_page,
                'total': patients.total
            }
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@patient_bp.route('/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_patient(patient_id):
    """Get specific patient"""
    try:
        patient = Patient.query.get_or_404(patient_id)
        return jsonify({
            'success': True,
            'data': patient.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 404

@patient_bp.route('/', methods=['POST'])
@jwt_required()
def create_patient():
    """Create new patient"""
    try:
        data = request.get_json()
        
        patient = Patient(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            date_of_birth=data.get('date_of_birth'),
            phone=data.get('phone'),
            email=data.get('email'),
            address=data.get('address'),
            emergency_contact=data.get('emergency_contact'),
            allergies=data.get('allergies'),
            medical_conditions=data.get('medical_conditions')
        )
        
        db.session.add(patient)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Patient created successfully',
            'data': patient.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@patient_bp.route('/<int:patient_id>', methods=['PUT'])
@jwt_required()
def update_patient(patient_id):
    """Update patient"""
    try:
        patient = Patient.query.get_or_404(patient_id)
        data = request.get_json()
        
        patient.first_name = data.get('first_name', patient.first_name)
        patient.last_name = data.get('last_name', patient.last_name)
        patient.date_of_birth = data.get('date_of_birth', patient.date_of_birth)
        patient.phone = data.get('phone', patient.phone)
        patient.email = data.get('email', patient.email)
        patient.address = data.get('address', patient.address)
        patient.emergency_contact = data.get('emergency_contact', patient.emergency_contact)
        patient.allergies = data.get('allergies', patient.allergies)
        patient.medical_conditions = data.get('medical_conditions', patient.medical_conditions)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Patient updated successfully',
            'data': patient.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@patient_bp.route('/<int:patient_id>', methods=['DELETE'])
@jwt_required()
def delete_patient(patient_id):
    """Delete patient"""
    try:
        patient = Patient.query.get_or_404(patient_id)
        db.session.delete(patient)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Patient deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

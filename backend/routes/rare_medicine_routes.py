"""
Rare Medicine Routes - Handle rare medicine requests and sourcing
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import RareMedicineRequest
from extensions import db

rare_medicine_bp = Blueprint('rare_medicine', __name__)

@rare_medicine_bp.route('/', methods=['GET'])
@jwt_required()
def get_rare_medicine_requests():
    """Get all rare medicine requests"""
    try:
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        query = RareMedicineRequest.query
        
        if status:
            query = query.filter(RareMedicineRequest.status == status)
        
        requests = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [req.to_dict() for req in requests.items],
            'pagination': {
                'page': page,
                'pages': requests.pages,
                'per_page': per_page,
                'total': requests.total
            }
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@rare_medicine_bp.route('/<int:request_id>', methods=['GET'])
@jwt_required()
def get_rare_medicine_request(request_id):
    """Get specific rare medicine request"""
    try:
        rare_request = RareMedicineRequest.query.get_or_404(request_id)
        return jsonify({
            'success': True,
            'data': rare_request.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 404

@rare_medicine_bp.route('/', methods=['POST'])
@jwt_required()
def create_rare_medicine_request():
    """Create new rare medicine request"""
    try:
        data = request.get_json()
        
        rare_request = RareMedicineRequest(
            patient_id=data.get('patient_id'),
            medicine_name=data.get('medicine_name'),
            generic_name=data.get('generic_name'),
            manufacturer=data.get('manufacturer'),
            dosage=data.get('dosage'),
            quantity_needed=data.get('quantity_needed'),
            urgency_level=data.get('urgency_level'),
            doctor_prescription=data.get('doctor_prescription'),
            patient_contact=data.get('patient_contact'),
            notes=data.get('notes'),
            status='pending'
        )
        
        db.session.add(rare_request)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Rare medicine request created successfully',
            'data': rare_request.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@rare_medicine_bp.route('/<int:request_id>', methods=['PUT'])
@jwt_required()
def update_rare_medicine_request(request_id):
    """Update rare medicine request"""
    try:
        rare_request = RareMedicineRequest.query.get_or_404(request_id)
        data = request.get_json()
        
        rare_request.status = data.get('status', rare_request.status)
        rare_request.notes = data.get('notes', rare_request.notes)
        rare_request.estimated_cost = data.get('estimated_cost', rare_request.estimated_cost)
        rare_request.estimated_delivery = data.get('estimated_delivery', rare_request.estimated_delivery)
        rare_request.supplier_info = data.get('supplier_info', rare_request.supplier_info)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Rare medicine request updated successfully',
            'data': rare_request.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@rare_medicine_bp.route('/<int:request_id>/approve', methods=['POST'])
@jwt_required()
def approve_rare_medicine_request(request_id):
    """Approve rare medicine request"""
    try:
        rare_request = RareMedicineRequest.query.get_or_404(request_id)
        data = request.get_json()
        
        rare_request.status = 'approved'
        rare_request.estimated_cost = data.get('estimated_cost')
        rare_request.estimated_delivery = data.get('estimated_delivery')
        rare_request.supplier_info = data.get('supplier_info')
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Rare medicine request approved successfully',
            'data': rare_request.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@rare_medicine_bp.route('/<int:request_id>/complete', methods=['POST'])
@jwt_required()
def complete_rare_medicine_request(request_id):
    """Mark rare medicine request as completed"""
    try:
        rare_request = RareMedicineRequest.query.get_or_404(request_id)
        rare_request.status = 'completed'
        rare_request.date_completed = db.func.now()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Rare medicine request completed successfully',
            'data': rare_request.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

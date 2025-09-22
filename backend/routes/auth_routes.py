"""
Authentication routes for Pharmacy Management System
Handles user login, registration, and JWT token management
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from marshmallow import Schema, fields, ValidationError
import re

from extensions import db
from models import Pharmacy

auth_bp = Blueprint('auth', __name__)

class LoginSchema(Schema):
    """Schema for login validation"""
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda x: len(x) >= 6)

class RegisterSchema(Schema):
    """Schema for pharmacy registration validation"""
    name = fields.Str(required=True, validate=lambda x: len(x) >= 2)
    license_number = fields.Str(required=True, validate=lambda x: len(x) >= 5)
    address = fields.Str(required=True, validate=lambda x: len(x) >= 10)
    phone = fields.Str(required=True, validate=lambda x: re.match(r'^\+?[1-9]\d{1,14}$', x))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda x: len(x) >= 8)
    owner_name = fields.Str(required=True, validate=lambda x: len(x) >= 2)
    gst_number = fields.Str(allow_none=True)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new pharmacy
    
    Request Body:
    {
        "name": "HealthCare Pharmacy",
        "license_number": "PH-12345-2024",
        "address": "123 Main Street, City",
        "phone": "+91-9876543210",
        "email": "admin@healthcare.com",
        "password": "securepassword123",
        "owner_name": "Dr. John Doe",
        "gst_number": "07AAACH7409R1Z5"
    }
    """
    try:
        schema = RegisterSchema()
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({
            'error': 'Validation Error',
            'messages': err.messages,
            'status_code': 400
        }), 400
    
    # Check if pharmacy already exists
    if Pharmacy.query.filter_by(email=data['email']).first():
        return jsonify({
            'error': 'Registration Failed',
            'message': 'A pharmacy with this email already exists.',
            'status_code': 409
        }), 409
    
    if Pharmacy.query.filter_by(license_number=data['license_number']).first():
        return jsonify({
            'error': 'Registration Failed',
            'message': 'A pharmacy with this license number already exists.',
            'status_code': 409
        }), 409
    
    try:
        # Create new pharmacy
        pharmacy = Pharmacy(
            name=data['name'],
            license_number=data['license_number'],
            address=data['address'],
            phone=data['phone'],
            email=data['email'],
            owner_name=data['owner_name'],
            gst_number=data.get('gst_number'),
            password_hash=generate_password_hash(data['password'])
        )
        
        db.session.add(pharmacy)
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=str(pharmacy.id))
        refresh_token = create_refresh_token(identity=str(pharmacy.id))
        
        return jsonify({
            'message': 'Pharmacy registered successfully',
            'pharmacy': {
                'id': str(pharmacy.id),
                'name': pharmacy.name,
                'license_number': pharmacy.license_number,
                'email': pharmacy.email,
                'owner_name': pharmacy.owner_name
            },
            'access_token': access_token,
            'refresh_token': refresh_token,
            'status_code': 201
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Registration Failed',
            'message': 'An error occurred during registration. Please try again.',
            'status_code': 500
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Pharmacy login
    
    Request Body:
    {
        "email": "admin@healthcare.com",
        "password": "securepassword123"
    }
    """
    try:
        schema = LoginSchema()
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({
            'error': 'Validation Error',
            'messages': err.messages,
            'status_code': 400
        }), 400
    
    # Find pharmacy by email
    pharmacy = Pharmacy.query.filter_by(email=data['email']).first()
    
    if not pharmacy or not check_password_hash(pharmacy.password_hash, data['password']):
        return jsonify({
            'error': 'Authentication Failed',
            'message': 'Invalid email or password.',
            'status_code': 401
        }), 401
    
    # Generate tokens
    access_token = create_access_token(identity=str(pharmacy.id))
    refresh_token = create_refresh_token(identity=str(pharmacy.id))
    
    return jsonify({
        'message': 'Login successful',
        'pharmacy': {
            'id': str(pharmacy.id),
            'name': pharmacy.name,
            'license_number': pharmacy.license_number,
            'email': pharmacy.email,
            'owner_name': pharmacy.owner_name,
            'phone': pharmacy.phone,
            'address': pharmacy.address
        },
        'access_token': access_token,
        'refresh_token': refresh_token,
        'status_code': 200
    })

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Refresh access token using refresh token
    """
    current_pharmacy_id = get_jwt_identity()
    
    # Verify pharmacy still exists
    pharmacy = Pharmacy.query.get(current_pharmacy_id)
    if not pharmacy:
        return jsonify({
            'error': 'Invalid Token',
            'message': 'Pharmacy account no longer exists.',
            'status_code': 401
        }), 401
    
    # Generate new access token
    new_access_token = create_access_token(identity=current_pharmacy_id)
    
    return jsonify({
        'access_token': new_access_token,
        'status_code': 200
    })

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """
    Get current pharmacy profile information
    """
    current_pharmacy_id = get_jwt_identity()
    pharmacy = Pharmacy.query.get(current_pharmacy_id)
    
    if not pharmacy:
        return jsonify({
            'error': 'Not Found',
            'message': 'Pharmacy profile not found.',
            'status_code': 404
        }), 404
    
    return jsonify({
        'pharmacy': {
            'id': str(pharmacy.id),
            'name': pharmacy.name,
            'license_number': pharmacy.license_number,
            'address': pharmacy.address,
            'phone': pharmacy.phone,
            'email': pharmacy.email,
            'owner_name': pharmacy.owner_name,
            'gst_number': pharmacy.gst_number,
            'created_at': pharmacy.created_at.isoformat() if pharmacy.created_at else None,
            'updated_at': pharmacy.updated_at.isoformat() if pharmacy.updated_at else None
        },
        'status_code': 200
    })

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """
    Update pharmacy profile information
    
    Request Body:
    {
        "name": "Updated Pharmacy Name",
        "address": "New Address",
        "phone": "+91-9876543210",
        "owner_name": "Updated Owner Name",
        "gst_number": "New GST Number"
    }
    """
    current_pharmacy_id = get_jwt_identity()
    pharmacy = Pharmacy.query.get(current_pharmacy_id)
    
    if not pharmacy:
        return jsonify({
            'error': 'Not Found',
            'message': 'Pharmacy profile not found.',
            'status_code': 404
        }), 404
    
    data = request.json or {}
    
    # Update allowed fields
    allowed_fields = ['name', 'address', 'phone', 'owner_name', 'gst_number']
    
    try:
        for field in allowed_fields:
            if field in data and data[field] is not None:
                if field == 'name' and len(data[field]) < 2:
                    return jsonify({
                        'error': 'Validation Error',
                        'message': 'Pharmacy name must be at least 2 characters long.',
                        'status_code': 400
                    }), 400
                
                if field == 'phone' and not re.match(r'^\+?[1-9]\d{1,14}$', data[field]):
                    return jsonify({
                        'error': 'Validation Error',
                        'message': 'Invalid phone number format.',
                        'status_code': 400
                    }), 400
                
                setattr(pharmacy, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'pharmacy': {
                'id': str(pharmacy.id),
                'name': pharmacy.name,
                'license_number': pharmacy.license_number,
                'address': pharmacy.address,
                'phone': pharmacy.phone,
                'email': pharmacy.email,
                'owner_name': pharmacy.owner_name,
                'gst_number': pharmacy.gst_number,
                'updated_at': pharmacy.updated_at.isoformat()
            },
            'status_code': 200
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Update Failed',
            'message': 'An error occurred while updating the profile.',
            'status_code': 500
        }), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """
    Change pharmacy password
    
    Request Body:
    {
        "current_password": "currentpassword123",
        "new_password": "newpassword123"
    }
    """
    current_pharmacy_id = get_jwt_identity()
    pharmacy = Pharmacy.query.get(current_pharmacy_id)
    
    if not pharmacy:
        return jsonify({
            'error': 'Not Found',
            'message': 'Pharmacy profile not found.',
            'status_code': 404
        }), 404
    
    data = request.json or {}
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({
            'error': 'Validation Error',
            'message': 'Both current and new passwords are required.',
            'status_code': 400
        }), 400
    
    if len(new_password) < 8:
        return jsonify({
            'error': 'Validation Error',
            'message': 'New password must be at least 8 characters long.',
            'status_code': 400
        }), 400
    
    # Verify current password
    if not check_password_hash(pharmacy.password_hash, current_password):
        return jsonify({
            'error': 'Authentication Failed',
            'message': 'Current password is incorrect.',
            'status_code': 401
        }), 401
    
    try:
        # Update password
        pharmacy.password_hash = generate_password_hash(new_password)
        db.session.commit()
        
        return jsonify({
            'message': 'Password changed successfully',
            'status_code': 200
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Update Failed',
            'message': 'An error occurred while changing the password.',
            'status_code': 500
        }), 500

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    """
    Verify if the current token is valid
    """
    current_pharmacy_id = get_jwt_identity()
    pharmacy = Pharmacy.query.get(current_pharmacy_id)
    
    if not pharmacy:
        return jsonify({
            'error': 'Invalid Token',
            'message': 'Token is invalid or pharmacy no longer exists.',
            'status_code': 401
        }), 401
    
    return jsonify({
        'valid': True,
        'pharmacy_id': current_pharmacy_id,
        'pharmacy_name': pharmacy.name,
        'status_code': 200
    })
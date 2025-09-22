"""
Analytics Routes - Handle system analytics and reporting
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Medicine, Patient, Prescription, InventoryItem
from extensions import db
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_analytics():
    """Get dashboard analytics overview"""
    try:
        # Basic counts
        total_medicines = Medicine.query.count()
        total_patients = Patient.query.count()
        total_prescriptions = Prescription.query.count()
        
        # Recent activity (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_prescriptions = Prescription.query.filter(
            Prescription.date_prescribed >= thirty_days_ago
        ).count()
        
        # Low stock items
        low_stock_items = InventoryItem.query.filter(
            InventoryItem.quantity <= InventoryItem.min_threshold
        ).count()
        
        return jsonify({
            'success': True,
            'data': {
                'totals': {
                    'medicines': total_medicines,
                    'patients': total_patients,
                    'prescriptions': total_prescriptions
                },
                'recent_activity': {
                    'prescriptions_last_30_days': recent_prescriptions
                },
                'alerts': {
                    'low_stock_items': low_stock_items
                }
            }
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@analytics_bp.route('/sales', methods=['GET'])
@jwt_required()
def get_sales_analytics():
    """Get sales analytics"""
    try:
        period = request.args.get('period', 'monthly')  # daily, weekly, monthly, yearly
        
        # Sample sales data - replace with actual sales queries
        sales_data = {
            'period': period,
            'total_revenue': 15750.00,
            'total_orders': 324,
            'average_order_value': 48.61,
            'top_selling_medicines': [
                {'name': 'Paracetamol', 'sales': 125, 'revenue': 1250.00},
                {'name': 'Ibuprofen', 'sales': 98, 'revenue': 980.00},
                {'name': 'Amoxicillin', 'sales': 76, 'revenue': 1520.00}
            ]
        }
        
        return jsonify({
            'success': True,
            'data': sales_data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@analytics_bp.route('/inventory', methods=['GET'])
@jwt_required()
def get_inventory_analytics():
    """Get inventory analytics"""
    try:
        # Stock levels
        total_items = InventoryItem.query.count()
        low_stock = InventoryItem.query.filter(
            InventoryItem.quantity <= InventoryItem.min_threshold
        ).count()
        out_of_stock = InventoryItem.query.filter(
            InventoryItem.quantity == 0
        ).count()
        
        # Most/least stocked items
        most_stocked = InventoryItem.query.order_by(
            InventoryItem.quantity.desc()
        ).limit(5).all()
        
        least_stocked = InventoryItem.query.filter(
            InventoryItem.quantity > 0
        ).order_by(InventoryItem.quantity.asc()).limit(5).all()
        
        return jsonify({
            'success': True,
            'data': {
                'stock_overview': {
                    'total_items': total_items,
                    'low_stock': low_stock,
                    'out_of_stock': out_of_stock
                },
                'most_stocked': [item.to_dict() for item in most_stocked],
                'least_stocked': [item.to_dict() for item in least_stocked]
            }
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@analytics_bp.route('/prescriptions', methods=['GET'])
@jwt_required()
def get_prescription_analytics():
    """Get prescription analytics"""
    try:
        period = request.args.get('period', 'monthly')
        
        # Prescription status breakdown
        total_prescriptions = Prescription.query.count()
        pending_prescriptions = Prescription.query.filter(
            Prescription.status == 'pending'
        ).count()
        fulfilled_prescriptions = Prescription.query.filter(
            Prescription.status == 'fulfilled'
        ).count()
        
        # Most prescribed medicines
        # This would require a more complex query in a real implementation
        most_prescribed = [
            {'medicine': 'Paracetamol', 'count': 145},
            {'medicine': 'Ibuprofen', 'count': 112},
            {'medicine': 'Amoxicillin', 'count': 89}
        ]
        
        return jsonify({
            'success': True,
            'data': {
                'overview': {
                    'total': total_prescriptions,
                    'pending': pending_prescriptions,
                    'fulfilled': fulfilled_prescriptions
                },
                'most_prescribed': most_prescribed,
                'period': period
            }
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@analytics_bp.route('/patients', methods=['GET'])
@jwt_required()
def get_patient_analytics():
    """Get patient analytics"""
    try:
        # Patient demographics and activity
        total_patients = Patient.query.count()
        
        # Age distribution (sample data)
        age_distribution = {
            '0-18': 45,
            '19-35': 123,
            '36-55': 156,
            '56-75': 89,
            '75+': 34
        }
        
        # Recent registrations
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        new_patients = Patient.query.filter(
            Patient.created_at >= thirty_days_ago
        ).count() if hasattr(Patient, 'created_at') else 0
        
        return jsonify({
            'success': True,
            'data': {
                'total_patients': total_patients,
                'new_patients_last_30_days': new_patients,
                'age_distribution': age_distribution
            }
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@analytics_bp.route('/reports/export', methods=['POST'])
@jwt_required()
def export_report():
    """Export analytics report"""
    try:
        data = request.get_json()
        report_type = data.get('type')
        format_type = data.get('format', 'pdf')  # pdf, excel, csv
        
        # Generate report based on type and format
        # This would be implemented with actual report generation logic
        
        return jsonify({
            'success': True,
            'message': f'{report_type} report exported successfully',
            'download_url': f'/api/analytics/downloads/{report_type}.{format_type}'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

"""
Notification Routes - Handle system notifications and alerts
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Notification
from extensions import db

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get all notifications for current user"""
    try:
        user_id = get_jwt_identity()
        read_status = request.args.get('read')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        query = Notification.query.filter(Notification.user_id == user_id)
        
        if read_status is not None:
            query = query.filter(Notification.is_read == (read_status.lower() == 'true'))
        
        notifications = query.order_by(Notification.created_at.desc()).paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [notification.to_dict() for notification in notifications.items],
            'pagination': {
                'page': page,
                'pages': notifications.pages,
                'per_page': per_page,
                'total': notifications.total
            }
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@notification_bp.route('/<int:notification_id>', methods=['GET'])
@jwt_required()
def get_notification(notification_id):
    """Get specific notification"""
    try:
        user_id = get_jwt_identity()
        notification = Notification.query.filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        ).first_or_404()
        
        return jsonify({
            'success': True,
            'data': notification.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 404

@notification_bp.route('/', methods=['POST'])
@jwt_required()
def create_notification():
    """Create new notification"""
    try:
        data = request.get_json()
        
        notification = Notification(
            user_id=data.get('user_id'),
            title=data.get('title'),
            message=data.get('message'),
            notification_type=data.get('type', 'info'),
            priority=data.get('priority', 'normal'),
            is_read=False
        )
        
        db.session.add(notification)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Notification created successfully',
            'data': notification.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@notification_bp.route('/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    """Mark notification as read"""
    try:
        user_id = get_jwt_identity()
        notification = Notification.query.filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        ).first_or_404()
        
        notification.is_read = True
        notification.read_at = db.func.now()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Notification marked as read',
            'data': notification.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@notification_bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_notifications_read():
    """Mark all notifications as read for current user"""
    try:
        user_id = get_jwt_identity()
        
        Notification.query.filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).update({
            'is_read': True,
            'read_at': db.func.now()
        })
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'All notifications marked as read'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@notification_bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """Delete notification"""
    try:
        user_id = get_jwt_identity()
        notification = Notification.query.filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        ).first_or_404()
        
        db.session.delete(notification)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Notification deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

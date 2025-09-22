"""
Flask Application Factory for Pharmacy Management System
Professional medical-grade backend API
"""

import os
import logging
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from datetime import datetime
import traceback

# Import extensions
from extensions import db, migrate, jwt, cors, ma

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    config_name = config_name or os.environ.get('FLASK_ENV', 'development')
    
    if config_name == 'production':
        from config import ProductionConfig
        app.config.from_object(ProductionConfig)
    elif config_name == 'testing':
        from config import TestingConfig
        app.config.from_object(TestingConfig)
    else:
        from config import DevelopmentConfig
        app.config.from_object(DevelopmentConfig)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, origins=app.config['CORS_ORIGINS'])
    ma.init_app(app)
    
    # Configure logging
    configure_logging(app)
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register JWT handlers
    register_jwt_handlers(app, jwt)
    
    # Register blueprints
    register_blueprints(app)
    
    # Register CLI commands
    register_cli_commands(app)
    
    return app

def configure_logging(app):
    """Configure application logging"""
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        
        file_handler = logging.FileHandler('logs/pharmacy_api.log')
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Pharmacy API startup')

def register_error_handlers(app):
    """Register application error handlers"""
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': 'Bad Request',
            'message': 'The request could not be understood by the server.',
            'status_code': 400
        }), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication is required to access this resource.',
            'status_code': 401
        }), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource.',
            'status_code': 403
        }), 403
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found.',
            'status_code': 404
        }), 404
    
    @app.errorhandler(422)
    def validation_error(error):
        return jsonify({
            'error': 'Validation Error',
            'message': 'The request data failed validation.',
            'status_code': 422
        }), 422
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        app.logger.error(f'Server Error: {error}')
        app.logger.error(traceback.format_exc())
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred. Please try again later.',
            'status_code': 500
        }), 500

def register_jwt_handlers(app, jwt):
    """Register JWT token handlers"""
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'error': 'Token Expired',
            'message': 'The JWT token has expired. Please login again.',
            'status_code': 401
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'error': 'Invalid Token',
            'message': 'The JWT token is invalid.',
            'status_code': 401
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'error': 'Token Missing',
            'message': 'Authentication token is required.',
            'status_code': 401
        }), 401

def register_blueprints(app):
    """Register application blueprints"""
    
    # API Routes
    from routes.auth_routes import auth_bp
    from routes.pharmacy_routes import pharmacy_bp
    from routes.medicine_routes import medicine_bp
    from routes.inventory_routes import inventory_bp
    from routes.patient_routes import patient_bp
    from routes.prescription_routes import prescription_bp
    from routes.rare_medicine_routes import rare_medicine_bp
    from routes.notification_routes import notification_bp
    from routes.analytics_routes import analytics_bp
    from routes.translation_routes import translation_bp
    
    # Register with API prefix
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(pharmacy_bp, url_prefix='/api/pharmacy')
    app.register_blueprint(medicine_bp, url_prefix='/api/medicines')
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
    app.register_blueprint(patient_bp, url_prefix='/api/patients')
    app.register_blueprint(prescription_bp, url_prefix='/api/prescriptions')
    app.register_blueprint(rare_medicine_bp, url_prefix='/api/rare-medicines')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(translation_bp, url_prefix='/api/translation')
    
    # Root endpoint
    @app.route('/')
    def root():
        return jsonify({
            'message': 'Welcome to Helio Pharmacy Management System API',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'health': '/api/health',
                'docs': '/api/docs',
                'auth': '/api/auth',
                'pharmacy': '/api/pharmacy',
                'medicines': '/api/medicines',
                'inventory': '/api/inventory',
                'patients': '/api/patients',
                'prescriptions': '/api/prescriptions',
                'rare_medicines': '/api/rare-medicines',
                'notifications': '/api/notifications',
                'analytics': '/api/analytics',
                'translation': '/api/translation'
            }
        })
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0',
            'environment': app.config.get('ENV', 'development')
        })
    
    # API documentation endpoint
    @app.route('/api/docs')
    def api_docs():
        return jsonify({
            'title': 'Pharmacy Management System API',
            'version': '1.0.0',
            'description': 'Professional pharmacy management system with mobile-first design',
            'endpoints': {
                'authentication': '/api/auth',
                'pharmacy': '/api/pharmacy',
                'medicines': '/api/medicines',
                'inventory': '/api/inventory',
                'patients': '/api/patients',
                'prescriptions': '/api/prescriptions',
                'rare_medicines': '/api/rare-medicines',
                'notifications': '/api/notifications',
                'analytics': '/api/analytics',
                'translation': '/api/translation'
            },
            'health_check': '/api/health'
        })

def register_cli_commands(app):
    """Register CLI commands for database management"""
    
    @app.cli.command()
    def init_db():
        """Initialize the database with tables"""
        db.create_all()
        print("Database initialized successfully!")
    
    @app.cli.command()
    def seed_db():
        """Seed the database with sample data"""
        from models import Pharmacy, Medicine, Patient
        # Add sample data creation logic here
        print("Database seeded successfully!")

# Request/Response middleware
def register_middleware(app):
    """Register request/response middleware"""
    
    @app.before_request
    def before_request():
        """Execute before each request"""
        # Log API requests in development
        if app.debug:
            app.logger.info(f'{request.method} {request.url}')
    
    @app.after_request
    def after_request(response):
        """Execute after each request"""
        # Add security headers
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        
        # Log response status in development
        if app.debug:
            app.logger.info(f'Response: {response.status_code}')
        
        return response

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
"""
Translation Routes - Handle multi-language support and translations
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

translation_bp = Blueprint('translation', __name__)

# Sample translations - in a real app, this would be stored in a database
TRANSLATIONS = {
    'en': {
        'welcome': 'Welcome to Helio Pharmacy',
        'dashboard': 'Dashboard',
        'medicines': 'Medicines',
        'patients': 'Patients',
        'prescriptions': 'Prescriptions',
        'inventory': 'Inventory',
        'search': 'Search',
        'add_new': 'Add New',
        'edit': 'Edit',
        'delete': 'Delete',
        'save': 'Save',
        'cancel': 'Cancel',
        'login': 'Login',
        'logout': 'Logout',
        'profile': 'Profile',
        'settings': 'Settings'
    },
    'es': {
        'welcome': 'Bienvenido a Helio Pharmacy',
        'dashboard': 'Panel de Control',
        'medicines': 'Medicinas',
        'patients': 'Pacientes',
        'prescriptions': 'Recetas',
        'inventory': 'Inventario',
        'search': 'Buscar',
        'add_new': 'Agregar Nuevo',
        'edit': 'Editar',
        'delete': 'Eliminar',
        'save': 'Guardar',
        'cancel': 'Cancelar',
        'login': 'Iniciar Sesión',
        'logout': 'Cerrar Sesión',
        'profile': 'Perfil',
        'settings': 'Configuraciones'
    },
    'fr': {
        'welcome': 'Bienvenue à Helio Pharmacy',
        'dashboard': 'Tableau de Bord',
        'medicines': 'Médicaments',
        'patients': 'Patients',
        'prescriptions': 'Ordonnances',
        'inventory': 'Inventaire',
        'search': 'Rechercher',
        'add_new': 'Ajouter Nouveau',
        'edit': 'Modifier',
        'delete': 'Supprimer',
        'save': 'Sauvegarder',
        'cancel': 'Annuler',
        'login': 'Connexion',
        'logout': 'Déconnexion',
        'profile': 'Profil',
        'settings': 'Paramètres'
    },
    'de': {
        'welcome': 'Willkommen bei Helio Pharmacy',
        'dashboard': 'Dashboard',
        'medicines': 'Medikamente',
        'patients': 'Patienten',
        'prescriptions': 'Rezepte',
        'inventory': 'Inventar',
        'search': 'Suchen',
        'add_new': 'Neu Hinzufügen',
        'edit': 'Bearbeiten',
        'delete': 'Löschen',
        'save': 'Speichern',
        'cancel': 'Abbrechen',
        'login': 'Anmelden',
        'logout': 'Abmelden',
        'profile': 'Profil',
        'settings': 'Einstellungen'
    },
    'hi': {
        'welcome': 'हेलियो फार्मेसी में आपका स्वागत है',
        'dashboard': 'डैशबोर्ड',
        'medicines': 'दवाइयां',
        'patients': 'मरीज़',
        'prescriptions': 'नुस्खे',
        'inventory': 'सूची',
        'search': 'खोजें',
        'add_new': 'नया जोड़ें',
        'edit': 'संपादित करें',
        'delete': 'हटाएं',
        'save': 'सहेजें',
        'cancel': 'रद्द करें',
        'login': 'लॉग इन',
        'logout': 'लॉग आउट',
        'profile': 'प्रोफ़ाइल',
        'settings': 'सेटिंग्स'
    }
}

@translation_bp.route('/languages', methods=['GET'])
def get_supported_languages():
    """Get list of supported languages"""
    languages = [
        {'code': 'en', 'name': 'English', 'native_name': 'English'},
        {'code': 'es', 'name': 'Spanish', 'native_name': 'Español'},
        {'code': 'fr', 'name': 'French', 'native_name': 'Français'},
        {'code': 'de', 'name': 'German', 'native_name': 'Deutsch'},
        {'code': 'hi', 'name': 'Hindi', 'native_name': 'हिन्दी'}
    ]
    
    return jsonify({
        'success': True,
        'data': languages
    }), 200

@translation_bp.route('/<language_code>', methods=['GET'])
def get_translations(language_code):
    """Get translations for a specific language"""
    if language_code not in TRANSLATIONS:
        return jsonify({
            'success': False,
            'message': f'Language {language_code} not supported'
        }), 404
    
    return jsonify({
        'success': True,
        'language': language_code,
        'translations': TRANSLATIONS[language_code]
    }), 200

@translation_bp.route('/<language_code>/key/<key>', methods=['GET'])
def get_translation_key(language_code, key):
    """Get specific translation key for a language"""
    if language_code not in TRANSLATIONS:
        return jsonify({
            'success': False,
            'message': f'Language {language_code} not supported'
        }), 404
    
    if key not in TRANSLATIONS[language_code]:
        return jsonify({
            'success': False,
            'message': f'Translation key {key} not found'
        }), 404
    
    return jsonify({
        'success': True,
        'language': language_code,
        'key': key,
        'translation': TRANSLATIONS[language_code][key]
    }), 200

@translation_bp.route('/translate', methods=['POST'])
def translate_text():
    """Translate text between languages"""
    try:
        data = request.get_json()
        text = data.get('text')
        source_lang = data.get('source_language', 'en')
        target_lang = data.get('target_language')
        
        if not text or not target_lang:
            return jsonify({
                'success': False,
                'message': 'Text and target_language are required'
            }), 400
        
        if target_lang not in TRANSLATIONS:
            return jsonify({
                'success': False,
                'message': f'Target language {target_lang} not supported'
            }), 404
        
        # Simple key-based translation lookup
        # In a real app, you would use a translation service like Google Translate
        translated_text = text
        for key, value in TRANSLATIONS[source_lang].items():
            if value.lower() == text.lower():
                translated_text = TRANSLATIONS[target_lang].get(key, text)
                break
        
        return jsonify({
            'success': True,
            'original_text': text,
            'translated_text': translated_text,
            'source_language': source_lang,
            'target_language': target_lang
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@translation_bp.route('/bulk-translate', methods=['POST'])
def bulk_translate():
    """Translate multiple texts at once"""
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        source_lang = data.get('source_language', 'en')
        target_lang = data.get('target_language')
        
        if not texts or not target_lang:
            return jsonify({
                'success': False,
                'message': 'Texts array and target_language are required'
            }), 400
        
        if target_lang not in TRANSLATIONS:
            return jsonify({
                'success': False,
                'message': f'Target language {target_lang} not supported'
            }), 404
        
        translations = []
        for text in texts:
            translated_text = text
            for key, value in TRANSLATIONS[source_lang].items():
                if value.lower() == text.lower():
                    translated_text = TRANSLATIONS[target_lang].get(key, text)
                    break
            
            translations.append({
                'original': text,
                'translated': translated_text
            })
        
        return jsonify({
            'success': True,
            'translations': translations,
            'source_language': source_lang,
            'target_language': target_lang
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@translation_bp.route('/detect-language', methods=['POST'])
def detect_language():
    """Detect the language of given text"""
    try:
        data = request.get_json()
        text = data.get('text')
        
        if not text:
            return jsonify({
                'success': False,
                'message': 'Text is required'
            }), 400
        
        # Simple detection based on character sets
        # In a real app, you would use a language detection service
        detected_language = 'en'  # Default to English
        
        # Simple Hindi detection
        if any('\u0900' <= char <= '\u097F' for char in text):
            detected_language = 'hi'
        
        return jsonify({
            'success': True,
            'text': text,
            'detected_language': detected_language,
            'confidence': 0.95  # Mock confidence score
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

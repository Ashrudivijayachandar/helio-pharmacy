# Pharmacy Dashboard - Setup Instructions

## Prerequisites

### For Backend (Flask)
- Python 3.9+
- PostgreSQL 12+
- pip (Python package manager)

### For Mobile App (React Native)
- Node.js 16+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development on macOS)

## Quick Start

### 1. Database Setup
```bash
# Install PostgreSQL and create database
createdb pharmacy_db

# Run database migrations
cd database
psql -d pharmacy_db -f schema.sql
psql -d pharmacy_db -f initial_data.sql
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run Flask server
python app.py
```

### 3. Mobile App Setup
```bash
cd mobile-app

# Install dependencies
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..

# Run on Android
npx react-native run-android

# Run on iOS (macOS only)
npx react-native run-ios
```

## Environment Configuration

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/pharmacy_db
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
TRANSLATION_API_KEY=your-translation-api-key
```

### Mobile App (config.js)
```javascript
export const API_BASE_URL = 'http://localhost:5000/api';
export const ENABLE_PUSH_NOTIFICATIONS = true;
```

## Development Workflow

1. **Database Changes**: Update schema.sql and create migration scripts
2. **Backend API**: Add endpoints in Flask with proper error handling
3. **Mobile UI**: Create components following the medical design system
4. **Testing**: Test on actual devices for real-world performance

## Production Deployment

### Backend
- Deploy Flask app to cloud service (AWS, Heroku, etc.)
- Use production PostgreSQL instance
- Configure proper SSL certificates
- Set up monitoring and logging

### Mobile App
- Build release APK/IPA
- Submit to Google Play Store / Apple App Store
- Configure push notification services
- Set up crash reporting

## Support

For technical support or questions:
- Check documentation in `/docs` folder
- Review API endpoints in backend/routes/
- Check component usage in mobile-app/src/components/
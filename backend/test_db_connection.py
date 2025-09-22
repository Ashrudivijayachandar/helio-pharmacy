#!/usr/bin/env python3
"""
Database Connection Test Script
Test the PostgreSQL connection with new credentials
"""

import psycopg2
from psycopg2 import sql
import sys

def test_connection():
    """Test PostgreSQL connection"""
    try:
        # Connection parameters
        connection_params = {
            'host': 'localhost',
            'port': '5432',
            'database': 'heliopharm',
            'user': 'postgres',
            'password': 'Ashrudi'
        }
        
        print("Testing PostgreSQL connection...")
        print(f"Host: {connection_params['host']}")
        print(f"Port: {connection_params['port']}")
        print(f"Database: {connection_params['database']}")
        print(f"User: {connection_params['user']}")
        
        # Attempt connection
        conn = psycopg2.connect(**connection_params)
        cursor = conn.cursor()
        
        # Test query
        cursor.execute("SELECT version();")
        db_version = cursor.fetchone()
        
        print("\n✅ Connection successful!")
        print(f"PostgreSQL version: {db_version[0]}")
        
        # Test if database exists and is accessible
        cursor.execute("SELECT current_database();")
        current_db = cursor.fetchone()
        print(f"Connected to database: {current_db[0]}")
        
        # Check for existing tables
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cursor.fetchall()
        
        if tables:
            print(f"\nExisting tables ({len(tables)}):")
            for table in tables:
                print(f"  - {table[0]}")
        else:
            print("\nNo tables found. Database is ready for schema creation.")
        
        cursor.close()
        conn.close()
        
        return True
        
    except psycopg2.OperationalError as e:
        print(f"\n❌ Connection failed: {e}")
        print("\nPossible solutions:")
        print("1. Check if PostgreSQL service is running")
        print("2. Verify the database 'heliopharm' exists")
        print("3. Confirm the password 'Ashrudi' is correct")
        print("4. Ensure user 'postgres' has access to the database")
        return False
        
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)

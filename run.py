#!/usr/bin/env python3
"""
Run script for YOLOv8 Object Detection Application
"""
import os
import sys
from app import create_app

if __name__ == '__main__':
    # Set environment variables if not already set
    if not os.environ.get('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'development'
    
    # Create and run the app
    app = create_app()
    
    # Get port from environment or use default
    port = int(os.environ.get('PORT', 5000))
    
    print(f"Starting YOLOv8 Object Detection App on port {port}")
    print(f"Environment: {os.environ.get('FLASK_ENV', 'development')}")
    print(f"Open your browser to: http://localhost:{port}")
    
    try:
        app.run(
            host='0.0.0.0',
            port=port,
            debug=app.config.get('DEBUG', False)
        )
    except KeyboardInterrupt:
        print("\nApplication stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"Error starting application: {e}")
        sys.exit(1)

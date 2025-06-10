"""
YOLOv8 Object Detection Web Application

A Flask web application for object detection using YOLOv8.
This application allows users to upload images and get object detection results.
"""
import os
from flask import Flask, render_template
from config import config
from models import ObjectDetector
from routes import Routes, APIRoutes
from utils import setup_logging, cleanup_old_files


def create_app(config_name=None):
    """
    Application factory pattern
    
    Args:
        config_name (str): Configuration environment name
        
    Returns:
        Flask: Configured Flask application
    """
    # Create Flask app
    app = Flask(__name__)
    
    # Load configuration
    config_name = config_name or os.environ.get('FLASK_ENV', 'default')
    app_config = config[config_name]
    app.config.from_object(app_config)
    
    # Setup logging
    setup_logging(app, app_config.LOG_LEVEL, app_config.LOG_FILE)
    app.logger.info(f"Application started with {config_name} configuration")
    
    # Ensure required directories exist
    os.makedirs(app_config.UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(os.path.dirname(app_config.MODEL_PATH), exist_ok=True)
    
    # Initialize object detector
    detector = ObjectDetector(
        model_path=app_config.MODEL_PATH,
        confidence_threshold=app_config.MODEL_CONFIDENCE_THRESHOLD
    )
    
    # Register routes
    Routes(app, detector, app_config)
    APIRoutes(app, detector, app_config)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return render_template('error.html'), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Internal server error: {error}")
        return render_template('error.html'), 500
    
    @app.errorhandler(413)
    def request_entity_too_large(error):
        return render_template('error.html'), 413
    
    # Cleanup old files on startup
    cleanup_old_files(app_config.UPLOAD_FOLDER, max_age_hours=24)
    
    app.logger.info("Application initialization completed")
    return app


def main():
    """Main entry point"""
    app = create_app()
    
    # Run the application
    app.run(
        debug=app.config.get('DEBUG', False),
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000))
    )


if __name__ == '__main__':
    main()

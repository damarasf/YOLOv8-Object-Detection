"""
Main application routes
"""
import os
import logging
from flask import render_template, request, redirect, url_for, flash, send_from_directory
from models import ObjectDetector
from utils import allowed_file, save_uploaded_file, save_result_image

logger = logging.getLogger(__name__)

class Routes:
    """Main application routes"""
    
    def __init__(self, app, detector, config):
        """
        Initialize routes with Flask app and dependencies
        
        Args:
            app: Flask application instance
            detector: ObjectDetector instance
            config: Application configuration
        """
        self.app = app
        self.detector = detector
        self.config = config
        self._register_routes()
    
    def _register_routes(self):
        """Register all application routes"""
        self.app.add_url_rule('/', 'index', self.index)
        self.app.add_url_rule('/detect', 'detect_objects', self.detect_objects, methods=['POST'])
        self.app.add_url_rule('/uploads/<filename>', 'uploaded_file', self.uploaded_file)
        self.app.add_url_rule('/static/<path:filename>', 'serve_static', self.serve_static)
        self.app.add_url_rule('/model-info', 'model_info', self.model_info)
    
    def index(self):
        """Home page route"""
        return render_template('index.html')
    
    def detect_objects(self):
        """Object detection route"""
        if 'file' not in request.files:
            flash('No file selected', 'error')
            return redirect(url_for('index'))
        
        file = request.files['file']
        
        if file.filename == '':
            flash('No file selected', 'error')
            return redirect(url_for('index'))
        
        if not allowed_file(file.filename, self.config.ALLOWED_EXTENSIONS):
            flash('Invalid file type. Please upload a JPG, JPEG, PNG, or GIF image.', 'error')
            return redirect(url_for('index'))
        
        try:
            # Save uploaded file
            filename, filepath = save_uploaded_file(file, self.config.UPLOAD_FOLDER)
            
            if not filename:
                flash('Error processing uploaded file', 'error')
                return redirect(url_for('index'))
            
            # Perform object detection
            detections, annotated_img = self.detector.detect(filepath)
            
            # Save result image
            result_filename = save_result_image(annotated_img, filename, self.config.UPLOAD_FOLDER)
            
            if not result_filename:
                flash('Error saving detection results', 'error')
                return redirect(url_for('index'))
            
            logger.info(f"Detection completed for {filename}: {len(detections)} objects found")
            
            # Render results
            return render_template('result.html',
                                 original_img=f"uploads/{filename}",
                                 result_img=f"uploads/{result_filename}",
                                 detections=detections,
                                 model_info=self.detector.get_model_info())
        
        except Exception as e:
            logger.error(f"Error during object detection: {e}")
            flash('An error occurred during object detection', 'error')
            return redirect(url_for('index'))
    
    def uploaded_file(self, filename):
        """Serve uploaded files"""
        return send_from_directory(self.config.UPLOAD_FOLDER, filename)
    
    def serve_static(self, filename):
        """Serve static files with no caching"""
        response = send_from_directory('static', filename)
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response
    
    def model_info(self):
        """API endpoint for model information"""
        return self.detector.get_model_info()

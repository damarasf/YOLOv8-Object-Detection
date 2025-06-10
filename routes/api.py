"""
API routes for YOLOv8 Object Detection
"""
import logging
from flask import jsonify, request
from models import ObjectDetector
from utils import allowed_file, save_uploaded_file

logger = logging.getLogger(__name__)

class APIRoutes:
    """API endpoints for object detection"""
    
    def __init__(self, app, detector, config):
        """
        Initialize API routes
        
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
        """Register all API routes"""
        self.app.add_url_rule('/api/model-info', 'api_model_info', self.model_info, methods=['GET'])
        self.app.add_url_rule('/api/detect', 'api_detect', self.detect_objects, methods=['POST'])
        self.app.add_url_rule('/api/health', 'api_health', self.health_check, methods=['GET'])
    
    def model_info(self):
        """Get model information API endpoint"""
        try:
            info = self.detector.get_model_info()
            return jsonify({
                'success': True,
                'data': info
            })
        except Exception as e:
            logger.error(f"Error getting model info: {e}")
            return jsonify({
                'success': False,
                'error': 'Failed to get model information'
            }), 500
    
    def detect_objects(self):
        """Object detection API endpoint"""
        try:
            if 'file' not in request.files:
                return jsonify({
                    'success': False,
                    'error': 'No file provided'
                }), 400
            
            file = request.files['file']
            
            if file.filename == '':
                return jsonify({
                    'success': False,
                    'error': 'No file selected'
                }), 400
            
            if not allowed_file(file.filename, self.config.ALLOWED_EXTENSIONS):
                return jsonify({
                    'success': False,
                    'error': 'Invalid file type'
                }), 400
            
            # Save uploaded file
            filename, filepath = save_uploaded_file(file, self.config.UPLOAD_FOLDER)
            
            if not filename:
                return jsonify({
                    'success': False,
                    'error': 'Failed to save uploaded file'
                }), 500
            
            # Perform detection
            detections, _ = self.detector.detect(filepath)
            
            return jsonify({
                'success': True,
                'data': {
                    'filename': filename,
                    'detections': detections,
                    'total_objects': len(detections)
                }
            })
            
        except Exception as e:
            logger.error(f"Error in API detection: {e}")
            return jsonify({
                'success': False,
                'error': 'Internal server error'
            }), 500
    
    def health_check(self):
        """Health check API endpoint"""
        try:
            # Test model availability
            model_info = self.detector.get_model_info()
            
            return jsonify({
                'success': True,
                'status': 'healthy',
                'model_loaded': model_info is not None,
                'timestamp': __import__('datetime').datetime.utcnow().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return jsonify({
                'success': False,
                'status': 'unhealthy',
                'error': str(e)
            }), 500

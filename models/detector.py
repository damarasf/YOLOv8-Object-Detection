"""
YOLOv8 object detection model wrapper
"""
import os
import logging
from ultralytics import YOLO
from PIL import Image
import numpy as np

logger = logging.getLogger(__name__)

class ObjectDetector:
    """YOLOv8 Object Detection Model Wrapper"""
    
    def __init__(self, model_path='yolov8n.pt', confidence_threshold=0.25):
        """
        Initialize the object detector
        
        Args:
            model_path (str): Path to the YOLOv8 model file
            confidence_threshold (float): Minimum confidence threshold for detections
        """
        self.model_path = model_path
        self.confidence_threshold = confidence_threshold
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load the YOLOv8 model"""
        try:
            # Create models directory if it doesn't exist
            os.makedirs(os.path.dirname(self.model_path) if os.path.dirname(self.model_path) else '.', exist_ok=True)
            
            # Load the model
            self.model = YOLO(self.model_path)
            logger.info(f"Successfully loaded YOLOv8 model from {self.model_path}")
            
        except Exception as e:
            logger.error(f"Failed to load YOLOv8 model: {e}")
            raise
    
    def detect(self, image_path):
        """
        Perform object detection on an image
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            tuple: (detection_results, annotated_image_array)
        """
        try:
            # Run inference
            results = self.model(image_path, conf=self.confidence_threshold)
            result = results[0]
            
            # Get annotated image
            annotated_img = result.plot()
            
            # Parse detections
            detections = self._parse_detections(result)
            
            logger.info(f"Detected {len(detections)} objects in {image_path}")
            return detections, annotated_img
            
        except Exception as e:
            logger.error(f"Error during object detection: {e}")
            raise
    
    def _parse_detections(self, result):
        """
        Parse YOLOv8 detection results
        
        Args:
            result: YOLOv8 detection result
            
        Returns:
            list: List of detection dictionaries
        """
        detections = []
        
        if result.boxes is not None and len(result.boxes) > 0:
            for box in result.boxes:
                class_id = int(box.cls[0].item())
                class_name = result.names[class_id]
                confidence = round(float(box.conf[0].item()) * 100, 2)
                
                # Get bounding box coordinates
                x1, y1, x2, y2 = [round(float(x)) for x in box.xyxy[0].tolist()]
                
                detections.append({
                    'class': class_name,
                    'confidence': confidence,
                    'bbox': [x1, y1, x2, y2],
                    'class_id': class_id
                })
        
        return detections
    
    def get_model_info(self):
        """Get information about the loaded model"""
        if self.model:
            return {
                'model_path': self.model_path,
                'confidence_threshold': self.confidence_threshold,
                'class_names': list(self.model.names.values()) if hasattr(self.model, 'names') else []
            }
        return None

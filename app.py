import os
import uuid
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory
from PIL import Image
import numpy as np
from ultralytics import YOLO

# Initialize the Flask application
app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a random secret key in production

# Configure upload folder
UPLOAD_FOLDER = os.path.join('static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Disable caching for development

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the YOLOv8 model
model = YOLO('yolov8n.pt')  # Using the nano model for speed, change to yolov8s.pt, yolov8m.pt, etc. for better accuracy

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/detect', methods=['POST'])
def detect_objects():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    
    file = request.files['file']
    
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    
    if file and allowed_file(file.filename):
        # Generate a unique filename
        filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the uploaded file
        file.save(filepath)
        
        # Process the image with YOLOv8
        results = model(filepath)
        
        # Get the first result (should only be one image)
        result = results[0]
          # Save the result with annotations
        result_filename = 'result_' + filename
        result_path = os.path.join(app.config['UPLOAD_FOLDER'], result_filename)
        
        # Plot the result and save
        result_img = result.plot()  # This returns the image with annotations
        result_pil = Image.fromarray(result_img)
        result_pil.save(result_path)
        
        # Make sure the file is written to disk
        try:
            os.chmod(result_path, 0o644)  # Make sure the file is readable
        except Exception as e:
            print(f"Warning: Could not set permissions on result image: {e}")
        
        # Debug information
        print(f"Original image path: {filepath}")
        print(f"Result image path: {result_path}")
        print(f"URL original: uploads/{filename}")
        print(f"URL result: uploads/{result_filename}")
        
        # Get detection results (class names, confidence scores, bounding boxes)
        detections = []
        if result.boxes is not None and len(result.boxes) > 0:
            for box in result.boxes:
                class_id = int(box.cls[0].item())
                class_name = result.names[class_id]
                confidence = round(float(box.conf[0].item()) * 100, 2)  # Convert to percentage
                
                # Get coordinates of the bounding box
                x1, y1, x2, y2 = [round(float(x)) for x in box.xyxy[0].tolist()]
                
                detections.append({
                    'class': class_name,
                    'confidence': confidence,
                    'bbox': [x1, y1, x2, y2]
                })
          # Return the template with detection results
        response = render_template('result.html', 
                              original_img=f"uploads/{filename}",
                              result_img=f"uploads/{result_filename}",
                              detections=detections)
        
        # Add no-cache headers to the response
        return response
    
    flash('Invalid file type. Please upload a JPG, JPEG, or PNG image.')
    return redirect(url_for('index'))

# Add a route to serve all static files with no caching
@app.route('/static/<path:filename>')
def serve_static(filename):
    response = send_from_directory('static', filename)
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

if __name__ == '__main__':
    # Download the model if it doesn't exist
    if not os.path.exists('yolov8n.pt'):
        model.download('yolov8n.pt')
    
    # Clear existing files in uploads directory for testing
    for file in os.listdir(UPLOAD_FOLDER):
        try:
            os.remove(os.path.join(UPLOAD_FOLDER, file))
            print(f"Removed old file: {file}")
        except Exception as e:
            print(f"Error removing file {file}: {e}")
    
    app.run(debug=True)

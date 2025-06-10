# YOLOv8 Object Detection Web Application

This is a web application that allows users to upload images and perform object detection using YOLOv8, a state-of-the-art real-time object detection model. The application provides a clean and intuitive interface for detecting objects in images with high accuracy.

![YOLOv8 Object Detection](https://raw.githubusercontent.com/ultralytics/assets/main/yolov8/yolo-comparison-plots.png)

## Features

- **User-friendly web interface** with modern, responsive design
- **Drag and drop image upload** functionality
- **Real-time object detection** using YOLOv8
- **Interactive results display** showing:
  - Original uploaded image
  - Annotated image with detected objects
  - Detailed table of detections with confidence scores
- **Download functionality** for the annotated images
- **Caching control** to ensure latest results are always displayed
- **Cross-platform compatibility** with modern web browsers

## Requirements

- Python 3.8+
- Flask
- Ultralytics YOLOv8
- Pillow
- NumPy

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/damarasf/YOLOv8-Object-Detection.git
   cd YOLOv8-Object-Detection
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Start the Flask application:
   ```bash
   python app.py
   ```

2. Open your web browser and navigate to:
   ```
   http://127.0.0.1:5000/
   ```

3. Upload an image using the web interface:
   - Click on the upload area or drag and drop an image file
   - Supported formats: JPG, JPEG, PNG
   - Wait for the detection process to complete

4. View the detection results, including:
   - Original image (left panel)
   - Image with bounding boxes (right panel)
   - Table showing detected objects with class names and confidence scores
   - Option to download the annotated image or try another image

## How It Works

1. **Image Upload**: The user uploads an image through the web interface
2. **Backend Processing**: The Flask server processes the image using YOLOv8
3. **Object Detection**: YOLOv8 identifies objects in the image, their classes, and confidence scores
4. **Visualization**: Bounding boxes are drawn around detected objects
5. **Results Display**: The web interface shows the original image, annotated image, and detection details

## YOLOv8 Models

By default, the application uses the YOLOv8n (nano) model for faster inference. You can change this in the `app.py` file to use other variants for better accuracy:

| Model | Size (pixels) | mAP val | Speed CPU (ms) | Speed A100 (ms) | Parameters (M) |
|-------|---------------|---------|---------------|-----------------|---------------|
| YOLOv8n | 640 | 37.3 | 80.4 | 0.99 | 3.2 |
| YOLOv8s | 640 | 44.9 | 128.4 | 1.20 | 11.2 |
| YOLOv8m | 640 | 50.2 | 234.7 | 1.83 | 25.9 |
| YOLOv8l | 640 | 52.9 | 375.2 | 2.39 | 43.7 |
| YOLOv8x | 640 | 53.9 | 479.1 | 3.53 | 68.2 |

To change the model, modify this line in `app.py`:

```python
# Load the YOLOv8 model
model = YOLO('yolov8n.pt')  # Change to 'yolov8s.pt', 'yolov8m.pt', etc.
```

## Project Structure

```
├── app.py                  # Main Flask application
├── requirements.txt        # Dependencies list
├── static/                 # Static files
│   └── uploads/            # Storage for uploaded and processed images
├── templates/              # HTML templates
│   ├── index.html          # Homepage with upload interface
│   └── result.html         # Results page
└── .gitignore              # Git ignore file
```

## Technologies Used

- **Backend**: Python, Flask
- **Object Detection**: Ultralytics YOLOv8
- **Image Processing**: Pillow, NumPy
- **Frontend**: HTML, CSS, JavaScript
- **Web Interface**: Responsive design with modern CSS

## Troubleshooting

- **Images not displaying**: Try refreshing the page or clearing your browser cache
- **Model loading errors**: Ensure you have downloaded the YOLOv8 model file to the project root directory
- **Dependencies issues**: Make sure you have installed all required packages from requirements.txt
- **Upload errors**: Verify that you're using a supported image format (JPG, JPEG, PNG)

## Future Enhancements

- Real-time object detection from webcam
- Support for video file analysis
- Multiple model selection from the web interface
- Batch processing of multiple images
- Custom object detection training interface

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This application uses [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics) for object detection
- Built with [Flask](https://flask.palletsprojects.com/)
- Inspired by the YOLO (You Only Look Once) family of object detection models
- Special thanks to the open-source community for their contributions to computer vision

## Author

- [Damara Satya Fadhilah](https://github.com/damarasf)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

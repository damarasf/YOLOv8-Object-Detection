# YOLOv8 Object Detection Web Application

A Flask web application for object detection using YOLOv8. Upload images through a web interface and get real-time object detection results with bounding boxes and confidence scores.

## ✨ Features

- **Object Detection**: Powered by YOLOv8 nano model for fast inference
- **Web Interface**: Responsive web UI with drag & drop upload
- **API Endpoints**: RESTful API for programmatic access
- **80+ Object Classes**: Detects people, vehicles, animals, and common objects
- **Result Visualization**: Images with bounding boxes and confidence scores
- **File Management**: Automatic cleanup of old uploaded files

## 📁 Project Structure

```
yolov8-object-detection/
├── app.py                     # Main application entry point
├── run.py                     # Alternative run script
├── requirements.txt           # Python dependencies
├── config/                    # Configuration management
│   └── settings.py           # App settings and configuration
├── models/                    # AI model handling
│   ├── detector.py           # YOLOv8 model wrapper (ObjectDetector class)
│   └── yolov8n.pt           # Model weights
├── routes/                    # Application routes (class-based)
│   ├── main.py              # Web interface routes (Routes class)
│   └── api.py               # API endpoints (APIRoutes class)
├── utils/                     # Utility functions
│   ├── file_handler.py      # File upload and validation
│   └── logger.py            # Logging configuration
├── templates/                 # HTML templates
│   ├── index.html           # Upload page
│   ├── result.html          # Results display
│   └── error.html           # Error page
├── static/                    # Static assets
│   ├── css/main.css         # Stylesheet
│   ├── js/main.js           # JavaScript functionality
│   └── uploads/             # Uploaded images storage
└── logs/                      # Application logs
```

## 🚀 Installation & Usage

### Prerequisites
- Python 3.8+
- pip package installer

### Quick Start

1. **Install dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

2. **Run the application**
   ```powershell
   python app.py
   # or alternatively
   python run.py
   ```

3. **Open your browser**  
   Navigate to `http://localhost:5000`

### Using the Application

1. **Upload Image**: Drag and drop or click to upload (JPG, PNG, GIF supported)
2. **Detect Objects**: Click "Detect Objects" to analyze the image  
3. **View Results**: See detected objects with bounding boxes and confidence scores

### API Endpoints

- **Health Check**: `GET /api/health`
- **Model Info**: `GET /api/model-info`
- **Object Detection**: `POST /api/detect` (with image file)

## ⚙️ Configuration

Key settings in `config/settings.py`:
- **Model confidence threshold**: 0.25 (default)
- **Max file size**: 16MB
- **Supported formats**: PNG, JPG, JPEG, GIF
- **Upload folder**: `static/uploads/`
- **Auto cleanup**: Files older than 24 hours

## 🎯 Supported Objects

YOLOv8 detects 80+ object classes including:
- **People & Animals**: person, cat, dog, horse, bird, etc.
- **Vehicles**: car, motorcycle, bus, truck, airplane, boat
- **Common Objects**: chair, bottle, laptop, phone, book, etc.

## 🔧 Development

### Architecture
- **Flask Factory Pattern**: `create_app()` in `app.py`
- **Class-based Routes**: `Routes` and `APIRoutes` classes
- **Model Wrapper**: `ObjectDetector` class for YOLOv8
- **Configuration Management**: Environment-based config classes

### Key Components
- `models/detector.py`: YOLOv8 integration and inference
- `routes/main.py`: Web interface handling
- `routes/api.py`: RESTful API endpoints
- `utils/file_handler.py`: File validation and processing

## 📝 License

MIT License - see the LICENSE file for details.

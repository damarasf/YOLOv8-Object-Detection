# YOLOv8 Object Detection Web Application

A modern Flask web application for object detection using YOLOv8 (You Only Look Once version 8). This application provides an intuitive web interface for uploading images and getting real-time object detection results with bounding boxes and confidence scores.

## 🌟 Features

- **Real-time Object Detection**: Powered by YOLOv8 for fast and accurate object detection
- **Web Interface**: Clean, modern, responsive web UI
- **Drag & Drop Upload**: Easy file upload with drag-and-drop support
- **80+ Object Classes**: Detects common objects like people, vehicles, animals, and more
- **API Endpoints**: RESTful API for programmatic access
- **Result Download**: Export detection results as JSON
- **Mobile Friendly**: Responsive design works on all devices
- **Error Handling**: Comprehensive error handling and logging

## 🏗️ Project Structure

```
yolov8-object-detection/
├── app.py                     # Main application entry point
├── config/                    # Configuration management
│   ├── __init__.py
│   └── settings.py           # App settings and configuration
├── models/                    # AI model handling
│   ├── __init__.py
│   ├── detector.py           # YOLOv8 model wrapper
│   └── yolov8n.pt           # Model weights (downloaded automatically)
├── routes/                    # Application routes
│   ├── __init__.py
│   ├── main.py              # Main web routes
│   └── api.py               # API endpoints
├── utils/                     # Utility functions
│   ├── __init__.py
│   ├── file_handler.py      # File upload and validation
│   └── logger.py            # Logging configuration
├── templates/                 # HTML templates
│   ├── index.html           # Home page
│   ├── result.html          # Results page
│   └── error.html           # Error page
├── static/                    # Static assets
│   ├── css/
│   │   └── main.css         # Main stylesheet
│   ├── js/
│   │   └── main.js          # JavaScript functionality
│   └── uploads/             # Uploaded images storage
├── logs/                      # Application logs
├── requirements.txt           # Python dependencies
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone or download the project**
   ```powershell
   git clone <https://github.com/damarasf/YOLOv8-Object-Detection.git>
   cd yolov8-object-detection
   ```

2. **Install dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```powershell
   python app.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

### Docker Installation (Optional)

```dockerfile
# Create a Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["python", "app.py"]
```

```powershell
docker build -t yolov8-detector .
docker run -p 5000:5000 yolov8-detector
```

## 🎯 Usage

### Web Interface

1. **Upload Image**: Drag and drop or click to upload an image (JPG, PNG, GIF)
2. **Detect Objects**: Click "Detect Objects" to analyze the image
3. **View Results**: See detected objects with bounding boxes and confidence scores
4. **Download Results**: Export detection data as JSON

### API Endpoints

#### Health Check
```powershell
curl http://localhost:5000/api/health
```

#### Model Information
```powershell
curl http://localhost:5000/api/model-info
```

#### Object Detection
```powershell
curl -X POST -F "file=@image.jpg" http://localhost:5000/api/detect
```

Example API response:
```json
{
  "success": true,
  "data": {
    "filename": "unique_filename.jpg",
    "total_objects": 3,
    "detections": [
      {
        "class": "person",
        "confidence": 89.5,
        "bbox": [100, 150, 300, 450],
        "class_id": 0
      }
    ]
  }
}
```

## ⚙️ Configuration

### Environment Variables

- `FLASK_ENV`: Environment mode (`development`, `production`)
- `SECRET_KEY`: Flask secret key for sessions
- `PORT`: Application port (default: 5000)

### Configuration Files

Edit `config/settings.py` to customize:

- Model confidence threshold
- Upload folder location
- Maximum file size
- Logging settings
- Model path

## 🔧 Development

### Project Architecture

The application follows a modular architecture with clear separation of concerns:

- **Configuration**: Centralized settings management
- **Models**: AI model abstraction and handling
- **Routes**: Web routes and API endpoints
- **Utils**: Utility functions and helpers
- **Templates**: HTML templates with modern design
- **Static**: CSS, JavaScript, and asset files

### Code Quality

The codebase includes:

- Type hints and docstrings
- Comprehensive error handling
- Logging throughout the application
- Input validation and sanitization
- Responsive design patterns

### Adding New Features

1. **New Routes**: Add to `routes/main.py` or `routes/api.py`
2. **Model Changes**: Modify `models/detector.py`
3. **UI Updates**: Update templates and static files
4. **Configuration**: Add settings to `config/settings.py`

## 📊 Supported Object Classes

YOLOv8 can detect 80 different object classes including:

- **People**: person
- **Vehicles**: car, motorcycle, airplane, bus, train, truck, boat
- **Animals**: bird, cat, dog, horse, sheep, cow, elephant, bear, zebra, giraffe
- **Sports**: frisbee, skis, snowboard, sports ball, kite, baseball bat, baseball glove, skateboard, surfboard, tennis racket
- **Kitchen**: bottle, wine glass, cup, fork, knife, spoon, bowl, banana, apple, sandwich, orange, broccoli, carrot, hot dog, pizza, donut, cake
- **Furniture**: chair, couch, potted plant, bed, dining table, toilet, tv, laptop, mouse, remote, keyboard, cell phone, microwave, oven, toaster, sink, refrigerator
- **Electronics**: clock, vase, scissors, teddy bear, hair drier, toothbrush

## 🚨 Error Handling

The application includes comprehensive error handling for:

- Invalid file formats
- File size limits
- Model loading failures
- Network errors
- Server errors

All errors are logged and user-friendly error messages are displayed.

## 📈 Performance

- **Fast Detection**: Uses YOLOv8 nano model for speed
- **Efficient Processing**: Optimized image handling
- **Caching**: Static file caching for better performance
- **Cleanup**: Automatic cleanup of old uploaded files

## 🔒 Security

- File type validation
- File size limits
- Secure filename handling
- Input sanitization
- Error message sanitization

## 📝 Logging

Logs are stored in the `logs/` directory and include:

- Application startup/shutdown
- User uploads and detections
- Errors and warnings
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics) for the object detection model
- [Flask](https://flask.palletsprojects.com/) for the web framework
- The open-source community for various tools and libraries

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the error logs in `logs/app.log`

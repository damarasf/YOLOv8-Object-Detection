"""
Utility functions for file handling and validation
"""
import os
import uuid
import logging
from werkzeug.utils import secure_filename
from PIL import Image

logger = logging.getLogger(__name__)

def allowed_file(filename, allowed_extensions):
    """
    Check if a file has an allowed extension
    
    Args:
        filename (str): Name of the file
        allowed_extensions (set): Set of allowed file extensions
        
    Returns:
        bool: True if file extension is allowed
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def generate_unique_filename(original_filename):
    """
    Generate a unique filename while preserving the original extension
    
    Args:
        original_filename (str): Original filename
        
    Returns:
        str: Unique filename
    """
    file_extension = os.path.splitext(original_filename)[1]
    unique_filename = str(uuid.uuid4()) + file_extension
    return secure_filename(unique_filename)

def save_uploaded_file(file, upload_folder):
    """
    Save uploaded file with a unique name
    
    Args:
        file: Flask uploaded file object
        upload_folder (str): Path to upload folder
        
    Returns:
        tuple: (filename, filepath) or (None, None) if failed
    """
    try:
        # Generate unique filename
        filename = generate_unique_filename(file.filename)
        filepath = os.path.join(upload_folder, filename)
        
        # Ensure upload directory exists
        os.makedirs(upload_folder, exist_ok=True)
        
        # Save file
        file.save(filepath)
        
        # Validate image
        if validate_image(filepath):
            logger.info(f"Successfully saved file: {filename}")
            return filename, filepath
        else:
            os.remove(filepath)  # Remove invalid file
            logger.warning(f"Invalid image file removed: {filename}")
            return None, None
            
    except Exception as e:
        logger.error(f"Error saving uploaded file: {e}")
        return None, None

def validate_image(filepath):
    """
    Validate that the file is a valid image
    
    Args:
        filepath (str): Path to the image file
        
    Returns:
        bool: True if valid image
    """
    try:
        with Image.open(filepath) as img:
            img.verify()  # Verify image integrity
        return True
    except Exception as e:
        logger.warning(f"Image validation failed for {filepath}: {e}")
        return False

def save_result_image(image_array, filename, upload_folder):
    """
    Save detection result image
    
    Args:
        image_array: NumPy array of the annotated image
        filename (str): Base filename
        upload_folder (str): Path to upload folder
        
    Returns:
        str: Result filename or None if failed
    """
    try:
        result_filename = 'result_' + filename
        result_path = os.path.join(upload_folder, result_filename)
        
        # Convert array to PIL Image and save
        result_pil = Image.fromarray(image_array)
        result_pil.save(result_path)
        
        # Set file permissions
        try:
            os.chmod(result_path, 0o644)
        except Exception as e:
            logger.warning(f"Could not set permissions on result image: {e}")
        
        logger.info(f"Successfully saved result image: {result_filename}")
        return result_filename
        
    except Exception as e:
        logger.error(f"Error saving result image: {e}")
        return None

def cleanup_old_files(directory, max_age_hours=24):
    """
    Clean up old files in a directory
    
    Args:
        directory (str): Directory path
        max_age_hours (int): Maximum age of files in hours
    """
    try:
        import time
        current_time = time.time()
        max_age_seconds = max_age_hours * 3600
        
        for filename in os.listdir(directory):
            filepath = os.path.join(directory, filename)
            if os.path.isfile(filepath):
                file_age = current_time - os.path.getctime(filepath)
                if file_age > max_age_seconds:
                    os.remove(filepath)
                    logger.info(f"Cleaned up old file: {filename}")
                    
    except Exception as e:
        logger.error(f"Error during file cleanup: {e}")

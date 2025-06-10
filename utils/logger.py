"""
Logging configuration and utilities
"""
import os
import logging
from logging.handlers import RotatingFileHandler

def setup_logging(app, log_level='INFO', log_file='logs/app.log'):
    """
    Set up logging for the application
    
    Args:
        app: Flask application instance
        log_level (str): Logging level
        log_file (str): Path to log file
    """
    # Create logs directory if it doesn't exist
    log_dir = os.path.dirname(log_file)
    if log_dir:
        os.makedirs(log_dir, exist_ok=True)
    
    # Set logging level
    level = getattr(logging, log_level.upper(), logging.INFO)
    
    # Configure logging format
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # File handler with rotation
    file_handler = RotatingFileHandler(
        log_file, maxBytes=10240000, backupCount=10
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(level)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    console_handler.setLevel(level)
    
    # Configure app logger
    app.logger.setLevel(level)
    app.logger.addHandler(file_handler)
    app.logger.addHandler(console_handler)
    
    # Configure root logger
    logging.getLogger().setLevel(level)
    logging.getLogger().addHandler(file_handler)
    logging.getLogger().addHandler(console_handler)
    
    app.logger.info("Logging configured successfully")

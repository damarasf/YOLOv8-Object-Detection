// Main JavaScript for YOLOv8 Object Detection App

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const submitBtn = document.getElementById('submit-btn');
    const uploadForm = document.getElementById('upload-form');
    const loading = document.getElementById('loading');
    const uploadArea = document.querySelector('.upload-area');
    const previewContainer = document.querySelector('.preview-container');
    const previewInfo = document.querySelector('.preview-info');
    const progressBar = document.querySelector('.progress-bar');
    const uploadProgress = document.querySelector('.upload-progress');

    // Initialize tooltips and animations
    initializeAnimations();

    // File input change handler
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelection);
    }

    // Form submit handler
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleFormSubmit);
    }

    // Drag and drop functionality
    if (uploadArea) {
        setupDragAndDrop();
    }

    function initializeAnimations() {
        // Add entrance animations to elements
        const containers = document.querySelectorAll('.upload-container, .result-container');
        containers.forEach((container, index) => {
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            setTimeout(() => {
                container.style.transition = 'all 0.6s ease-out';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    function handleFileSelection() {
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            
            // Validate file size (16MB max)
            if (file.size > 16 * 1024 * 1024) {
                showError('File size too large. Please select a file smaller than 16MB.');
                resetFileInput();
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                showError('Invalid file type. Please select a JPG, JPEG, PNG, or GIF image.');
                resetFileInput();
                return;
            }

            // Show progress
            showProgress();
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                if (imagePreview) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'inline-block';
                    
                    // Show preview container with animation
                    if (previewContainer) {
                        previewContainer.classList.add('show');
                    }
                    
                    // Update file info
                    updateFileInfo(file);
                    
                    // Enable submit button with animation
                    enableSubmitButton();
                }
                hideProgress();
            };

            reader.onerror = function() {
                showError('Error reading file. Please try again.');
                resetFileInput();
                hideProgress();
            };
            
            reader.readAsDataURL(file);
        }
    }

    function updateFileInfo(file) {
        if (previewInfo) {
            const fileName = document.getElementById('file-name');
            const fileSize = document.getElementById('file-size');
            const fileType = document.getElementById('file-type');
            
            if (fileName) fileName.textContent = `📄 ${file.name}`;
            if (fileSize) fileSize.textContent = `📏 ${formatFileSize(file.size)}`;
            if (fileType) fileType.textContent = `🏷️ ${file.type}`;
            
            previewInfo.style.display = 'block';
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function enableSubmitButton() {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                submitBtn.style.transform = 'scale(1)';
            }, 200);
        }
    }

    function resetFileInput() {
        if (fileInput) {
            fileInput.value = '';
        }
        if (imagePreview) {
            imagePreview.style.display = 'none';
            imagePreview.src = '';
        }
        if (previewContainer) {
            previewContainer.classList.remove('show');
        }
        if (previewInfo) {
            previewInfo.style.display = 'none';
        }
        if (submitBtn) {
            submitBtn.disabled = true;
        }
    }

    function showProgress() {
        if (uploadProgress) {
            uploadProgress.style.display = 'block';
            if (progressBar) {
                progressBar.style.width = '0%';
                // Simulate progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 30;
                    if (progress >= 90) {
                        clearInterval(interval);
                        progress = 90;
                    }
                    progressBar.style.width = progress + '%';
                }, 100);
            }
        }
    }

    function hideProgress() {
        if (uploadProgress) {
            if (progressBar) {
                progressBar.style.width = '100%';
            }
            setTimeout(() => {
                uploadProgress.style.display = 'none';
                if (progressBar) {
                    progressBar.style.width = '0%';
                }
            }, 500);
        }
    }

    function showError(message) {
        // Create and show error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'flash-message error';
        errorDiv.innerHTML = `<strong>⚠️ Error:</strong> ${message}`;
        
        const flashContainer = document.querySelector('.flash-messages') || createFlashContainer();
        flashContainer.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.animation = 'slideOut 0.5s ease-in forwards';
                setTimeout(() => {
                    errorDiv.remove();
                }, 500);
            }
        }, 5000);
    }

    function createFlashContainer() {
        const container = document.createElement('div');
        container.className = 'flash-messages';
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.insertBefore(container, mainContent.firstChild);
        }
        return container;
    }

    function handleFormSubmit(e) {
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        
        if (loading) {
            loading.style.display = 'block';
            loading.style.animation = 'fadeIn 0.5s ease-out';
        }
        
        // Add loading state to upload area
        if (uploadArea) {
            uploadArea.style.opacity = '0.5';
            uploadArea.style.pointerEvents = 'none';
        }
    }

    function setupDragAndDrop() {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
        uploadArea.addEventListener('drop', handleDrop, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight() {
            uploadArea.classList.add('dragover');
        }

        function unhighlight() {
            uploadArea.classList.remove('dragover');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                fileInput.files = files;
                handleFileSelection();
            }
        }
    }
});

// Additional utility functions for result page
function downloadResults() {
    const resultImage = document.querySelector('.image-container img[alt*="Detection Results"]');
    if (resultImage) {
        const link = document.createElement('a');
        link.download = 'yolov8-detection-results.png';
        link.href = resultImage.src;
        link.click();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `flash-message ${type}`;
    
    const icon = type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    notification.innerHTML = `<strong>${icon}</strong> ${message}`;
    
    const flashContainer = document.querySelector('.flash-messages') || createFlashContainer();
    flashContainer.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.5s ease-in forwards';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }, 5000);
}

function createFlashContainer() {
    const container = document.createElement('div');
    container.className = 'flash-messages';
    const uploadContainer = document.querySelector('.upload-container');
    if (uploadContainer) {
        uploadContainer.insertBefore(container, uploadContainer.firstChild);
    }
    return container;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideOut {
        from { 
            opacity: 1; 
            transform: translateX(0); 
        }
        to { 
            opacity: 0; 
            transform: translateX(-20px); 
        }
    }
`;
document.head.appendChild(style);

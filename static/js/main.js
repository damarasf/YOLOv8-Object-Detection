// Main JavaScript for YOLOv8 Object Detection App

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const submitBtn = document.getElementById('submit-btn');
    const uploadForm = document.getElementById('upload-form');
    const loading = document.getElementById('loading');
    const uploadArea = document.querySelector('.upload-area');

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

    function handleFileSelection() {
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            
            // Validate file size (16MB max)
            if (file.size > 16 * 1024 * 1024) {
                alert('File size too large. Please select a file smaller than 16MB.');
                fileInput.value = '';
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type. Please select a JPG, JPEG, PNG, or GIF image.');
                fileInput.value = '';
                return;
            }

            const reader = new FileReader();
            
            reader.onload = function(e) {
                if (imagePreview) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'inline-block';
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                }
            }
            
            reader.onerror = function() {
                alert('Error reading file. Please try again.');
                fileInput.value = '';
            }
            
            reader.readAsDataURL(file);
        } else {
            if (imagePreview) {
                imagePreview.style.display = 'none';
            }
            if (submitBtn) {
                submitBtn.disabled = true;
            }
        }
    }

    function handleFormSubmit() {
        if (loading) {
            loading.style.display = 'block';
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
        }
    }

    function setupDragAndDrop() {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            uploadArea.style.borderColor = '#2980b9';
            uploadArea.style.backgroundColor = '#f0f7ff';
        }

        function unhighlight() {
            uploadArea.style.borderColor = '#3498db';
            uploadArea.style.backgroundColor = '';
        }

        // Handle dropped files
        uploadArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                fileInput.files = files;
                
                // Trigger the change event
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            }
        }
    }

    // Auto-hide flash messages after 5 seconds
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 5000);
    });
});

// Utility functions
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `flash-message ${type}`;
    notification.textContent = message;
    
    const container = document.querySelector('.flash-messages') || document.querySelector('main');
    if (container) {
        container.insertBefore(notification, container.firstChild);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

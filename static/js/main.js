// Main JavaScript for YOLOv8 Object Detection App - Updated for Tailwind UI

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const submitBtn = document.getElementById('submit-btn');
    const uploadForm = document.getElementById('upload-form');
    const loading = document.getElementById('loading');
    const uploadArea = document.getElementById('upload-area');
    const uploadDisabled = document.getElementById('upload-disabled');
    const previewContainer = document.querySelector('.preview-container');
    const progressBar = document.querySelector('.progress-bar');
    const uploadProgress = document.querySelector('.upload-progress');
    const clearImageBtn = document.getElementById('clear-image-btn');

    // Initialize animations and interactions
    initializeAnimations();
    
    // File input change handler
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelection);
    }

    // Form submit handler
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleFormSubmit);
    }    // Clear image button handler
    if (clearImageBtn) {
        clearImageBtn.addEventListener('click', clearImage);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key to clear image (when image is uploaded)
        if (e.key === 'Escape' && previewContainer && !previewContainer.classList.contains('hidden')) {
            clearImage();
        }
    });

    // Drag and drop functionality
    if (uploadArea) {
        setupDragAndDrop();
    }

    function initializeAnimations() {
        // Add entrance animations to elements with staggered timing
        const animatedElements = document.querySelectorAll('.bg-white, .bg-gradient-to-br');
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }    function handleFileSelection() {
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            
            // Validate file size (16MB max)
            if (file.size > 16 * 1024 * 1024) {
                showNotification('File size too large. Please select a file smaller than 16MB.', 'error');
                resetFileInput();
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                showNotification('Invalid file type. Please select a JPG, JPEG, PNG, or GIF image.', 'error');
                resetFileInput();
                return;
            }

            // Show progress
            showProgress();
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                if (imagePreview) {
                    imagePreview.src = e.target.result;
                    
                    // Show preview container
                    if (previewContainer) {
                        previewContainer.classList.remove('hidden');
                        previewContainer.style.opacity = '0';
                        setTimeout(() => {
                            previewContainer.style.transition = 'opacity 0.3s ease-out';
                            previewContainer.style.opacity = '1';
                        }, 100);
                    }
                    
                    // Update file info
                    updateFileInfo(file);
                    
                    // Enable submit button
                    enableSubmitButton();
                    
                    // Disable upload area and show disabled state
                    disableUploadArea();
                    
                    showNotification('Image loaded successfully!', 'success');
                }
                hideProgress();
            };

            reader.onerror = function() {
                showNotification('Error reading file. Please try again.', 'error');
                resetFileInput();
                hideProgress();
            };

            reader.readAsDataURL(file);
        }
    }    function disableUploadArea() {
        if (uploadArea && uploadDisabled) {
            uploadArea.classList.add('hidden');
            uploadDisabled.classList.remove('hidden');
            uploadDisabled.style.opacity = '0';
            setTimeout(() => {
                uploadDisabled.style.transition = 'opacity 0.3s ease-out';
                uploadDisabled.style.opacity = '1';
            }, 100);
            console.log('Upload area disabled - image uploaded successfully');
        }
    }

    function enableUploadArea() {
        if (uploadArea && uploadDisabled) {
            uploadDisabled.classList.add('hidden');
            uploadArea.classList.remove('hidden');
            uploadArea.style.opacity = '0';
            setTimeout(() => {
                uploadArea.style.transition = 'opacity 0.3s ease-out';
                uploadArea.style.opacity = '1';
            }, 100);
            console.log('Upload area enabled - ready for new upload');
        }
    }function clearImage() {
        // Reset file input
        if (fileInput) fileInput.value = '';
        
        // Clear image preview
        if (imagePreview) imagePreview.src = '';
        
        // Hide preview container
        if (previewContainer) {
            previewContainer.style.opacity = '0';
            setTimeout(() => {
                previewContainer.classList.add('hidden');
            }, 300);
        }
        
        // Disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            submitBtn.innerHTML = '<i class="fas fa-search mr-2"></i>Detect Objects';
        }
        
        // Re-enable clear button (in case it was disabled during processing)
        if (clearImageBtn) {
            clearImageBtn.disabled = false;
            clearImageBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        
        // Enable upload area
        enableUploadArea();
        
        // Clear file info
        clearFileInfo();
        
        showNotification('Image cleared successfully!', 'success');
        
        // Log user action for analytics
        console.log('User cleared uploaded image');
    }

    function clearFileInfo() {
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        const fileType = document.getElementById('file-type');
        
        if (fileName) fileName.textContent = '';
        if (fileSize) fileSize.textContent = '';
        if (fileType) fileType.textContent = '';
    }

    function updateFileInfo(file) {
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        const fileType = document.getElementById('file-type');
        
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = formatFileSize(file.size);
        if (fileType) fileType.textContent = file.type;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }    function enableSubmitButton() {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            submitBtn.innerHTML = '<i class="fas fa-search mr-2"></i>Detect Objects';
        }
    }    function resetFileInput() {
        if (fileInput) fileInput.value = '';
        if (imagePreview) imagePreview.src = '';
        if (previewContainer) previewContainer.classList.add('hidden');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
        // Enable upload area
        enableUploadArea();
        // Clear file info
        clearFileInfo();
    }function showProgress() {
        if (uploadProgress) {
            uploadProgress.classList.remove('hidden');
            if (progressBar) {
                progressBar.style.width = '0%';
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 20 + 5;
                    if (progress >= 90) {
                        clearInterval(interval);
                        progress = 90;
                    }
                    progressBar.style.width = progress + '%';
                }, 100);
            }
        }
    }    function hideProgress() {
        if (uploadProgress && progressBar) {
            progressBar.style.width = '100%';
            setTimeout(() => {
                uploadProgress.classList.add('hidden');
                progressBar.style.width = '0%';
            }, 500);
        }
    }function handleFormSubmit(e) {
        if (!fileInput.files || !fileInput.files[0]) {
            e.preventDefault();
            showNotification('Please select a file first.', 'error');
            return false;
        }

        // Check if upload area is disabled (image already uploaded)
        if (uploadArea && uploadArea.classList.contains('hidden')) {
            // Image is already uploaded, proceed with processing
        }

        // Update UI for processing state
        if (loading) loading.classList.remove('hidden');
        if (uploadArea) {
            uploadArea.style.opacity = '0.5';
            uploadArea.style.pointerEvents = 'none';
        }
        if (uploadDisabled) {
            uploadDisabled.style.opacity = '0.5';
            uploadDisabled.style.pointerEvents = 'none';
        }        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner animate-spin mr-2"></i>Processing...';
        }

        // Disable clear button during processing
        if (clearImageBtn) {
            clearImageBtn.disabled = true;
            clearImageBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }

        // Update status indicator
        const statusIndicator = document.querySelector('nav .bg-green-100');
        if (statusIndicator) {
            statusIndicator.className = statusIndicator.className.replace('bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300', 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300');
            statusIndicator.innerHTML = '<div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div><span>Processing</span>';
        }

        showProgress();
        showNotification('Processing image with YOLOv8 AI...', 'info');
        return true;
    }function setupDragAndDrop() {
        if (!uploadArea) return;
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                // Only allow drag and drop if upload area is visible
                if (!uploadArea.classList.contains('hidden')) {
                    uploadArea.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                    uploadArea.classList.remove('border-gray-300');
                    const icon = uploadArea.querySelector('.fas.fa-cloud-upload-alt');
                    if (icon) {
                        icon.classList.add('text-blue-500');
                        icon.classList.remove('text-gray-400', 'dark:text-gray-500');
                    }
                }
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                uploadArea.classList.add('border-gray-300');
                const icon = uploadArea.querySelector('.fas.fa-cloud-upload-alt');
                if (icon) {
                    icon.classList.remove('text-blue-500');
                    icon.classList.add('text-gray-400', 'dark:text-gray-500');
                }
            }, false);
        });

        uploadArea.addEventListener('drop', (e) => {
            // Only allow drop if upload area is visible
            if (!uploadArea.classList.contains('hidden')) {
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    fileInput.files = files;
                    handleFileSelection();
                }
            }
        }, false);

        uploadArea.addEventListener('click', () => {
            // Only allow click if upload area is visible
            if (!uploadArea.classList.contains('hidden')) {
                fileInput.click();
            }
        });
    }function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-xl shadow-2xl z-50 transform transition-all duration-300 translate-x-full max-w-md`;
        
        if (type === 'error') {
            notification.classList.add('bg-red-500', 'text-white', 'border-l-4', 'border-red-700');
            notification.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-exclamation-triangle mr-3 mt-0.5 flex-shrink-0"></i>
                    <div>
                        <div class="font-semibold">Error</div>
                        <div class="text-sm opacity-90">${message}</div>
                    </div>
                </div>`;
        } else if (type === 'success') {
            notification.classList.add('bg-green-500', 'text-white', 'border-l-4', 'border-green-700');
            notification.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-check-circle mr-3 mt-0.5 flex-shrink-0"></i>
                    <div>
                        <div class="font-semibold">Success</div>
                        <div class="text-sm opacity-90">${message}</div>
                    </div>
                </div>`;
        } else {
            notification.classList.add('bg-blue-500', 'text-white', 'border-l-4', 'border-blue-700');
            notification.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-info-circle mr-3 mt-0.5 flex-shrink-0"></i>
                    <div>
                        <div class="font-semibold">Info</div>
                        <div class="text-sm opacity-90">${message}</div>
                    </div>
                </div>`;
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);        }, 5000);
    }

    // Fullscreen functionality for image preview
    function toggleFullscreen() {
        const imagePreview = document.getElementById('image-preview');
        if (!imagePreview || !imagePreview.src) return;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-pointer backdrop-blur-sm';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease-out';

        const modalImg = document.createElement('img');
        modalImg.src = imagePreview.src;
        modalImg.className = 'max-w-[90%] max-h-[90%] rounded-lg shadow-2xl transform scale-95';
        modalImg.style.transition = 'transform 0.3s ease-out';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'absolute top-4 right-4 text-white bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors duration-200';
        closeBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';

        modal.appendChild(modalImg);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);

        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
            modalImg.style.transform = 'scale(1)';
        }, 10);

        // Close handlers
        const closeModal = () => {
            modal.style.opacity = '0';
            modalImg.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
            }, 300);
        };

        modal.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);
        
        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    // Make toggleFullscreen globally available
    window.toggleFullscreen = toggleFullscreen;
});

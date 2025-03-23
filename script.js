// Initialize AOS
AOS.init({
    duration: 600,
    once: true,
    offset: 50
});

// Simple image loading handler
function handleImageLoading() {
    const images = document.querySelectorAll('.hero-image, .testimonial-image, .logo');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.onload = () => img.classList.add('loaded');
            img.onerror = () => console.error('Failed to load image:', img.src);
        }
    });
}

// Toast notification system
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        ${type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : ''}
        ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : ''}
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Simple form validation
function validateField(input) {
    const formGroup = input.closest('.form-group');
    
    if (input.required && !input.value.trim()) {
        const errorMessage = formGroup.querySelector('.error-message') || createErrorMessage(formGroup);
        errorMessage.textContent = 'This field is required';
        return false;
    }
    
    removeErrorMessage(formGroup);
    return true;
}

function createErrorMessage(formGroup) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    formGroup.appendChild(errorMessage);
    return errorMessage;
}

function removeErrorMessage(formGroup) {
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Form handling
document.addEventListener('DOMContentLoaded', () => {
    // Initialize image loading handling
    handleImageLoading();
    
    const form = document.getElementById('coachingForm');
    const formInputs = form.querySelectorAll('input, textarea, select');
    
    // Simple blur validation
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            const formGroup = input.closest('.form-group');
            formGroup.classList.add('touched');
            validateField(input);
        });
    });

    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Mark all fields as touched on submit attempt
        formInputs.forEach(input => {
            input.closest('.form-group').classList.add('touched');
        });
        
        let isValid = true;
        let firstError = null;

        // Validate all fields
        formInputs.forEach(input => {
            if (!validateField(input) && !firstError) {
                firstError = input;
                isValid = false;
            }
        });

        if (!isValid) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            form.innerHTML = `
                <div class="success-message" data-aos="fade-up">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--primary-color);"></i>
                    <h2>Thank you for your application!</h2>
                    <p>We'll be in touch with you shortly to discuss the next steps in your fitness journey.</p>
                </div>
            `;
            
            showToast('Application submitted successfully!', 'success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } catch (error) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showToast('Failed to submit application. Please try again.', 'error');
        }
    });

    // Add page load animation
    document.body.classList.add('loaded');
    
    // Prevent rubber-banding/bouncing effect on iOS
    document.body.addEventListener('touchmove', function(e) {
        if (e.target.closest('.form-group')) return;
        e.preventDefault();
    }, { passive: false });

    // Star Rating System
    const ratingContainer = document.querySelector('.star-rating');
    const ratingInputs = document.querySelectorAll('.star-rating input[type="radio"]');
    let currentRating = 0;
    
    ratingInputs.forEach((input, index) => {
        input.addEventListener('change', (e) => {
            currentRating = index + 1;
        });

        input.addEventListener('focus', () => {
            input.parentElement.style.outline = '2px solid #3b82f6';
            input.parentElement.style.outlineOffset = '2px';
        });

        input.addEventListener('blur', () => {
            input.parentElement.style.outline = 'none';
            input.parentElement.style.outlineOffset = '0';
        });
    });

    // Handle keyboard navigation
    ratingContainer.addEventListener('keydown', (e) => {
        const currentIndex = Array.from(ratingInputs).findIndex(input => input === document.activeElement);
        
        if (currentIndex === -1) return;

        let nextIndex;
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                nextIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                nextIndex = Math.min(ratingInputs.length - 1, currentIndex + 1);
                break;
            default:
                return;
        }

        ratingInputs[nextIndex].focus();
        ratingInputs[nextIndex].checked = true;
        currentRating = nextIndex + 1;
        e.preventDefault();
    });
});

// Add validation styling on input
document.querySelectorAll('input, textarea, select').forEach(element => {
    element.addEventListener('invalid', (event) => {
        event.target.classList.add('error');
    });
    
    element.addEventListener('input', (event) => {
        if (event.target.validity.valid) {
            event.target.classList.remove('error');
        }
    });
});
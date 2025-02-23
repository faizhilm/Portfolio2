document.addEventListener('DOMContentLoaded', function() {
    // Get current page path and hash
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Remove all active classes first
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Set active class based on current page/section
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if we're on the contact page
        if (currentPath.includes('contact.html') && href === 'contact.html') {
            link.classList.add('active');
        }
        // Check if we're on the main page with a hash
        else if (currentHash && href === currentHash) {
            link.classList.add('active');
        }
        // Check if we're on the main page without hash
        else if (!currentHash && currentPath.includes('index.html') && href === '#work') {
            link.classList.add('active');
        }
    });

    const form = document.getElementById('contact-form');
    const formMessages = document.getElementById('form-messages');

    function showFormError(input, message) {
        const feedback = input.nextElementSibling;
        feedback.textContent = message;
        feedback.classList.add('show');
    }

    function clearFormError(input) {
        const feedback = input.nextElementSibling;
        feedback.textContent = '';
        feedback.classList.remove('show');
    }

    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        const errors = {};

        inputs.forEach(input => {
            const value = input.value.trim();
            if (input.hasAttribute('required') && !value) {
                errors[input.id] = 'This field is required';
                isValid = false;
            } else if (input.type === 'email' && value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    errors[input.id] = 'Please enter a valid email address';
                    isValid = false;
                }
            }
        });

        // Show all errors at once
        Object.keys(errors).forEach(id => {
            showError(document.getElementById(id), errors[id]);
        });

        return isValid;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.classList.add('loading');

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            formMessages.textContent = 'Message sent successfully!';
            formMessages.className = 'form-messages success';
            form.reset();
        } catch (error) {
            formMessages.textContent = 'An error occurred. Please try again.';
            formMessages.className = 'form-messages error';
        } finally {
            submitButton.classList.remove('loading');
        }
    });

    // Clear validation messages on input
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => clearFormError(input));
    });

    // Work section filtering
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectCards = document.querySelectorAll('.project-card');

    // Remove existing event listeners first
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => card.style.opacity = '1', 50);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                }
            });
        });
    });
});

document.getElementById('services-button').addEventListener('click', function() {
    window.location.href = 'contact.html';
});

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Reset previous error states
    document.querySelectorAll('.form-feedback').forEach(el => el.textContent = '');
    
    let isValid = true;
    const formData = {};
    
    // Validate each field
    ['name', 'email', 'subject', 'message'].forEach(field => {
        const element = document.getElementById(field);
        const value = element.value.trim();
        formData[field] = value;
        
        if (!value) {
            showError(element, 'This field is required');
            isValid = false;
        } else if (field === 'email' && !isValidEmail(value)) {
            showError(element, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    if (isValid) {
        const button = this.querySelector('button[type="submit"]');
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate form submission
        setTimeout(() => {
            const mailtoLink = `mailto:${formData.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.message)}`;
            window.location.href = mailtoLink;
            
            button.disabled = false;
            button.innerHTML = '<span class="button-text">Message Sent!</span> <i class="fas fa-check"></i>';
            
            setTimeout(() => {
                button.innerHTML = '<span class="button-text">Send Message</span> <i class="fas fa-paper-plane"></i>';
            }, 3000);
        }, 1500);
    }
});

function showError(element, message) {
    const feedback = element.parentElement.querySelector('.form-feedback');
    feedback.textContent = message;
    element.classList.add('error');
    
    element.addEventListener('input', function() {
        feedback.textContent = '';
        element.classList.remove('error');
    }, { once: true });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Modal functionality
const modal = document.createElement('div');
modal.classList.add('modal');
document.body.appendChild(modal);

const modalContent = document.createElement('div');
modalContent.classList.add('modal-content');
modal.appendChild(modalContent);

const closeModal = document.createElement('span');
closeModal.classList.add('close');
closeModal.innerHTML = '&times;';
modal.appendChild(closeModal);

document.querySelectorAll('.grid-gallery img').forEach(img => {
    img.addEventListener('click', function() {
        const fullSizeImg = document.createElement('img');
        fullSizeImg.src = this.src;
        fullSizeImg.alt = this.alt;
        modalContent.innerHTML = '';
        modalContent.appendChild(fullSizeImg);
        modal.style.display = 'block';
    });
});

closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Image modal functionality
const imageModal = document.createElement('div');
imageModal.classList.add('image-modal');
document.body.appendChild(imageModal);

const imageModalContent = document.createElement('div');
imageModalContent.classList.add('image-modal-content');
imageModal.appendChild(imageModalContent);

const closeImageModal = document.createElement('span');
closeImageModal.classList.add('image-modal-close');
closeImageModal.innerHTML = '&times;';
imageModal.appendChild(closeImageModal);

document.querySelectorAll('.grid-gallery img').forEach(img => {
    img.addEventListener('click', function() {
        const fullSizeImg = document.createElement('img');
        fullSizeImg.src = this.src;
        fullSizeImg.alt = this.alt;
        imageModalContent.innerHTML = '';
        imageModalContent.appendChild(fullSizeImg);
        imageModal.style.display = 'block';
    });
});

closeImageModal.addEventListener('click', function() {
    imageModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === imageModal) {
        imageModal.style.display = 'none';
    }
});

// Magic Circle Cursor Effect
const magicCircle = document.createElement('div');
magicCircle.className = 'magic-circle';
document.body.appendChild(magicCircle);

// Debounce function for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize mousemove event
document.addEventListener('mousemove', debounce((e) => {
    requestAnimationFrame(() => {
        magicCircle.style.left = e.clientX - 150 + 'px';
        magicCircle.style.top = e.clientY - 150 + 'px';
    });
}, 10));

// Magic Activation Effect
document.querySelectorAll('.magic-effect').forEach(element => {
    element.addEventListener('mouseover', function() {
        const activationSound = new Audio('activation.mp3');
        activationSound.volume = 0.2;
        activationSound.play().catch(() => {});
    });
});

// Add form validation improvements
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.getElementById('contact-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const button = this.querySelector('button[type="submit"]');
    const formMessages = document.getElementById('form-messages');
    
    // Validate form
    const name = this.querySelector('#name').value.trim();
    const email = this.querySelector('#email').value.trim();
    const message = this.querySelector('#message').value.trim();
    
    if (!name || !email || !message) {
        formMessages.textContent = 'Please fill in all required fields.';
        formMessages.className = 'form-messages error';
        return;
    }
    
    if (!validateEmail(email)) {
        formMessages.textContent = 'Please enter a valid email address.';
        formMessages.className = 'form-messages error';
        return;
    }
    
    // Show loading state
    button.classList.add('loading');
    
    try {
        // Add your form submission logic here
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        
        formMessages.textContent = 'Message sent successfully!';
        formMessages.className = 'form-messages success';
        this.reset();
    } catch (error) {
        formMessages.textContent = 'An error occurred. Please try again.';
        formMessages.className = 'form-messages error';
    } finally {
        button.classList.remove('loading');
    }
});

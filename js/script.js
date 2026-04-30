// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ===== Active Navigation Link =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// ===== Counter Animation for Stats =====
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            entry.target.classList.add('counted');
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.activity-stats');
if (statsSection) {
    observer.observe(statsSection);
}

// ===== 3D Scroll Animation for Stats Cards =====
const observerOptions3D = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer3D = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions3D);

document.querySelectorAll('.stat-card').forEach(card => {
    observer3D.observe(card);
});

// Mouse tracking 3D tilt effect
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (!card.classList.contains('animate-in')) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30;
    const duration = 1500;
    const startTime = Date.now();

    function updateCount() {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            current = Math.floor(increment * (elapsed / 100));
            if (current > target) current = target;
            element.textContent = current;
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target;
        }
    }

    updateCount();
}

// ===== Smooth Scroll for Internal Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Scroll Animation for Elements =====
const scrollElements = document.querySelectorAll('.info-card, .education-card, .skill-category, .blog-card, .cert-card');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            scrollObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

scrollElements.forEach(element => {
    scrollObserver.observe(element);
});

// ===== Navbar Background on Scroll =====
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        }
    });
}

// ===== Form Validation (for Contact Page) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showAlert('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }

        const submitBtn = contactForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Send data to Google Apps Script
        const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxHI0uwhdvv_ekuNHoSuCRgYQyXl-imxIKC1V4Tlk8RjyplTQxLuPURa1x1ANtrhrpQ/exec';

        fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: new URLSearchParams({
                name: name,
                email: email,
                subject: subject,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showAlert('Error sending message. Please try again.', 'error');
            }
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        })
        .catch(error => {
            showAlert('Error sending message. Please try again.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// ===== Add CSS for Animations in JS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
`;
document.head.appendChild(style);

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
window.addEventListener('DOMContentLoaded', () => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
});

// ===== Hero Typing Animation =====
const heroTyped = document.getElementById('heroTyped');
if (heroTyped) {
    const roles = [
        'Project Coordinator',
        'Problem Solver',
        'Android Developer',
        'Vibe coder'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeRole() {
        const current = roles[roleIndex];
        if (isDeleting) {
            heroTyped.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 45;
        } else {
            heroTyped.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === current.length) {
            // Pause at end before deleting
            typingSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 400;
        }

        setTimeout(typeRole, typingSpeed);
    }

    // Start after a short delay so hero content loads first
    setTimeout(typeRole, 600);
}

// ===== Resume Download Modal =====
const downloadResumeBtn = document.getElementById('downloadResumeBtn');
const resumeModal = document.getElementById('resumeModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const resumeDownloadForm = document.getElementById('resumeDownloadForm');
const purposeSelect = document.getElementById('purposeSelect');
const organizationGroup = document.getElementById('organizationGroup');
const occupationGroup = document.getElementById('occupationGroup');
const visitorOrganizationGroup = document.getElementById('visitorOrganizationGroup');

function openResumeModal() {
    resumeModal.style.cssText = [
        'display:flex',
        'position:fixed',
        'top:0',
        'left:0',
        'width:100%',
        'height:100%',
        'z-index:9999',
        'align-items:center',
        'justify-content:center',
        'background:rgba(0,0,0,0.6)'
    ].join(';');
}

function closeResumeModal() {
    resumeModal.style.display = 'none';
    if (resumeDownloadForm) resumeDownloadForm.reset();
    resetFormFields();
}

if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', openResumeModal);
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeResumeModal);
}

if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) closeResumeModal();
    });
}

// Handle purpose dropdown change
if (purposeSelect) {
    purposeSelect.addEventListener('change', () => {
        const purpose = purposeSelect.value;

        organizationGroup.style.display = 'none';
        occupationGroup.style.display = 'none';
        visitorOrganizationGroup.style.display = 'none';

        if (purpose === 'hire') {
            organizationGroup.style.display = 'flex';
        } else if (purpose === 'visitor') {
            occupationGroup.style.display = 'flex';
            visitorOrganizationGroup.style.display = 'flex';
        }
    });
}

function resetFormFields() {
    organizationGroup.style.display = 'none';
    occupationGroup.style.display = 'none';
    visitorOrganizationGroup.style.display = 'none';
}

// Handle form submission
if (resumeDownloadForm) {
    resumeDownloadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('userEmail').value.trim();
        const purpose = document.getElementById('purposeSelect').value;
        const organizationName = document.getElementById('organizationName').value.trim();
        const occupation = document.getElementById('occupationField').value.trim();
        const visitorOrganization = document.getElementById('visitorOrganization').value.trim();

        // Validation
        if (!email || !isValidEmail(email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }

        if (!purpose) {
            showAlert('Please select an option', 'error');
            return;
        }

        if (purpose === 'hire' && !organizationName) {
            showAlert('Please enter organization name', 'error');
            return;
        }

        if (purpose === 'visitor' && !occupation) {
            showAlert('Please enter your occupation', 'error');
            return;
        }

        const organization = purpose === 'hire' ? organizationName : (visitorOrganization || '');

        const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxHI0uwhdvv_ekuNHoSuCRgYQyXl-imxIKC1V4Tlk8RjyplTQxLuPURa1x1ANtrhrpQ/exec';

        const submitBtn = resumeDownloadForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
        submitBtn.disabled = true;

        fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: new URLSearchParams({
                type: 'resume',
                email: email,
                purpose: purpose === 'hire' ? 'To Hire' : 'Visitor',
                occupation: occupation || '',
                organization: organization
            })
        })
        .then(response => response.json())
        .then(() => {
            downloadResume();
        })
        .catch(() => {
            // Still allow download even if logging fails
            downloadResume();
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
}

function downloadResume() {
    const resumePath = 'images/Qulification Documents/Resume - Durvesh Karande .pdf';
    const link = document.createElement('a');
    link.href = resumePath;
    link.download = 'Resume - Durvesh Karande.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Close modal and show success message
    resumeModal.classList.remove('active');
    showAlert('Resume downloaded successfully! Thank you for your interest.', 'success');
    resumeDownloadForm.reset();
    resetFormFields();
}

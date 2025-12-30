/* ============================================
   PREMIUM PORTFOLIO - GODKNOWS MUGADUYI
   Advanced Interactivity & Animations
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initScrollProgress();
    initHeader();
    initMobileMenu();
    initThemeToggle();
    initRevealAnimations();
    initSkillBars();
    initCountUp();
    initTiltEffect();
    initBackToTop();
    initSmoothScroll();
});

/* ---------- Loading Screen ---------- */
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Trigger hero animations after loader
            document.body.classList.add('loaded');
        }, 2200);
    });
}

/* ---------- Custom Cursor ---------- */
function initCursor() {
    const cursor = document.getElementById('cursor');
    const dot = document.querySelector('.cursor-dot');
    const circle = document.querySelector('.cursor-circle');
    
    if (!cursor || !dot || !circle) return;
    
    // Check if device has hover capability (not touch device)
    if (!window.matchMedia('(hover: hover)').matches) {
        cursor.style.display = 'none';
        return;
    }
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let circleX = 0, circleY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Dot follows immediately
        dotX += (mouseX - dotX) * 0.5;
        dotY += (mouseY - dotY) * 0.5;
        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;
        
        // Circle follows with delay
        circleX += (mouseX - circleX) * 0.15;
        circleY += (mouseY - circleY) * 0.15;
        circle.style.left = `${circleX}px`;
        circle.style.top = `${circleY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-tilt], .project-card, .skill-category, .contact-item, .info-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('cursor-click');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('cursor-click');
    });
}

/* ---------- Scroll Progress ---------- */
function initScrollProgress() {
    const progress = document.getElementById('scroll-progress');
    if (!progress) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progress.style.width = `${scrollPercent}%`;
    });
}

/* ---------- Header Scroll Effect ---------- */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-nav-link');
    
    if (!menuBtn || !menu) return;
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
    
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ---------- Theme Toggle ---------- */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    if (!toggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
    
    toggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add transition class for smooth theme change
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

/* ---------- Reveal Animations ---------- */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    if (!reveals.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animations
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    reveals.forEach(el => observer.observe(el));
    
    // Also use GSAP if available for more complex animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Parallax effect on orbs
        gsap.to('.orb-1', {
            y: -100,
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            }
        });
        
        gsap.to('.orb-2', {
            y: 100,
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            }
        });
        
        // Hero title animation
        gsap.from('.title-line', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power4.out',
            delay: 2.3 // After loader
        });
        
        // Hero badge animation
        gsap.from('.hero-badge', {
            y: -20,
            opacity: 0,
            duration: 0.8,
            delay: 2.2
        });
    }
}

/* ---------- Skill Bars Animation ---------- */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if (!skillBars.length) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress;
                entry.target.style.width = `${progress}%`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
}

/* ---------- Count Up Animation ---------- */
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    if (!counters.length) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCount(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCount(element, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    
    const update = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    };
    
    update();
}

/* ---------- 3D Tilt Effect ---------- */
function initTiltEffect() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    if (!cards.length) return;
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* ---------- Back to Top Button ---------- */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ---------- Magnetic Button Effect ---------- */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/* ---------- Typing Effect (Optional) ---------- */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* ---------- Parallax Effect for Hero ---------- */
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

/* ---------- Easter Egg: Konami Code ---------- */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Easter egg activated!
            document.body.style.animation = 'rainbow 2s linear infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

/* ---------- Preload Critical Resources ---------- */
function preloadResources() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize magnetic buttons after content loads
window.addEventListener('load', initMagneticButtons);

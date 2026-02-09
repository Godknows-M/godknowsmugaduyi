/* ============================================
   PREMIUM PORTFOLIO - GODKNOWS MUGADUYI
   Advanced Interactivity & Animations
   Midnight Charcoal & Brushed Gold Theme
   ============================================ */

// Initialize Lenis Smooth Scroll
let lenis = null;

function initLenis() {
    try {
        if (typeof Lenis === 'undefined') {
            console.warn('Lenis not loaded, skipping smooth scroll');
            return;
        }

        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Connect Lenis to GSAP ScrollTrigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    } catch (error) {
        console.warn('Lenis initialization failed:', error);
        lenis = null;
    }
}

// IMMEDIATELY hide loader after timeout - runs before DOMContentLoaded
(function () {
    setTimeout(function () {
        const loader = document.getElementById('loader');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            document.body.classList.add('loaded');
        }
    }, 3500);
})();

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Detect mobile/low-power devices
    const isMobile = window.innerWidth < 768;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Only init Lenis on desktop and when motion is allowed
    if (!isMobile && !isReducedMotion) {
        try {
            initLenis();
        } catch (e) {
            console.warn('Lenis error:', e);
        }
    }

    initLoader();

    // Only init cursor on desktop
    if (!isMobile) {
        initCursor();
    }

    initScrollProgress();
    initHeader();
    initMobileMenu();
    initThemeToggle();

    // Defer non-critical animations
    if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(() => {
            initRevealAnimations();
            initCountUp();
            if (!isMobile) initTiltEffect();
        });
    } else {
        setTimeout(() => {
            initRevealAnimations();
            initCountUp();
            if (!isMobile) initTiltEffect();
        }, 100);
    }

    initBackToTop();
    initSmoothScroll();
    initParallaxEffects();
});

/* ---------- Loading Screen ---------- */
function initLoader() {
    const loader = document.getElementById('loader');

    function hideLoader() {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.add('loaded');

            // Trigger hero animations after loader
            if (typeof gsap !== 'undefined') {
                animateHero();
            }
        }, 2800);
    }

    // Check if document is already loaded
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }

    // Fallback: hide loader after 4.5 seconds max regardless
    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            document.body.classList.add('loaded');
            if (typeof gsap !== 'undefined') {
                animateHero();
            }
        }
    }, 4500);
}

/* ---------- Hero Animations ---------- */
function animateHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.hero-glass-card', {
        y: -40,
        opacity: 0,
        duration: 1
    })
        .from('.title-line', {
            y: 80,
            opacity: 0,
            duration: 1.2,
            stagger: 0.12
        }, '-=0.6')
        .from('.hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 0.9
        }, '-=0.7')
        .from('.hero-cta .btn', {
            y: 25,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1
        }, '-=0.5')
        .from('.hero-3d-element', {
            scale: 0.5,
            opacity: 0,
            duration: 1.2,
            ease: 'elastic.out(1, 0.5)'
        }, '-=0.6')
        .from('.metric', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1
        }, '-=0.4')
        .from('.metric-divider', {
            scaleY: 0,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1
        }, '-=0.3')
        .from('.scroll-indicator', {
            opacity: 0,
            y: 20,
            duration: 0.8
        }, '-=0.2');
}

/* ---------- Custom Cursor ---------- */
function initCursor() {
    const cursor = document.getElementById('cursor');
    const dot = document.querySelector('.cursor-dot');
    const circle = document.querySelector('.cursor-circle');

    if (!cursor || !dot || !circle) return;

    // Hide cursor on touch devices and mobile
    const isTouchDevice = ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);

    if (isTouchDevice || !window.matchMedia('(hover: hover)').matches || window.innerWidth < 1024) {
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }

    // Hide cursor during loader
    cursor.style.opacity = '0';

    // Show cursor after loader is hidden
    const showCursorWhenReady = () => {
        const loader = document.getElementById('loader');
        if (loader && loader.classList.contains('hidden')) {
            cursor.style.opacity = '1';
        } else {
            setTimeout(showCursorWhenReady, 100);
        }
    };
    setTimeout(showCursorWhenReady, 100);

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let circleX = 0, circleY = 0;
    let isMoving = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isMoving) {
            isMoving = true;
            requestAnimationFrame(animateCursor);
        }
    });

    function animateCursor() {
        dotX += (mouseX - dotX) * 0.8;
        dotY += (mouseY - dotY) * 0.8;
        dot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;

        circleX += (mouseX - circleX) * 0.2;
        circleY += (mouseY - circleY) * 0.2;
        circle.style.transform = `translate(${circleX - 20}px, ${circleY - 20}px)`;

        const deltaX = Math.abs(mouseX - dotX);
        const deltaY = Math.abs(mouseY - dotY);

        if (deltaX > 0.1 || deltaY > 0.1) {
            requestAnimationFrame(animateCursor);
        } else {
            isMoving = false;
        }
    }

    const interactiveElements = document.querySelectorAll('a, button, [data-tilt], .project-card, .testimonial-card, .tech-item, .contact-item, .highlight-card, .impact-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('cursor-click'));
}

/* ---------- Scroll Progress ---------- */
function initScrollProgress() {
    const progress = document.getElementById('scroll-progress');
    if (!progress) return;

    if (lenis) {
        lenis.on('scroll', ({ progress: scrollProgress }) => {
            progress.style.width = `${scrollProgress * 100}%`;
        });
    } else {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progress.style.width = `${scrollPercent}%`;
        });
    }
}

/* ---------- Header Scroll Effect ---------- */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const checkScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    if (lenis) {
        lenis.on('scroll', checkScroll);
    } else {
        window.addEventListener('scroll', checkScroll);
    }
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

        if (lenis) {
            menu.classList.contains('active') ? lenis.stop() : lenis.start();
        }
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            menu.classList.remove('active');
            if (lenis) lenis.start();
            document.body.style.overflow = '';
        });
    });
}

/* ---------- Theme Toggle ---------- */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    if (!toggle) return;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else {
        // Force dark theme as default regardless of system preference
        html.setAttribute('data-theme', 'dark');
        // Optional: Save it immediately so it persists
        // localStorage.setItem('theme', 'dark'); 
    }

    toggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    });
}

/* ---------- Reveal Animations ---------- */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    if (!reveals.length) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        reveals.forEach((el) => {
            let fromVars = { opacity: 0, duration: 1 };

            if (el.classList.contains('reveal-up')) {
                fromVars.y = 50;
            } else if (el.classList.contains('reveal-left')) {
                fromVars.x = -50;
            } else if (el.classList.contains('reveal-right')) {
                fromVars.x = 50;
            }

            gsap.from(el, {
                ...fromVars,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Parallax effect on ambient orbs
        gsap.to('.orb-gold', {
            y: -100,
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5
            }
        });

        gsap.to('.orb-slate', {
            y: 120,
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5
            }
        });
    } else {
        // Fallback with Intersection Observer
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        reveals.forEach(el => observer.observe(el));
    }
}

/* ---------- Count Up Animation ---------- */
function initCountUp() {
    const counters = document.querySelectorAll('.metric-number[data-count]');

    if (!counters.length) return;

    const observerOptions = { threshold: 0.5 };

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
    const duration = 2500;
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

            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;

            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* ---------- Parallax Effects ---------- */
function initParallaxEffects() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Hero content parallax
    gsap.to('.hero-content', {
        y: 100,
        opacity: 0.3,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    // Section headers subtle parallax
    document.querySelectorAll('.section-header').forEach(header => {
        gsap.from(header, {
            y: 30,
            scrollTrigger: {
                trigger: header,
                start: 'top 90%',
                end: 'top 60%',
                scrub: 0.5
            }
        });
    });
}

/* ---------- Back to Top Button ---------- */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');

    if (!btn) return;

    const checkVisibility = () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    };

    if (lenis) {
        lenis.on('scroll', checkVisibility);
    } else {
        window.addEventListener('scroll', checkVisibility);
    }

    btn.addEventListener('click', () => {
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.8 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

/* ---------- Smooth Scroll for Anchor Links ---------- */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(0, { duration: 1.8 });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(target, { offset: -80, duration: 1.8 });
                } else {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

/* ---------- Magnetic Button Effect ---------- */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-header');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/* ---------- Easter Egg: Konami Code ---------- */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Gold sparkle effect
            createSparkles();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function createSparkles() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: linear-gradient(135deg, #c9a962, #e8d5a3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                animation: sparkle 1.5s ease-out forwards;
            `;
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1500);
        }, i * 50);
    }
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Initialize magnetic buttons after content loads
window.addEventListener('load', initMagneticButtons);

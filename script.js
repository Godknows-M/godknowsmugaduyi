// Custom Cursor
const cursor = document.getElementById('cursor-follower');
const links = document.querySelectorAll('a, button, .project-card');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });
});

// Magnetic Buttons
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});

// Ghost Code Snippet Window
const projectCards = document.querySelectorAll('.project-card');
const codeOverlay = document.getElementById('code-snippet-overlay');
const codeContent = document.getElementById('dynamic-code');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const snippet = card.getAttribute('data-snippet');
        const tech = card.getAttribute('data-tech');
        
        // Simple typing effect or just setting innerText
        codeContent.innerText = `// ${tech}\n\n${snippet}`;
        codeOverlay.classList.add('visible');
    });

    card.addEventListener('mouseleave', () => {
        codeOverlay.classList.remove('visible');
    });
    
    // Make the window float near the cursor slightly? 
    // Or just fixed position as defined in CSS (bottom right) is cleaner for UX.
});

// Particle System
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
        this.color = Math.random() > 0.5 ? '#4361ee' : '#7209b7'; // Cobalt or Violet
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 50; i++) { // 50 Particles for clean look
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(67, 97, 238, ${1 - distance / 150})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Glitch effect on Hero Text (Random character swaps)
const heroText = document.querySelector('.glitch-text');
const originalText = heroText.getAttribute('data-text');
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

heroText.addEventListener('mouseenter', () => {
    let iterations = 0;
    const interval = setInterval(() => {
        heroText.innerText = heroText.innerText.split('')
            .map((letter, index) => {
                if(index < iterations) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * 36)];
            }).join('');
        
        if(iterations >= originalText.length) clearInterval(interval);
        iterations += 1/3;
    }, 30);
});

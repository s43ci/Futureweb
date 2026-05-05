document.addEventListener('DOMContentLoaded', function() {
    const html = document.documentElement;
    const langToggle = document.getElementById('langToggle');
    const themeToggle = document.getElementById('themeToggle');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const contactForm = document.getElementById('contactForm');
    const navbar = document.querySelector('.navbar');

    let currentLang = 'ar';

    function setLanguage(lang) {
        currentLang = lang;
        html.lang = lang;
        html.dir = lang === 'ar' ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-en][data-ar]').forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });

        document.querySelectorAll('[data-en-placeholder], [data-ar-placeholder]').forEach(el => {
            const placeholder = lang === 'ar' 
                ? el.getAttribute('data-ar-placeholder') 
                : el.getAttribute('data-en-placeholder');
            if (placeholder) el.placeholder = placeholder;
        });

        const langBtn = langToggle.querySelector('.current-lang');
        langBtn.textContent = lang === 'ar' ? 'EN' : 'ع';
        
        document.querySelectorAll('.current-lang').forEach(el => {
            el.textContent = lang === 'ar' ? 'EN' : 'ع';
        });

        localStorage.setItem('futureweb-lang', lang);
    }

    function toggleLanguage() {
        setLanguage(currentLang === 'ar' ? 'en' : 'ar');
    }

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('futureweb-theme', theme);
    }

    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    langToggle.addEventListener('click', toggleLanguage);
    themeToggle.addEventListener('click', toggleTheme);

    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    const savedLang = localStorage.getItem('futureweb-lang');
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        setLanguage('ar');
    }

    const savedTheme = localStorage.getItem('futureweb-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('dark');
    }

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Scroll animations with Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll(
        '.service-card, .pricing-card, .why-card, .addon-card, .section-header, .stat, .hero-content > *'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Add animation CSS dynamically
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .hero-content > * {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .hero-content > *:nth-child(1) { animation-delay: 0.1s; }
        .hero-content > *:nth-child(2) { animation-delay: 0.2s; }
        .hero-content > *:nth-child(3) { animation-delay: 0.3s; }
        .hero-content > *:nth-child(4) { animation-delay: 0.4s; }
        .hero-content > *:nth-child(5) { animation-delay: 0.5s; }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(animationStyle);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = currentLang === 'ar' ? '...' : '...';
            submitBtn.disabled = true;

            // Add loading animation
            submitBtn.style.position = 'relative';
            submitBtn.innerHTML = `<span class="btn-loader"></span>${currentLang === 'ar' ? 'جاري الإرسال' : 'Sending...'}`;

            setTimeout(() => {
                alert(currentLang === 'ar'
                    ? 'شكراً لك! تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.'
                    : 'Thank you! Your message has been sent successfully. We will contact you soon.');

                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--x', x + 'px');
            this.style.setProperty('--y', y + 'px');
        });
    });

    // Card hover animations
    const cards = document.querySelectorAll('.service-card, .pricing-card, .why-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Add floating particles
    function createParticles() {
        const bgAnimation = document.querySelector('.bg-animation');
        if (!bgAnimation) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: var(--accent);
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.1};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float${Math.random() > 0.5 ? 'Reverse' : ''} ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            bgAnimation.appendChild(particle);
        }
    }

    createParticles();

    // Add particle animation style
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
            25% { transform: translate(30px, -30px) rotate(90deg); opacity: 0.6; }
            50% { transform: translate(0, -60px) rotate(180deg); opacity: 0.3; }
            75% { transform: translate(-30px, -30px) rotate(270deg); opacity: 0.6; }
        }
        @keyframes floatReverse {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
            25% { transform: translate(-30px, 30px) rotate(-90deg); opacity: 0.6; }
            50% { transform: translate(0, 60px) rotate(-180deg); opacity: 0.3; }
            75% { transform: translate(30px, 30px) rotate(-270deg); opacity: 0.6; }
        }
    `;
    document.head.appendChild(particleStyle);

    // Mobile touch improvements
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.btn, .nav-links a, .mobile-menu a').forEach(el => {
            el.style.webkitTapHighlightColor = 'transparent';
        });

        // Add touch feedback
        document.querySelectorAll('.service-card, .pricing-card, .why-card, .addon-card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            card.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }

    // Parallax effect on scroll (subtle)
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const bgGradients = document.querySelectorAll('.bg-gradient');
                
                bgGradients.forEach((bg, index) => {
                    const speed = (index + 1) * 0.05;
                    bg.style.transform = `translateY(${scrolled * speed}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });

    // Add loading state
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});
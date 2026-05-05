document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Color Bends Background (React Component Logic Translated to Vanilla JS) ---
    class ColorBends {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.time = 0;

            // Parameters strictly matching your request:
            this.color = { r: 168, g: 85, b: 247 }; // #A855F7
            this.speed = 0.005; // Mapped from 0.2 for optimal 60fps smoothing
            this.frequency = 1.0;
            this.noiseLevel = 0.15;
            this.bandWidth = 0.14;
            this.intensity = 1.3;
            this.fadeTop = 0.75;
            this.rotation = 90; // Handled structurally by drawing orientation

            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        animate() {
            this.time += this.speed;
            const { width, height } = this.canvas;

            // Deep dark background
            this.ctx.fillStyle = '#05010a';
            this.ctx.fillRect(0, 0, width, height);

            // Draw fluid bands
            const numBands = Math.floor(30 * this.frequency);
            const bandHeight = height / numBands;

            this.ctx.globalCompositeOperation = 'screen';

            for (let i = 0; i < numBands; i++) {
                this.ctx.beginPath();
                const startY = i * bandHeight;

                for (let x = 0; x <= width; x += 15) {
                    const normalizedX = x / width;
                    
                    // Complex noise algorithm simulating the React shader
                    const noise = Math.sin(normalizedX * 12 + this.time + i * 0.1) *
                                  Math.cos(normalizedX * 8 - this.time * 0.8) *
                                  (height * this.noiseLevel);

                    const y = startY + noise;

                    if (x === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                }

                this.ctx.lineWidth = height * this.bandWidth * 0.1;
                const alpha = 0.03 * this.intensity;
                this.ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                this.ctx.stroke();
            }

            this.ctx.globalCompositeOperation = 'source-over';

            // Apply fadeTop effect
            const fadeHeight = height * this.fadeTop;
            const gradient = this.ctx.createLinearGradient(0, 0, 0, fadeHeight);
            gradient.addColorStop(0, '#05010a'); 
            gradient.addColorStop(1, 'rgba(5, 1, 10, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, width, fadeHeight);

            requestAnimationFrame(() => this.animate());
        }
    }

    // Initialize the background
    new ColorBends('colorBendsCanvas');

    // --- 2. Custom Mouse Glow Tracker ---
    const mouseGlow = document.getElementById('mouseGlow');
    document.addEventListener('mousemove', (e) => {
        mouseGlow.style.left = `${e.clientX}px`;
        mouseGlow.style.top = `${e.clientY}px`;
    });

    // --- 3. Sticky Navbar ---
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // --- 4. 3D Tilt Effect for Cards ---
    const tiltElements = document.querySelectorAll('.tilt-element');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.zIndex = "10";
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.zIndex = "1";
        });
    });

    // --- 5. Cinematic Auto Scroll ---
    const autoScrollBtn = document.getElementById('autoScrollBtn');
    const autoScrollText = autoScrollBtn.querySelector('.text');
    let isAutoScrolling = false;
    let animationFrameId;

    function smoothScroll() {
        if (isAutoScrolling) {
            window.scrollBy(0, 1);
            if ((window.innerHeight + Math.ceil(window.scrollY)) >= document.body.offsetHeight) {
                toggleAutoScroll();
            } else {
                animationFrameId = requestAnimationFrame(smoothScroll);
            }
        }
    }

    function toggleAutoScroll() {
        isAutoScrolling = !isAutoScrolling;
        autoScrollBtn.classList.toggle('active', isAutoScrolling);
        
        if (isAutoScrolling) {
            autoScrollText.textContent = 'إيقاف التمرير';
            animationFrameId = requestAnimationFrame(smoothScroll);
        } else {
            autoScrollText.textContent = 'تمرير تلقائي';
            cancelAnimationFrame(animationFrameId);
        }
    }
    autoScrollBtn.addEventListener('click', toggleAutoScroll);

    // --- 6. Poetic Typewriter Animation ---
    const poetryLines = [
        "أَنَا الَّذِي نَظَرَ الأَعْمَى إِلَى أَدَبِي",
        "وَأَسْمَعَتْ كَلِمَاتِي مَنْ بِهِ صَمَمُ",
        "أَنَامُ مِلْءَ جُفُونِي عَنْ شَوَارِدِهَا",
        "وَيَسْهَرُ الْخَلْقُ جَرَّاهَا وَيَخْتَصِمُ",
        "وَجَاهِلٍ مَدَّهُ فِي جَهْلِهِ ضَحِكِي",
        "حَتَّى أَتَتْهُ يَدٌ فَرَّاسَةٌ وَفَمُ"
    ];
    
    const poetryContainer = document.getElementById('poetryContainer');
    let isTypingStarted = false;

    function typePoetry() {
        if (isTypingStarted) return;
        isTypingStarted = true;
        let lineIndex = 0;

        function typeLine() {
            if (lineIndex >= poetryLines.length) return;
            
            const lineDiv = document.createElement('div');
            lineDiv.className = 'poetry-line';
            lineDiv.style.opacity = '1';
            lineDiv.style.transform = 'translateY(0)';
            poetryContainer.appendChild(lineDiv);
            
            let charIndex = 0;
            const currentLine = poetryLines[lineIndex];
            
            const typingInterval = setInterval(() => {
                if (charIndex < currentLine.length) {
                    lineDiv.textContent += currentLine.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    lineIndex++;
                    setTimeout(typeLine, 800);
                }
            }, 60);
        }
        typeLine();
    }

    const aboutSection = document.getElementById('about');
    const poetryObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            typePoetry();
            poetryObserver.disconnect();
        }
    }, { threshold: 0.5 });
    
    poetryObserver.observe(aboutSection);

    // --- 7. Form Demo ---
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn span');
        submitBtn.textContent = 'تم الإرسال بنجاح!';
        setTimeout(() => {
            contactForm.reset();
            submitBtn.textContent = 'إرسال الرسالة';
        }, 3000);
    });

});

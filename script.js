document.addEventListener('DOMContentLoaded', () => {
    // Generate Stars
    const starsContainer = document.getElementById('stars-container');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 3 + 2;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);

        starsContainer.appendChild(star);
    }

    // Generate Clouds
    const cloudsContainer = document.getElementById('clouds-container');
    const cloudCount = 8;

    for (let j = 0; j < cloudCount; j++) {
        const cloud = document.createElement('div');
        cloud.classList.add('cloud');

        const top = Math.random() * 80 + 10; // 10% to 90% height
        const width = Math.random() * 200 + 150; // 150px to 350px
        const height = width * 0.4;
        const duration = Math.random() * 30 + 40; // 40s to 70s drift
        const opacity = Math.random() * 0.3 + 0.1;
        const delay = Math.random() * -50;

        cloud.style.top = `${top}%`;
        cloud.style.width = `${width}px`;
        cloud.style.height = `${height}px`;
        cloud.style.animationDuration = `${duration}s`;
        cloud.style.animationDelay = `${delay}s`;
        cloud.style.setProperty('--cloud-opacity', opacity);

        cloudsContainer.appendChild(cloud);
    }

    // Countdown Logic
    let count = 3;
    const countdownEl = document.getElementById('countdown-number');
    const countdownContainer = document.getElementById('countdown-container');
    const burstOverlay = document.getElementById('burst-overlay');
    const revealContainer = document.getElementById('reveal-container');
    const scrollHint = document.querySelector('.scroll-hint');

    // Initial animation for the first number (3)
    countdownEl.textContent = count;
    countdownEl.classList.add('animate-number');

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.classList.remove('animate-number');
            void countdownEl.offsetWidth; // Trigger reflow
            countdownEl.textContent = count;
            countdownEl.classList.add('animate-number');
        } else {
            clearInterval(timer);
            countdownEl.style.display = 'none'; // Hide number at 0
            triggerSequence();

            // Unlock scroll after a delay
            setTimeout(() => {
                document.body.classList.add('scroll-active');
                if (scrollHint) scrollHint.classList.remove('hidden');
                document.getElementById('music-controls').classList.remove('hidden');
            }, 3000);
        }
    }, 1000);

    function triggerSequence() {
        burstOverlay.classList.add('burst-active');

        setTimeout(() => {
            countdownContainer.style.display = 'none';
        }, 300);

        setTimeout(() => {
            revealContainer.classList.remove('hidden');
            revealContainer.style.display = 'flex';
            setTimeout(() => {
                revealContainer.classList.add('show-content');
                triggerConfetti();
            }, 100);
        }, 600);
    }

    // Music Control
    const audio = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    let isPlaying = false;

    // Try to play on first user interaction if blocked
    document.body.addEventListener('click', () => {
        if (!isPlaying && document.body.classList.contains('scroll-active')) {
            // Only try autoplay if we are past the countdown
            // audio.play().catch(()=>{}); 
        }
    }, { once: true });

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicBtn.textContent = "🔇";
        } else {
            audio.play().then(() => {
                musicBtn.textContent = "🔊";
            }).catch(e => {
                console.error("Audio play failed", e);
            });
        }
        isPlaying = !isPlaying;
    });

    // Candle Interaction
    const candle = document.getElementById('candle');
    const flame = document.getElementById('flame');
    const instruction = document.getElementById('candle-instruction');

    candle.addEventListener('click', () => {
        if (!flame.classList.contains('out')) {
            flame.classList.add('out'); // Flame out
            instruction.textContent = "Yay! 🎆";
            triggerFireworks();

            // Auto play music on candle blow if not playing
            if (!isPlaying) {
                audio.play().then(() => {
                    isPlaying = true;
                    musicBtn.textContent = "🔊";
                }).catch(e => console.log("Audio play blocked"));
            }
        }
    });

    function triggerConfetti() {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    function triggerFireworks() {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // Accordion Mobile Handling
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => {
                if (c !== card) c.classList.remove('active');
            });
            card.classList.toggle('active');
        });
    });

    // --- Wish Section Logic ---

    // Intersection Observer for Wish Section Animation
    const wishSection = document.getElementById('wish-section');
    const glassCard = document.querySelector('.glass-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                glassCard.classList.add('show-fade');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (wishSection) {
        observer.observe(wishSection);
    }

    // WhatsApp Message Handling
    const form = document.getElementById('wish-form');
    const msgInput = document.getElementById('wish-message');
    const submitBtn = document.getElementById('wish-submit-btn');
    const successMsg = document.getElementById('wish-success');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const message = msgInput.value;
            if (!message.trim()) return;

            // Visual Processing
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Opening WhatsApp... 💬";
            submitBtn.disabled = true;

            // Prepare WhatsApp URL
            // Using api.whatsapp.com is more reliable than wa.me
            const phoneNumber = "916383970881";
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

            // Open in new tab
            window.open(whatsappURL, '_blank');

            // Show success message immediately on page
            setTimeout(() => {
                submitBtn.innerText = "Sent! ✨";
                form.style.display = 'none';
                successMsg.classList.remove('hidden');
                successMsg.classList.add('success-glow');
                triggerConfetti();
            }, 1000); // Small delay to allow the tab to open
        });
    }
});

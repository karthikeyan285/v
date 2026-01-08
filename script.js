document.addEventListener('DOMContentLoaded', () => {

  /* ---------- STARS ---------- */
  const starsContainer = document.getElementById('stars-container');
  if (starsContainer) {
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
      starsContainer.appendChild(star);
    }
  }

  /* ---------- CLOUDS ---------- */
  const cloudsContainer = document.getElementById('clouds-container');
  if (cloudsContainer) {
    for (let i = 0; i < 8; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.top = `${Math.random() * 80 + 10}%`;
      const width = Math.random() * 200 + 150;
      cloud.style.width = `${width}px`;
      cloud.style.height = `${width * 0.4}px`;
      cloud.style.animationDuration = `${Math.random() * 30 + 40}s`;
      cloud.style.animationDelay = `${Math.random() * -50}s`;
      cloud.style.setProperty('--cloud-opacity', Math.random() * 0.3 + 0.1);
      cloudsContainer.appendChild(cloud);
    }
  }

  /* ---------- COUNTDOWN ---------- */
  const countdownEl = document.getElementById('countdown-number');
  const countdownContainer = document.getElementById('countdown-container');
  const burstOverlay = document.getElementById('burst-overlay');
  const revealContainer = document.getElementById('reveal-container');

  let count = 3;
  if (countdownEl) {
    countdownEl.textContent = count;
    countdownEl.classList.add('animate-number');

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        countdownEl.classList.remove('animate-number');
        void countdownEl.offsetWidth;
        countdownEl.textContent = count;
        countdownEl.classList.add('animate-number');
      } else {
        clearInterval(timer);
        countdownEl.style.display = 'none';
        if (burstOverlay) burstOverlay.classList.add('burst-active');
        if (countdownContainer) countdownContainer.style.display = 'none';

        setTimeout(() => {
          if (revealContainer) {
            revealContainer.classList.remove('hidden');
            revealContainer.classList.add('show-content');
          }
          document.body.classList.add('scroll-active');
          document.getElementById('music-controls')?.classList.remove('hidden');
        }, 1200);
      }
    }, 1000);
  }

  /* ---------- MUSIC ---------- */
  const audio = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  let isPlaying = false;

  musicBtn?.addEventListener('click', () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      musicBtn.textContent = '🔇';
    } else {
      audio.play().then(() => musicBtn.textContent = '🔊');
    }
    isPlaying = !isPlaying;
  });

  /* ---------- CANDLE ---------- */
  const candle = document.getElementById('candle');
  const flame = document.getElementById('flame');
  const instruction = document.getElementById('candle-instruction');

  candle?.addEventListener('click', () => {
    if (!flame || flame.classList.contains('out')) return;
    flame.classList.add('out');
    if (instruction) instruction.textContent = 'Yay! 🎆';
    audio?.play().catch(() => {});
  });

  /* ---------- ACCORDION ---------- */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  /* ---------- WISH SECTION ---------- */
  const form = document.getElementById('wish-form');
  const msgInput = document.getElementById('wish-message');
  const submitBtn = document.getElementById('wish-submit-btn');
  const successMsg = document.getElementById('wish-success');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!msgInput.value.trim()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Opening WhatsApp… 💬';

    const phone = '916383970881';
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msgInput.value)}`;
    window.open(url, '_blank');

    setTimeout(() => {
      form.style.display = 'none';
      successMsg?.classList.remove('hidden');
    }, 800);
  });

});

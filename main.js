import './style.css'

document.addEventListener('DOMContentLoaded', () => {

  // 0. Envelope Intro Animation & Music
  const waxSeal = document.getElementById('wax-seal');
  const envelopeOverlay = document.getElementById('envelope-overlay');
  
  const musicBtn = document.querySelector('.music-btn');
  const bgMusic = document.getElementById('bg-music');
  let isMusicPlaying = false;

  // Toggle music on button click
  if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', () => {
      if (isMusicPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
      } else {
        bgMusic.play();
        musicBtn.classList.add('playing');
      }
      isMusicPlaying = !isMusicPlaying;
    });
  }

  if (waxSeal && envelopeOverlay) {
    waxSeal.addEventListener('click', () => {
      // Auto-start music when envelope is opened (browser policy requires interaction first)
      if (bgMusic) {
        bgMusic.play().then(() => {
          isMusicPlaying = true;
          if (musicBtn) musicBtn.classList.add('playing');
        }).catch(err => console.log("Audio autoplay blocked", err));
      }

      // 1. Fade out seal and center line
      waxSeal.style.opacity = '0';
      waxSeal.style.pointerEvents = 'none';
      waxSeal.style.transform = 'translate(-50%, -50%) scale(1.5)';
      
      const centerLine = document.getElementById('center-line');
      if(centerLine) centerLine.style.opacity = '0';
      
      // 2. Wait for seal fade, then trigger burst animation
      setTimeout(() => {
        envelopeOverlay.classList.add('is-opening');

        // 3. Wait for envelope to burst open, then fade it out
        setTimeout(() => {
          envelopeOverlay.classList.add('hidden');
          
          // 4. Remove from DOM and allow scrolling
          setTimeout(() => {
            envelopeOverlay.style.display = 'none';
            document.body.classList.remove('no-scroll');
          }, 600);
        }, 700); 
      }, 300);
    });
  }

  // 1. Scroll Reveal Animation using Intersection Observer
  const revealElements = document.querySelectorAll('.animate-up, .scroll-reveal');
  
  const revealOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, revealOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // 2. Falling Petals Particle System
  const petalsContainer = document.getElementById('petals-container');
  const maxPetals = 30; // Control petal density

  function createPetal() {
    if (petalsContainer.childElementCount >= maxPetals) return;

    const petal = document.createElement('div');
    petal.classList.add('petal');

    // Randomize properties
    const size = Math.random() * 15 + 10; // 10px to 25px
    const leftPos = Math.random() * 100; // 0% to 100% width
    const duration = Math.random() * 8 + 7; // 7s to 15s fall duration
    const delay = Math.random() * 5; // 0s to 5s delay before falling

    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${leftPos}%`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;

    // Vary the colors slightly for depth (Rose Gold variations)
    const isDarker = Math.random() > 0.5;
    petal.style.backgroundColor = isDarker ? '#b76e79' : '#d89b9d';

    petalsContainer.appendChild(petal);

    // Remove petal after animation ends to keep DOM clean
    setTimeout(() => {
      petal.remove();
    }, (duration + delay) * 1000);
  }

  // Create initial petals and set interval
  for(let i=0; i<15; i++) {
    createPetal();
  }
  setInterval(createPetal, 1000);


  // 3. Countdown Timer Logic
  const countdownDate = new Date("August 11, 2026 11:30:00").getTime();
  
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  const countdownTimer = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance < 0) {
      clearInterval(countdownTimer);
      daysEl.innerText = "00";
      hoursEl.innerText = "00";
      minutesEl.innerText = "00";
      secondsEl.innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Pad with zeros
    daysEl.innerText = days < 10 ? '0' + days : days;
    hoursEl.innerText = hours < 10 ? '0' + hours : hours;
    minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;

  }, 1000);

});

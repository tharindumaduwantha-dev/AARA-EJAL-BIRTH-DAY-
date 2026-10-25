// Floating magical sparkles
const sparkleLayer = document.getElementById('sparkles');
const sparkleSymbols = ['✦', '✧', '✳', '⋆', '✦'];

for (let i = 0; i < 12; i++) {
  const sparkle = document.createElement('span');
  sparkle.className = 'sparkle';
  sparkle.textContent = sparkleSymbols[i % sparkleSymbols.length];
  sparkle.style.left = `${(i * 37 + 7) % 100}%`;
  sparkle.style.animationDelay = `${(i % 10) * -1.6}s`;
  sparkle.style.animationDuration = `${12 + (i % 8) * 2}s`;
  sparkle.style.fontSize = `${8 + (i % 4) * 4}px`;
  sparkleLayer.appendChild(sparkle);
}

// Reveal content gently as the visitor scrolls
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

// Invitation button
const inviteButton = document.getElementById('inviteButton');
const openedNote = document.getElementById('openedNote');
inviteButton.addEventListener('click', () => {
  const isOpen = !openedNote.hidden;
  openedNote.hidden = isOpen;
  inviteButton.setAttribute('aria-expanded', String(!isOpen));
  if (!isOpen) {
    createWishBurst(inviteButton);
  }
  inviteButton.innerHTML = isOpen
    ? '<span>✧</span> Open your invitation <b>↗</b>'
    : '<span>♡</span> Your invitation is open <b>✦</b>';
});

// Play the local fairytale track after the visitor chooses to start it.
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
const princessMusic = document.getElementById('princessMusic');

musicToggle.addEventListener('click', async () => {
  if (princessMusic.paused) {
    try {
      await princessMusic.play();
    } catch (error) {
      musicLabel.textContent = 'Music unavailable';
      return;
    }
  } else {
    princessMusic.pause();
  }
  const isPlaying = !princessMusic.paused;
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicToggle.setAttribute('aria-label', isPlaying ? 'Pause princess music' : 'Play princess music');
  musicLabel.textContent = isPlaying ? 'Pause music' : 'Play music';
  musicToggle.classList.toggle('is-playing', isPlaying);
});

// Countdown to the royal celebration.
const countdown = document.getElementById('countdown');
const countdownParts = {
  days: document.getElementById('countdownDays'),
  hours: document.getElementById('countdownHours'),
  minutes: document.getElementById('countdownMinutes'),
  seconds: document.getElementById('countdownSeconds')
};
const celebrationDate = new Date('2026-11-14T18:00:00');

function updateCountdown() {
  const remaining = celebrationDate.getTime() - Date.now();

  if (remaining <= 0) {
    countdown.innerHTML = '<p class="countdown-live">The royal celebration is here! ✨</p>';
    return false;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownParts.days.textContent = String(days).padStart(2, '0');
  countdownParts.hours.textContent = String(hours).padStart(2, '0');
  countdownParts.minutes.textContent = String(minutes).padStart(2, '0');
  countdownParts.seconds.textContent = String(seconds).padStart(2, '0');
  return true;
}

updateCountdown();
const countdownTimer = window.setInterval(() => {
  if (!updateCountdown()) {
    window.clearInterval(countdownTimer);
  }
}, 1000);

function createWishBurst(origin) {
  const bounds = origin.getBoundingClientRect();
  const symbols = ['✦', '✧', '⋆', '❀'];

  for (let i = 0; i < 18; i++) {
    const wish = document.createElement('span');
    const angle = (Math.PI * 2 * i) / 12;
    const distance = 70 + (i % 4) * 18;
    wish.className = 'wish-burst';
    wish.textContent = symbols[i % symbols.length];
    wish.style.left = `${bounds.left + bounds.width / 2}px`;
    wish.style.top = `${bounds.top + bounds.height / 2}px`;
    wish.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    wish.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
    wish.style.animationDelay = `${(i % 3) * 25}ms`;
    sparkleLayer.appendChild(wish);
    wish.addEventListener('animationend', () => wish.remove(), { once: true });
  }
}

// Add event to calendar (downloads an .ics file)
document.getElementById('calendarButton').addEventListener('click', () => {
  const eventLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aara Birthday Invitation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'DTSTART:20261114T180000',
    'DTEND:20261114T210000',
    'SUMMARY:Aara Ejal turns 3!',
    'LOCATION:Aara’s Palace in Bellamack',
    'DESCRIPTION:Join Aara for a magical little-princess birthday celebration!',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  const blob = new Blob([eventLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'aara-birthday.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

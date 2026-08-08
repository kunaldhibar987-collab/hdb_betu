/* ==========================================================================
   MINI-GAMES & STAGE TASK LOGIC
   ========================================================================== */

// Stage 05 Heart Catcher
class StageCatcherGame {
  constructor(canvasId, onComplete) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.onComplete = onComplete;
    this.basket = { x: 130, y: 320, width: 60, height: 18 };
    this.hearts = [];
    this.score = 0;
    this.isRunning = false;
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.basket.x = Math.max(0, this.basket.x - 25);
      if (e.key === 'ArrowRight') this.basket.x = Math.min(this.canvas.width - this.basket.width, this.basket.x + 25);
    });

    this.canvas.addEventListener('touchmove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      this.basket.x = Math.max(0, Math.min(this.canvas.width - this.basket.width, touchX - this.basket.width / 2));
    });
  }

  start() {
    this.score = 0;
    this.hearts = [];
    this.isRunning = true;
    this.loop();
  }

  loop() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Basket
    this.ctx.fillStyle = '#ff76ce';
    this.ctx.fillRect(this.basket.x, this.basket.y, this.basket.width, this.basket.height);

    // Spawn Hearts
    if (Math.random() < 0.06) {
      this.hearts.push({ x: Math.random() * (this.canvas.width - 20), y: 0, speed: 2 + Math.random() * 2 });
    }

    for (let i = this.hearts.length - 1; i >= 0; i--) {
      let h = this.hearts[i];
      h.y += h.speed;
      this.ctx.font = '18px serif';
      this.ctx.fillText('❤️', h.x, h.y);

      // Catch Detection
      if (h.y >= this.basket.y && h.x >= this.basket.x && h.x <= this.basket.x + this.basket.width) {
        this.score++;
        document.getElementById('catcherScore').innerText = this.score;
        this.hearts.splice(i, 1);

        if (this.score >= 10) {
          this.isRunning = false;
          this.onComplete();
        }
      } else if (h.y > this.canvas.height) {
        this.hearts.splice(i, 1);
      }
    }

    if (this.isRunning) requestAnimationFrame(() => this.loop());
  }
}

// Stage 09 Memory Match
function initStageMemoryMatch(onSuccess) {
  const grid = document.getElementById('memoryGrid');
  if (!grid) return;
  const icons = ['❤️', '🌙', '⭐', '🎁'];
  const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
  grid.innerHTML = '';
  
  let flipped = [];
  let matches = 0;

  deck.forEach((icon) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.innerText = '❓';
    card.addEventListener('click', () => {
      if (flipped.length < 2 && !card.classList.contains('matched') && card.innerText === '❓') {
        card.innerText = icon;
        flipped.push(card);

        if (flipped.length === 2) {
          if (flipped[0].innerText === flipped[1].innerText) {
            flipped.forEach(c => c.classList.add('matched'));
            matches += 2;
            flipped = [];
            if (matches === deck.length) onSuccess();
          } else {
            setTimeout(() => {
              flipped.forEach(c => c.innerText = '❓');
              flipped = [];
            }, 700);
          }
        }
      }
    });
    grid.appendChild(card);
  });
}
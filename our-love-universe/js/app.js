/* ==========================================================================
   ADVENTURE ENGINE, STAGE ROUTER & PROGRESSION CONTROLLER
   ========================================================================== */
let currentStage = 1;
const TOTAL_STAGES = 25;

document.addEventListener("DOMContentLoaded", () => {
  initParticleBackground();
  initProgressState();
  bindStageEvents();
});

// Particle Background FX
function initParticleBackground() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 0.8 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 118, 206, 0.4)';
    particles.forEach(p => {
      p.y -= p.speedY;
      if (p.y < 0) p.y = canvas.height;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(render);
  }
  render();
}

// Progress State & Save System
function initProgressState() {
  const savedStage = parseInt(localStorage.getItem('our_love_stage'), 10);
  if (savedStage && savedStage > 1 && savedStage <= TOTAL_STAGES) {
    document.getElementById('resumeModalText').innerText = `You were on Stage ${savedStage}. Continue your journey? ❤️`;
    document.getElementById('resumeModal').classList.remove('hidden');

    document.getElementById('resumeYesBtn').onclick = () => {
      document.getElementById('resumeModal').classList.add('hidden');
      jumpToStage(savedStage);
    };

    document.getElementById('resumeRestartBtn').onclick = () => {
      localStorage.removeItem('our_love_stage');
      document.getElementById('resumeModal').classList.add('hidden');
      jumpToStage(1);
    };
  } else {
    jumpToStage(1);
  }
}

// Stage Transition Engine
function advanceStage(transitionText = "Entry approved ❤️") {
  const next = currentStage + 1;
  if (next > TOTAL_STAGES) return;

  const overlay = document.getElementById('transitionOverlay');
  document.getElementById('transitionMessage').innerText = transitionText;
  overlay.classList.remove('hidden');

  setTimeout(() => {
    jumpToStage(next);
    overlay.classList.add('hidden');
  }, 1200);
}

function jumpToStage(stageNum) {
  currentStage = stageNum;
  localStorage.setItem('our_love_stage', currentStage);

  document.querySelectorAll('.stage-card').forEach(s => s.classList.remove('active'));
  const activeCard = document.getElementById(`stage-${currentStage}`);
  if (activeCard) activeCard.classList.add('active');

  // Update Header Bar
  const progressHeader = document.getElementById('gameProgressHeader');
  if (currentStage > 1) {
    progressHeader.classList.remove('hidden');
    document.getElementById('stageTitleDisplay').innerText = `Stage ${currentStage}`;
    document.getElementById('progressCounterDisplay').innerText = `${String(currentStage).padStart(2, '0')} / ${TOTAL_STAGES}`;
    document.getElementById('progressBarFill').style.width = `${(currentStage / TOTAL_STAGES) * 100}%`;
  } else {
    progressHeader.classList.add('hidden');
  }

  // Stage Specific Initializations
  setupStageTasks(currentStage);
}

// Bind Tasks & Objectives per Stage
function setupStageTasks(stage) {
  if (stage === 2) initStage2();
  if (stage === 5) {
    document.getElementById('startCatcherBtn').onclick = () => {
      new StageCatcherGame('catcherCanvas', () => advanceStage("Hearts successfully caught! ❤️")).start();
    };
  }
  if (stage === 7) initStage7();
  if (stage === 9) initStageMemoryMatch(() => advanceStage("All pairs matched! 💕"));
  if (stage === 10) initStage10();
  if (stage === 13) initStage13();
  if (stage === 14) initStage14();
  if (stage === 15) initStage15();
  if (stage === 18) initStage18();
  if (stage === 19) initStage19();
  if (stage === 20) initStage20();
  if (stage === 21) initStage21();
  if (stage === 25) initStage25();
}

/* ------------------ STAGE LOGIC IMPLEMENTATIONS ------------------ */

// Stage 01
document.getElementById('unlockBtn').onclick = () => {
  const pass = document.getElementById('passInput').value;
  const msg = document.getElementById('gateMessage');
  if (pass === SITE_CONFIG.password) {
    msg.style.color = '#ff76ce';
    msg.innerText = "Welcome home, beautiful. 💕";
    setTimeout(() => advanceStage("Welcome… I was waiting for you. ❤️"), 800);
  } else {
    msg.innerText = "Galat password! Dil ka password guess karna easy nahi hai. 😂❤️";
  }
};

// Stage 02
function initStage2() {
  const grid = document.getElementById('oddHeartGrid');
  grid.innerHTML = '';
  const oddIndex = Math.floor(Math.random() * 8);
  for (let i = 0; i < 8; i++) {
    const btn = document.createElement('button');
    btn.className = 'heart-grid-btn';
    btn.innerText = i === oddIndex ? '💗' : '💖';
    btn.onclick = () => {
      if (i === oddIndex) {
        document.getElementById('stage2Feedback').innerText = "Observation skills passed! 😌❤️";
        setTimeout(() => advanceStage("Passing to next secret..."), 800);
      } else {
        document.getElementById('stage2Feedback').innerText = "Try again! Look closely. 👀";
      }
    };
    grid.appendChild(btn);
  }
}

// Stage 03 & 04
function selectDoor(choice) {
  document.getElementById('stage3Feedback').innerText = `Interesting choice (${choice})… 😏`;
  setTimeout(() => advanceStage("Stepping through the door..."), 800);
}

function answerQuestion4(ans) {
  document.getElementById('stage4Feedback').innerText = "I knew you would say that! 😂❤️";
  setTimeout(() => advanceStage("Continuing journey..."), 800);
}

// Stage 06
document.getElementById('dontPressBtn').onclick = () => {
  document.getElementById('dontPressMsg').innerText = "I knew you would press it! 😂❤️";
  setTimeout(() => advanceStage("Curiosity rewarded! 🎁"), 1000);
};

// Stage 07
let shayariClicks = 3;
function initStage7() {
  shayariClicks = 3;
  document.getElementById('stage7ShayariText').innerText = SITE_CONFIG.shayaris[0];
  document.getElementById('oneMoreShayariBtn').onclick = () => {
    shayariClicks--;
    document.getElementById('shayariClicksLeft').innerText = shayariClicks;
    if (shayariClicks >= 0) {
      document.getElementById('stage7ShayariText').innerText = SITE_CONFIG.shayaris[3 - shayariClicks] || SITE_CONFIG.shayaris[0];
    }
    if (shayariClicks <= 0) {
      setTimeout(() => advanceStage("Bas bas… warna book ban jayegi. 😂❤️"), 800);
    }
  };
}

// Stage 08
let eyeCardsOpened = 0;
function revealEyeCard(btn, text) {
  btn.innerText = text;
  btn.disabled = true;
  eyeCardsOpened++;
  if (eyeCardsOpened >= 3) {
    document.getElementById('stage8Feedback').innerText = "Tumhari aankhon se bachna mushkil hai. 😭❤️";
    setTimeout(() => advanceStage("Unlocking memory match..."), 1200);
  }
}

// Stage 10
let quizIdx = 0;
function initStage10() {
  quizIdx = 0;
  renderQuizQuestion();
}
function renderQuizQuestion() {
  const item = SITE_CONFIG.quiz[quizIdx];
  document.getElementById('quizQuestionText').innerText = item.q;
  const grid = document.getElementById('quizOptionsGrid');
  grid.innerHTML = item.options.map((opt, i) => `
    <button class="btn-secondary" onclick="handleQuizAnswer(${i})">${opt}</button>
  `).join('');
}
function handleQuizAnswer(idx) {
  quizIdx++;
  if (quizIdx < SITE_CONFIG.quiz.length) {
    renderQuizQuestion();
  } else {
    advanceStage("Quiz completed! You know us so well. 💕");
  }
}

// Stage 11 & 12
document.getElementById('flirtSlider').oninput = function() {
  document.getElementById('flirtScoreDisplay').innerText = this.value;
};
document.getElementById('submitFlirtScoreBtn').onclick = () => {
  advanceStage("Flirting score saved! 😌❤️");
};

document.getElementById('saveSentenceBtn').onclick = () => {
  const val = document.getElementById('sentenceInput').value;
  if (val.trim()) {
    localStorage.setItem('our_love_sentence', val);
    document.getElementById('stage12Feedback').innerText = "Saved in our memory box! ❤️";
    setTimeout(() => advanceStage("Continuing journey..."), 800);
  }
};

// Stage 13
let likelyIdx = 0;
function initStage13() {
  likelyIdx = 0;
  document.getElementById('likelyQuestionText').innerText = SITE_CONFIG.likelyQuestions[0];
}
function answerLikely(choice) {
  likelyIdx++;
  if (likelyIdx < SITE_CONFIG.likelyQuestions.length) {
    document.getElementById('likelyQuestionText').innerText = SITE_CONFIG.likelyQuestions[likelyIdx];
    document.getElementById('likelyCurrentNum').innerText = likelyIdx + 1;
  } else {
    advanceStage("Playful battle completed! Winner: BOTH ❤️");
  }
}

// Stage 14
let jarClicks = 3;
function initStage14() {
  jarClicks = 3;
  document.getElementById('loveJarBtn').onclick = () => {
    jarClicks--;
    document.getElementById('jarNotesNeeded').innerText = jarClicks;
    const notes = ["You make ordinary days special. ✨", "Your smile is my favorite thing. ❤️", "Stuck with me forever! 😂"];
    document.getElementById('jarNoteText').innerText = notes[3 - jarClicks - 1] || notes[0];
    if (jarClicks <= 0) setTimeout(() => advanceStage("Love jar empty! Moving forward..."), 1000);
  };
}

// Stage 15
let openedLetters = 0;
function initStage15() {
  openedLetters = 0;
  const grid = document.getElementById('envelopesGrid');
  grid.innerHTML = SITE_CONFIG.letters.map((l, i) => `
    <div class="envelope-card" onclick="openLetter(this, '${l.content}')">
      <h4>${l.title}</h4>
    </div>
  `).join('');
}
function openLetter(el, content) {
  el.innerHTML = `<p class="small-text">${content}</p>`;
  el.onclick = null;
  openedLetters++;
  if (openedLetters >= 4) setTimeout(() => advanceStage("All letters read! ❤️"), 1200);
}

// Stage 16 Secret Egg
document.getElementById('hiddenHeartEgg').onclick = () => {
  advanceStage("Secret easter egg found! 👀✨");
};

// Stage 17 Sequence
let seqProgress = [];
const correctSeq = ['❤️', '🌙', '⭐', '🦋', '🎂'];
function clickSeqSymbol(sym) {
  seqProgress.push(sym);
  if (seqProgress[seqProgress.length - 1] !== correctSeq[seqProgress.length - 1]) {
    seqProgress = [];
    document.getElementById('stage17Feedback').innerText = "Wrong order! Try again. 🔄";
  } else {
    document.getElementById('stage17Feedback').innerText = `Sequence: ${seqProgress.join(' ')}`;
    if (seqProgress.length === correctSeq.length) {
      setTimeout(() => advanceStage("Puzzle solved! 🧩❤️"), 800);
    }
  }
}

// Stage 18 Compliments
let compCount = 5;
function initStage18() {
  compCount = 5;
  document.getElementById('genComplimentBtn').onclick = () => {
    compCount--;
    document.getElementById('complimentsNeeded').innerText = compCount;
    document.getElementById('complimentDisplay').innerText = SITE_CONFIG.compliments[compCount] || SITE_CONFIG.compliments[0];
    if (compCount <= 0) setTimeout(() => advanceStage("Compliment overload! 💕"), 1000);
  };
}

// Stage 19 Fake Progress
function initStage19() {
  let progress = 0;
  const fill = document.getElementById('fakeProgressFill');
  const status = document.getElementById('fakeCalcStatus');
  const interval = setInterval(() => {
    progress += 10;
    fill.style.width = progress + '%';
    status.innerText = progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      status.innerText = "ERROR: Number too large to calculate! 😭❤️";
      setTimeout(() => advanceStage("Overflow of love! ❤️"), 1200);
    }
  }, 200);
}

// Stage 20 Story
let storyIdx = 0;
function initStage20() {
  storyIdx = 0;
  renderStoryItem();
  document.getElementById('nextStoryBtn').onclick = () => {
    storyIdx++;
    if (storyIdx < SITE_CONFIG.storyTimeline.length) {
      renderStoryItem();
    } else {
      advanceStage("Memory journey completed! 📖");
    }
  };
}
function renderStoryItem() {
  const item = SITE_CONFIG.storyTimeline[storyIdx];
  document.getElementById('timelineTitle').innerText = item.title;
  document.getElementById('timelineDesc').innerText = item.desc;
}

// Stage 21 Surprise
let surpriseCount = 3;
function initStage21() {
  surpriseCount = 3;
  document.getElementById('triggerSurpriseBtn').onclick = () => {
    surpriseCount--;
    document.getElementById('surprisesNeeded').innerText = surpriseCount;
    document.getElementById('surpriseBoxText').innerText = SITE_CONFIG.surprises[surpriseCount] || SITE_CONFIG.surprises[0];
    if (surpriseCount <= 0) setTimeout(() => advanceStage("Surprises unlocked! 🎁"), 1000);
  };
}

// Stage 22 Puzzle
let assembledPieces = 0;
function assemblePiece(btn) {
  btn.disabled = true;
  btn.style.opacity = '0.5';
  assembledPieces++;
  if (assembledPieces >= 3) {
    document.getElementById('wholeHeartContainer').classList.remove('hidden');
    document.getElementById('stage22Feedback').innerText = "Some things just fit together perfectly. ❤️";
    setTimeout(() => advanceStage("Heart assembled! ❤️"), 1200);
  }
}

// Stage 23 Scramble
document.getElementById('revealScrambleBtn').onclick = () => {
  document.getElementById('scrambleSolution').innerText = "Solution: 'I love you more than words can say.' ❤️";
  setTimeout(() => advanceStage("Secret decrypted! 🔐"), 1200);
};

// Stage 24 Final Door
function openFinalDoor(choice) {
  advanceStage(choice === 'ready' ? "Opening the heart chamber..." : "Don't worry, I'm right here. ❤️");
}

// Stage 25 Emotional Finale Typewriter
function initStage25() {
  const body = document.getElementById('finaleTypewriterBody');
  body.innerHTML = '';
  let lineIdx = 0;

  function revealNextLine() {
    if (lineIdx < SITE_CONFIG.finalMessageLines.length) {
      const p = document.createElement('p');
      p.className = 'lead-text margin-top';
      p.innerText = SITE_CONFIG.finalMessageLines[lineIdx];
      body.appendChild(p);
      lineIdx++;
      setTimeout(revealNextLine, 1800);
    } else {
      document.getElementById('restartJourneyBtn').classList.remove('hidden');
    }
  }
  revealNextLine();
}

document.getElementById('restartJourneyBtn').onclick = () => {
  localStorage.removeItem('our_love_stage');
  jumpToStage(1);
};
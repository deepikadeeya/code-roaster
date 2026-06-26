// ===== LINE COUNTER =====
const codeInput = document.getElementById('codeInput');
const lineCountEl = document.getElementById('lineCount');

codeInput.addEventListener('input', () => {
  const lines = codeInput.value === '' ? 0 : codeInput.value.split('\n').length;
  lineCountEl.textContent = lines === 0
    ? '0 lines of questionable decisions'
    : `${lines} line${lines === 1 ? '' : 's'} of questionable decisions`;
});

// ===== ROAST TEMPLATES =====
const roastTemplates = [
  {
    check: (code) => code.includes('var '),
    line: "🔥 Still using `var`? What year do you think it is, 2012?",
    type: 'fire'
  },
  {
    check: (code) => /console\.log/.test(code),
    line: "💀 Found console.log(). A wild debugging fossil appears.",
    type: 'skull'
  },
  {
    check: (code) => code.includes('TODO'),
    line: "⚠️  TODO comments — the graveyard of good intentions.",
    type: 'warn'
  },
  {
    check: (code) => /if.*==/.test(code),
    line: "🔥 Using `==` instead of `===`? Living dangerously, I see.",
    type: 'fire'
  },
  {
    check: (code) => code.split('\n').some(l => l.length > 120),
    line: "📏 Some lines are longer than my patience. Ever heard of line breaks?",
    type: 'warn'
  },
  {
    check: (code) => /function\s+\w+\s*\(/.test(code) && !/\/\/|\/\*/.test(code),
    line: "📝 No comments? Great — future you is going to love this mystery.",
    type: 'warn'
  },
  {
    check: (code) => /catch\s*\(.*\)\s*\{\s*\}/.test(code),
    line: "🚨 Empty catch block detected. Errors? What errors? Bold strategy.",
    type: 'fire'
  },
  {
    check: (code) => code.includes('!important'),
    line: "😩 !important in CSS — the nuclear option. Classic.",
    type: 'fire'
  },
  {
    check: (code) => /\t/.test(code) && / {2}/.test(code),
    line: "⚠️  Mixing tabs and spaces? Pick a side. This isn't Python (but even Python has standards).",
    type: 'warn'
  },
  {
    check: (code) => code.includes('goto'),
    line: "💀 `goto`?! You absolute legend. Wrong era, wrong language, zero regrets.",
    type: 'skull'
  },
  {
    check: (code) => /password\s*=\s*['"][^'"]+['"]/.test(code),
    line: "🚨 Hardcoded password spotted. Your security team just fainted.",
    type: 'fire'
  },
  {
    check: (code) => code.includes('innerHTML'),
    line: "🔥 `innerHTML` — why fix XSS vulnerabilities when you can just invite them in?",
    type: 'fire'
  },
  {
    check: (code) => /for\s*\(.*in.*\)/.test(code),
    line: "⚠️  `for...in` on an array? Spicy choice. Hope you like prototype properties.",
    type: 'warn'
  },
  {
    check: (code) => code.split('\n').length > 200,
    line: "📦 This file is longer than a CVS receipt. Split it up, please.",
    type: 'warn'
  },
  {
    check: (code) => /\beval\b/.test(code),
    line: "☠️  `eval()` — the 'hold my beer' of JavaScript functions.",
    type: 'skull'
  },
];

// Generic roasts always shown
const genericRoasts = [
  { line: "🔥 Whoever wrote this deserves a participation trophy.", type: 'fire' },
  { line: "💀 I've seen spaghetti with more structure than this.", type: 'skull' },
  { line: "⚠️  This code has the vibe of a 2am deadline submission.", type: 'warn' },
  { line: "🔥 On the bright side, it's not the worst code I've seen today. It's close though.", type: 'fire' },
  { line: "✅ It probably works. That's... something.", type: 'ok' },
];

// ===== SCORE GENERATOR =====
function generateScores(code, matches) {
  const penaltyPer = 15;
  const base = 85;

  const readability = Math.max(10, base - matches * penaltyPer + Math.floor(Math.random() * 10));
  const logic = Math.max(10, base - Math.floor(matches * penaltyPer * 0.7) + Math.floor(Math.random() * 15));
  const willRun = Math.max(5, base - Math.floor(matches * penaltyPer * 0.5) + Math.floor(Math.random() * 20));

  return {
    readability: Math.min(readability, 99),
    logic: Math.min(logic, 99),
    willRun: Math.min(willRun, 99)
  };
}

// ===== ANIMATE LINES =====
function animateLines(lines, container) {
  container.innerHTML = '';
  lines.forEach((item, i) => {
    const span = document.createElement('span');
    span.className = `roast-line ${item.type}`;
    span.textContent = item.line;
    span.style.animationDelay = `${i * 120}ms`;
    container.appendChild(span);
    container.appendChild(document.createTextNode('\n'));
  });
}

// ===== MAIN ROAST FUNCTION =====
function roastCode() {
  const code = codeInput.value.trim();

  if (!code) {
    shakeBtn();
    return;
  }

  const btn = document.getElementById('roastBtn');
  const roastOutput = document.getElementById('roastOutput');
  const roastScore = document.getElementById('roastScore');
  const copyBtn = document.getElementById('copyBtn');

  // Loading state
  btn.classList.add('loading');
  btn.innerHTML = `<span class="btn-icon">⏳</span> Roasting...`;
  roastScore.style.display = 'none';
  copyBtn.style.display = 'none';

  roastOutput.innerHTML = `
    <div class="spinner">
      <div class="spin-ring"></div>
      <span>Analyzing your... creative choices...</span>
    </div>`;

  // Simulate roasting delay
  setTimeout(() => {
    const matched = roastTemplates.filter(t => t.check(code));
    const numGeneric = Math.max(2, 4 - matched.length);
    const shuffledGeneric = genericRoasts.sort(() => Math.random() - 0.5).slice(0, numGeneric);
    const allRoasts = [...matched, ...shuffledGeneric];

    const roastContainer = document.createElement('div');
    roastContainer.className = 'roast-text';
    roastOutput.innerHTML = '';
    roastOutput.appendChild(roastContainer);

    animateLines(allRoasts, roastContainer);

    // Show scores
    const scores = generateScores(code, matched.length);
    roastScore.style.display = 'flex';

    setTimeout(() => {
      document.getElementById('readScore').style.width = scores.readability + '%';
      document.getElementById('logicScore').style.width = scores.logic + '%';
      document.getElementById('runScore').style.width = scores.willRun + '%';
    }, 200);

    copyBtn.style.display = 'block';
    btn.classList.remove('loading');
    btn.innerHTML = `<span class="btn-icon">🔥</span> Roast Again`;

  }, 1800);
}

// ===== COPY ROAST =====
function copyRoast() {
  const lines = [...document.querySelectorAll('.roast-line')];
  const text = lines.map(l => l.textContent).join('\n');
  navigator.clipboard.writeText(text).then(() => showToast());
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== SHAKE BUTTON =====
function shakeBtn() {
  const btn = document.getElementById('roastBtn');
  btn.style.animation = 'none';
  btn.style.transform = 'translateX(0)';

  let count = 0;
  const shake = setInterval(() => {
    btn.style.transform = count % 2 === 0 ? 'translateX(6px)' : 'translateX(-6px)';
    count++;
    if (count > 6) {
      clearInterval(shake);
      btn.style.transform = 'translateX(0)';
    }
  }, 60);
}

// ===== KEYBOARD SHORTCUT =====
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    roastCode();
  }
});

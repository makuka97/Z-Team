<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Z-TEAM — PC EDITION</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  <script src="/shared/game-constants.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: #000;
      font-family: 'Press Start 2P', monospace;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }

    body::after {
      content: '';
      position: fixed; inset: 0;
      background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px);
      pointer-events: none; z-index: 9999;
    }

    /* ── SCREEN CONTAINERS ── */
    .screen {
      display: none;
      width: 100vw; height: 100vh;
      align-items: center; justify-content: center;
      flex-direction: column;
      position: absolute; top: 0; left: 0;
    }
    .screen.active { display: flex; }

    /* ── LOBBY ── */
    #lobby-screen { gap: 0; }

    #lobby-title {
      font-size: clamp(56px, 12vw, 110px);
      color: #883232;
      letter-spacing: clamp(6px, 1.5vw, 18px);
      text-shadow: 3px 3px 0 #3d0000, -1px -1px 0 #5a1a1a, 2px 0 0 #3d0000;
      margin-bottom: 8px;
    }
    #lobby-subtitle { color: #7869c4; font-size: 7px; letter-spacing: 5px; margin-bottom: 6px; }
    #lobby-author   { color: #7869c4; font-size: 7px; letter-spacing: 3px; margin-bottom: 44px; }

    .lobby-box {
      border: 2px solid #40318d;
      padding: 28px 36px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      min-width: 340px;
    }

    .lobby-label { color: #7869c4; font-size: 8px; letter-spacing: 2px; margin-bottom: 4px; text-align: center; }

    #room-input {
      background: #000; border: 2px solid #40318d; color: #fff;
      font-family: 'Press Start 2P', monospace; font-size: 22px;
      letter-spacing: 12px; text-align: center;
      width: 200px; height: 52px; padding: 0 8px;
      outline: none; text-transform: uppercase;
    }
    #room-input:focus { border-color: #7869c4; }
    #room-input::placeholder { color: #222; }

    .lobby-btn {
      width: 220px; height: 48px;
      font-family: 'Press Start 2P', monospace; font-size: 11px;
      letter-spacing: 2px; cursor: pointer;
      border: 2px solid; background: transparent;
      transition: background 0.08s;
    }
    #join-btn  { color: #fff; border-color: #fff; }
    #join-btn:hover  { background: #883232; border-color: #883232; }

    #lobby-error { color: #883232; font-size: 8px; letter-spacing: 1px; min-height: 20px; text-align: center; margin-top: 4px; }
    #lobby-status { color: #7869c4; font-size: 8px; letter-spacing: 1px; min-height: 20px; text-align: center; }

    /* ── WAITING ROOM ── */
    #waiting-screen { gap: 24px; }

    #wait-room-code {
      font-size: 28px; color: #fff; letter-spacing: 8px;
    }
    #wait-room-code span { color: #bfce72; }

    #invite-btn {
      font-family: 'Press Start 2P', monospace; font-size: 8px;
      letter-spacing: 1px; color: #6fcfcf; border: 2px solid #6fcfcf;
      background: transparent; cursor: pointer; padding: 10px 16px;
      transition: background 0.1s;
    }
    #invite-btn:hover { background: rgba(111,207,207,0.12); }

    #player-slots {
      display: flex; gap: 16px;
    }
    .p-slot {
      width: 72px; height: 88px;
      border: 2px solid #222;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 6px; font-size: 9px; color: #333;
    }
    .p-slot.filled { border-color: var(--pc); color: var(--pc); }
    .p-slot-box { width: 28px; height: 28px; background: #111; }
    .p-slot.filled .p-slot-box { background: var(--pc); }

    #ready-btn {
      width: 240px; height: 52px;
      font-family: 'Press Start 2P', monospace; font-size: 12px;
      letter-spacing: 2px; cursor: pointer;
      border: 2px solid #fff; background: transparent; color: #fff;
      transition: all 0.1s;
    }
    #ready-btn.ready { border-color: #55a049; color: #55a049; background: rgba(85,160,73,0.1); }
    #ready-btn:hover { background: rgba(255,255,255,0.05); }

    #ready-count { color: #7869c4; font-size: 8px; letter-spacing: 2px; }
    #countdown-display { color: #bfce72; font-size: 22px; letter-spacing: 4px; min-height: 32px; }

    #wait-mic-wrap { display: flex; align-items: center; gap: 12px; }
    #wait-mic-btn {
      width: 48px; height: 48px; border-radius: 50%;
      border: 2px solid #40318d; background: #000; color: #7869c4;
      font-family: 'Press Start 2P', monospace; font-size: 6px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 2px; cursor: pointer; transition: all 0.1s;
    }
    #wait-mic-btn.mic-on   { border-color: #55a049; color: #55a049; }
    #wait-mic-btn.muted    { border-color: #883232; color: #883232; }
    #wait-mic-btn.speaking { box-shadow: 0 0 8px #55a049; }

    /* ── GAME SCREEN ── */
    #game-screen {
      position: relative;
      padding: 0;
      background: #000;
    }
    #game-canvas {
      display: block;
      touch-action: none;
    }

    /* HUD overlay */
    #hud {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
      z-index: 10;
    }
    #hud-top {
      position: absolute; top: 10px; left: 10px;
      font-size: 9px; color: #bfce72; line-height: 1.8;
    }
    #hud-players {
      position: absolute; top: 10px; right: 10px;
      display: flex; flex-direction: column; gap: 8px; align-items: flex-end;
    }
    .hud-player {
      display: flex; align-items: center; gap: 6px;
      font-size: 7px;
    }
    .hud-p-color { width: 12px; height: 12px; flex-shrink: 0; }
    .hud-p-info { display: flex; flex-direction: column; gap: 2px; align-items: flex-end; }
    .hud-hp-bar-bg { width: 60px; height: 5px; background: #1a0000; }
    .hud-hp-bar    { height: 5px; transition: width 0.1s; }

    #hud-controls {
      position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
      font-size: 6px; color: #40318d; letter-spacing: 1px; white-space: nowrap;
    }

    /* MIC button in game */
    #mic-btn {
      position: absolute; bottom: 20px; right: 20px;
      width: 64px; height: 64px; border-radius: 50%;
      border: 2px solid #40318d; background: #000;
      color: #7869c4; font-family: 'Press Start 2P', monospace; font-size: 7px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 3px; cursor: pointer; z-index: 20; transition: all 0.1s;
      pointer-events: all;
    }
    #mic-btn.mic-on   { border-color: #55a049; color: #55a049; }
    #mic-btn.muted    { border-color: #883232; color: #883232; }
    #mic-btn.speaking { border-color: #55a049; color: #55a049; box-shadow: 0 0 8px #55a049; }

    /* Wave banner */
    #wave-banner {
      position: absolute; top: 30%; left: 50%; transform: translateX(-50%);
      font-size: 20px; color: #bfce72; letter-spacing: 4px;
      text-align: center; pointer-events: none; z-index: 15;
      opacity: 0; transition: opacity 0.3s;
      text-shadow: 2px 2px 0 #000;
    }
    #wave-banner.visible { opacity: 1; }

    /* Interaction prompts */
    #interact-prompt {
      position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%);
      font-size: 7px; color: #bfce72; letter-spacing: 1px;
      pointer-events: none; z-index: 15; min-height: 16px; text-align: center;
    }

    /* ── GAME OVER ── */
    #gameover-screen { gap: 28px; }
    #gameover-title { font-size: clamp(32px, 8vw, 72px); color: #883232; letter-spacing: 6px; }
    #gameover-wave  { font-size: 14px; color: #7869c4; letter-spacing: 3px; }
    #restart-btn {
      width: 260px; height: 52px;
      font-family: 'Press Start 2P', monospace; font-size: 11px;
      letter-spacing: 2px; cursor: pointer;
      border: 2px solid #fff; background: transparent; color: #fff;
      transition: all 0.1s;
    }
    #restart-btn:hover { background: rgba(136,50,50,0.3); border-color: #883232; color: #883232; }
    #restart-votes { color: #7869c4; font-size: 8px; letter-spacing: 2px; min-height: 18px; }

    /* Vending/MysteryBox prompts - shown in HUD */
    .shop-prompt {
      position: absolute;
      font-size: 7px; color: #bfce72;
      background: rgba(0,0,0,0.8); border: 1px solid #40318d;
      padding: 6px 10px; pointer-events: all; cursor: pointer;
      z-index: 12;
    }
  </style>
</head>
<body>

  <!-- ── LOBBY SCREEN ── -->
  <div id="lobby-screen" class="screen">
    <div id="lobby-title">Z-TEAM</div>
    <div id="lobby-subtitle">ZOMBIE WAVE SURVIVAL</div>
    <div id="lobby-author">WRITTEN BY MICAJAH NORDYKE</div>
    <div class="lobby-box">
      <div class="lobby-label">ENTER ROOM CODE</div>
      <input id="room-input" type="text" maxlength="4" placeholder="····" autocomplete="off" spellcheck="false">
      <button id="join-btn" class="lobby-btn">JOIN ROOM</button>
      <div id="lobby-error"></div>
      <div id="lobby-status"></div>
    </div>
  </div>

  <!-- ── WAITING ROOM SCREEN ── -->
  <div id="waiting-screen" class="screen">
    <div id="wait-room-code">ROOM: <span id="wait-code-val">----</span></div>
    <button id="invite-btn">📋 COPY INVITE LINK</button>

    <div id="player-slots">
      <div class="p-slot" id="slot-1" style="--pc:#00ffff"><div class="p-slot-box"></div><span>P1</span></div>
      <div class="p-slot" id="slot-2" style="--pc:#ff44ff"><div class="p-slot-box"></div><span>P2</span></div>
      <div class="p-slot" id="slot-3" style="--pc:#4488ff"><div class="p-slot-box"></div><span>P3</span></div>
      <div class="p-slot" id="slot-4" style="--pc:#ffff00"><div class="p-slot-box"></div><span>P4</span></div>
    </div>

    <button id="ready-btn">READY UP</button>
    <div id="ready-count">WAITING FOR PLAYERS...</div>
    <div id="countdown-display"></div>

    <div id="wait-mic-wrap">
      <button id="wait-mic-btn" onclick="toggleMicWait()">
        <span>🎤</span><span id="wait-mic-label">MIC</span>
      </button>
      <span style="font-size:7px;color:#40318d">VOICE CHAT</span>
    </div>
  </div>

  <!-- ── GAME SCREEN ── -->
  <div id="game-screen" class="screen">
    <canvas id="game-canvas"></canvas>

    <div id="hud">
      <div id="hud-top">
        <div id="hud-wave">WAVE —</div>
        <div id="hud-zombies">ZOMBIES —</div>
      </div>
      <div id="hud-players"></div>
      <div id="hud-controls">WASD=MOVE · MOUSE=AIM · CLICK=FIRE/KNIFE · F=BOX · V=VEND</div>
    </div>

    <div id="wave-banner"></div>
    <div id="interact-prompt"></div>

    <button id="mic-btn" onclick="toggleMute()">
      <span id="mic-icon">🎤</span>
      <span id="mic-label">MIC</span>
    </button>
  </div>

  <!-- ── GAME OVER SCREEN ── -->
  <div id="gameover-screen" class="screen">
    <div id="gameover-title">GAME OVER</div>
    <div id="gameover-wave">WAVE 0 SURVIVED</div>
    <button id="restart-btn" onclick="voteRestart()">RESTART</button>
    <div id="restart-votes"></div>
  </div>

  <script src="/socket.io/socket.io.js"></script>
  <script>
  'use strict';

  // ── Socket (MUST be first) ──────────────────────────────────────
  const socket = io({ transports: ['websocket'], upgrade: false });

  // ── Game constants (with fallbacks) ────────────────────────────
  const GC = (typeof window.GAME_CONSTANTS !== 'undefined') ? window.GAME_CONSTANTS : {};
  const CANVAS_W = 1334, CANVAS_H = 750;

  // ── State ───────────────────────────────────────────────────────
  let roomCode    = null;
  let mySlot      = null;
  let myColor     = null;
  let isReady     = false;
  let gameState   = null;
  let smooth      = {};
  let animId      = null;

  // Mouse / keyboard
  const keys  = {};
  const mouse = { x: CANVAS_W / 2, y: CANVAS_H / 2, down: false, clicked: false };
  let canvasScale = 1, canvasOffX = 0, canvasOffY = 0;

  // Input loop
  let inputInterval = null;

  // Interaction flags (updated from game state)
  let nearMysteryBox  = false;
  let nearVending     = false;
  let vendingCost     = 0;

  // ── Voice chat ──────────────────────────────────────────────────
  let localStream   = null;
  let rtcPeers      = {};
  const remoteAudios = {};  // module-scope — prevents GC
  let audioCtx      = null;
  let analyserNodes = {};
  let myMuted       = false;
  let micInitialized = false;

  // ── Screens ─────────────────────────────────────────────────────
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  // ── LOBBY ───────────────────────────────────────────────────────
  function showLobby() { showScreen('lobby-screen'); }

  function joinRoom(code) {
    if (!code || code.length !== 4) return;
    code = code.toUpperCase();
    document.getElementById('lobby-status').textContent = 'CONNECTING...';
    document.getElementById('lobby-error').textContent = '';
    const fingerprint = localStorage.getItem('zt-fp') || Math.random().toString(36).slice(2);
    localStorage.setItem('zt-fp', fingerprint);
    socket.emit('join-room', { roomCode: code, fingerprint });
  }

  document.getElementById('join-btn').addEventListener('click', () => {
    const code = document.getElementById('room-input').value.trim().toUpperCase();
    if (code.length !== 4) {
      document.getElementById('lobby-error').textContent = 'ENTER 4-LETTER CODE';
      return;
    }
    joinRoom(code);
  });

  document.getElementById('room-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('join-btn').click();
  });
  document.getElementById('room-input').addEventListener('input', e => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g,'');
  });

  // ── WAITING ROOM ────────────────────────────────────────────────
  function showWaitingRoom() {
    isReady = false;
    document.getElementById('ready-btn').classList.remove('ready');
    document.getElementById('ready-btn').textContent = 'READY UP';
    document.getElementById('countdown-display').textContent = '';
    document.getElementById('ready-count').textContent = 'WAITING FOR PLAYERS...';
    showScreen('waiting-screen');
  }

  document.getElementById('invite-btn').addEventListener('click', async () => {
    const url = `${window.location.origin}/game.html?room=${roomCode}`;
    try {
      await navigator.clipboard.writeText(url);
      document.getElementById('invite-btn').textContent = '✅ LINK COPIED!';
      setTimeout(() => { document.getElementById('invite-btn').textContent = '📋 COPY INVITE LINK'; }, 2000);
    } catch(e) {
      document.getElementById('invite-btn').textContent = url;
    }
  });

  document.getElementById('ready-btn').addEventListener('click', () => {
    if (!isReady) {
      isReady = true;
      document.getElementById('ready-btn').classList.add('ready');
      document.getElementById('ready-btn').textContent = 'READY!';
      socket.emit('player-ready', { roomCode });
    }
  });

  function updateLobbySlots(players) {
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById('slot-' + i);
      const p = players.find(p => p.slot === i);
      if (p) { el.classList.add('filled'); el.style.setProperty('--pc', p.color); }
      else    { el.classList.remove('filled'); }
    }
  }

  // ── GAME SCREEN ─────────────────────────────────────────────────
  const canvas = document.getElementById('game-canvas');
  const ctx    = canvas.getContext('2d');

  function resizeCanvas() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const ratio = CANVAS_W / CANVAS_H;
    let w = vw, h = vw / ratio;
    if (h > vh) { h = vh; w = vh * ratio; }
    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    canvasScale = w / CANVAS_W;
    canvasOffX  = (vw - w) / 2;
    canvasOffY  = (vh - h) / 2;
    const gs = document.getElementById('game-screen');
    gs.style.width  = vw + 'px';
    gs.style.height = vh + 'px';
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function showGameScreen() {
    showScreen('game-screen');
    resizeCanvas();
    startInputLoop();
    if (!animId) renderLoop();
  }

  // Mouse handling on canvas
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / canvasScale;
    mouse.y = (e.clientY - rect.top)  / canvasScale;
  });
  canvas.addEventListener('mousedown', e => {
    if (e.button === 0) { mouse.down = true; mouse.clicked = true; }
  });
  canvas.addEventListener('mouseup', e => {
    if (e.button === 0) mouse.down = false;
  });
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  // Keyboard
  document.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    // Interaction keys
    if (e.key.toLowerCase() === 'f' && nearMysteryBox) {
      socket.emit('mystery-box-purchase', { roomCode });
    }
    if (e.key.toLowerCase() === 'v' && nearVending) {
      socket.emit('vending-purchase', { roomCode });
    }
  });
  document.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

  // ── INPUT LOOP ──────────────────────────────────────────────────
  function startInputLoop() {
    if (inputInterval) clearInterval(inputInterval);
    inputInterval = setInterval(() => {
      if (!gameState || !mySlot) return;
      const localMe = gameState.players.find(p => p.slot === mySlot);
      if (!localMe || !localMe.alive) return;

      // Client-side prediction
      tickLocalPlayer(localMe);

      const aimAngle = Math.atan2(mouse.y - localMe.y, mouse.x - localMe.x);
      let moveX = 0, moveY = 0;
      if (keys['w'] || keys['arrowup'])    moveY = -1;
      if (keys['s'] || keys['arrowdown'])  moveY =  1;
      if (keys['a'] || keys['arrowleft'])  moveX = -1;
      if (keys['d'] || keys['arrowright']) moveX =  1;
      if (moveX && moveY) { moveX *= 0.707; moveY *= 0.707; }

      const fire = mouse.down && localMe.ammo !== 0;
      socket.emit('pc-input', { roomCode, input: { moveX, moveY, aimAngle, fire } });

      if (mouse.clicked && localMe.ammo === 0) {
        socket.emit('pc-melee', { roomCode });
        mouse.clicked = false;
      }
      mouse.clicked = false;

      // Near shop objects?
      nearMysteryBox = !!localMe.canUseMysteryBox;
      nearVending    = !!localMe.canUseVending;
      vendingCost    = localMe.vendingCost || 0;
      updateInteractPrompt();
    }, 16);
  }

  function tickLocalPlayer(p) {
    const SPEED = 4.2, WALL = 6, HS = 14;
    let vx = 0, vy = 0;
    if (keys['w'] || keys['arrowup'])    vy = -SPEED;
    if (keys['s'] || keys['arrowdown'])  vy =  SPEED;
    if (keys['a'] || keys['arrowleft'])  vx = -SPEED;
    if (keys['d'] || keys['arrowright']) vx =  SPEED;
    if (vx && vy) { vx *= 0.707; vy *= 0.707; }
    p.x = Math.max(HS + WALL, Math.min(CANVAS_W - HS - WALL, p.x + vx));
    p.y = Math.max(HS + WALL, Math.min(CANVAS_H - HS - WALL, p.y + vy));
    p.angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
  }

  function updateInteractPrompt() {
    const el = document.getElementById('interact-prompt');
    if (nearMysteryBox)  el.textContent = '[F] MYSTERY BOX';
    else if (nearVending) el.textContent = '[V] VENDING MACHINE — ' + vendingCost + ' PTS';
    else                  el.textContent = '';
  }

  // ── SMOOTHING ───────────────────────────────────────────────────
  function getSmoothPos(key, sx, sy, svx, svy) {
    if (!smooth[key]) { smooth[key] = { x: sx, y: sy, vx: svx||0, vy: svy||0 }; return smooth[key]; }
    const s = smooth[key];
    const dx = sx - s.x, dy = sy - s.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > 100) { s.x = sx; s.y = sy; }
    else { s.x += dx * 0.4; s.y += dy * 0.4; }
    s.vx = svx||0; s.vy = svy||0;
    return s;
  }

  // ── RENDERING ───────────────────────────────────────────────────
  function renderLoop() {
    animId = requestAnimationFrame(renderLoop);
    if (!gameState) { drawIdleFrame(); return; }
    render(gameState);
  }

  function drawIdleFrame() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    drawGrid();
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(120,105,196,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_W; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
    }
    for (let y = 0; y < CANVAS_H; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
    }
    ctx.strokeStyle = '#40318d';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CANVAS_W - 2, CANVAS_H - 2);
  }

  function render(state) {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    drawGrid();

    // Ammo packs
    if (state.ammoPacks) state.ammoPacks.forEach(a => {
      ctx.fillStyle = '#bfce72';
      ctx.fillRect(a.x - 6, a.y - 6, 12, 12);
      ctx.fillStyle = '#000';
      ctx.fillRect(a.x - 4, a.y - 2, 8, 4);
    });

    // Health packs
    if (state.healthPacks) state.healthPacks.forEach(h => {
      ctx.fillStyle = '#55a049';
      ctx.fillRect(h.x - 7, h.y - 7, 14, 14);
      ctx.fillStyle = '#fff';
      ctx.fillRect(h.x - 1, h.y - 5, 2, 10);
      ctx.fillRect(h.x - 5, h.y - 1, 10, 2);
    });

    // Mystery box
    if (state.mysteryBox) {
      const b = state.mysteryBox;
      const pulse = Math.floor(Date.now() / 400) % 2 === 0;
      ctx.fillStyle = pulse ? '#8b3f96' : '#883232';
      ctx.fillRect(b.x - 14, b.y - 14, 28, 28);
      ctx.strokeStyle = '#d14da0'; ctx.lineWidth = 2;
      ctx.strokeRect(b.x - 14, b.y - 14, 28, 28);
      ctx.fillStyle = '#fff'; ctx.font = '7px "Press Start 2P"';
      ctx.textAlign = 'center'; ctx.fillText('?', b.x, b.y + 3);
    }

    // Vending machine
    if (state.vendingMachine) {
      const v = state.vendingMachine;
      ctx.fillStyle = '#40318d';
      ctx.fillRect(v.x - 16, v.y - 20, 32, 40);
      ctx.strokeStyle = '#7869c4'; ctx.lineWidth = 2;
      ctx.strokeRect(v.x - 16, v.y - 20, 32, 40);
      ctx.fillStyle = '#6fcfcf'; ctx.font = '6px "Press Start 2P"';
      ctx.textAlign = 'center'; ctx.fillText('VEND', v.x, v.y + 3);
    }

    // Zombies
    if (state.zombies) state.zombies.forEach(z => {
      const s = getSmoothPos('z' + z.id, z.x, z.y, z.vx, z.vy);
      const half = z.size / 2;
      ctx.fillStyle = z.color || '#553300';
      ctx.fillRect(s.x - half, s.y - half, z.size, z.size);
      ctx.strokeStyle = z.borderColor || '#883200'; ctx.lineWidth = 2;
      ctx.strokeRect(s.x - half, s.y - half, z.size, z.size);

      // HP bar
      const hpPct = z.hp / z.maxHp;
      ctx.fillStyle = '#1a0000';
      ctx.fillRect(s.x - half, s.y - half - 6, z.size, 4);
      ctx.fillStyle = hpPct > 0.5 ? '#55a049' : hpPct > 0.25 ? '#bfce72' : '#883232';
      ctx.fillRect(s.x - half, s.y - half - 6, z.size * hpPct, 4);
    });

    // Bullets
    if (state.bullets) state.bullets.forEach(b => {
      ctx.save();
      switch(b.weapon) {
        case 'shotgun':
          ctx.fillStyle = '#bfce72'; ctx.fillRect(b.x-2, b.y-2, 4, 4); break;
        case 'smg': {
          const a = Math.atan2(b.vy, b.vx);
          ctx.fillStyle = '#c8a800'; ctx.translate(b.x, b.y); ctx.rotate(a);
          ctx.fillRect(-5, -1, 10, 2); break;
        }
        case 'lmg': {
          const a = Math.atan2(b.vy, b.vx);
          ctx.fillStyle = '#8b5429'; ctx.translate(b.x, b.y); ctx.rotate(a);
          ctx.fillRect(-7, -2, 14, 4); break;
        }
        case 'ar': {
          const a = Math.atan2(b.vy, b.vx);
          ctx.fillStyle = '#55a049'; ctx.translate(b.x, b.y); ctx.rotate(a);
          ctx.fillRect(-6, -1, 12, 3); break;
        }
        case 'minigun':
          ctx.fillStyle = '#d14da0'; ctx.fillRect(b.x-2, b.y-2, 4, 4); break;
        case 'raygun':
          ctx.fillStyle = '#6fcfcf'; ctx.fillRect(b.x-4, b.y-4, 8, 8);
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
          ctx.strokeRect(b.x-4, b.y-4, 8, 8); break;
        case 'thundergun':
          ctx.fillStyle = '#883232'; ctx.fillRect(b.x-5, b.y-5, 10, 10);
          ctx.fillStyle = '#fff'; ctx.fillRect(b.x-2, b.y-2, 4, 4); break;
        case 'plasma':
          ctx.fillStyle = '#8b3f96'; ctx.fillRect(b.x-4, b.y-4, 8, 8);
          ctx.fillStyle = '#d14da0'; ctx.fillRect(b.x-2, b.y-2, 4, 4); break;
        default:
          ctx.fillStyle = b.color || '#fff'; ctx.fillRect(b.x-2, b.y-2, 4, 4);
      }
      ctx.restore();
    });

    // Explosions
    if (state.explosions) state.explosions.forEach(ex => {
      ctx.save();
      ctx.translate(ex.x, ex.y);
      if (ex.melee && ex.angle != null) ctx.rotate(ex.angle);
      const size = ex.melee ? 18 : 12;
      ctx.fillStyle = ex.color || '#bfce72';
      ctx.fillRect(-size/2, -size/2, size, size);
      if (!ex.melee) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(-4, -4, 8, 8);
      }
      ctx.restore();
    });

    // Players
    if (state.players) state.players.forEach(p => {
      if (!p.connected && !p.alive) return;
      let px = p.x, py = p.y;
      if (p.slot !== mySlot) {
        const s = getSmoothPos('p' + p.slot, p.x, p.y, p.vx, p.vy);
        px = s.x; py = s.y;
      }
      const drawP = Object.assign({}, p, { x: px, y: py });

      if (!p.alive) {
        // Dead indicator
        ctx.strokeStyle = p.color; ctx.lineWidth = 2;
        ctx.strokeRect(px-14, py-14, 28, 28);
        ctx.fillStyle = 'rgba(136,50,50,0.4)';
        ctx.fillRect(px-14, py-14, 28, 28);
        ctx.fillStyle = '#883232'; ctx.font = '7px "Press Start 2P"';
        ctx.textAlign = 'center'; ctx.fillText('DEAD', px, py + 3);
        return;
      }

      // Body
      ctx.fillStyle = p.color;
      ctx.fillRect(px-14, py-14, 28, 28);
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
      ctx.strokeRect(px-13, py-13, 26, 26);

      // Gun
      drawGun(ctx, drawP, 14);

      // HP bar
      ctx.fillStyle = '#1a0000'; ctx.fillRect(px-14, py-22, 28, 4);
      const hpPct = p.hp / p.maxHp;
      ctx.fillStyle = hpPct > 0.5 ? '#55a049' : hpPct > 0.25 ? '#bfce72' : '#883232';
      ctx.fillRect(px-14, py-22, 28 * hpPct, 4);

      // Label
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px "Press Start 2P"';
      ctx.textAlign = 'center'; ctx.fillText('P' + p.slot, px, py + 4);

      // Knife indicator
      if (p.ammo === 0) {
        ctx.fillStyle = '#94e089'; ctx.font = '6px "Press Start 2P"';
        ctx.fillText('KNIFE', px, py - 28);
      }

      // Speaking indicator
      if (analyserNodes[p.slot]) {
        const data = new Uint8Array(32);
        analyserNodes[p.slot].getByteFrequencyData(data);
        const vol = data.reduce((s,v)=>s+v,0)/data.length;
        if (vol > 12) {
          ctx.strokeStyle = '#55a049'; ctx.lineWidth = 2;
          ctx.strokeRect(px-16, py-16, 32, 32);
        }
      }
    });

    // HUD update
    updateHUD(state);
  }

  function drawGun(ctx, p, hs) {
    const a = p.angle;
    const w = p.weapon || p.currentWeapon || 'pistol';
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(a);
    switch(w) {
      case 'pistol':
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(hs-2,0); ctx.lineTo(hs+12,0); ctx.stroke(); break;
      case 'smg':
        ctx.strokeStyle = '#c8a800'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(hs-2,0); ctx.lineTo(hs+16,0); ctx.stroke();
        ctx.fillStyle = '#c8a800'; ctx.fillRect(hs+4,-3,6,2); break;
      case 'shotgun':
        ctx.strokeStyle = '#8b5429'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(hs-2,-2); ctx.lineTo(hs+14,-2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hs-2,2);  ctx.lineTo(hs+14,2);  ctx.stroke(); break;
      case 'ar':
        ctx.strokeStyle = '#55a049'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(hs-4,0); ctx.lineTo(hs+20,0); ctx.stroke();
        ctx.fillStyle = '#55a049'; ctx.fillRect(hs+8,-2,4,4); break;
      case 'lmg':
        ctx.strokeStyle = '#8b5429'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(hs-4,0); ctx.lineTo(hs+22,0); ctx.stroke(); break;
      case 'minigun':
        ctx.strokeStyle = '#d14da0'; ctx.lineWidth = 2;
        [-3,0,3].forEach(o => {
          ctx.beginPath(); ctx.moveTo(hs,o); ctx.lineTo(hs+24,o); ctx.stroke();
        });
        ctx.fillStyle = '#883272'; ctx.fillRect(hs+2,-5,5,10); break;
      case 'raygun':
        ctx.strokeStyle = 'rgba(111,207,207,0.4)'; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(hs,0); ctx.lineTo(hs+18,0); ctx.stroke();
        ctx.strokeStyle = '#6fcfcf'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(hs-2,0); ctx.lineTo(hs+18,0); ctx.stroke();
        ctx.fillStyle = '#6fcfcf'; ctx.fillRect(hs+16,-3,6,6); break;
      case 'thundergun':
        ctx.strokeStyle = '#883232'; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(hs-2,0); ctx.lineTo(hs+14,0); ctx.stroke(); break;
      case 'plasma':
        ctx.strokeStyle = '#8b3f96'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(hs-2,0); ctx.lineTo(hs+16,0); ctx.stroke();
        const pulse = Math.sin(Date.now()*0.01)*2;
        ctx.fillStyle = '#d14da0';
        ctx.fillRect(hs+14-pulse/2, -pulse/2-2, 4+pulse, 4+pulse); break;
      case 'chainsaw':
        ctx.strokeStyle = '#574200'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(hs-2,0); ctx.lineTo(hs+20,0); ctx.stroke();
        ctx.fillStyle = '#c8a800';
        for (let i=0;i<4;i++) { ctx.fillRect(hs+3+i*4,-4,2,4); ctx.fillRect(hs+5+i*4,0,2,4); } break;
      default:
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(hs-2,0); ctx.lineTo(hs+12,0); ctx.stroke();
    }
    ctx.restore();
  }

  // ── HUD ─────────────────────────────────────────────────────────
  function updateHUD(state) {
    document.getElementById('hud-wave').textContent    = 'WAVE ' + (state.wave || '--');
    document.getElementById('hud-zombies').textContent = 'ZOMBIES ' + (state.zombies ? state.zombies.length : '--');

    const container = document.getElementById('hud-players');
    container.innerHTML = '';
    if (!state.players) return;
    state.players.filter(p => p.connected).forEach(p => {
      const div = document.createElement('div');
      div.className = 'hud-player';
      const hpPct = p.maxHp ? Math.max(0, p.hp / p.maxHp) : 0;
      const hpColor = hpPct > 0.5 ? '#55a049' : hpPct > 0.25 ? '#bfce72' : '#883232';
      const ammoStr = p.ammo === -1 ? '∞' : (p.ammo === 0 ? 'KNIFE' : p.ammo);
      div.innerHTML = `
        <div class="hud-p-color" style="background:${p.color}"></div>
        <div class="hud-p-info">
          <span style="color:${p.color}">P${p.slot} ${p.alive?'':'💀'}</span>
          <div class="hud-hp-bar-bg"><div class="hud-hp-bar" style="width:${hpPct*100}%;background:${hpColor}"></div></div>
          <span style="color:#7869c4">${p.weapon||'pistol'} · ${ammoStr}</span>
          <span style="color:#bfce72">${p.points||0} PTS</span>
        </div>`;
      container.appendChild(div);
    });
  }

  // ── WAVE BANNER ─────────────────────────────────────────────────
  function showBanner(text) {
    const el = document.getElementById('wave-banner');
    el.textContent = text;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 2800);
  }

  // ── GAME OVER ───────────────────────────────────────────────────
  function showGameOver(wave) {
    document.getElementById('gameover-wave').textContent = 'WAVE ' + wave + ' SURVIVED';
    document.getElementById('restart-votes').textContent = '';
    document.getElementById('restart-btn').textContent = 'RESTART';
    showScreen('gameover-screen');
    if (inputInterval) { clearInterval(inputInterval); inputInterval = null; }
  }

  function voteRestart() {
    socket.emit('restart-vote', { roomCode });
    document.getElementById('restart-btn').textContent = 'VOTED!';
    document.getElementById('restart-btn').disabled = true;
  }

  // ── SOCKET EVENTS ───────────────────────────────────────────────
  socket.on('connect', () => {
    // Auto-join from URL params
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if (urlRoom) {
      document.getElementById('room-input').value = urlRoom.toUpperCase();
      joinRoom(urlRoom);
    } else if (params.get('create') === '1') {
      socket.emit('create-room');
    }
  });

  socket.on('room-created', ({ roomCode: code }) => {
    roomCode = code;
    document.getElementById('wait-code-val').textContent = code;
    showWaitingRoom();
  });

  socket.on('join-success', ({ roomCode: code, slotNumber, color }) => {
    roomCode = code;
    mySlot   = slotNumber;
    myColor  = color;
    document.getElementById('wait-code-val').textContent = code;
    document.getElementById('lobby-status').textContent = '';
    showWaitingRoom();
    // Init voice AFTER join (after user gesture context)
    // We don't auto-init — user clicks mic button
  });

  socket.on('join-failed', ({ reason }) => {
    document.getElementById('lobby-error').textContent = reason || 'JOIN FAILED';
    document.getElementById('lobby-status').textContent = '';
  });

  socket.on('lobby-update', ({ players }) => updateLobbySlots(players));

  socket.on('ready-update', ({ readyCount, total }) => {
    document.getElementById('ready-count').textContent = `READY: ${readyCount}/${total}`;
    if (readyCount === total && total > 0) {
      let count = 3;
      document.getElementById('countdown-display').textContent = count;
      const cd = setInterval(() => {
        count--;
        if (count <= 0) { clearInterval(cd); document.getElementById('countdown-display').textContent = 'GO!'; }
        else document.getElementById('countdown-display').textContent = count;
      }, 1000);
    }
  });

  socket.on('game-starting-remote', () => {
    smooth = {};
    gameState = null;
    showGameScreen();
  });

  socket.on('remote-game-state', state => {
    gameState = state;
  });

  socket.on('wave-banner', ({ text }) => showBanner(text));

  socket.on('game-over', ({ wave }) => showGameOver(wave));

  socket.on('restart-vote-remote', ({ votes, needed }) => {
    document.getElementById('restart-votes').textContent = `VOTES: ${votes}/${needed}`;
  });

  socket.on('game-restarting-remote', () => {
    smooth = {};
    gameState = null;
    isReady = false;
    document.getElementById('restart-btn').disabled = false;
    showWaitingRoom();
  });

  // ── VOICE CHAT ──────────────────────────────────────────────────
  async function initVoiceChat() {
    if (micInitialized) return;
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micInitialized = true;
      myMuted = false;
      updateMicUI(true);
      setupVoiceAnalyser(mySlot, localStream);
      for (const pc of Object.values(rtcPeers)) {
        localStream.getTracks().forEach(t => { try { pc.addTrack(t, localStream); } catch(e){} });
      }
    } catch(e) {
      updateMicUI(false);
      console.warn('Mic denied:', e);
    }
  }

  function getOrCreatePeer(remoteSlot) {
    if (rtcPeers[remoteSlot]) return rtcPeers[remoteSlot];
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    });
    if (localStream) localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
    pc.onicecandidate = e => {
      if (e.candidate) socket.emit('rtc-ice', { roomCode, to: remoteSlot, from: mySlot, candidate: e.candidate });
    };
    pc.ontrack = e => {
      const stream = e.streams[0];
      if (!remoteAudios[remoteSlot]) {
        const audio = new Audio();
        audio.srcObject = stream;
        audio.autoplay = true;
        remoteAudios[remoteSlot] = audio;
      } else {
        remoteAudios[remoteSlot].srcObject = stream;
      }
      remoteAudios[remoteSlot].play().catch(() => {});
      setupVoiceAnalyser(remoteSlot, stream);
    };
    rtcPeers[remoteSlot] = pc;
    return pc;
  }

  async function initiateCall(remoteSlot) {
    const pc = getOrCreatePeer(remoteSlot);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('rtc-offer', { roomCode, to: remoteSlot, from: mySlot, offer });
  }

  socket.on('rtc-offer', async data => {
    const pc = getOrCreatePeer(data.from);
    await pc.setRemoteDescription(data.offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('rtc-answer', { roomCode, to: data.from, from: mySlot, answer });
  });

  socket.on('rtc-answer', async data => {
    const pc = rtcPeers[data.from];
    if (pc) await pc.setRemoteDescription(data.answer);
  });

  socket.on('rtc-ice', async data => {
    const pc = rtcPeers[data.from];
    if (pc && data.candidate) { try { await pc.addIceCandidate(data.candidate); } catch(e){} }
  });

  socket.on('rtc-initiate', async data => {
    if (data.offerer === mySlot) await initiateCall(data.answerer);
  });

  function setupVoiceAnalyser(slot, stream) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const src = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      analyserNodes[slot] = analyser;
    } catch(e) {}
  }

  function toggleMute() {
    if (!micInitialized) { initVoiceChat(); return; }
    myMuted = !myMuted;
    if (localStream) localStream.getAudioTracks().forEach(t => t.enabled = !myMuted);
    updateMicUI(!myMuted);
  }

  function toggleMicWait() {
    if (!micInitialized) { initVoiceChat(); return; }
    myMuted = !myMuted;
    if (localStream) localStream.getAudioTracks().forEach(t => t.enabled = !myMuted);
    updateMicUIWait(!myMuted);
  }

  function updateMicUI(on) {
    const btn = document.getElementById('mic-btn');
    const lbl = document.getElementById('mic-label');
    if (!btn) return;
    btn.classList.remove('mic-on','muted');
    if (!micInitialized) { lbl.textContent = 'MIC'; return; }
    if (on) { btn.classList.add('mic-on'); lbl.textContent = 'ON'; }
    else     { btn.classList.add('muted');  lbl.textContent = 'MUTE'; }
    updateMicUIWait(on);
  }

  function updateMicUIWait(on) {
    const btn = document.getElementById('wait-mic-btn');
    const lbl = document.getElementById('wait-mic-label');
    if (!btn) return;
    btn.classList.remove('mic-on','muted');
    if (!micInitialized) { lbl.textContent = 'MIC'; return; }
    if (on) { btn.classList.add('mic-on'); lbl.textContent = 'ON'; }
    else     { btn.classList.add('muted');  lbl.textContent = 'MUTE'; }
  }

  // Speaking indicator poll
  setInterval(() => {
    if (!audioCtx || !analyserNodes[mySlot]) return;
    const data = new Uint8Array(32);
    analyserNodes[mySlot].getByteFrequencyData(data);
    const vol = data.reduce((s,v)=>s+v,0)/data.length;
    const speaking = vol > 12 && !myMuted;
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) micBtn.classList.toggle('speaking', speaking);
    const wBtn = document.getElementById('wait-mic-btn');
    if (wBtn) wBtn.classList.toggle('speaking', speaking);
  }, 80);

  // ── INIT ─────────────────────────────────────────────────────────
  // Check URL params on load (before socket connect fires)
  (() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if (urlRoom) {
      document.getElementById('room-input').value = urlRoom.toUpperCase().slice(0,4);
    }
    showLobby();
    renderLoop(); // start idle canvas render
  })();

  </script>
</body>
</html>

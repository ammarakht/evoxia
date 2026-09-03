/**
 * EVOXIA — main.js
 * Three.js 3D reactor + GSAP pin scroll-trigger + all logic
 */

gsap.registerPlugin(ScrollTrigger);

// ════════════════════════════ DATA ════════════════════════
const MEMBERS = {
  baqir:  { name:'M Baqir',        role:'Project Manager & Strategy Lead',   av:'av1', init:'MB',
             bio:'M Baqir is the strategic backbone of EVOXIA, translating high-level visions into agile roadmaps with crystal-clear client communication.',
             skills:['Agile / Scrum Sprint Management','Technical Roadmapping & KPI Tracking','Client Discovery & Scope Alignment','Risk Mitigation & Resource Optimization'],
             email:'baqir@evoxia.agency', phone:'+92 300 000 0000' },
  ammar:  { name:'M Ammar Akhter', role:'Lead Full-Stack Developer',          av:'av2', init:'MA',
             bio:'M Ammar Akhter merges architectural robustness with bleeding-edge web animation, delivering 60fps experiences using React and GSAP.',
             skills:['Creative Frontend & GSAP Motion Physics','React / Next.js & TypeScript','CSS Architecture & Tailwind','Full-Stack API & Backend Systems'],
             email:'ammar@evoxia.agency', phone:'+92 300 000 0000' },
  ibrahim:{ name:'M Ibrahim Khan',  role:'Lead UI/UX Designer',               av:'av3', init:'MI',
             bio:'M Ibrahim Khan leads visual identity and product design at EVOXIA with an eye for typography, spatial balance, and micro-interactions.',
             skills:['Design Systems & Component Libraries','High-Fidelity Wireframing & Prototyping','User Journey Mapping & Research','Micro-Animations & Interaction Spec'],
             email:'ibrahim@evoxia.agency', phone:'+92 300 000 0000' },
  hasham: { name:'Hasham Arshad',   role:'QA & Test Automation Specialist',   av:'av4', init:'HA',
             bio:'Hasham Arshad ensures nothing ships without reaching pinnacle reliability — automated E2E suites, cross-device audits, Lighthouse sweeps.',
             skills:['Automated E2E Testing (Playwright)','Cross-Browser & Device Lab','Lighthouse & Core Web Vitals','Security Scanning & Vulnerability Reports'],
             email:'hasham@evoxia.agency', phone:'+92 300 000 0000' },
};

const CASES = {
  quantum:    { title:'Project Quantum AI Platform', type:'WEB + AI',      desc:'An interactive AI-powered analytics platform with real-time WebGL visualizations, GSAP dashboards, and a scalable Next.js backend.', tech:['GSAP 3','Three.js','Next.js','Python AI','Tailwind CSS'], metrics:['0.4s Load','60 FPS Charts','100 Lighthouse'] },
  'nexa-mob': { title:'Nexa Mobile App',             type:'MOBILE UI/UX',  desc:'Cross-platform mobile app with smooth gesture navigation, glassmorphic cards, biometric auth flows, and a Figma-sourced design system.', tech:['React Native','Figma','Framer Motion','REST API'], metrics:['4.9★ App Store','2.1s Cold Start','99.7% Crash-Free'] },
  quantum2:   { title:'Quantum Dashboard',           type:'WEB',           desc:'Real-time financial analytics dashboard with animated graphs, live WebSocket feeds, and dark-mode-first design.', tech:['React','D3.js','WebSockets','Tailwind'], metrics:['Real-Time Data','A+ Performance','Mobile Ready'] },
  nexa:       { title:'Nexa — Web + Mobile',         type:'WEB + MOBILE',  desc:'Full-stack brand presence: scroll-triggered marketing site paired with a mobile app, sharing unified design language and backend.', tech:['Next.js','GSAP','Lenis','React Native','Node.js'], metrics:['3.4x Conversion','Zero CLS','Full E2E QA'] },
  'nexa-mob2':{ title:'Nexa Mobile App v2',          type:'MOBILE',        desc:'Second-gen redesign with improved IA, dark-mode system tokens, and a revamped onboarding flow that cut drop-offs by 68%.', tech:['Figma','React Native','Expo','Playwright'], metrics:['68% Retention Boost','12s Onboarding','0 P0 Bugs'] },
};

// ════════════════════════════ BOOT ════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initStars();
  initThreeReactor();
  initNav();
  initHeroScroll();
  initSectionReveals();
  initMobileNav();
});

// ════════════════════════════ LENIS ═══════════════════════
let lenisInstance = null;

function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenisInstance = new Lenis({
    duration: 1.35,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenisInstance.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // smooth anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); lenisInstance.scrollTo(el, { offset: -72, duration: 1.4 }); }
    });
  });
}

// ════════════════════════════ STARS CANVAS ════════════════
function initStars() {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const STARS = [];

  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  for (let i = 0; i < 220; i++) {
    STARS.push({ x: Math.random() * 1920, y: Math.random() * 1080, r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.6 + 0.1, vx: (Math.random() - 0.5) * 0.05, vy: (Math.random() - 0.5) * 0.05,
      ph: Math.random() * Math.PI * 2 });
  }

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const t = Date.now() * 0.001;
    STARS.forEach(s => {
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
      const alpha = s.a * (0.5 + 0.5 * Math.sin(t + s.ph));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160,175,255,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
}

// ════════════════════════ THREE.JS REACTOR ════════════════
let threeScene, threeCamera, threeRenderer, reactorGroup;
let animFrameId;

function initThreeReactor() {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('threeCanvas');
  if (!canvas) return;

  // Scene
  threeScene = new THREE.Scene();

  // Camera — positioned to see reactor from slight top-right angle
  threeCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  threeCamera.position.set(0, 0, 8);

  // Renderer
  threeRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  threeRenderer.setSize(window.innerWidth, window.innerHeight);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  threeRenderer.outputEncoding = THREE.sRGBEncoding;
  threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  threeRenderer.toneMappingExposure = 1.2;

  // ── LIGHTING ──
  const ambientLight = new THREE.AmbientLight(0x112244, 1.5);
  threeScene.add(ambientLight);

  const coreLight = new THREE.PointLight(0x88aaff, 8, 12);
  coreLight.position.set(0, 0, 0);
  threeScene.add(coreLight);

  const rimLight1 = new THREE.DirectionalLight(0x4466ff, 2);
  rimLight1.position.set(-4, 3, 2);
  threeScene.add(rimLight1);

  const rimLight2 = new THREE.DirectionalLight(0x8844ff, 1.5);
  rimLight2.position.set(4, -2, 1);
  threeScene.add(rimLight2);

  const blueGlow = new THREE.PointLight(0x00ccff, 5, 8);
  blueGlow.position.set(0, 0, 1);
  threeScene.add(blueGlow);

  // ── BUILD REACTOR ──
  reactorGroup = new THREE.Group();

  // Materials
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x1a2550,
    metalness: 0.95,
    roughness: 0.25,
    envMapIntensity: 1.5,
  });

  const brightMetalMat = new THREE.MeshStandardMaterial({
    color: 0x3355aa,
    metalness: 1.0,
    roughness: 0.1,
    envMapIntensity: 2,
  });

  const glowMat = new THREE.MeshStandardMaterial({
    color: 0x4488ff,
    metalness: 0.2,
    roughness: 0.5,
    emissive: 0x2244cc,
    emissiveIntensity: 1.5,
  });

  const innerGlowMat = new THREE.MeshStandardMaterial({
    color: 0x88aaff,
    metalness: 0.1,
    roughness: 0.4,
    emissive: 0x5588ff,
    emissiveIntensity: 3,
  });

  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.1,
    emissive: 0xaabbff,
    emissiveIntensity: 6,
  });

  // Helper: create a torus ring
  function makeRing(outerR, tubeR, mat, segments = 64, tubeSegments = 32) {
    const geo  = new THREE.TorusGeometry(outerR, tubeR, tubeSegments, segments);
    const mesh = new THREE.Mesh(geo, mat);
    return mesh;
  }

  // Helper: create a flat disc/ring
  function makeDisc(innerR, outerR, mat) {
    const geo  = new THREE.RingGeometry(innerR, outerR, 64);
    const mesh = new THREE.Mesh(geo, mat);
    return mesh;
  }

  // Helper: segment ring (for the gear-like detail rings)
  function makeSegmentRing(r, segCount, segWidth, segHeight, mat) {
    const group = new THREE.Group();
    for (let i = 0; i < segCount; i++) {
      const angle = (i / segCount) * Math.PI * 2;
      const geo   = new THREE.BoxGeometry(segWidth, segHeight, segHeight * 0.5);
      const mesh  = new THREE.Mesh(geo, mat);
      mesh.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
      mesh.rotation.z = angle;
      group.add(mesh);
    }
    return group;
  }

  // ── OUTER STRUCTURAL RINGS ──
  // Ring 1 — outermost dark steel frame
  const ring1 = makeRing(1.85, 0.14, metalMat);
  reactorGroup.add(ring1);

  // Ring 2
  const ring2 = makeRing(1.65, 0.09, metalMat);
  reactorGroup.add(ring2);

  // ── SEGMENT / GEAR RINGS ──
  const segRing1 = makeSegmentRing(1.75, 24, 0.08, 0.18, metalMat);
  reactorGroup.add(segRing1);

  const segRing2 = makeSegmentRing(1.5, 18, 0.06, 0.12, brightMetalMat);
  reactorGroup.add(segRing2);

  // ── ACCENT GLOW RINGS ──
  const glowRing1 = makeRing(1.55, 0.035, glowMat, 128, 16);
  reactorGroup.add(glowRing1);

  const glowRing2 = makeRing(1.35, 0.028, glowMat, 128, 16);
  reactorGroup.add(glowRing2);

  // ── MIDDLE STRUCTURE RING ──
  const ring3 = makeRing(1.22, 0.08, metalMat);
  reactorGroup.add(ring3);

  const segRing3 = makeSegmentRing(1.22, 14, 0.055, 0.1, brightMetalMat);
  reactorGroup.add(segRing3);

  // ── INNER BRIGHT GLOW RINGS ──
  const innerGlow1 = makeRing(1.05, 0.04, innerGlowMat, 128, 16);
  reactorGroup.add(innerGlow1);

  const innerGlow2 = makeRing(0.88, 0.03, innerGlowMat, 128, 16);
  reactorGroup.add(innerGlow2);

  // ── INNER DETAIL RING ──
  const ring4 = makeRing(0.75, 0.07, metalMat);
  reactorGroup.add(ring4);

  const segRing4 = makeSegmentRing(0.75, 10, 0.04, 0.08, brightMetalMat);
  reactorGroup.add(segRing4);

  // ── INNERMOST GLOW ──
  const coreRing = makeRing(0.58, 0.025, coreMat, 128, 16);
  reactorGroup.add(coreRing);

  // ── CORE SPHERE (bright plasma centre) ──
  const coreGeo  = new THREE.SphereGeometry(0.28, 32, 32);
  const coreSphere = new THREE.Mesh(coreGeo, coreMat);
  reactorGroup.add(coreSphere);

  // ── OUTER GLOW HALO (sprite/additive sphere) ──
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x3366ff,
    transparent: true,
    opacity: 0.06,
    side: THREE.FrontSide,
  });
  const haloGeo = new THREE.SphereGeometry(0.85, 32, 32);
  const halo    = new THREE.Mesh(haloGeo, haloMat);
  reactorGroup.add(halo);

  const haloMat2 = new THREE.MeshBasicMaterial({
    color: 0x2255ff,
    transparent: true,
    opacity: 0.04,
    side: THREE.FrontSide,
  });
  const haloGeo2 = new THREE.SphereGeometry(1.3, 32, 32);
  const halo2    = new THREE.Mesh(haloGeo2, haloMat2);
  reactorGroup.add(halo2);

  // ── ELECTRIC PLASMA SPOKES / RAYS (inside reactor) ──
  const raysGroup = new THREE.Group();
  const rayMat = new THREE.LineBasicMaterial({
    color: 0x4fc3f7,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
  });

  const RAY_COUNT = 32;
  for (let i = 0; i < RAY_COUNT; i++) {
    const theta = (i / RAY_COUNT) * Math.PI * 2;
    const innerR = 0.35 + (i % 3 === 0 ? 0.05 : 0);
    const outerR = 0.95 + (i % 2 === 0 ? 0.2 : 0);
    const points = [
      new THREE.Vector3(Math.cos(theta) * innerR, Math.sin(theta) * innerR, 0.02),
      new THREE.Vector3(Math.cos(theta) * outerR, Math.sin(theta) * outerR, 0.02),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geo, rayMat);
    raysGroup.add(line);
  }
  reactorGroup.add(raysGroup);

  // ── INITIAL TILT ── (matches video: slightly from above-right, angled)
  reactorGroup.rotation.x = 0.30;   // tilt back (top of ring away)
  reactorGroup.rotation.y = -0.42;  // rotate right face toward viewer

  // Scale down so it doesn't fill the whole screen
  reactorGroup.scale.setScalar(0.8);
  // Position to right side (matches video initial state)
  reactorGroup.position.set(1.8, 0, 0);

  threeScene.add(reactorGroup);

  // ── RESIZE ──
  window.addEventListener('resize', () => {
    threeCamera.aspect = window.innerWidth / window.innerHeight;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

  // ── MOUSE PARALLAX ──
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // ── RENDER LOOP ──
  let t = 0;
  const animate = () => {
    animFrameId = requestAnimationFrame(animate);
    t += 0.004;

    // Rotate concentric rings & rays
    segRing1.rotation.z += 0.003;
    segRing2.rotation.z -= 0.005;
    segRing3.rotation.z += 0.008;
    segRing4.rotation.z -= 0.01;
    glowRing1.rotation.z += 0.006;
    glowRing2.rotation.z -= 0.007;
    innerGlow1.rotation.z += 0.012;
    innerGlow2.rotation.z -= 0.014;
    coreRing.rotation.z += 0.018;
    raysGroup.rotation.z -= 0.006;

    // Pulse core & rays
    const pulse = 1 + 0.08 * Math.sin(t * 2.5);
    coreSphere.scale.setScalar(pulse);
    coreLight.intensity = 8 + 4 * Math.sin(t * 2.5);
    blueGlow.intensity  = 5 + 2.5 * Math.sin(t * 1.8);
    rayMat.opacity      = 0.45 + 0.35 * Math.sin(t * 3.5);

    // Apply parallax with scroll proxy blending
    if (reactorGroup) {
      reactorGroup.rotation.x = reactorProxy.rx + my * 0.05 * (1 - scrollProxy.progress);
      reactorGroup.rotation.y = reactorProxy.ry + mx * 0.06 * (1 - scrollProxy.progress);
    }

    threeRenderer.render(threeScene, threeCamera);
  };
  animate();
}

// Global proxy object so animate loop and gsap stay in sync
const reactorProxy = { px: 1.8, py: 0, rx: 0.30, ry: -0.42, scale: 0.8 };
const scrollProxy  = { progress: 0 };

// ════════════════════ HERO SCROLL ANIMATION (PROPER PIN) ═════════════════
function initHeroScroll() {
  const wrapper   = document.getElementById('heroPinWrapper');
  const heroText  = document.getElementById('heroText');
  const cardField = document.getElementById('cardField');
  const scrollHint= document.getElementById('scrollHint');
  const cards     = document.querySelectorAll('.fcard');

  if (!wrapper) return;

  // ── ENTRANCE on page load ──
  const tl = gsap.timeline({ delay: 0.2 });
  tl.from(heroText,   { x: -60, opacity: 0, duration: 1,   ease: 'power3.out' })
    .from(cards,      { scale: 0.6, opacity: 0, stagger: 0.07, duration: 0.75, ease: 'back.out(1.5)' }, '-=0.7')
    .from('.sh',      { opacity: 0, stagger: 0.04, duration: 0.5 }, '-=0.5')
    .from(scrollHint, { opacity: 0, y: 8, duration: 0.6 }, '-=0.4');

  // ── Idle float animations on cards ──
  gsap.to('#fc1', { y: -16, duration: 5.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
  gsap.to('#fc2', { y: -20, duration: 6.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.5 });
  gsap.to('#fc3', { y: -12, duration: 7.0, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.0 });
  gsap.to('#fc4', { y: -14, duration: 5.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.3 });
  gsap.to('#fc5', { y: -18, duration: 6.0, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.7 });
  gsap.to('#fc6', { y: -11, duration: 5.8, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.2 });

  // ── SCROLL TIMELINE (scrubbed with GSAP pin) ──
  const st = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=160%',
      pin: true,
      anticipatePin: 1,
      scrub: 1.0,
      onUpdate: (self) => {
        scrollProxy.progress = self.progress;
      }
    }
  });

  // PHASE 1 (0–40%): Text fades left, scroll hint fades
  st.to(heroText, { x: -80, opacity: 0, duration: 0.35, ease: 'power1.in' }, 0)
    .to(scrollHint, { opacity: 0, duration: 0.15 }, 0);

  // PHASE 1 (0–50%): Reactor moves right → center and tilts flat (facing user)
  st.to(reactorProxy, {
    px: 0,
    py: 0,
    rx: 0,
    ry: 0,
    scale: 1.05,
    duration: 0.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (reactorGroup) {
        reactorGroup.position.x = reactorProxy.px;
        reactorGroup.position.y = reactorProxy.py;
        reactorGroup.scale.setScalar(reactorProxy.scale);
      }
    },
  }, 0);

  // PHASE 2 (30–80%): Cards expand outward into constellation
  const cardExpand = [
    { el: '#fc1', x: -260, y: -180 },
    { el: '#fc2', x:  240, y: -220 },
    { el: '#fc3', x: -360, y:  20  },
    { el: '#fc4', x: -220, y:  200 },
    { el: '#fc5', x:   60, y:  240 },
    { el: '#fc6', x:  320, y:  160 },
  ];

  cardExpand.forEach(c => {
    st.to(c.el, {
      x: c.x, y: c.y,
      scale: 1.05,
      duration: 0.45,
      ease: 'power2.out',
    }, 0.25);
  });

  // PHASE 3 (75–100%): Fade out as user exits hero pin
  st.to(['#cardField', '.sh', heroText], {
    opacity: 0,
    duration: 0.25,
    ease: 'power1.in',
  }, 0.75);

  st.to(reactorProxy, {
    scale: 0.5,
    duration: 0.25,
    ease: 'power2.in',
    onUpdate: () => {
      if (reactorGroup) reactorGroup.scale.setScalar(reactorProxy.scale);
    },
  }, 0.75);
}

// ════════════════════════════ SECTION REVEALS ════════════
function initSectionReveals() {
  document.querySelectorAll('[data-r]').forEach(el => {
    const dir   = el.getAttribute('data-r');
    const delay = parseFloat(el.getAttribute('data-delay') || 0) / 1000;
    const from  = { opacity: 0, duration: 0.9, ease: 'power2.out', delay };

    if (dir === 'up')    from.y =  55;
    if (dir === 'down')  from.y = -55;
    if (dir === 'left')  from.x = -60;
    if (dir === 'right') from.x =  60;

    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      ...from,
    });
  });

  // Portfolio cards stagger
  gsap.from('.pcard', {
    scrollTrigger: { trigger: '.port-grid', start: 'top 85%' },
    y: 55, opacity: 0, stagger: 0.09, duration: 0.85, ease: 'power2.out',
  });

  // Team cards stagger
  gsap.from('.tf', {
    scrollTrigger: { trigger: '.team-grid', start: 'top 85%' },
    y: 40, opacity: 0, stagger: 0.1, duration: 0.85, ease: 'power2.out',
  });

  // Process steps
  gsap.from('.pr-step', {
    scrollTrigger: { trigger: '.proc-rm', start: 'top 82%' },
    y: 28, opacity: 0, stagger: 0.14, duration: 0.75, ease: 'power2.out',
  });

  gsap.from('.pr-ln', {
    scrollTrigger: { trigger: '.proc-rm', start: 'top 80%' },
    scaleX: 0, transformOrigin: 'left center', stagger: 0.14, delay: 0.35,
    duration: 0.55, ease: 'power2.inOut',
  });
}

// ════════════════════════════ NAV ════════════════════════
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('solid', window.scrollY > 40), { passive: true });
}

function initMobileNav() {
  const btn   = document.getElementById('ham');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// ════════════════════════════ MODALS ═════════════════════
window.openMember = function(key) {
  const m = MEMBERS[key]; if (!m) return;
  document.getElementById('mMemberBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:1.25rem;margin-bottom:1.5rem;">
      <div class="tm-av ${m.av}" style="width:68px;height:68px;font-size:1.2rem;font-family:var(--fo);font-weight:700;color:#fff;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.4);border:2px solid rgba(255,255,255,.1);"><span>${m.init}</span></div>
      <div>
        <div style="font-family:var(--fo);font-size:1.3rem;font-weight:800;color:#fff;">${m.name}</div>
        <div style="font-size:.65rem;font-weight:600;letter-spacing:.12em;color:var(--acc);background:rgba(79,113,255,.1);border:1px solid rgba(79,113,255,.2);padding:.2rem .6rem;border-radius:3px;margin-top:.25rem;text-transform:uppercase;display:inline-block;">${m.role}</div>
      </div>
    </div>
    <p style="font-size:.65rem;font-weight:600;letter-spacing:.18em;color:var(--accl);text-transform:uppercase;margin-bottom:.5rem;margin-top:1.25rem;">About</p>
    <p style="font-size:.875rem;color:var(--muted);line-height:1.6;">${m.bio}</p>
    <p style="font-size:.65rem;font-weight:600;letter-spacing:.18em;color:var(--accl);text-transform:uppercase;margin-bottom:.5rem;margin-top:1.25rem;">Core Skills</p>
    <ul style="list-style:none;display:flex;flex-direction:column;gap:.35rem;">
      ${m.skills.map(s => `<li style="font-size:.8125rem;color:var(--muted);display:flex;align-items:center;gap:.5rem;"><span style="color:var(--acc);font-size:.75rem;">→</span>${s}</li>`).join('')}
    </ul>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-top:1.5rem;border-top:1px solid rgba(79,113,255,.1);padding-top:1.25rem;">
      <a href="mailto:${m.email}" style="display:flex;align-items:center;gap:.75rem;padding:.85rem 1rem;background:rgba(79,113,255,.05);border:1px solid rgba(79,113,255,.12);border-radius:6px;text-decoration:none;">
        <span style="opacity:.7;font-size:1rem;">✉</span>
        <div><span style="font-size:.58rem;letter-spacing:.1em;color:var(--muted);text-transform:uppercase;display:block;">Email</span><strong style="font-size:.75rem;color:#fff;">${m.email}</strong></div>
      </a>
      <a href="#contact" onclick="closeMember()" style="display:flex;align-items:center;gap:.75rem;padding:.85rem 1rem;background:rgba(79,113,255,.05);border:1px solid rgba(79,113,255,.12);border-radius:6px;text-decoration:none;">
        <span style="opacity:.7;font-size:1rem;">➔</span>
        <div><span style="font-size:.58rem;letter-spacing:.1em;color:var(--muted);text-transform:uppercase;display:block;">Hire</span><strong style="font-size:.75rem;color:#fff;">Start a Project</strong></div>
      </a>
    </div>`;
  document.getElementById('mMember').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeMember = () => { document.getElementById('mMember').classList.remove('open'); document.body.style.overflow = ''; };

window.openCase = function(key) {
  const p = CASES[key]; if (!p) return;
  document.getElementById('mCaseBody').innerHTML = `
    <p style="font-size:.65rem;letter-spacing:.18em;color:var(--acc);text-transform:uppercase;margin-bottom:.5rem;">${p.type}</p>
    <h2 style="font-family:var(--fo);font-size:1.55rem;font-weight:900;color:#fff;margin-bottom:1.25rem;letter-spacing:.02em;">${p.title}</h2>
    <p style="font-size:.9375rem;color:var(--muted);line-height:1.65;margin-bottom:1.5rem;">${p.desc}</p>
    <p style="font-size:.65rem;font-weight:600;letter-spacing:.18em;color:var(--accl);text-transform:uppercase;margin-bottom:.75rem;">Tech & Tooling</p>
    <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1.5rem;">
      ${p.tech.map(t => `<span style="font-size:.7rem;letter-spacing:.08em;color:var(--accl);background:rgba(124,111,255,.08);border:1px solid rgba(124,111,255,.18);padding:.2rem .6rem;border-radius:3px;">${t}</span>`).join('')}
    </div>
    <p style="font-size:.65rem;font-weight:600;letter-spacing:.18em;color:var(--accl);text-transform:uppercase;margin-bottom:.75rem;">Key Metrics</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-bottom:1.75rem;">
      ${p.metrics.map(m => `<div style="background:rgba(79,113,255,.05);border:1px solid rgba(79,113,255,.12);border-radius:6px;padding:.85rem 1rem;font-size:.8125rem;color:var(--muted);text-align:center;"><span style="color:var(--acc);display:block;margin-bottom:.2rem;font-size:1rem;">✓</span>${m}</div>`).join('')}
    </div>
    <a href="#contact" onclick="closeCase()" style="display:inline-flex;align-items:center;gap:.5rem;font-size:.8rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:var(--acc);padding:.8rem 1.75rem;border-radius:5px;text-decoration:none;">START A SIMILAR PROJECT →</a>`;
  document.getElementById('mCase').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeCase = () => { document.getElementById('mCase').classList.remove('open'); document.body.style.overflow = ''; };

// ════════════════════════════ FORM ═══════════════════════
window.submitForm = function(e) {
  e.preventDefault();
  const btn = document.getElementById('ctBtn');
  const ok  = document.getElementById('ctOk');
  btn.textContent = 'SENDING...';
  btn.style.opacity = '.7';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'SENT ✓';
    btn.style.background = '#10b981';
    ok.style.display = 'block';
    setTimeout(() => {
      btn.textContent = 'CONNECT';
      btn.style.background = '';
      btn.style.opacity = '';
      btn.disabled = false;
      ok.style.display = 'none';
      e.target.reset();
    }, 5000);
  }, 1200);
};

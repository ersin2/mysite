/* main.js — v51.0 Ultimate Portfolio + Snake */
(function () {
  'use strict';

  /* ─── SCROLL PROGRESS BAR ─── */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (window.scrollY / docH * 100) + '%';
    }, { passive: true });
  }

  /* ─── PARTICLES ─── */
  function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const COLS = ['#818CF8','#EC4899','#06B6D4','#34D399','#F59E0B'];
    const mouse = { x: -1000, y: -1000 };
    const pts = [];
    const N = 80;

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

    for (let i = 0; i < N; i++) {
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - .5) * .3,
        vy: (Math.random() - .5) * .3,
        r: Math.random() * 1.8 + .4,
        a: Math.random() * .45 + .1,
        col: COLS[Math.floor(Math.random() * COLS.length)]
      });
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 120) {
            ctx.strokeStyle = 'rgba(129,140,248,' + (.065 * (1 - d / 120)) + ')';
            ctx.lineWidth = .7;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
        const mx = pts[i].x - mouse.x, my = pts[i].y - mouse.y;
        const md = Math.hypot(mx, my);
        if (md < 170) {
          ctx.strokeStyle = 'rgba(129,140,248,' + (.18 * (1 - md / 170)) + ')';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          pts[i].vx -= mx * .00025;
          pts[i].vy -= my * .00025;
        }
      }
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        p.vx *= .994; p.vy *= .994;
        if (Math.abs(p.vx) < .04) p.vx += (Math.random() - .5) * .04;
        if (Math.abs(p.vy) < .04) p.vy += (Math.random() - .5) * .04;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  /* ─── CUSTOM CURSOR ─── */
  function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const dot    = document.getElementById('cur-dot');
    const circle = document.getElementById('cur-circle');
    const txt    = document.getElementById('cur-text');
    if (!dot || !circle) return;

    document.body.classList.add('has-cur');
    let mx = 0, my = 0, cx = 0, cy = 0;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    }, { passive: true });

    (function lerp() {
      cx += (mx - cx) * .15; cy += (my - cy) * .15;
      circle.style.left = cx + 'px'; circle.style.top = cy + 'px';
      if (txt) { txt.style.left = cx + 'px'; txt.style.top = cy + 'px'; }
      requestAnimationFrame(lerp);
    })();

    document.querySelectorAll('[data-cursor]').forEach(el => {
      const label = el.dataset.cursor;
      el.addEventListener('mouseenter', () => {
        circle.classList.add('show-txt');
        if (txt) txt.textContent = label;
      });
      el.addEventListener('mouseleave', () => circle.classList.remove('show-txt'));
    });

    document.querySelectorAll('a, button, .ba-card, .wcard, .proc-card, .s-chip').forEach(el => {
      el.addEventListener('mouseenter', () => { if (!el.dataset.cursor) circle.classList.add('expand'); });
      el.addEventListener('mouseleave', () => circle.classList.remove('expand'));
    });
  }

  /* ─── STICKY NAV ─── */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const fn = () => nav.classList.toggle('stuck', window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
  }

  /* ─── SCROLL REVEAL ─── */
  function initReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const d = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('in'), d);
        io.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
    document.querySelectorAll('.reveal-up').forEach(el => io.observe(el));
  }

  /* ─── COUNT UP ─── */
  function initCounters() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const end = parseInt(el.dataset.to, 10);
        const dur = 1600;
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          const s = p * p * (3 - 2 * p);
          el.textContent = Math.round(s * end);
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        io.unobserve(el);
      });
    }, { threshold: .5 });
    document.querySelectorAll('.count[data-to]').forEach(el => io.observe(el));
  }

  /* ─── TEXT SCRAMBLE ─── */
  function initScramble() {
    const CHARS = '!<>-_\\/[]{}=+*^?#@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    document.querySelectorAll('[data-scramble]').forEach(el => {
      const target = el.textContent;
      let frame = 0;
      const total = 28;
      const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        setTimeout(() => {
          const timer = setInterval(() => {
            el.textContent = target.split('').map((ch, i) => {
              if (ch === ' ') return ' ';
              if (frame / total > i / target.length) return ch;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            }).join('');
            frame++;
            if (frame > total) { clearInterval(timer); el.textContent = target; }
          }, 45);
        }, 300);
      }, { threshold: .5 });
      io.observe(el);
    });
  }

  /* ─── SKILL BARS ─── */
  function initSkillBars() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.style.width = en.target.dataset.w + '%';
        io.unobserve(en.target);
      });
    }, { threshold: .3 });
    document.querySelectorAll('.sbar-fill[data-w]').forEach(el => io.observe(el));
  }

  /* ─── 3D CARD TILT ─── */
  function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - .5;
        const y = (e.clientY - r.top)  / r.height - .5;
        card.style.transform = 'perspective(800px) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 8) + 'deg) translateY(-5px)';
        card.style.setProperty('--cx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--cy', ((e.clientY - r.top)  / r.height * 100) + '%');
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ─── MAGNETIC BUTTONS ─── */
  function initMagnetic() {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width  / 2);
        const dy = e.clientY - (r.top  + r.height / 2);
        el.style.transform = 'translate(' + (dx * 0.28) + 'px, ' + (dy * 0.28) + 'px)';
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ─── FORM ─── */
  function initForm() {
    const form = document.getElementById('contact-form');
    const btn  = document.getElementById('cf-btn');
    const txt  = document.getElementById('cf-txt');
    const msg  = document.getElementById('cf-msg');
    if (!form || !btn || !msg) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      btn.disabled = true;
      if (txt) txt.textContent = 'Sending...';
      msg.className = 'cf-msg';
      msg.textContent = '';

      try {
        const res  = await fetch('/contact/send/', { method: 'POST', body: new FormData(form) });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
          msg.className  = 'cf-msg ok';
          msg.textContent = 'Message sent! I\'ll reply within 24 hours.';
          form.reset();
        } else {
          msg.className  = 'cf-msg err';
          msg.textContent = data.message || 'Something went wrong. Please try again.';
        }
      } catch (err) {
        msg.className  = 'cf-msg err';
        msg.textContent = 'Network error. Please check your connection.';
      } finally {
        btn.disabled = false;
        if (txt) txt.textContent = 'Send Message';
      }
    });
  }

  /* ══════════════════════════════════════════════════
     GIANT SNAKE PARALLAX BACKGROUND
     ══════════════════════════════════════════════════ */
  function initSnake() {
    var canvas = document.getElementById('snake-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0;
    var targetScroll = 0, smoothScroll = 0;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', function() { targetScroll = window.scrollY; }, { passive: true });

    /* Catmull-Rom interpolation for smooth spine */
    function catmull(p0, p1, p2, p3, t) {
      var t2 = t * t, t3 = t2 * t;
      return {
        x: 0.5 * ((2*p1.x) + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
        y: 0.5 * ((2*p1.y) + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3)
      };
    }

    function buildSpine(ctrl, steps) {
      var pts = [];
      for (var i = 0; i < ctrl.length - 1; i++) {
        var p0 = ctrl[Math.max(0, i-1)];
        var p1 = ctrl[i];
        var p2 = ctrl[i+1];
        var p3 = ctrl[Math.min(ctrl.length-1, i+2)];
        for (var s = 0; s < steps; s++) {
          pts.push(catmull(p0, p1, p2, p3, s / steps));
        }
      }
      pts.push(ctrl[ctrl.length-1]);
      return pts;
    }

    /* Body thickness profile — fat belly, thin tail */
    function thick(i, total) {
      var t = i / total;
      var profile = Math.sin(t * Math.PI) * 0.82 + 0.18;
      return W * 0.058 * profile;
    }

    function draw(sy) {
      ctx.clearRect(0, 0, W, H);

      /* Parallax offset — snake drifts at 22% of scroll */
      var oy = sy * -0.22;

      /* ── Snake spine control points ──
         Starts top-right, winds down and across in an S-shape */
      var ctrl = [
        { x: W*0.74, y: H*-0.28 + oy },
        { x: W*0.82, y: H* 0.04 + oy },
        { x: W*0.90, y: H* 0.16 + oy },
        { x: W*0.85, y: H* 0.28 + oy },
        { x: W*0.70, y: H* 0.38 + oy },
        { x: W*0.52, y: H* 0.46 + oy },
        { x: W*0.36, y: H* 0.52 + oy },
        { x: W*0.26, y: H* 0.61 + oy },
        { x: W*0.28, y: H* 0.72 + oy },
        { x: W*0.38, y: H* 0.82 + oy },
        { x: W*0.55, y: H* 0.91 + oy },
        { x: W*0.66, y: H* 0.99 + oy },
        { x: W*0.64, y: H* 1.10 + oy },
        { x: W*0.52, y: H* 1.26 + oy }
      ];

      var spine = buildSpine(ctrl, 20);
      var N = spine.length;

      /* Layer 1: Outer ambient glow */
      ctx.save();
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      for (var i = 1; i < N; i++) {
        ctx.beginPath();
        ctx.moveTo(spine[i-1].x, spine[i-1].y);
        ctx.lineTo(spine[i].x, spine[i].y);
        ctx.lineWidth   = thick(i, N) + 22;
        ctx.strokeStyle = 'rgba(129,140,248,0.025)';
        ctx.stroke();
      }
      ctx.restore();

      /* Layer 2: Main dark body */
      ctx.save();
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      for (var i = 1; i < N; i++) {
        var t = i / N;
        ctx.beginPath();
        ctx.moveTo(spine[i-1].x, spine[i-1].y);
        ctx.lineTo(spine[i].x, spine[i].y);
        ctx.lineWidth   = thick(i, N);
        ctx.strokeStyle = 'rgba(9,12,20,' + (0.88 - t * 0.3) + ')';
        ctx.stroke();
      }
      ctx.restore();

      /* Layer 3: Belly stripe */
      ctx.save();
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      for (var i = 1; i < N; i++) {
        var t = i / N;
        var a = Math.max(0.008, 0.052 - t * 0.035);
        ctx.beginPath();
        ctx.moveTo(spine[i-1].x, spine[i-1].y);
        ctx.lineTo(spine[i].x, spine[i].y);
        ctx.lineWidth   = Math.max(thick(i, N) * 0.25, 2);
        ctx.strokeStyle = 'rgba(180,190,240,' + a + ')';
        ctx.stroke();
      }
      ctx.restore();

      /* Layer 4: Scale markings — perpendicular arcs */
      ctx.save();
      for (var i = 6; i < N - 6; i += 6) {
        var prev = spine[i-1];
        var curr = spine[i];
        var next = spine[Math.min(i+1, N-1)];
        var dx = next.x - prev.x, dy = next.y - prev.y;
        var len = Math.hypot(dx, dy) || 1;
        var nx = -dy / len, ny = dx / len;
        var w = thick(i, N);
        var hw = w * 0.44;
        var sh = w * 0.20;
        var fwdx = dx / len * sh, fwdy = dy / len * sh;

        ctx.beginPath();
        ctx.moveTo(curr.x + nx*hw, curr.y + ny*hw);
        ctx.quadraticCurveTo(curr.x + fwdx, curr.y + fwdy,
                             curr.x - nx*hw, curr.y - ny*hw);
        ctx.lineWidth   = 1.8;
        ctx.strokeStyle = 'rgba(129,140,248,0.06)';
        ctx.stroke();
      }
      ctx.restore();

      /* Layer 5: Indigo rim highlight (top half of body) */
      ctx.save();
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      var half = Math.floor(N * 0.55);
      for (var i = 1; i < half; i++) {
        ctx.beginPath();
        ctx.moveTo(spine[i-1].x, spine[i-1].y);
        ctx.lineTo(spine[i].x, spine[i].y);
        ctx.lineWidth   = thick(i, N) + 2;
        ctx.strokeStyle = 'rgba(129,140,248,0.038)';
        ctx.stroke();
      }
      ctx.restore();

      /* ── HEAD ── */
      if (N < 5) return;
      var head  = spine[0];
      var neck  = spine[5];
      var hdx = head.x - neck.x, hdy = head.y - neck.y;
      var hlen = Math.hypot(hdx, hdy) || 1;
      var hfx = hdx / hlen, hfy = hdy / hlen;
      var hw  = thick(0, N) * 1.35;

      ctx.save();

      /* Head oval */
      ctx.beginPath();
      ctx.ellipse(head.x, head.y, hw*0.78, hw*0.58, Math.atan2(hdy, hdx), 0, Math.PI*2);
      ctx.fillStyle   = 'rgba(9,12,20,0.94)';
      ctx.fill();
      ctx.lineWidth   = 2.5;
      ctx.strokeStyle = 'rgba(129,140,248,0.14)';
      ctx.stroke();

      /* Snout */
      var sx = head.x + hfx * hw * 0.65;
      var sy = head.y + hfy * hw * 0.65;
      ctx.beginPath();
      ctx.ellipse(sx, sy, hw*0.28, hw*0.20, Math.atan2(hdy, hdx), 0, Math.PI*2);
      ctx.fillStyle = 'rgba(12,16,26,0.97)';
      ctx.fill();

      /* Nostrils */
      var no = hw * 0.1;
      ctx.beginPath();
      ctx.arc(sx + (-hfy)*no + hfx*hw*0.08, sy + (hfx)*no + hfy*hw*0.08, hw*0.04, 0, Math.PI*2);
      ctx.arc(sx - (-hfy)*no + hfx*hw*0.08, sy - (hfx)*no + hfy*hw*0.08, hw*0.04, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(129,140,248,0.18)';
      ctx.fill();

      /* Eyes */
      var eo = hw * 0.30;
      var efx = hfx * hw * 0.14, efy = hfy * hw * 0.14;
      var eyes = [
        { x: head.x + (-hfy)*eo + efx, y: head.y + (hfx)*eo + efy },
        { x: head.x - (-hfy)*eo + efx, y: head.y - (hfx)*eo + efy }
      ];
      eyes.forEach(function(e) {
        /* glow */
        ctx.beginPath();
        ctx.arc(e.x, e.y, hw*0.14, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(129,140,248,0.18)';
        ctx.fill();
        /* iris */
        ctx.beginPath();
        ctx.arc(e.x, e.y, hw*0.10, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(129,140,248,0.28)';
        ctx.fill();
        /* pupil (vertical slit) */
        ctx.beginPath();
        ctx.ellipse(e.x, e.y, hw*0.03, hw*0.08, 0, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(5,6,12,0.95)';
        ctx.fill();
        /* highlight */
        ctx.beginPath();
        ctx.arc(e.x + hw*0.035, e.y - hw*0.035, hw*0.025, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(220,230,255,0.55)';
        ctx.fill();
      });

      /* Forked tongue */
      var tlen  = hw * 1.0;
      var tx0   = sx + hfx * hw * 0.18, ty0 = sy + hfy * hw * 0.18;
      var txm   = tx0 + hfx * tlen * 0.52, tym = ty0 + hfy * tlen * 0.52;
      var tfork = tlen * 0.48, tspread = tlen * 0.24;
      ctx.beginPath();
      ctx.moveTo(tx0,  ty0);
      ctx.lineTo(txm,  tym);
      ctx.moveTo(txm,  tym);
      ctx.lineTo(txm + hfx*tfork + (-hfy)*tspread, tym + hfy*tfork + (hfx)*tspread);
      ctx.moveTo(txm,  tym);
      ctx.lineTo(txm + hfx*tfork - (-hfy)*tspread, tym + hfy*tfork - (hfx)*tspread);
      ctx.lineWidth   = Math.max(hw*0.07, 2.5);
      ctx.strokeStyle = 'rgba(236,72,153,0.6)';
      ctx.lineCap     = 'round';
      ctx.stroke();

      /* Scale pattern on head */
      for (var k = 0; k < 3; k++) {
        var ht = (k + 1) / 4;
        var hpx = head.x + hfx * hw * (ht - 0.5);
        var hpy = head.y + hfy * hw * (ht - 0.5);
        ctx.beginPath();
        ctx.moveTo(hpx + (-hfy)*hw*0.55, hpy + (hfx)*hw*0.55);
        ctx.quadraticCurveTo(hpx + hfx*hw*0.12, hpy + hfy*hw*0.12,
                             hpx - (-hfy)*hw*0.55, hpy - (hfx)*hw*0.55);
        ctx.lineWidth   = 1.2;
        ctx.strokeStyle = 'rgba(129,140,248,0.07)';
        ctx.stroke();
      }

      ctx.restore();
    }

    /* Smooth animation loop */
    (function loop() {
      smoothScroll += (targetScroll - smoothScroll) * 0.065;
      draw(smoothScroll);
      requestAnimationFrame(loop);
    })();
  }

  /* ─── BOOT ─── */
  document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initParticles();
    initSnake();       // snake goes early so particles render on top
    initCursor();
    initNav();
    initReveal();
    initCounters();
    initScramble();
    initSkillBars();
    initTilt();
    initMagnetic();
    initForm();
  });

})();
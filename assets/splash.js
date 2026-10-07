/* Opening splash: the spray bottle spritzes a foggy screen clean, a shine sweeps across, sparkles pop and the
   wordmark lands (rebuilding the logo), then the curtain lifts. About 3 s, once per visit, skipped for reduced motion. */
(function () {
  try {
    if (sessionStorage.getItem('nn-splash') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    sessionStorage.setItem('nn-splash', '1');
  } catch (e) { return; }

  var en = (document.documentElement.lang || '').indexOf('en') === 0;
  var STAR = '<svg viewBox="0 0 24 24"><path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z"/></svg>';
  // Sparkles around the bottle as in the logo: [left, top, size] as fractions of the bottle box
  var LOGO_STARS = [[-0.131, 0.502, 0.37], [0.982, 0.497, 0.36], [-0.026, 0.40, 0.12], [1.082, 0.399, 0.11],
    [-0.243, 0.416, 0.075], [0.868, 0.414, 0.07], [-0.234, 0.583, 0.075], [0.88, 0.578, 0.072],
    [-0.067, 0.34, 0.05], [1.028, 0.339, 0.045], [0.029, 0.358, 0.042], [1.134, 0.357, 0.04]];

  var root = document.documentElement;
  var d = document.createElement('div');
  d.className = 'nn-splash';
  d.setAttribute('aria-hidden', 'true');
  d.innerHTML = '<canvas class="nn-fog"></canvas><canvas class="nn-mist"></canvas>' +
    '<div class="nn-stage"><div class="nn-bottle"><img src="/assets/spray.svg" alt="" width="492" height="579"></div>' +
    '<img class="nn-word" src="/assets/wordmark.svg" alt="" width="1049" height="245"></div>' +
    '<button class="nn-skip" type="button" tabindex="-1">' + (en ? 'Skip ›' : 'Passer ›') + '</button>';
  document.body.appendChild(d);
  root.classList.add('nn-splashing');

  var bottle = d.querySelector('.nn-bottle'), img = bottle.querySelector('img');
  LOGO_STARS.forEach(function (s, i) {
    var el = document.createElement('span');
    el.className = 'nn-star nn-logo-star';
    el.style.cssText = 'left:' + s[0] * 100 + '%;top:' + s[1] * 100 + '%;width:' + s[2] * 100 + '%;animation-delay:' + (i < 2 ? 0 : 60 + i * 35) + 'ms';
    el.innerHTML = STAR;
    bottle.appendChild(el);
  });

  var W = window.innerWidth, H = window.innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
  function ctx(c) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); var x = c.getContext('2d'); x.scale(dpr, dpr); return x; }
  var fog = ctx(d.querySelector('.nn-fog')), mist = ctx(d.querySelector('.nn-mist'));
  var rnd = Math.random, reach = Math.max(W, H), i;

  // A dull, smudgy film over the bright page underneath
  fog.fillStyle = 'rgba(178, 160, 167, .62)';
  fog.fillRect(0, 0, W, H);
  for (i = 0; i < 28; i++) {
    var r = 30 + rnd() * reach * 0.14, cx = rnd() * W, cy = rnd() * H, g = fog.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, 'rgba(118, 96, 104, .26)'); g.addColorStop(1, 'rgba(118, 96, 104, 0)');
    fog.fillStyle = g; fog.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  }
  for (i = 0; i < 60; i++) {
    fog.fillStyle = 'rgba(255, 255, 255, ' + (0.08 + rnd() * 0.14) + ')';
    fog.beginPath(); fog.arc(rnd() * W, rnd() * H, 1 + rnd() * 4, 0, 7); fog.fill();
  }

  function wipe(x, y, rad, a) {
    var gr = fog.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, 'rgba(0,0,0,' + a + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    fog.fillStyle = gr; fog.fillRect(x - rad, y - rad, 2 * rad, 2 * rad);
  }

  function star(x, y, size) {
    var el = document.createElement('span');
    el.className = 'nn-star nn-pop';
    el.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px';
    el.innerHTML = STAR;
    d.appendChild(el);
  }

  var parts = [];
  function spritz() {
    img.classList.remove('pump'); void img.offsetWidth; img.classList.add('pump');
    var b = img.getBoundingClientRect(), nx = b.left + b.width * 0.235, ny = b.top + b.height * 0.05;
    var base = Math.atan2(-0.17, -1); // the nozzle points left and a little up
    for (var k = 0; k < 48; k++) {
      var ang = base + (rnd() - 0.5) * 0.85, sp = reach * (0.42 + rnd() * 0.8) / 1000;
      parts.push({ x: nx, y: ny, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, age: 0, life: 650 + rnd() * 350,
        r: 1.4 + rnd() * 2.6, wr: 9 + rnd() * reach * 0.028, pink: rnd() < 0.45, star: rnd() < 0.09 });
    }
  }

  var EVENTS = [[520, spritz], [880, spritz], [1240, spritz], [1760, function () { d.classList.add('nn-final'); }], [2750, bye]];
  var SHINE_AT = 1450, SHINE_FOR = 520, END = 3000;
  var t0 = 0, last = 0, ev = 0, started = false, gone = false;

  function frame(now) {
    if (gone) return;
    var t = now - t0, dt = Math.min(48, now - last); last = now;
    while (ev < EVENTS.length && t >= EVENTS[ev][0]) EVENTS[ev++][1]();

    mist.clearRect(0, 0, W, H);
    fog.save(); fog.globalCompositeOperation = 'destination-out';
    for (var k = parts.length - 1; k >= 0; k--) {
      var p = parts[k]; p.age += dt;
      var drag = Math.pow(0.9972, dt); p.vx *= drag; p.vy = p.vy * drag + 0.00018 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      var q = p.age / p.life;
      if (q >= 1) { if (p.star) star(p.x, p.y, 10 + rnd() * 16); parts.splice(k, 1); continue; }
      wipe(p.x, p.y, p.wr * (0.45 + q), 0.34);
      mist.fillStyle = p.pink ? 'rgba(247, 210, 220,' + (1 - q) * 0.9 + ')' : 'rgba(255, 255, 255,' + (1 - q) * 0.95 + ')';
      mist.beginPath(); mist.arc(p.x, p.y, p.r * (1 + q * 2.2), 0, 7); mist.fill();
    }
    // Shine sweep: clears whatever film is left and leaves a glint
    if (t >= SHINE_AT && t <= SHINE_AT + SHINE_FOR + 200) {
      // the slanted band starts fully off the left edge and ends fully off the right one, whatever the screen shape
      var s = Math.min(1, (t - SHINE_AT) / SHINE_FOR), e = 1 - Math.pow(1 - s, 3), slant = Math.min(H * 0.35, W * 0.6), bw = Math.max(80, W * 0.16);
      var bx = -(slant + bw) + e * (W + 2 * (slant + bw));
      fog.globalAlpha = 1; fog.fillStyle = '#000';
      fog.beginPath(); fog.moveTo(0, 0); fog.lineTo(bx + slant, 0); fog.lineTo(bx - slant, H); fog.lineTo(0, H); fog.closePath(); fog.fill();
      var gl = mist.createLinearGradient(bx - bw, 0, bx + bw, 0);
      gl.addColorStop(0, 'rgba(255,255,255,0)'); gl.addColorStop(0.5, 'rgba(255,255,255,' + 0.75 * (1 - s * 0.6) + ')'); gl.addColorStop(1, 'rgba(255,255,255,0)');
      mist.fillStyle = gl;
      mist.beginPath(); mist.moveTo(bx - bw + slant, 0); mist.lineTo(bx + bw + slant, 0); mist.lineTo(bx + bw - slant, H); mist.lineTo(bx - bw - slant, H); mist.closePath(); mist.fill();
    }
    fog.restore();
    if (t < END) requestAnimationFrame(frame);
  }

  function start() {
    if (started || gone) return;
    started = true;
    d.classList.add('nn-go');
    t0 = last = performance.now();
    requestAnimationFrame(frame);
  }
  function bye() {
    if (gone) return;
    gone = true;
    window.removeEventListener('keydown', skip);
    d.classList.add('nn-bye');
    setTimeout(function () { d.remove(); root.classList.remove('nn-splashing'); }, 520);
  }
  function skip(e) { if (e.type === 'keydown' && e.key === 'Tab') return; bye(); }

  d.addEventListener('click', skip);
  window.addEventListener('keydown', skip);
  // Wait for the bottle artwork (max 0.9 s) so it never pops in half-drawn; CSS also lifts the curtain on its own if this script stalls
  if (img.complete && img.naturalWidth) start();
  else { img.addEventListener('load', start); img.addEventListener('error', start); setTimeout(start, 900); }
})();

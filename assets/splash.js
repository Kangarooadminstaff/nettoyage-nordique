/* Opening splash: a toon Victorian window with foggy glass. The spray bottle cleans the fanlight and both casements,
   a squeegee shine finishes the job (the website shows through the clean glass), sparkles pop, then the casements
   swing open and we fly through the window onto the page. About 3.4 s, plays every time the site is opened, but not
   when moving between pages of the site (e.g. switching language), and never for reduced motion.
   Tap or any key skips it, and CSS fades it out on its own if this script stalls. */
(function () {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var nav = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
    var reload = nav ? nav.type === 'reload' : false;
    if (!reload && document.referrer && new URL(document.referrer).host === location.host) return; // moving between pages of the site
    if (sessionStorage.getItem('nn-splash-test')) return; // lets audits screenshot the page without the intro
  } catch (e) { return; }

  var INK = '#D02A62', PINK = '#E93971', NAIL = '#F9A3B6';
  var STAR = 'M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z';
  var APERTURE = 'M40 460V170A110 110 0 0 1 260 170V460Z';
  var SKIP = { fr: 'Passer ›', es: 'Saltar ›', it: 'Salta ›' }[(document.documentElement.lang || 'en').slice(0, 2)] || 'Skip ›';
  var W = window.innerWidth, H = window.innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1), rnd = Math.random;

  // The window is drawn in a 300 x 520 unit space and scaled to fit the screen
  var ww = Math.min(W * 0.66, H * 0.74 * 300 / 520, 340), s = ww / 300, wh = 520 * s;
  var ox = (W - ww) / 2, oy = Math.max(8, (H - wh) / 2 - H * 0.02);
  function X(u) { return ox + u * s; }
  function Y(v) { return oy + v * s; }
  function box(el, x, y, w, h) { el.style.cssText = 'left:' + X(x) + 'px;top:' + Y(y) + 'px;width:' + w * s + 'px;height:' + h * s + 'px'; }

  // ---------- Build the scene ----------

  function sashSvg(side) {
    var g = '<path fill="#fff" fill-rule="evenodd" stroke="' + INK + '" stroke-width="2.5" d="M1 1h108v278H1zM9 9v262h92V9z"/>';
    [[9, 94], [99, 186], [191, 271]].forEach(function (r) {
      [9, 57.5].forEach(function (c) { // toon glare on every pane
        g += '<path d="M' + (c + 7) + ' ' + (r[0] + 30) + 'l14-16M' + (c + 7) + ' ' + (r[0] + 46) + 'l24-28" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>';
      });
    });
    g += '<g fill="#fff" stroke="' + INK + '" stroke-width="1.6"><rect x="52.5" y="8" width="5" height="264"/><rect x="8" y="94" width="94" height="5"/><rect x="8" y="186" width="94" height="5"/></g>';
    g += '<circle cx="' + (side === 'l' ? 103 : 7) + '" cy="150" r="4" fill="' + PINK + '" stroke="' + INK + '" stroke-width="1.2"/>';
    return '<svg viewBox="0 0 110 280" preserveAspectRatio="none">' + g + '</svg>';
  }

  var spokes = '';
  [30, 60, 90, 120, 150].forEach(function (a) {
    var r = a * Math.PI / 180;
    spokes += 'M150 170L' + (150 + 110 * Math.cos(r)).toFixed(1) + ' ' + (170 - 110 * Math.sin(r)).toFixed(1);
  });
  var T = 'translate(' + ox + ' ' + oy + ') scale(' + s + ')';
  var wall = '<svg class="nn-wall" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' +
    '<defs>' +
      '<pattern id="nnPaper" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="#F9EAF1"/><rect x="20" width="4" height="44" fill="#F3D9E4"/><path transform="translate(1 16) scale(.5)" fill="#F1D0DD" d="' + STAR + '"/></pattern>' +
      '<mask id="nnHole"><rect width="' + W + '" height="' + H + '" fill="#fff"/><path transform="' + T + '" d="' + APERTURE + '"/></mask>' +
      '<filter id="nnShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="' + INK + '" flood-opacity=".22"/></filter>' +
    '</defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#nnPaper)" mask="url(#nnHole)"/>' +
    '<g transform="' + T + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" fill="#fff">' +
      '<g filter="url(#nnShadow)"><path fill-rule="evenodd" d="M22 466V170A128 128 0 0 1 278 170V466ZM40 460V170A110 110 0 0 1 260 170V460Z"/><rect x="8" y="458" width="284" height="20" rx="4"/></g>' +
      '<path fill="none" stroke="#F7D2DC" stroke-width="2.5" d="M31 462V170A119 119 0 0 1 269 170V462"/>' +
      '<rect x="16" y="478" width="268" height="9" rx="3" fill="' + NAIL + '"/>' +
      '<path d="M36 487h20v5c0 14-6 22-14 24-5-6-6-14-6-29z"/><path d="M264 487h-20v5c0 14 6 22 14 24 5-6 6-14 6-29z"/>' +
      '<path fill="' + NAIL + '" d="M137 31h26l-4 34h-18z"/>' +
      '<path fill="' + PINK + '" stroke="none" transform="translate(137 2) scale(1.1)" d="' + STAR + '"/>' +
      '<path fill="none" stroke-width="7" stroke-linecap="round" d="' + spokes + '"/><path fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" d="' + spokes + '"/>' +
      '<path d="M126 170A24 24 0 0 1 174 170Z"/>' +
      '<rect x="40" y="165" width="220" height="15"/>' +
    '</g></svg>';

  var root = document.documentElement;
  var d = document.createElement('div');
  d.className = 'nn-splash';
  d.setAttribute('aria-hidden', 'true');
  d.innerHTML = '<div class="nn-room"><canvas class="nn-fan"></canvas><div class="nn-panes">' +
    '<div class="nn-sash nn-sash-l"><canvas></canvas>' + sashSvg('l') + '</div>' +
    '<div class="nn-sash nn-sash-r"><canvas></canvas>' + sashSvg('r') + '</div></div>' + wall + '</div>' +
    '<canvas class="nn-mist"></canvas>' +
    '<div class="nn-bottle"><img src="/assets/spray.svg" alt="" width="492" height="579"></div>' +
    '<button class="nn-skip" type="button" tabindex="-1">' + SKIP + '</button>';
  document.body.appendChild(d);
  root.classList.add('nn-splashing');

  var room = d.querySelector('.nn-room'), bottle = d.querySelector('.nn-bottle'), img = bottle.querySelector('img');
  var fanEl = d.querySelector('.nn-fan'), sashL = d.querySelector('.nn-sash-l'), sashR = d.querySelector('.nn-sash-r');
  box(fanEl, 40, 60, 220, 110); box(sashL, 40, 180, 110, 280); box(sashR, 150, 180, 110, 280);
  room.style.transformOrigin = X(150) + 'px ' + Y(320) + 'px';
  room.style.setProperty('--nn-zoom', (Math.max(W / (200 * s), H / (260 * s)) * 1.2).toFixed(2));

  // Dirty glass on three canvases (the fanlight is clipped to its half circle)
  function dirty(c, w, h, arch) {
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    var x = c.getContext('2d'), i, r, cx, cy, g;
    x.scale(dpr, dpr);
    if (arch) { x.beginPath(); x.moveTo(0, h); x.arc(w / 2, h, w / 2, Math.PI, 0); x.closePath(); x.clip(); }
    x.fillStyle = 'rgba(198, 178, 187, .92)'; x.fillRect(0, 0, w, h);
    for (i = 0; i < 9; i++) {
      r = 10 + rnd() * w * 0.4; cx = rnd() * w; cy = rnd() * h; g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(140, 112, 124, .3)'); g.addColorStop(1, 'rgba(140, 112, 124, 0)');
      x.fillStyle = g; x.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    }
    for (i = 0; i < 6; i++) { x.fillStyle = 'rgba(255, 255, 255, .14)'; x.fillRect(rnd() * w, rnd() * h * 0.5, 1.5, h * (0.15 + rnd() * 0.3)); }
    for (i = 0; i < 16; i++) { x.fillStyle = 'rgba(255, 255, 255, ' + (0.1 + rnd() * 0.2) + ')'; x.beginPath(); x.arc(rnd() * w, rnd() * h, 0.8 + rnd() * 2.2, 0, 7); x.fill(); }
    x.globalCompositeOperation = 'destination-out'; // from here on, everything drawn on the glass cleans it
    return { ctx: x, left: parseFloat(c.parentNode === room ? c.style.left : c.parentNode.style.left), top: parseFloat(c.parentNode === room ? c.style.top : c.parentNode.style.top), w: w, h: h };
  }
  var panes = [dirty(fanEl, 220 * s, 110 * s, true), dirty(sashL.querySelector('canvas'), 110 * s, 280 * s), dirty(sashR.querySelector('canvas'), 110 * s, 280 * s)];

  var mistEl = d.querySelector('.nn-mist');
  mistEl.width = Math.round(W * dpr); mistEl.height = Math.round(H * dpr);
  var mist = mistEl.getContext('2d'); mist.scale(dpr, dpr);
  var glass = new Path2D(APERTURE);

  function wipe(px, py, r, a) {
    panes.forEach(function (p) {
      var lx = px - p.left, ly = py - p.top;
      if (lx < -r || ly < -r || lx > p.w + r || ly > p.h + r) return;
      var g = p.ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
      g.addColorStop(0, 'rgba(0,0,0,' + a + ')'); g.addColorStop(1, 'rgba(0,0,0,0)');
      p.ctx.fillStyle = g; p.ctx.fillRect(lx - r, ly - r, 2 * r, 2 * r);
    });
  }

  // ---------- The bottle ----------

  var bh = ww * 0.62, bw = bh * 492 / 579, reach = ww * 0.4;
  bottle.style.width = bw + 'px'; bottle.style.height = bh + 'px';
  function aimAt(u, v) { // put the nozzle where its spray (left and a little up) lands on (u, v)
    bottle.style.left = (X(u) + reach - bw * 0.235) + 'px';
    bottle.style.top = (Y(v) + reach * 0.17 - bh * 0.05) + 'px';
  }
  aimAt(150, 112); bottle.style.left = W + 20 + 'px';

  var parts = [];
  function spritz() {
    img.classList.remove('pump'); void img.offsetWidth; img.classList.add('pump');
    var b = img.getBoundingClientRect(), nx = b.left + b.width * 0.235, ny = b.top + b.height * 0.05, base = Math.atan2(-0.17, -1);
    for (var k = 0; k < 46; k++) {
      var ang = base + (rnd() - 0.5) * 0.7, sp = reach * 0.0035 * (0.75 + rnd() * 0.65);
      parts.push({ x: nx, y: ny, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, age: 0, life: 700 + rnd() * 300,
        r: 1.2 + rnd() * 2.2, wr: ww * (0.045 + rnd() * 0.05), pink: rnd() < 0.45 });
    }
  }
  function sparkles() {
    [[112, 118, 0.11], [198, 96, 0.07], [78, 252, 0.08], [226, 236, 0.12], [70, 410, 0.07], [232, 392, 0.09]].forEach(function (p, i) {
      var el = document.createElement('span');
      el.className = 'nn-star nn-pop';
      el.style.cssText = 'left:' + X(p[0]) + 'px;top:' + Y(p[1]) + 'px;width:' + p[2] * ww + 'px;animation-delay:' + i * 60 + 'ms';
      el.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + STAR + '"/></svg>';
      room.appendChild(el);
    });
  }

  // ---------- Timeline ----------

  var EVENTS = [
    [180, function () { bottle.classList.add('nn-in'); aimAt(150, 112); }],
    [620, spritz],
    [880, function () { aimAt(95, 300); }], [1100, spritz],
    [1360, function () { aimAt(205, 330); }], [1580, spritz],
    [1820, function () { bottle.style.left = W + 40 + 'px'; }],
    [2180, sparkles],
    [2450, function () { d.classList.add('nn-open'); }],
    [2580, function () { d.classList.add('nn-zoom'); }],
    [3450, function () { bye(true); }]
  ];
  var SHINE_AT = 1820, SHINE_FOR = 420;
  var t0 = 0, last = 0, ev = 0, started = false, gone = false;

  function frame(now) {
    if (gone) return;
    var t = now - t0, dt = Math.min(48, now - last); last = now;
    while (ev < EVENTS.length && t >= EVENTS[ev][0]) EVENTS[ev++][1]();

    mist.clearRect(0, 0, W, H);
    for (var k = parts.length - 1; k >= 0; k--) {
      var p = parts[k]; p.age += dt;
      var drag = Math.pow(0.9965, dt); p.vx *= drag; p.vy = p.vy * drag + 0.00012 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      var q = p.age / p.life;
      if (q >= 1) { parts.splice(k, 1); continue; }
      wipe(p.x, p.y, p.wr * (0.5 + q), 0.3);
      mist.fillStyle = p.pink ? 'rgba(247, 210, 220,' + (1 - q) * 0.9 + ')' : 'rgba(255, 255, 255,' + (1 - q) * 0.95 + ')';
      mist.beginPath(); mist.arc(p.x, p.y, p.r * (1 + q * 2.2), 0, 7); mist.fill();
    }
    // Squeegee shine: a slanted band crosses the glass, clearing what is left and leaving a glint
    if (t >= SHINE_AT && t <= SHINE_AT + SHINE_FOR + 150) {
      var e = Math.min(1, (t - SHINE_AT) / SHINE_FOR), slant = ww * 0.25, bwid = ww * 0.12;
      var bx = X(40) - slant - bwid + e * (220 * s + 2 * (slant + bwid));
      panes.forEach(function (pn) {
        var a = bx - pn.left;
        pn.ctx.fillStyle = '#000';
        pn.ctx.beginPath(); pn.ctx.moveTo(0, 0); pn.ctx.lineTo(a + slant, 0); pn.ctx.lineTo(a - slant, pn.h); pn.ctx.lineTo(0, pn.h); pn.ctx.closePath(); pn.ctx.fill();
      });
      mist.save();
      mist.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy); mist.clip(glass); mist.setTransform(dpr, 0, 0, dpr, 0, 0);
      var gl = mist.createLinearGradient(bx - bwid, 0, bx + bwid, 0);
      gl.addColorStop(0, 'rgba(255,255,255,0)'); gl.addColorStop(0.5, 'rgba(255,255,255,' + 0.8 * (1 - e * 0.5) + ')'); gl.addColorStop(1, 'rgba(255,255,255,0)');
      mist.fillStyle = gl;
      mist.beginPath(); mist.moveTo(bx - bwid + slant, 0); mist.lineTo(bx + bwid + slant, 0); mist.lineTo(bx + bwid - slant, H); mist.lineTo(bx - bwid - slant, H); mist.closePath(); mist.fill();
      mist.restore();
    }
    if (t < 2500) requestAnimationFrame(frame);
    else { mist.clearRect(0, 0, W, H); setTimeout(function () { frame(performance.now()); }, 60); } // keep firing the last events without drawing
  }

  function start() {
    if (started || gone) return;
    started = true;
    t0 = last = performance.now();
    requestAnimationFrame(frame);
  }
  function bye(natural) {
    if (gone) return;
    gone = true;
    window.removeEventListener('keydown', skip);
    if (!natural) d.classList.add('nn-bye');
    setTimeout(function () { d.remove(); root.classList.remove('nn-splashing'); }, natural ? 0 : 380);
  }
  function skip(e) { if (e.type === 'keydown' && e.key === 'Tab') return; bye(false); }

  d.addEventListener('click', skip);
  window.addEventListener('keydown', skip);
  // Wait for the bottle artwork (max 0.9 s) so it never pops in half-drawn
  if (img.complete && img.naturalWidth) start();
  else { img.addEventListener('load', start); img.addEventListener('error', start); setTimeout(start, 900); }
})();

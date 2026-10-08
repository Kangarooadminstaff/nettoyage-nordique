/* "Meet Alicia": her photo sits behind a toon Victorian casement (same style as the opening splash). When the photo
   scrolls into view, the window unlatches and swings open on its left hinges. Without JavaScript or with reduced
   motion there is no window, just the photo. */
(function () {
  try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) { return; }
  if (!('IntersectionObserver' in window)) return;
  var figs = document.querySelectorAll('.about-photo');
  if (!figs.length) return;

  var INK = '#D02A62', PINK = '#E93971', NAIL = '#F9A3B6';
  var STAR = 'M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z';

  // 400 x 500 units, the photo frame's 4:5 shape: arched top, rounded bottom corners
  var spokes = '';
  [45, 90, 135].forEach(function (a) {
    var r = a * Math.PI / 180;
    spokes += 'M200 200L' + (200 + 176 * Math.cos(r)).toFixed(1) + ' ' + (200 - 176 * Math.sin(r)).toFixed(1);
  });
  var glare = '';
  [[60, 300], [250, 300], [60, 420], [250, 420], [110, 150]].forEach(function (p) {
    glare += 'M' + p[0] + ' ' + p[1] + 'l26-28M' + p[0] + ' ' + (p[1] + 22) + 'l46-50';
  });
  var svg = '<svg viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
    '<path fill="#fff" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round" fill-rule="evenodd" d="M3 470V200A197 197 0 0 1 397 200V470Q397 497 370 497H30Q3 497 3 470ZM26 476V200A174 174 0 0 1 374 200V476Z"/>' +
    '<path fill="#FBEFF4" fill-opacity=".86" d="M26 476V200A174 174 0 0 1 374 200V476Z"/>' +
    '<path fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".85" d="' + glare + '"/>' +
    '<path fill="none" stroke="' + INK + '" stroke-width="12" stroke-linecap="round" d="' + spokes + '"/>' +
    '<path fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" d="' + spokes + '"/>' +
    '<g fill="#fff" stroke="' + INK + '" stroke-width="3"><rect x="193" y="200" width="14" height="276"/><rect x="26" y="193" width="348" height="14"/><rect x="26" y="335" width="348" height="12"/></g>' +
    '<path fill="#fff" stroke="' + INK + '" stroke-width="3" d="M168 200A32 32 0 0 1 232 200Z"/>' +
    '<path fill="' + PINK + '" transform="translate(188 171) scale(1)" d="' + STAR + '"/>' +
    '<g fill="' + NAIL + '" stroke="' + INK + '" stroke-width="3"><rect x="-2" y="110" width="16" height="40" rx="4"/><rect x="-2" y="390" width="16" height="40" rx="4"/></g>' +
    '<circle cx="370" cy="300" r="10" fill="' + PINK + '" stroke="' + INK + '" stroke-width="3"/>' +
    '</svg>';

  var root = document.documentElement;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      (function open() { // wait for the opening splash to finish before swinging
        if (root.classList.contains('nn-splashing')) { setTimeout(open, 250); return; }
        en.target.classList.add('is-open');
      })();
    });
  }, { threshold: 0.45 });

  Array.prototype.forEach.call(figs, function (fig) {
    var sash = document.createElement('div');
    sash.className = 'about-sash';
    sash.innerHTML = svg;
    fig.insertBefore(sash, fig.querySelector('.about-badge'));
    fig.classList.add('has-sash');
    io.observe(fig);
  });
})();

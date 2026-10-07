/* Sparkle dust behind the magic broom that sweeps along the bottom of the hero.
   Off for reduced motion, and paused while the hero is off screen or the tab is hidden. */
(function () {
  var lane = document.querySelector('.sweep'), broom = lane && lane.querySelector('.broom');
  if (!broom || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var visible = true, timer = null;

  function puff() {
    var L = lane.getBoundingClientRect(), b = broom.getBoundingClientRect();
    if (b.right < L.left || b.left > L.right) return; // between sweeps
    var star = Math.random() < 0.55, size = star ? 8 + Math.random() * 10 : 4 + Math.random() * 6;
    var d = document.createElement('span');
    d.className = 'dust' + (star ? ' dust-star' : '');
    // bristle tips sit at about 22% across and 86% down the broom box
    d.style.cssText = 'left:' + (b.left - L.left + b.width * 0.22) + 'px;top:' + (b.top - L.top + b.height * 0.86) + 'px;--s:' + size + 'px;' +
      '--dx:' + (-10 - Math.random() * 26) + 'px;--dy:' + (-14 - Math.random() * 34) + 'px';
    if (star) d.innerHTML = '<svg><use href="#sparkle"/></svg>';
    lane.appendChild(d);
    setTimeout(function () { d.remove(); }, 1100);
  }
  function run() {
    clearInterval(timer);
    timer = visible && !document.hidden ? setInterval(puff, 90) : null;
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; run(); }).observe(lane);
  }
  document.addEventListener('visibilitychange', run);
  run();
})();

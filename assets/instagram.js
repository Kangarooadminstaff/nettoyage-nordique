// Live Instagram grid, fed by a Behold JSON feed (https://behold.so; free plan = 6 latest posts, refreshed daily).
// Paste the feed URL from the Behold dashboard below. The section stays hidden until posts load.
(function () {
  var FEED_URL = '';

  var section = document.getElementById('instagram');
  if (!FEED_URL || !section || !window.fetch) return;
  var grid = section.querySelector('.insta-grid');
  var label = grid.getAttribute('data-label');

  fetch(FEED_URL)
    .then(function (r) {
      if (!r.ok) throw new Error('Feed ' + r.status);
      return r.json();
    })
    .then(function (data) {
      var posts = (Array.isArray(data) ? data : data.posts || []).slice(0, 6);
      posts.forEach(function (p) {
        var size = p.sizes && (p.sizes.medium || p.sizes.small);
        var src = size ? size.mediaUrl : (p.mediaType === 'VIDEO' ? p.thumbnailUrl : p.mediaUrl);
        if (!src || !p.permalink) return;

        var a = document.createElement('a');
        a.href = p.permalink;
        a.target = '_blank';
        a.rel = 'noopener';
        a.setAttribute('aria-label', label);

        var img = document.createElement('img');
        img.src = src;
        img.alt = (p.altText || p.prunedCaption || '').slice(0, 140);
        img.width = 400;
        img.height = 400;
        img.loading = 'lazy';
        img.decoding = 'async';
        a.appendChild(img);

        if (p.mediaType === 'VIDEO') {
          var play = document.createElement('span');
          play.className = 'insta-play';
          play.setAttribute('aria-hidden', 'true');
          a.appendChild(play);
        }
        grid.appendChild(a);
      });
      if (grid.children.length) section.hidden = false;
    })
    .catch(function () {
      // Feed unavailable: keep the section hidden; the Instagram buttons elsewhere still work.
    });
})();

/* timkoppers.com — progressive enhancement layer
   Everything here is optional: the site works fully without JS.
   With prefers-reduced-motion the CSS switches to gentle fades;
   parallax, tilt and the cursor comet stay off entirely. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---- Scroll reveal + marker ink ---------------------------------- */
  var revealables = document.querySelectorAll('.reveal, .ink-on-scroll');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view', 'is-inked');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in-view', 'is-inked'); });
  }

  /* ---- Cursor comet: blob + trail + click sparks ---------------------- */
  if (finePointer && !reduceMotion) {
    var TRAIL = 6;
    var blob = document.createElement('div');
    blob.className = 'cursor-blob';
    blob.setAttribute('aria-hidden', 'true');
    document.body.appendChild(blob);

    var trail = [];
    for (var i = 0; i < TRAIL; i++) {
      var d = document.createElement('div');
      d.className = 'cursor-trail';
      d.setAttribute('aria-hidden', 'true');
      var size = 11 - i * 1.4;
      d.style.width = d.style.height = size + 'px';
      d.style.opacity = (0.42 - i * 0.06).toFixed(2);
      document.body.appendChild(d);
      trail.push({ el: d, x: -100, y: -100, r: size / 2 });
    }

    var mx = -100, my = -100, bx = -100, by = -100, visible = false;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!visible) { blob.style.opacity = '0.9'; visible = true; }
    });
    document.addEventListener('mouseleave', function () {
      blob.style.opacity = '0'; visible = false;
    });

    var interactive = 'a, button, [role="button"]';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactive)) blob.classList.add('is-active');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactive)) blob.classList.remove('is-active');
    });

    /* little yellow ink splat on every click */
    document.addEventListener('click', function (e) {
      for (var s = 0; s < 9; s++) {
        var spark = document.createElement('div');
        spark.className = 'cursor-spark';
        spark.setAttribute('aria-hidden', 'true');
        var angle = (Math.PI * 2 * s) / 9 + Math.random() * 0.6;
        var dist = 28 + Math.random() * 34;
        spark.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        spark.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        spark.style.transform = 'translate(' + (e.clientX - 4) + 'px,' + (e.clientY - 4) + 'px)';
        document.body.appendChild(spark);
        spark.addEventListener('animationend', spark.remove.bind(spark));
      }
    });

    (function follow() {
      bx += (mx - bx) * 0.2;
      by += (my - by) * 0.2;
      blob.style.transform = 'translate(' + (bx - 8) + 'px,' + (by - 8) + 'px)';
      var px = bx, py = by;
      trail.forEach(function (t) {
        t.x += (px - t.x) * 0.28;
        t.y += (py - t.y) * 0.28;
        t.el.style.transform = 'translate(' + (t.x - t.r) + 'px,' + (t.y - t.r) + 'px)';
        px = t.x; py = t.y;
      });
      requestAnimationFrame(follow);
    })();
  }

  /* ---- Card tilt on hover ---------------------------------------------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.card-link').forEach(function (link) {
      var media = link.querySelector('.card-media');
      if (!media) return;
      link.addEventListener('mousemove', function (e) {
        var r = media.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        media.style.setProperty('--tiltX', (y * -8).toFixed(2) + 'deg');
        media.style.setProperty('--tiltY', (x * 10).toFixed(2) + 'deg');
      });
      link.addEventListener('mouseleave', function () {
        media.style.setProperty('--tiltX', '0deg');
        media.style.setProperty('--tiltY', '0deg');
      });
    });
  }

  /* ---- Subtle parallax on slide images -------------------------------- */
  var pxTargets = Array.prototype.slice.call(document.querySelectorAll('.slide-media img'));
  if (pxTargets.length && !reduceMotion && finePointer) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      pxTargets.forEach(function (img) {
        var r = img.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var progress = (r.top + r.height / 2 - vh / 2) / vh; // -0.5 .. 0.5
        img.style.setProperty('translate', '0 ' + (progress * -16).toFixed(1) + 'px');
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---- Video facades: swap poster for iframe on click ------------------- */
  document.querySelectorAll('.video-facade').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var provider = btn.getAttribute('data-provider');
      var id = btn.getAttribute('data-video-id');
      var src = provider === 'youtube'
        ? 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0'
        : 'https://player.vimeo.com/video/' + id + '?autoplay=1';
      var wrap = document.createElement('div');
      wrap.className = 'video-embed';
      var iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.title = btn.getAttribute('data-title') || 'Video';
      wrap.appendChild(iframe);
      btn.replaceWith(wrap);
    });
  });
})();

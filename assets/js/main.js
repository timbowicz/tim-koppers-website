/* timkoppers.com — progressive enhancement layer
   Everything here is optional: the site works fully without JS. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Scroll reveal + marker ink ---------------------------------- */
  var revealables = document.querySelectorAll('.reveal, .ink-on-scroll');
  if ('IntersectionObserver' in window && !reduceMotion) {
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

  /* ---- Cursor blob --------------------------------------------------- */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reduceMotion) {
    var blob = document.createElement('div');
    blob.className = 'cursor-blob';
    blob.setAttribute('aria-hidden', 'true');
    document.body.appendChild(blob);

    var mx = -100, my = -100, bx = -100, by = -100, visible = false;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!visible) { blob.style.opacity = '0.85'; visible = true; }
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

    (function follow() {
      bx += (mx - bx) * 0.16;
      by += (my - by) * 0.16;
      blob.style.transform = 'translate(' + (bx - 7) + 'px,' + (by - 7) + 'px)';
      requestAnimationFrame(follow);
    })();
  }

  /* ---- Subtle parallax on slide images -------------------------------- */
  var pxTargets = Array.prototype.slice.call(document.querySelectorAll('.slide-media img, .card-media img'));
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

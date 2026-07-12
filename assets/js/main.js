/* timkoppers.com — Swiss edition. Progressive enhancement only:
   the site works fully without JS. Motion is mechanical and quick,
   and prefers-reduced-motion switches to opacity-only. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---- Scroll reveal + red rule ink ---------------------------------- */
  var revealables = document.querySelectorAll('.reveal, .ink-on-scroll');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view', 'is-inked');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in-view', 'is-inked'); });
  }

  /* ---- Cursor: red square, rotates 45deg over links, stamps a cross on click */
  if (finePointer && !reduceMotion) {
    var square = document.createElement('div');
    square.className = 'cursor-square';
    square.setAttribute('aria-hidden', 'true');
    document.body.appendChild(square);

    var mx = -100, my = -100, sx = -100, sy = -100, visible = false;
    var rotCur = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!visible) { square.style.opacity = '1'; visible = true; }
    });
    document.addEventListener('mouseleave', function () {
      square.style.opacity = '0'; visible = false;
    });

    var interactive = 'a, button, [role="button"]';
    var active = false;
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactive)) active = true;
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactive)) active = false;
    });

    document.addEventListener('click', function (e) {
      var cross = document.createElement('div');
      cross.className = 'click-cross';
      cross.setAttribute('aria-hidden', 'true');
      cross.style.left = (e.clientX - 14) + 'px';
      cross.style.top = (e.clientY - 14) + 'px';
      document.body.appendChild(cross);
      cross.addEventListener('animationend', cross.remove.bind(cross));
    });

    (function follow() {
      sx += (mx - sx) * 0.3;
      sy += (my - sy) * 0.3;
      /* rotation and scale composed after the positioning translate,
         so they act around the square's own center */
      var rotTarget = active ? 45 : 0;
      rotCur += (rotTarget - rotCur) * 0.25;
      square.style.transform =
        'translate(' + (sx - 6) + 'px,' + (sy - 6) + 'px)' +
        ' rotate(' + rotCur.toFixed(1) + 'deg)' +
        ' scale(' + (active ? 1.5 : 1) + ')';
      requestAnimationFrame(follow);
    })();
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

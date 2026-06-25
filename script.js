/* =====================================================================
   Shaheer Saud — Cyber AI Engineer portfolio
   Vanilla JS · no dependencies
   ===================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* ===================================================================
     BOOT SEQUENCE — optional, fast (<1.2s), skippable, never long-locks
     =================================================================== */
  var boot = document.getElementById("boot");
  var bootLog = document.getElementById("boot-log");
  var bootBar = document.getElementById("boot-bar-fill");
  var bootPct = document.getElementById("boot-pct");
  var bootSkip = document.getElementById("boot-skip");
  var booted = false;

  var lines = [
    ["ok", "[ OK ] ", "init secure kernel ... mounting /portfolio"],
    ["ok", "[ OK ] ", "loading module ai_security.ko"],
    ["am", "[ .. ] ", "decrypting credentials.vault"],
    ["ok", "[ OK ] ", "RAG pipeline ... online"],
    ["ok", "[ OK ] ", "SIEM listeners ... attached"],
    ["am", "[ >> ] ", "user: shaheer_saud authenticated"]
  ];

  function endBoot() {
    if (booted || !boot) return;
    booted = true;
    boot.classList.add("done");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onBootKey);
    window.setTimeout(function () {
      if (boot && boot.parentNode) boot.parentNode.removeChild(boot);
    }, reduce ? 0 : 480);
    startHero();
  }

  function onBootKey() { endBoot(); }

  if (!boot || !bootLog || !bootBar || !bootPct || !bootSkip || reduce) {
    // No splash for reduced-motion or if any boot markup is missing
    if (boot) boot.classList.add("done");
    document.body.style.overflow = "";
    startHero();
  } else {
    // Briefly prevent scroll, but auto-release well under 1.2s
    document.body.style.overflow = "hidden";
    bootSkip.addEventListener("click", endBoot);
    document.addEventListener("keydown", onBootKey);
    boot.addEventListener("click", function (e) {
      if (e.target === boot) endBoot();
    });

    var i = 0;
    (function step() {
      if (i < lines.length && !booted) {
        var l = lines[i];
        var div = document.createElement("div");
        div.innerHTML = '<span class="' + l[0] + '">' + l[1] + '</span><span class="dim">' + l[2] + "</span>";
        bootLog.appendChild(div);
        i++;
        window.setTimeout(step, 120);
      }
    })();

    var p = 0;
    var pv = window.setInterval(function () {
      p += Math.random() * 22 + 12;
      if (p >= 100) { p = 100; window.clearInterval(pv); }
      bootBar.style.width = p + "%";
      bootPct.textContent = Math.round(p) + "%";
    }, 90);

    // Hard cap: dismiss at ~1.0s regardless
    window.setTimeout(endBoot, 1000);
  }

  /* ===================================================================
     HERO ENTRANCE — masked line reveal (CSS fallback keeps it visible)
     =================================================================== */
  var heroStarted = false;
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;

    var heroName = document.querySelector(".hero-name");
    if (heroName && !reduce) {
      // Apply masked state then animate up on next frame
      heroName.classList.add("mask");
      var spans = heroName.querySelectorAll(".line span");
      requestAnimationFrame(function () {
        spans.forEach(function (s, idx) {
          s.style.transition = "transform .9s cubic-bezier(.22,1,.36,1)";
          s.style.transitionDelay = (0.1 + idx * 0.12) + "s";
        });
        requestAnimationFrame(function () { heroName.classList.remove("mask"); });
      });
    }

    // Reveal hero panels immediately (they're above the fold)
    var heroEls = document.querySelectorAll("#hero .rv");
    heroEls.forEach(function (el, idx) {
      window.setTimeout(function () { el.classList.add("in"); }, reduce ? 0 : 120 + idx * 130);
    });
  }

  /* ===================================================================
     SCROLL REVEAL (staggered per section)
     =================================================================== */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".rv"));
    if (reduce || !hasIO) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    // Group non-hero reveals by section for staggered entrance
    var groups = new Map();
    items.forEach(function (el) {
      if (el.closest("#hero")) return; // hero handled in startHero
      var sec = el.closest("section") || document.body;
      if (!groups.has(sec)) groups.set(sec, []);
      groups.get(sec).push(el);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var els = groups.get(e.target) || [];
          els.forEach(function (el, idx) {
            window.setTimeout(function () { el.classList.add("in"); }, Math.min(idx, 8) * 70);
          });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    groups.forEach(function (_, sec) { io.observe(sec); });
  }
  initReveal();

  /* ===================================================================
     COUNT-UP (decimal-aware) + sparkline draw on scroll into view
     =================================================================== */
  function animateCount(el) {
    var to = parseFloat(el.getAttribute("data-to"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    function fmt(v) {
      return dec ? v.toFixed(dec) : Math.round(v).toLocaleString();
    }
    if (reduce) { el.textContent = fmt(to); return; }
    var dur = 1500, start = null;
    function frame(ts) {
      if (!start) start = ts;
      var prog = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = fmt(to * eased);
      if (prog < 1) requestAnimationFrame(frame);
      else el.textContent = fmt(to);
    }
    requestAnimationFrame(frame);
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll(".cu"));
  if (hasIO && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { animateCount(el); });
  }

  // Sparkline draw: toggle `.in` on the metric tile when it scrolls in
  var metrics = Array.prototype.slice.call(document.querySelectorAll(".metric"));
  if (hasIO && !reduce) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); sio.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    metrics.forEach(function (el) { sio.observe(el); });
  } else {
    metrics.forEach(function (el) { el.classList.add("in"); });
  }

  /* ===================================================================
     NAV: scrolled state + active-link scrollspy
     =================================================================== */
  var nav = document.getElementById("nav");
  window.addEventListener("scroll", function () {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 16);
  }, { passive: true });
  if (nav) nav.classList.toggle("scrolled", window.scrollY > 16);

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".menu a"));
  if (hasIO && navLinks.length) {
    var linkSections = navLinks
      .map(function (a) {
        var h = a.getAttribute("href");
        return h && h.charAt(0) === "#" ? document.querySelector(h) : null;
      })
      .filter(Boolean);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    linkSections.forEach(function (s) { spy.observe(s); });
  }

  /* ===================================================================
     MOBILE MENU: toggle, Escape-to-close, body scroll lock
     =================================================================== */
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    if (booted || !boot) document.body.style.overflow = "";
  }
  function openMenu() {
    mobileMenu.classList.add("open");
    burger.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      if (mobileMenu.classList.contains("open")) closeMenu();
      else openMenu();
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("open")) closeMenu();
    });
  }

  /* ===================================================================
     AMBIENT NEURAL FIELD (full-page) + HERO INFERENCE GRAPH
     Canvas, phosphor-green, motion-gated and paused off-screen / hidden.
     =================================================================== */
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  function fitCanvas(cv) {
    var rect = cv.getBoundingClientRect();
    var w = Math.max(1, rect.width), h = Math.max(1, rect.height);
    cv.width = Math.round(w * DPR);
    cv.height = Math.round(h * DPR);
    return { w: w, h: h };
  }

  /* ---- A) Ambient neural field ---- */
  (function neuralField() {
    var cv = document.getElementById("neural");
    if (!cv) return;
    var ctx = cv.getContext("2d");
    var GREEN = "67,249,127";
    var nodes = [], pulses = [], dims = { w: 0, h: 0 };
    var raf = null, running = false;
    var mouse = { x: -9999, y: -9999 };
    var LINK = 132;

    function build() {
      dims = fitCanvas(cv);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var count = Math.round(Math.min(70, Math.max(22, (dims.w * dims.h) / 17000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * dims.w, y: Math.random() * dims.h,
          vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
          r: Math.random() * 1.5 + 0.7
        });
      }
      pulses = [];
    }
    function update() {
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < -24) a.x = dims.w + 24; else if (a.x > dims.w + 24) a.x = -24;
        if (a.y < -24) a.y = dims.h + 24; else if (a.y > dims.h + 24) a.y = -24;
      }
      if (pulses.length < 9 && Math.random() < 0.05) {
        var s = nodes[(Math.random() * nodes.length) | 0], near = null, best = LINK;
        for (var m = 0; m < nodes.length; m++) {
          if (nodes[m] === s) continue;
          var e = nodes[m], dd = Math.hypot(s.x - e.x, s.y - e.y);
          if (dd < best) { best = dd; near = e; }
        }
        if (near) pulses.push({ a: s, b: near, t: 0, sp: 0.018 + Math.random() * 0.02 });
      }
      for (var p = pulses.length - 1; p >= 0; p--) {
        pulses[p].t += pulses[p].sp;
        if (pulses[p].t >= 1) pulses.splice(p, 1);
      }
    }
    function render() {
      ctx.clearRect(0, 0, dims.w, dims.h);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.strokeStyle = "rgba(" + GREEN + "," + ((1 - d / LINK) * 0.16).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        var md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 170) {
          ctx.strokeStyle = "rgba(" + GREEN + "," + ((1 - md / 170) * 0.3).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        ctx.fillStyle = "rgba(" + GREEN + ",0.5)";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
      }
      for (var q = 0; q < pulses.length; q++) {
        var pl = pulses[q];
        var px = pl.a.x + (pl.b.x - pl.a.x) * pl.t, py = pl.a.y + (pl.b.y - pl.a.y) * pl.t;
        ctx.fillStyle = "rgba(154,255,185," + (Math.sin(pl.t * Math.PI) * 0.9).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(px, py, 1.7, 0, 6.2832); ctx.fill();
      }
    }
    function loop() { update(); render(); raf = requestAnimationFrame(loop); }
    function sync() {
      if (!document.hidden) { if (!running) { running = true; raf = requestAnimationFrame(loop); } }
      else { running = false; if (raf) cancelAnimationFrame(raf); }
    }

    build();
    if (reduce) { render(); return; }
    render();
    window.addEventListener("mousemove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener("mouseout", function () { mouse.x = -9999; mouse.y = -9999; });
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(build, 200); });
    document.addEventListener("visibilitychange", sync);
    sync();
  })();

  /* ---- B) Hero inference graph ---- */
  (function heroNet() {
    var cv = document.getElementById("nnet");
    if (!cv) return;
    var ctx = cv.getContext("2d");
    var GREEN = "67,249,127", BG = "8,10,9";
    var layers = [4, 6, 6, 3];
    var nodes = [], edges = [], dims = { w: 0, h: 0 };
    var raf = null, running = false, onScreen = false, t = 0;

    function build() {
      dims = fitCanvas(cv);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      nodes = []; edges = [];
      var padX = dims.w * 0.13, padY = dims.h * 0.12;
      var uW = dims.w - padX * 2, uH = dims.h - padY * 2, L = layers.length;
      for (var l = 0; l < L; l++) {
        var cnt = layers[l], x = padX + (L === 1 ? 0 : uW * l / (L - 1));
        for (var i = 0; i < cnt; i++) {
          var y = padY + (cnt === 1 ? uH / 2 : uH * i / (cnt - 1));
          nodes.push({ x: x, y: y, layer: l });
        }
      }
      for (var l2 = 0; l2 < L - 1; l2++) {
        var A = nodes.filter(function (nd) { return nd.layer === l2; });
        var B = nodes.filter(function (nd) { return nd.layer === l2 + 1; });
        A.forEach(function (a) { B.forEach(function (b) { edges.push({ a: a, b: b }); }); });
      }
    }
    function render() {
      ctx.clearRect(0, 0, dims.w, dims.h);
      var wave = (t % 1) * layers.length;
      for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        ctx.strokeStyle = "rgba(" + GREEN + ",0.10)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
        var prog = wave - e.a.layer;
        if (prog > 0 && prog < 1) {
          var px = e.a.x + (e.b.x - e.a.x) * prog, py = e.a.y + (e.b.y - e.a.y) * prog;
          ctx.fillStyle = "rgba(154,255,185," + (Math.sin(prog * Math.PI) * 0.85).toFixed(3) + ")";
          ctx.beginPath(); ctx.arc(px, py, 1.5, 0, 6.2832); ctx.fill();
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var nd = nodes[k], act = Math.max(0, 1 - Math.abs(wave - nd.layer) * 1.5), r = 3.3 + act * 2.1;
        if (act > 0.03) {
          ctx.fillStyle = "rgba(" + GREEN + "," + (act * 0.15).toFixed(3) + ")";
          ctx.beginPath(); ctx.arc(nd.x, nd.y, r + 6, 0, 6.2832); ctx.fill();
        }
        ctx.fillStyle = "rgba(" + BG + ",1)";
        ctx.beginPath(); ctx.arc(nd.x, nd.y, r, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "rgba(" + GREEN + "," + (0.22 + act * 0.66).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(nd.x, nd.y, Math.max(0, r - 2.1), 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "rgba(" + GREEN + "," + (0.45 + act * 0.5).toFixed(3) + ")";
        ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.arc(nd.x, nd.y, r, 0, 6.2832); ctx.stroke();
      }
    }
    function loop() { t = (t + 0.004) % 1; render(); raf = requestAnimationFrame(loop); }
    function sync() {
      if (onScreen && !document.hidden) { if (!running) { running = true; raf = requestAnimationFrame(loop); } }
      else { running = false; if (raf) cancelAnimationFrame(raf); }
    }

    build();
    if (reduce) { t = 0.5; render(); return; }
    render();
    var rt2;
    window.addEventListener("resize", function () { clearTimeout(rt2); rt2 = setTimeout(function () { build(); render(); }, 200); });
    document.addEventListener("visibilitychange", sync);
    if (hasIO) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { onScreen = e.isIntersecting; sync(); });
      }, { threshold: 0.05 });
      io.observe(cv);
    } else { onScreen = true; sync(); }
  })();

  /* ===================================================================
     POINTER 3D TILT on project + experience cards (hover + motion gated)
     =================================================================== */
  if (canHover && !reduce) {
    var tiltCards = Array.prototype.slice.call(document.querySelectorAll(".tilt"));
    tiltCards.forEach(function (card) {
      card.addEventListener("mousemove", function (ev) {
        var r = card.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5;
        var y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateX(" + (-y * 3.5).toFixed(2) + "deg) rotateY(" +
          (x * 4.5).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }
})();

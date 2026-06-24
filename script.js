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
     RADAR SWEEP + randomized blips (decorative, motion-gated)
     =================================================================== */
  if (!reduce) {
    var sweep = document.getElementById("sweep");
    var blipG = document.getElementById("blips");
    var radar = document.getElementById("radar");
    if (sweep && blipG && radar) {
      var angle = 0;
      var rafId = null;
      var spawnTimer = null;
      var radarActive = false;

      function frame() {
        angle = (angle + 1.1) % 360;
        sweep.setAttribute("transform", "rotate(" + angle + " 150 150)");
        rafId = requestAnimationFrame(frame);
      }
      function spawnBlip() {
        var a = Math.random() * Math.PI * 2;
        var r = 30 + Math.random() * 110;
        var x = 150 + Math.cos(a) * r;
        var y = 150 + Math.sin(a) * r;
        var crit = Math.random() > 0.78;
        var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", x.toFixed(1));
        c.setAttribute("cy", y.toFixed(1));
        c.setAttribute("r", "3");
        c.setAttribute("fill", crit ? "#ff5b6e" : "#43f97f");
        c.style.opacity = "0";
        c.style.transition = "opacity .5s";
        blipG.appendChild(c);
        requestAnimationFrame(function () { c.style.opacity = "1"; });
        window.setTimeout(function () {
          c.style.opacity = "0";
          window.setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 600);
        }, 2600);
      }
      function startRadar() {
        if (radarActive) return;
        radarActive = true;
        rafId = requestAnimationFrame(frame);
        spawnTimer = window.setInterval(spawnBlip, 950);
        for (var k = 0; k < 4; k++) window.setTimeout(spawnBlip, k * 280);
      }
      function stopRadar() {
        radarActive = false;
        if (rafId) cancelAnimationFrame(rafId);
        if (spawnTimer) window.clearInterval(spawnTimer);
      }
      // Only run while the radar is on screen (perf)
      if (hasIO) {
        var rio = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) startRadar(); else stopRadar();
          });
        }, { threshold: 0.05 });
        rio.observe(radar);
      } else {
        startRadar();
      }
    }
  }

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

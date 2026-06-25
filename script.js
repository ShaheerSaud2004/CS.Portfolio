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

  /* ===================================================================
     KNOWLEDGE BASE (résumé chunks) — shared by the terminal `ask` RAG demo
     =================================================================== */
  var KB = [
    { id: "about", src: "about/profile.md", kw: "who you are summary cyber ai engineer security machine learning discipline overview intro background", text: "I'm a Cyber AI Engineer who treats security and machine learning as one discipline — turning slow, manual security work into fast, reliable, auditable automation." },
    { id: "att", src: "experience/att.md", kw: "at&t att cyber ai engineer rag llm pipeline ingestion iam pam 96% accuracy ragas hugging face benchmarking 1000 labeled examples 90% hyperparameters embeddings proprietary llm middletown 2025 most recent current job", text: "At AT&T (Cyber AI Engineer, May–Aug 2025) I architected a RAG LLM pipeline that cut document processing from weeks to seconds and pushed IAM/PAM query accuracy to 96%, built an LLM benchmarking framework with RAGAS + Hugging Face over 1,000+ examples (90% faster eval), and tuned hyperparameters/embeddings for AT&T's proprietary LLM." },
    { id: "colgate", src: "experience/colgate.md", kw: "colgate palmolive security engineer intern pam chatbot help desk 98% splunk okta tanium log analysis threat detection anomalies migration 1000 it profiles powershell python api 80% piscataway 2024", text: "At Colgate-Palmolive (Security Engineer Intern, Feb 2024–Dec 2025) I built an AI chatbot for PAM queries that cut help-desk workload 98%, hunted threats across Splunk/Okta/Tanium, and automated migration of 1,000+ IT profiles (80% less manual effort)." },
    { id: "rutgers", src: "experience/rutgers.md", kw: "rutgers oit office information technology supervisor selenium python automation caller wait 85% osi layer tcp ip dns network 200 consultants 300 tickets servicenow new brunswick 2023", text: "At Rutgers OIT (IT Supervisor, Apr 2023–present) I deployed a Selenium/Python automation that cut caller wait times 85%, applied OSI L1–7 / TCP-IP / DNS expertise, and led & trained 200 consultants resolving 300+ tickets via ServiceNow." },
    { id: "p1", src: "projects/llm-compression", kw: "project on device llm compression deployment bert gpt-2 edge int8 raspberry pi lime shap pytorch advisor rabiul islam model", text: "Project — On-Device LLM Compression & Deployment (advisor Dr. Rabiul Islam): compressed BERT/GPT-2 for edge, deployed int8 on Raspberry Pi, validated with LIME/SHAP." },
    { id: "p2", src: "projects/honeypot", kw: "project smart home honeypot dashboard iot flask sqlite websockets geoip telnet jinja attacker deception real time threats", text: "Project — Smart Home Honeypot Dashboard: a full-stack IoT honeypot (Python/Flask/SQLite/WebSockets/GeoIP/Telnet) capturing attacker behavior with a real-time threat dashboard." },
    { id: "p3", src: "projects/crawler", kw: "project sensitive data exposure crawler fastapi asyncio nlp chartjs uvicorn websockets pii scan public urls 100 concurrent workers", text: "Project — Sensitive Data Exposure Crawler: a real-time crawler (FastAPI/Asyncio/NLP) scanning public URLs for exposed PII with 100+ concurrent workers." },
    { id: "skills", src: "skills/stack.json", kw: "skills languages tools python java javascript c c++ sql powershell pytorch hugging face splunk tanium okta iam pam siem honeypots tcp ip dns osi tech stack", text: "Skills — Python, Java, JavaScript, C/C++, SQL, PowerShell, PyTorch, Hugging Face; Splunk, Tanium, Okta, IAM/PAM, SIEM, honeypots, TCP/IP, DNS, OSI 1–7." },
    { id: "edu", src: "education/degree.md", kw: "education rutgers university bachelor computer science cum laude gpa 3.65 may 2026 degree school college", text: "Education — Rutgers University, B.A. Computer Science, Cum Laude, GPA 3.65, expected May 2026." },
    { id: "contact", src: "contact.sh", kw: "contact email hire reach linkedin github website cipherconsulting khafi resume available roles", text: "Contact — email shaheersaud.internship@gmail.com · github.com/ShaheerSaud2004 · linkedin.com/in/shaheer-saud · cipherconsulting.net · khafi.org" }
  ];
  var STOP = { the:1,a:1,an:1,and:1,or:1,of:1,to:1,in:1,on:1,at:1,for:1,with:1,is:1,are:1,was:1,were:1,do:1,did:1,does:1,you:1,your:1,what:1,which:1,how:1,me:1,my:1,i:1,tell:1,about:1,please:1,can:1,whats:1,"what's":1 };
  function terms(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9+#&]+/g, " ").split(/\s+/).filter(function (w) { return w && !STOP[w]; });
  }
  function retrieve(q) {
    var qt = terms(q);
    if (!qt.length) return [];
    return KB.map(function (c) {
      var hay = (c.kw + " " + c.text).toLowerCase();
      var score = 0;
      qt.forEach(function (t) { if (hay.indexOf(t) !== -1) score += (t.length > 4 ? 2 : 1); });
      return { c: c, score: score };
    }).filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });
  }

  /* ===================================================================
     INTERACTIVE TERMINAL (hero) + client-side RAG `ask`
     =================================================================== */
  (function repl() {
    var form = document.getElementById("termForm");
    var input = document.getElementById("termIn");
    var out = document.getElementById("termOut");
    if (!form || !input || !out) return;

    var history = [], hpos = -1;

    function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
    function line(html, cls) {
      var d = document.createElement("div");
      d.className = "l" + (cls ? " " + cls : "");
      d.innerHTML = html;
      out.appendChild(d);
      return d;
    }
    function streamInto(el, text, done) {
      if (reduce) { el.textContent = text; if (done) done(); return; }
      var words = text.split(/(\s+)/), i = 0;
      el.innerHTML = '<span class="sw"></span><span class="caret"></span>';
      var sw = el.firstChild, caret = el.lastChild;
      (function tick() {
        if (i < words.length) {
          sw.textContent += words[i++]; sw.textContent += words[i] || ""; i++;
          window.setTimeout(tick, 22);
        } else { if (caret && caret.parentNode) caret.parentNode.removeChild(caret); if (done) done(); }
      })();
    }

    var HELP = [
      "available commands:",
      "  help            this list",
      "  whoami          quick intro",
      "  experience      roles @ AT&T, Colgate, Rutgers",
      "  projects        featured builds",
      "  skills          tech + security stack",
      "  education       degree & GPA",
      "  contact         ways to reach me",
      "  resume          open my résumé (pdf)",
      "  ask \"...\"        ask my résumé anything (RAG demo)",
      "  clear           wipe the screen",
      "",
      "try:  ask what did you do at AT&T?"
    ];

    function ask(q) {
      if (!q) { line('usage: ask "your question"  —  e.g. ask what did you build at Colgate?', "err"); return; }
      line('<span class="pmt">↳</span> <span class="src">retrieving context from résumé knowledge base…</span>');
      var hits = retrieve(q);
      window.setTimeout(function () {
        if (!hits.length) {
          line('no strong match. try asking about <b>AT&amp;T</b>, <b>Colgate</b>, <b>Rutgers</b>, my <b>projects</b>, <b>skills</b>, or <b>education</b>.', "amb");
          return;
        }
        var top = hits.slice(0, hits.length > 1 && hits[1].score >= hits[0].score - 1 ? 2 : 1);
        line('<span class="src">sources: ' + top.map(function (t) { return "[" + esc(t.c.src) + "]"; }).join(" ") + '</span>');
        var answer = top.map(function (t) { return t.c.text; }).join("  ");
        var l = line("", "ok");
        streamInto(l, answer);
      }, 360);
    }

    function run(raw) {
      var cmd = raw.trim();
      line('<span class="pmt">visitor@portfolio:~$</span> ' + esc(cmd), "cmd-echo");
      if (!cmd) return;
      var sp = cmd.indexOf(" ");
      var name = (sp === -1 ? cmd : cmd.slice(0, sp)).toLowerCase();
      var arg = sp === -1 ? "" : cmd.slice(sp + 1).trim().replace(/^["']|["']$/g, "");

      if (name === "ask") { ask(arg); return; }
      switch (cmd.toLowerCase()) {
        case "help": case "?": case "ls": HELP.forEach(function (h) { line(esc(h)); }); break;
        case "whoami": case "about": line(KB[0].text, "ok"); break;
        case "experience": case "exp": case "experience/":
          line("AT&amp;T — Cyber AI Engineer (RAG/LLM, IAM/PAM → 96%)", "ok");
          line("Colgate-Palmolive — Security Engineer Intern (PAM chatbot, Splunk/Okta/Tanium)", "ok");
          line("Rutgers OIT — IT Supervisor (automation, 200 consultants)", "ok");
          line('<span class="src">// run `ask` for details, e.g. ask what did you do at AT&amp;T</span>');
          break;
        case "projects": case "ls projects": case "projects/":
          line("1) On-Device LLM Compression &amp; Deployment — PyTorch · int8 · Raspberry Pi", "ok");
          line("2) Smart Home Honeypot Dashboard — Flask · WebSockets · GeoIP", "ok");
          line("3) Sensitive Data Exposure Crawler — FastAPI · NLP · 100+ workers", "ok");
          break;
        case "skills": line(KB[7].text, "ok"); break;
        case "education": case "edu": line(KB[8].text, "ok"); break;
        case "contact":
          line('email · <a href="mailto:shaheersaud.internship@gmail.com">shaheersaud.internship@gmail.com</a>');
          line('github · <a href="https://github.com/ShaheerSaud2004" target="_blank" rel="noopener noreferrer">@ShaheerSaud2004</a>');
          line('linkedin · <a href="https://linkedin.com/in/shaheer-saud" target="_blank" rel="noopener noreferrer">/in/shaheer-saud</a>');
          break;
        case "resume": case "cv":
          line('opening <a href="Shaheer_Saud_Resume.pdf" target="_blank" rel="noopener noreferrer">Shaheer_Saud_Resume.pdf</a> …', "ok");
          window.open("Shaheer_Saud_Resume.pdf", "_blank", "noopener");
          break;
        case "sudo hire-me": case "sudo hire me":
          line("[sudo] permission granted ✓", "ok");
          line('Shaheer is open to Cyber AI / security roles → <a href="mailto:shaheersaud.internship@gmail.com">email me</a>', "ok");
          break;
        case "clear": case "cls": out.innerHTML = ""; break;
        default:
          if (name === "sudo") { line("sudo: nice try — permission denied. (try: sudo hire-me)", "amb"); break; }
          line("command not found: " + esc(name) + " — type 'help'", "err");
      }
    }

    line('<span class="src">// interactive shell ready — type <b>help</b>, or <b>ask</b> me anything about my work</span>');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value;
      if (v.trim()) { history.push(v); hpos = history.length; }
      run(v);
      input.value = "";
      out.scrollTop = out.scrollHeight;
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp") { if (hpos > 0) { hpos--; input.value = history[hpos]; e.preventDefault(); } }
      else if (e.key === "ArrowDown") { if (hpos < history.length - 1) { hpos++; input.value = history[hpos]; } else { hpos = history.length; input.value = ""; } }
    });
    var replBox = form.parentNode;
    if (replBox) replBox.addEventListener("click", function (e) { if (window.getSelection && String(window.getSelection())) return; input.focus(); });
  })();

  /* ===================================================================
     TOKEN-STREAMING ABOUT (LLM-style word-by-word reveal on scroll-in)
     =================================================================== */
  (function streamAbout() {
    var body = document.querySelector(".about-body");
    if (!body || reduce || !hasIO) return;

    // Wrap every word in the rich paragraphs in a .tok span (preserving structure)
    var texts = [];
    var walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null);
    var t; while ((t = walker.nextNode())) { if (t.nodeValue.trim()) texts.push(t); }
    texts.forEach(function (node) {
      var parts = node.nodeValue.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      parts.forEach(function (w) {
        if (!w) return;
        if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w));
        else { var s = document.createElement("span"); s.className = "tok"; s.textContent = w; frag.appendChild(s); }
      });
      node.parentNode.replaceChild(frag, node);
    });
    var toks = Array.prototype.slice.call(body.querySelectorAll(".tok"));
    var caret = document.createElement("span"); caret.className = "caret";

    var started = false;
    function reveal(animated) {
      if (started) return; started = true;
      if (!animated) { toks.forEach(function (t) { t.classList.add("on"); }); return; }
      var i = 0;
      (function tick() {
        var n = Math.min(i + 2, toks.length);
        for (; i < n; i++) { toks[i].classList.add("on"); }
        if (i < toks.length) { if (toks[i]) toks[i].parentNode.insertBefore(caret, toks[i]); window.setTimeout(tick, 34); }
        else if (caret.parentNode) caret.parentNode.removeChild(caret);
      })();
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { reveal(true); io.disconnect(); } });
    }, { threshold: 0.2 });
    io.observe(body);
    // Already in view on load (e.g. short screens / reload mid-page)
    if (body.getBoundingClientRect().top < window.innerHeight * 0.85) {
      window.setTimeout(function () { reveal(true); }, 400);
    }
    // Safety net: text must never stay hidden if the observer never fires
    window.setTimeout(function () { reveal(false); }, 6000);
  })();

  /* ===================================================================
     LIVE THREAT-DETECTION FEED (simulated ML classifier, motion-gated)
     =================================================================== */
  (function threatFeed() {
    var feed = document.getElementById("feed");
    if (!feed) return;

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    var clock = 9 * 3600 + 41 * 60 + 12; // deterministic start (no Date.now)
    function ts() { clock = (clock + 3 + ((Math.random() * 7) | 0)) % 86400; var h = (clock / 3600) | 0, m = ((clock % 3600) / 60) | 0, s = clock % 60; return pad(h) + ":" + pad(m) + ":" + pad(s); }
    function ip() { return (10 + (Math.random() * 240 | 0)) + "." + (Math.random() * 256 | 0) + "." + (Math.random() * 256 | 0) + "." + (Math.random() * 256 | 0); }
    function pick(a) { return a[(Math.random() * a.length) | 0]; }
    var users = ["s.saud", "root", "svc-pam", "jdoe", "admin", "k.lee", "guest"];
    var events = [
      function () { return "auth.login user=" + pick(users) + " src=" + ip(); },
      function () { return "pam.query id=" + (1000 + (Math.random() * 8999 | 0)) + " lat=" + (8 + (Math.random() * 90 | 0)) + "ms"; },
      function () { return "honeypot.hit proto=telnet src=" + ip(); },
      function () { return "siem.rule=" + pick(["T1110", "T1059", "T1078", "T1021"]) + " src=" + ip(); },
      function () { return "dns.lookup " + pick(["cdn", "api", "vault", "unknown-" + (Math.random() * 99 | 0)]) + ".internal"; },
      function () { return "iam.escalation user=" + pick(users) + " role=admin"; },
      function () { return "okta.mfa user=" + pick(users) + " result=" + pick(["pass", "deny"]); }
    ];
    function classify() {
      var r = Math.random();
      if (r > 0.9) return { cls: "crit", label: "CRITICAL" };
      if (r > 0.66) return { cls: "susp", label: "SUSPICIOUS" };
      return { cls: "benign", label: "BENIGN" };
    }

    var MAX = 7, timer = null, running = false;
    function add() {
      var v = classify(), conf = (v.cls === "benign" ? 80 + (Math.random() * 19 | 0) : 90 + (Math.random() * 9 | 0));
      var row = document.createElement("div");
      row.className = "row";
      row.innerHTML = '<span class="ts">' + ts() + '</span><span class="msg">' + pick(events)() +
        '</span><span class="vd ' + v.cls + '">' + v.label + ' ' + conf + '%</span>';
      feed.appendChild(row);
      while (feed.children.length > MAX) feed.removeChild(feed.firstChild);
    }
    function start() { if (running) return; running = true; add(); timer = window.setInterval(add, 1500); }
    function stop() { running = false; if (timer) window.clearInterval(timer); }

    for (var k = 0; k < 5; k++) add(); // seed
    if (reduce) return;
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else if (onView) start(); });
    var onView = true;
    if (hasIO) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { onView = e.isIntersecting; if (onView && !document.hidden) start(); else stop(); });
      }, { threshold: 0.05 });
      io.observe(feed);
    } else { start(); }
  })();
})();

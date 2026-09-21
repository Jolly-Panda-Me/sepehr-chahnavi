(function () {
  "use strict";

  var DATA_URL = "data/content.json";
  var STORAGE_KEY = "sepehr-lang";
  var content = null;
  var currentLang = "en";

  /* ---------------- utilities ---------------- */

  function getPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function el(tag, className, html) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* ---------------- i18n ---------------- */

  function detectInitialLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved === "en" || saved === "fa") return saved;
    var browserLang = (navigator.language || "en").toLowerCase();
    return browserLang.indexOf("fa") === 0 ? "fa" : "en";
  }

  function applyStaticText(lang) {
    var dict = content[lang];
    qsa("[data-i18n]").forEach(function (node) {
      var value = getPath(dict, node.getAttribute("data-i18n"));
      if (typeof value === "string") node.textContent = value;
    });

    document.documentElement.lang = lang;
    document.documentElement.dir = dict.dir;
    document.title = dict.meta.title;

    var metaDesc = qs('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", dict.meta.description);
    var metaKw = qs('meta[name="keywords"]');
    if (metaKw) metaKw.setAttribute("content", dict.meta.keywords);

    document.body.classList.toggle("lang-fa", lang === "fa");
    document.body.classList.toggle("lang-en", lang === "en");
  }

  /* ---------------- dynamic sections ---------------- */

  function renderAbout(dict) {
    var img = qs("#about-image");
    if (img) img.src = dict.about.image;
    var wrap = qs("#about-paragraphs");
    wrap.innerHTML = "";
    dict.about.paragraphs.forEach(function (p) {
      wrap.appendChild(el("p", null, p));
    });
  }

  function renderExperience(dict) {
    var list = qs("#experience-list");
    list.innerHTML = "";
    dict.experience.items.forEach(function (item) {
      var li = el("li", "timeline-item");

      var head = el("div", "timeline-head");
      head.appendChild(el("span", "timeline-role", item.role));
      head.appendChild(el("span", "timeline-company", "— " + item.company));
      head.appendChild(el("span", "timeline-period", item.period));
      li.appendChild(head);

      var metaBits = [item.location, item.note].filter(Boolean).join(" · ");
      if (metaBits) li.appendChild(el("p", "timeline-meta", metaBits));

      var bullets = el("ul", "timeline-bullets");
      item.bullets.forEach(function (b) { bullets.appendChild(el("li", null, b)); });
      li.appendChild(bullets);

      if (item.link) {
        var a = document.createElement("a");
        a.href = item.link.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.className = "timeline-link";
        a.textContent = item.link.label + " ↗";
        li.appendChild(a);
      }

      list.appendChild(li);
    });
  }

  function renderSkills(dict) {
    var list = qs("#skills-list");
    list.innerHTML = "";
    dict.skills.items.forEach(function (skill) {
      list.appendChild(el("li", null, skill));
    });
  }

  function renderProjects(dict) {
    var grid = qs("#projects-list");
    grid.innerHTML = "";
    dict.projects.items.forEach(function (p) {
      var card = el("article", "project-card");

      var media = el("div", "project-media");
      var img = document.createElement("img");
      img.src = p.image;
      img.alt = p.title;
      img.loading = "lazy";
      media.appendChild(img);
      card.appendChild(media);

      var body = el("div", "project-body");
      var head = el("div", "project-head");
      head.appendChild(el("h3", "project-title", p.title));
      head.appendChild(el("span", "project-year", p.year));
      body.appendChild(head);
      body.appendChild(el("p", "project-desc", p.description));

      var tags = el("div", "project-tags");
      (p.tags || []).forEach(function (t) { tags.appendChild(el("span", null, t)); });
      body.appendChild(tags);

      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function renderEducation(dict) {
    var wrap = qs("#education-list");
    wrap.innerHTML = "";
    dict.education.items.forEach(function (item) {
      var card = el("div", "education-item");
      card.appendChild(el("h3", "education-degree", item.degree));
      card.appendChild(el("p", "education-school", item.school));
      card.appendChild(el("p", "education-period", item.period));
      var courses = el("ul", "education-courses");
      (item.courses || []).forEach(function (c) { courses.appendChild(el("li", null, c)); });
      card.appendChild(courses);
      wrap.appendChild(card);
    });
  }

  function renderContact(dict) {
    var emailLink = qs("#contact-email");
    var emailLabel = qs("#contact-email-label");
    var liLink = qs("#contact-linkedin");
    var liLabel = qs("#contact-linkedin-label");
    if (emailLink) emailLink.href = "mailto:" + dict.contact.email;
    if (emailLabel) emailLabel.textContent = dict.contact.email;
    if (liLink) liLink.href = dict.contact.linkedin;
    if (liLabel) liLabel.textContent = dict.contact.linkedin_label;
  }

  function renderDynamic(lang) {
    var dict = content[lang];
    renderAbout(dict);
    renderExperience(dict);
    renderSkills(dict);
    renderProjects(dict);
    renderEducation(dict);
    renderContact(dict);
  }

  function setLang(lang) {
    currentLang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    applyStaticText(lang);
    renderDynamic(lang);
  }

  /* ---------------- header / nav ---------------- */

  function initNav() {
    var burger = qs("#nav-burger");
    var headerInner = qs(".header-inner");
    if (!burger) return;
    burger.addEventListener("click", function () {
      var open = headerInner.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    qsa(".main-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        headerInner.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initLangToggle() {
    var btn = qs("#lang-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      setLang(currentLang === "en" ? "fa" : "en");
    });
  }

  /* ---------------- hero 3D interaction ---------------- */

  function initHeroParallax() {
    var scene = qs("#hero-scene");
    var wrap = qs("#hero-card-wrap");
    if (!scene || !wrap) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var maxTilt = 14;
    var raf = null;
    var target = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };

    function onMove(clientX, clientY) {
      var rect = scene.getBoundingClientRect();
      var px = (clientX - rect.left) / rect.width - 0.5;
      var py = (clientY - rect.top) / rect.height - 0.5;
      target.x = px * maxTilt;
      target.y = py * -maxTilt;
    }

    scene.addEventListener("mousemove", function (e) { onMove(e.clientX, e.clientY); });
    scene.addEventListener("mouseleave", function () { target.x = 0; target.y = 0; });
    scene.addEventListener("touchmove", function (e) {
      if (e.touches && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    function tick() {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      wrap.style.transform = "translate(-50%, -50%) rotateX(" + current.y + "deg) rotateY(" + current.x + "deg)";
      raf = requestAnimationFrame(tick);
    }
    tick();
  }

  function initParticles() {
    var field = qs("#hero-particles");
    if (!field) return;
    var colors = ["#2de2e6", "#ff2fb9", "#9dfc4a"];
    var count = window.innerWidth < 700 ? 16 : 30;
    for (var i = 0; i < count; i++) {
      var span = document.createElement("span");
      span.style.left = Math.random() * 100 + "%";
      span.style.top = Math.random() * 100 + "%";
      span.style.color = colors[i % colors.length];
      span.style.animation = "particle-drift " + (6 + Math.random() * 8) + "s ease-in-out " + (Math.random() * 4) + "s infinite";
      field.appendChild(span);
    }
    var styleTag = document.createElement("style");
    styleTag.textContent =
      "@keyframes particle-drift {" +
      "0%,100% { transform: translateY(0) scale(1); opacity: .25; }" +
      "50% { transform: translateY(-26px) scale(1.4); opacity: .9; }" +
      "}";
    document.head.appendChild(styleTag);
  }

  /* ---------------- glitch intro (single orchestrated moment) ---------------- */

  function initGlitchIntro() {
    var headline = qs("[data-glitch]");
    if (!headline) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    headline.classList.add("glitch-play");
    setTimeout(function () { headline.classList.remove("glitch-play"); }, 900);
  }

  /* ---------------- misc ---------------- */

  function initFooterYear() {
    var y = qs("#footer-year");
    if (y) y.textContent = new Date().getFullYear();
  }

  function initScrollSpy() {
    var links = qsa(".main-nav a");
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("active"); });
        var match = links.find(function (a) { return a.getAttribute("href") === "#" + entry.target.id; });
        if (match) match.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------------- boot ---------------- */

  function boot() {
    currentLang = detectInitialLang();
    applyStaticText(currentLang);
    renderDynamic(currentLang);
    initNav();
    initLangToggle();
    initHeroParallax();
    initParticles();
    initGlitchIntro();
    initFooterYear();
    initScrollSpy();
  }

  fetch(DATA_URL)
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load content.json (" + res.status + ")");
      return res.json();
    })
    .then(function (json) {
      content = json;
      boot();
    })
    .catch(function (err) {
      console.error(err);
      document.body.insertAdjacentHTML(
        "afterbegin",
        '<div style="position:fixed;inset:0;z-index:9999;background:#0a0e17;color:#ff2fb9;' +
        'font-family:monospace;display:flex;align-items:center;justify-content:center;' +
        'text-align:center;padding:24px;">Could not load data/content.json.<br>' +
        'Serve this site over http:// (e.g. `npx serve`) instead of opening index.html directly.</div>'
      );
    });
})();

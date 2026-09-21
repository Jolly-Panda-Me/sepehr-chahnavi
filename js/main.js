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
    var scene = qs(".hero");
    var frame = qs("#hero-art-frame");
    if (!scene || !frame) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    if (window.matchMedia("(max-width: 860px)").matches) return;

    var maxTilt = 10;
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

    function tick() {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      frame.style.transform = "rotateX(" + current.y + "deg) rotateY(" + current.x + "deg)";
      requestAnimationFrame(tick);
    }
    tick();
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
        '<div style="position:fixed;inset:0;z-index:9999;background:#efe8db;color:#e33a2c;' +
        'font-family:monospace;display:flex;align-items:center;justify-content:center;' +
        'text-align:center;padding:24px;">Could not load data/content.json.<br>' +
        'Serve this site over http:// (e.g. `npx serve`) instead of opening index.html directly.</div>'
      );
    });
})();

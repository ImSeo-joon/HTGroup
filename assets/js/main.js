(function () {
  "use strict";

  const STORAGE_KEY = "ht-group-language";
  const supported = ["en", "zh", "fr"];
  const htmlLang = { en: "en", zh: "zh-CN", fr: "fr" };
  const titles = window.HT_I18N || {};

  const header = document.getElementById("masthead");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const metaDescription = document.querySelector("[data-meta-description]");
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');

  function readStoredLanguage() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeLanguage(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // The language still changes for this visit when storage is unavailable.
    }
  }

  function getInitialLanguage() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("lang");
    if (supported.includes(requested)) return requested;

    const stored = readStoredLanguage();
    if (supported.includes(stored)) return stored;

    return "en";
  }

  function setText(selector, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = value;
    });
  }

  function applyLanguage(lang, options) {
    const settings = options || {};
    const nextLanguage = supported.includes(lang) ? lang : "en";
    const dictionary = titles[nextLanguage] || titles.en;

    document.documentElement.lang = htmlLang[nextLanguage];
    document.documentElement.dataset.lang = nextLanguage;
    document.title = dictionary["meta.title"];

    if (metaDescription) {
      metaDescription.setAttribute("content", dictionary["meta.description"]);
    }
    if (ogTitle) {
      ogTitle.setAttribute("content", dictionary["meta.title"]);
    }
    if (ogDescription) {
      ogDescription.setAttribute("content", dictionary["meta.description"]);
    }

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      const key = node.getAttribute("data-i18n");
      const value = dictionary[key];
      if (typeof value === "string") node.textContent = value;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (node) {
      const key = node.getAttribute("data-i18n-aria");
      const value = dictionary[key];
      if (typeof value === "string") node.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (node) {
      const key = node.getAttribute("data-i18n-alt");
      const value = dictionary[key];
      if (typeof value === "string") node.setAttribute("alt", value);
    });

    document.querySelectorAll("[data-lang]").forEach(function (button) {
      const active = button.getAttribute("data-lang") === nextLanguage;
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (settings.persist !== false) storeLanguage(nextLanguage);

    if (settings.updateUrl !== false) {
      const url = new URL(window.location.href);
      if (nextLanguage === "en") {
        url.searchParams.delete("lang");
      } else {
        url.searchParams.set("lang", nextLanguage);
      }
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  }

  function closeMenu() {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  }

  function setupMenu() {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener("click", function () {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
      mobileMenu.hidden = isOpen;
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1160) closeMenu();
    });
  }

  function setupLanguage() {
    document.querySelectorAll("[data-lang]").forEach(function (button) {
      button.addEventListener("click", function () {
        applyLanguage(button.getAttribute("data-lang"));
        closeMenu();
      });
    });
  }

  function setupHeader() {
    if (!header) return;

    function syncHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 26);
    }

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
  }

  function setupReveal() {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach(function (element) {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  function setupSectionNav() {
    if (!("IntersectionObserver" in window)) return;

    const sectionIds = ["group", "flagships", "laboratory", "progress"];
    const links = Array.from(document.querySelectorAll('.nav a[href^="#"]'));

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            if (link.getAttribute("href") === "#" + entry.target.id) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: 0 }
    );

    sectionIds.forEach(function (id) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  function setupServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (!/^https?:$/.test(window.location.protocol)) return;

    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {
        // The site remains fully usable if offline caching is unavailable.
      });
    });
  }

  setupMenu();
  setupLanguage();
  setupHeader();
  applyLanguage(getInitialLanguage(), { persist: false, updateUrl: false });
  setupReveal();
  setupSectionNav();
  setupServiceWorker();
})();

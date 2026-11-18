/* Plotweave site script: sticky glass nav, mobile menu, OS-aware download links,
   FAQ accordion and the video player modal. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  // Download URLs are placeholders: update before publishing (see landing-page/README.md).
  var DOWNLOADS = {
    windows: { label: "Windows", href: "https://github.com/tanzir71/plotweave-site/releases/latest/download/PlotweaveSetup-3.0.0.exe" },
    macos: { label: "macOS", href: "https://github.com/tanzir71/plotweave-site/releases/latest" }
  };

  var nav = document.querySelector("[data-nav]");

  // 1. Nav gets its glass background after 40 px of scroll.
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // 2. Mobile menu.
  var menuButton = document.querySelector("[data-menu-button]");
  var panel = menuButton && document.getElementById(menuButton.getAttribute("aria-controls"));
  if (menuButton && panel) {
    var setMenu = function (open) {
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      panel.hidden = !open;
      if (nav) nav.classList.toggle("is-open", open);
    };
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuButton.focus();
      }
    });
    if (window.matchMedia) {
      var wide = window.matchMedia("(min-width: 769px)");
      var closeOnWide = function (event) { if (event.matches) setMenu(false); };
      if (wide.addEventListener) wide.addEventListener("change", closeOnWide);
      else if (wide.addListener) wide.addListener(closeOnWide);
    }
  }

  // 3. Download buttons follow the visitor's OS. Phones, tablets and Linux keep the
  //    "#download" link, which scrolls to both options.
  function detectOS() {
    var uaData = navigator.userAgentData;
    var platform = (uaData && uaData.platform) || navigator.platform || "";
    var ua = navigator.userAgent || "";
    if ((uaData && uaData.mobile) || /android|iphone|ipad|ipod/i.test(ua)) return null;
    if (/win/i.test(platform) || /windows/i.test(ua)) return "windows";
    if (/mac/i.test(platform) || /macintosh|mac os x/i.test(ua)) {
      return navigator.maxTouchPoints > 1 ? null : "macos"; // iPadOS reports itself as a Mac.
    }
    return null;
  }

  var os = detectOS();
  if (os) {
    var target = DOWNLOADS[os];
    document.querySelectorAll("[data-download]").forEach(function (link) {
      link.setAttribute("href", target.href);
      if (link.hasAttribute("data-download-label")) {
        link.textContent = "Download free for " + target.label;
      }
    });
    document.querySelectorAll("[data-os-choice]").forEach(function (link) {
      var mine = link.getAttribute("data-os-choice") === os;
      link.classList.toggle("btn-primary", mine);
      link.classList.toggle("btn-secondary", !mine);
      if (mine && link.parentElement) link.parentElement.insertBefore(link, link.parentElement.firstChild);
    });
  }

  // 4. FAQ: one answer open at a time (native with <details name>, this covers older browsers).
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item && other.open) other.open = false;
      });
    });
  });

  // 5. Player modal. Until real renders exist, it shows the poster and a "coming soon" note.
  //    To ship a video, fill data-video-mp4 (H.264) and/or data-video-webm on the trigger.
  var dialog = document.getElementById("player");
  if (dialog && typeof dialog.showModal === "function") {
    var media = dialog.querySelector("[data-player-media]");
    var titleEl = dialog.querySelector("[data-player-title]");
    var metaEl = dialog.querySelector("[data-player-meta]");
    var soon = dialog.querySelector("[data-player-soon]");
    var lastTrigger = null;

    var clearMedia = function () {
      media.querySelectorAll("video, picture").forEach(function (node) {
        if (node.tagName === "VIDEO") node.pause();
        node.remove();
      });
    };

    var openPlayer = function (trigger) {
      lastTrigger = trigger;
      clearMedia();
      var aspect = trigger.getAttribute("data-aspect") || "16 / 9";
      var portrait = aspect.replace(/\s/g, "") === "9/16";
      dialog.style.setProperty("--player-aspect", aspect);
      dialog.setAttribute("data-orientation", portrait ? "portrait" : "landscape");
      titleEl.textContent = trigger.getAttribute("data-title") || "";
      metaEl.textContent = trigger.getAttribute("data-meta") || "";
      var titleLang = trigger.getAttribute("data-title") && /[ঀ-৿]/.test(trigger.getAttribute("data-title"));
      if (titleLang) titleEl.setAttribute("lang", "bn"); else titleEl.removeAttribute("lang");

      var source = trigger.querySelector("picture");
      var fromSelector = trigger.getAttribute("data-poster-from");
      if (!source && fromSelector) source = document.querySelector(fromSelector);
      var picture = source ? source.cloneNode(true) : null;
      if (picture) {
        picture.removeAttribute("id");
        picture.querySelectorAll("source, img").forEach(function (node) {
          node.setAttribute("sizes", portrait ? "400px" : "(max-width: 992px) 100vw, 960px");
        });
        var img = picture.querySelector("img");
        if (img) {
          img.removeAttribute("loading");
          img.removeAttribute("fetchpriority");
          img.setAttribute("alt", "");
        }
      }

      var mp4 = trigger.getAttribute("data-video-mp4");
      var webm = trigger.getAttribute("data-video-webm");
      if (mp4 || webm) {
        var video = document.createElement("video");
        video.controls = true;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = "metadata";
        var posterImg = picture && picture.querySelector("img");
        if (posterImg) video.poster = posterImg.getAttribute("src");
        if (webm) {
          var webmSource = document.createElement("source");
          webmSource.src = webm;
          webmSource.type = "video/webm";
          video.appendChild(webmSource);
        }
        if (mp4) {
          var mp4Source = document.createElement("source");
          mp4Source.src = mp4;
          mp4Source.type = "video/mp4";
          video.appendChild(mp4Source);
        }
        media.insertBefore(video, media.firstChild);
        soon.hidden = true;
      } else {
        if (picture) media.insertBefore(picture, media.firstChild);
        soon.hidden = false;
      }
      dialog.showModal();
    };

    document.querySelectorAll("[data-player]").forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        openPlayer(trigger);
      });
    });

    dialog.querySelectorAll("[data-player-close]").forEach(function (button) {
      button.addEventListener("click", function () { dialog.close(); });
    });

    // Clicks on the backdrop land on the dialog element itself.
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", function () {
      clearMedia();
      if (lastTrigger) lastTrigger.focus();
    });
  }
})();

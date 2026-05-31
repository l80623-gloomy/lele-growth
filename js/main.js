(function () {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Navigation */
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  window.addEventListener("scroll", () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navMenu.classList.toggle("open", !open);
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("open");
      });
    });
  }

  /* Timeline reveal on scroll */
  const timelineItems = document.querySelectorAll(".timeline-item");
  if (timelineItems.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    timelineItems.forEach((item) => observer.observe(item));
  } else {
    timelineItems.forEach((item) => item.classList.add("visible"));
  }

  /* Gallery lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxVideo = document.getElementById("lightbox-video");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item[data-src]"));
  let currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !galleryItems.length) return;
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    const type = item.dataset.type || "image";
    const src = item.dataset.src;
    const caption = item.dataset.caption || "";

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    if (lightboxCaption) lightboxCaption.textContent = caption;

    if (type === "video" && lightboxVideo) {
      if (lightboxImg) lightboxImg.hidden = true;
      lightboxVideo.hidden = false;
      lightboxVideo.src = src;
      lightboxVideo.load();
    } else if (lightboxImg) {
      if (lightboxVideo) {
        lightboxVideo.hidden = true;
        lightboxVideo.pause();
        lightboxVideo.removeAttribute("src");
      }
      lightboxImg.hidden = false;
      lightboxImg.src = src;
      lightboxImg.alt = caption;
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute("src");
    }
    if (lightboxImg) lightboxImg.removeAttribute("src");
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", () => openLightbox(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => openLightbox(currentIndex + 1));

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (lightbox?.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(currentIndex - 1);
    if (e.key === "ArrowRight") openLightbox(currentIndex + 1);
  });
})();

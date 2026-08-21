document.addEventListener("DOMContentLoaded", () => {
  // Counter animation
  const counters = document.querySelectorAll(".counter-number, .mini-stat-num");
  const speed = 120;
  const startCounter = (counter) => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText.replace(/\D/g, "") || 0;
      const increment = Math.ceil(target / speed) || 1;
      if (count < target) {
        counter.innerText = count + increment > target ? target : count + increment;
        setTimeout(updateCount, 15);
      } else { counter.innerText = target; }
    };
    updateCount();
  };
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { startCounter(entry.target); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => counterObserver.observe(c));

  // Scroll reveal with multiple animation classes
  const revealElements = document.querySelectorAll(".reveal, .reveal-up, .reveal-scale, .reveal-left, .reveal-right");
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { 
        entry.target.classList.add("is-visible"); 
        obs.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach(el => revealObserver.observe(el));

  // Header scroll direction handler (Scroll UP = Appear, Scroll DOWN = Hide)
  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 20) {
        siteHeader.classList.remove("header-hidden");
        siteHeader.classList.add("header-visible");
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        siteHeader.classList.remove("header-visible");
        siteHeader.classList.add("header-hidden");
      } else if (currentScrollY < lastScrollY) {
        siteHeader.classList.remove("header-hidden");
        siteHeader.classList.add("header-visible");
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  // Header Navigation & Dropdowns Handler
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("is-active");
      mainNav.classList.toggle("mobile-open");
      document.body.classList.toggle("nav-locked");
    });
  }

  // Dropdown toggle buttons on mobile & touch devices
  document.querySelectorAll(".dropdown-trigger-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentLi = btn.closest(".has-dropdown");
      if (parentLi) {
        const wasOpen = parentLi.classList.contains("is-open");
        document.querySelectorAll(".has-dropdown").forEach(item => {
          if (item !== parentLi) item.classList.remove("is-open");
        });
        parentLi.classList.toggle("is-open", !wasOpen);
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".has-dropdown")) {
      document.querySelectorAll(".has-dropdown").forEach(item => item.classList.remove("is-open"));
    }
  });

  // Lightbox
  const lightbox = document.getElementById("siteLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (lightbox) {
    document.querySelectorAll(".lightbox-trigger, .portfolio-card").forEach(el => {
      el.addEventListener("click", () => {
        const src = el.getAttribute("data-lightbox");
        if (!src) return;
        lightboxImg.src = src;
        lightbox.classList.add("active");
      });
    });
    const closeBtn = document.getElementById("lightboxClose");
    if (closeBtn) closeBtn.addEventListener("click", () => lightbox.classList.remove("active"));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("active"); });
  }

  // Testimonials slider (home page)
  const track = document.getElementById("tstmTrack");
  if (track) {
    const nextBtn = document.getElementById("tstmNext");
    const dotsContainer = document.getElementById("tstmDots");
    const slides = Array.from(track.children);
    let currentIndex = 0;
    slides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.classList.add("arch-tstm-dot");
      if (idx === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
      dotsContainer.appendChild(dot);
      dot.addEventListener("click", () => { currentIndex = idx; updateSlider(); });
    });
    const dots = Array.from(dotsContainer.children);
    function updateSlider() {
      track.style.transform = `translate3d(-${currentIndex * 100}%,0,0)`;
      dots.forEach((d,i) => d.classList.toggle("active", i === currentIndex));
    }
    if (nextBtn) nextBtn.addEventListener("click", () => { currentIndex = (currentIndex+1) % slides.length; updateSlider(); });
    setInterval(() => { currentIndex = (currentIndex+1) % slides.length; updateSlider(); }, 6000);
  }

  // FAQ accordion
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  // Portfolio filters
  const filterBtns = document.querySelectorAll(".filter-btn");
  if (filterBtns.length) {
    const cards = document.querySelectorAll(".portfolio-card");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.getAttribute("data-filter");
        cards.forEach(card => {
          const show = cat === "all" || card.getAttribute("data-category") === cat;
          card.classList.toggle("hidden", !show);
        });
      });
    });
  }

  // Pune Bento Region Filters
  const puneBtns = document.querySelectorAll(".pune-filter-btn");
  if (puneBtns.length) {
    const bentoCards = document.querySelectorAll(".bento-card");
    puneBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        puneBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const region = btn.getAttribute("data-region");
        bentoCards.forEach(card => {
          const show = region === "all" || card.getAttribute("data-region") === region;
          card.classList.toggle("hidden", !show);
        });
      });
    });
  }
});

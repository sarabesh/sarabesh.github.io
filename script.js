const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const filters = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    filters.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    projectCards.forEach((card) => {
      const tags = card.dataset.tags || "";
      const show = selected === "all" || tags.includes(selected);
      card.style.display = show ? "flex" : "none";
    });
  });
});

const year = document.getElementById("year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const themeToggle = document.getElementById("themeToggle");
const THEME_KEY = "portfolio_theme";
const savedTheme = localStorage.getItem(THEME_KEY);
const hourNow = new Date().getHours();
const isDaytime = hourNow >= 7 && hourNow < 19;
const initialTheme = savedTheme || (isDaytime ? "light" : "dark");
document.body.setAttribute("data-theme", initialTheme);

function updateThemeToggleLabel() {
  if (!themeToggle) {
    return;
  }
  const isLight = document.body.getAttribute("data-theme") === "light";
  themeToggle.textContent = isLight ? "Dark Mode" : "Light Mode";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.body.setAttribute("data-theme", nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    updateThemeToggleLabel();
  });
}

updateThemeToggleLabel();

const scrollProgress = document.getElementById("scrollProgress");
const parallaxItems = document.querySelectorAll("[data-parallax]");
if (scrollProgress) {
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (scrollTop / total) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
    document.documentElement.style.setProperty("--scroll-y", `${scrollTop.toFixed(1)}px`);
    parallaxItems.forEach((element) => {
      const speed = Number(element.getAttribute("data-parallax") || "0");
      element.style.setProperty("--parallax-y", `${(scrollTop * speed).toFixed(2)}px`);
    });
  };
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();
}

const ambientCanvas = document.getElementById("ambientCanvas");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (ambientCanvas && !reducedMotion) {
  const ctx = ambientCanvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const stars = [];
  const starCount = 110;
  const pointer = { x: 0, y: 0 };

  const resizeCanvas = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    ambientCanvas.width = Math.floor(width * dpr);
    ambientCanvas.height = Math.floor(height * dpr);
    ambientCanvas.style.width = `${width}px`;
    ambientCanvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const seedStars = () => {
    stars.length = 0;
    for (let i = 0; i < starCount; i += 1) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: 0.2 + Math.random() * 0.8,
        r: 0.5 + Math.random() * 1.8,
        twinkle: Math.random() * Math.PI * 2,
        drift: 0.008 + Math.random() * 0.02
      });
    }
  };

  const draw = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < stars.length; i += 1) {
      const s = stars[i];
      s.twinkle += s.drift;

      const parallaxX = (pointer.x - w / 2) * 0.0007 * s.z;
      const parallaxY = (pointer.y - h / 2) * 0.0007 * s.z;
      const x = s.x + parallaxX * 60;
      const y = s.y + parallaxY * 60;

      const alpha = 0.2 + (Math.sin(s.twinkle) + 1) * 0.18;
      ctx.fillStyle = `rgba(217, 236, 248, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  };

  window.addEventListener("resize", () => {
    resizeCanvas();
    seedStars();
  });

  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    },
    { passive: true }
  );

  resizeCanvas();
  seedStars();
  requestAnimationFrame(draw);
}

const miniSvgMap = {
  "role-aiml": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><rect class="ms-soft" x="7" y="9" width="64" height="26" rx="4"/><path class="ms-line anim-drift" d="M13 28 L22 16 L31 28 L40 16 L49 28 L58 16 L67 28"/><circle class="ms-dot anim-pulse" cx="67" cy="28" r="3"/></svg>`,
  "role-mlops": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><rect class="ms-soft" x="8" y="9" width="14" height="24" rx="3"/><rect class="ms-soft" x="32" y="9" width="14" height="24" rx="3"/><rect class="ms-soft" x="56" y="9" width="14" height="24" rx="3"/><path class="ms-line anim-pulse" d="M22 21 L32 21 M46 21 L56 21"/></svg>`,
  "role-scientist": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><circle class="ms-soft" cx="20" cy="22" r="10"/><circle class="ms-soft" cx="40" cy="18" r="8"/><circle class="ms-soft" cx="58" cy="24" r="9"/><path class="ms-line anim-drift" d="M12 28 Q32 8 66 26"/></svg>`,
  "role-rag": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><circle class="ms-dot" cx="12" cy="30" r="3"/><circle class="ms-dot" cx="28" cy="15" r="3"/><circle class="ms-dot" cx="45" cy="25" r="3"/><circle class="ms-dot anim-pulse" cx="66" cy="12" r="3"/><path class="ms-line" d="M12 30 L28 15 L45 25 L66 12"/><path class="ms-line anim-drift" d="M12 14 L22 22 L34 18"/></svg>`,
  "sig-rag": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><path class="ms-line anim-drift" d="M8 34 L26 20 L44 26 L66 10" /><circle class="ms-dot anim-pulse" cx="8" cy="34" r="3"/><circle class="ms-dot" cx="26" cy="20" r="3"/><circle class="ms-dot" cx="44" cy="26" r="3"/><circle class="ms-dot anim-pulse" cx="66" cy="10" r="3"/></svg>`,
  "sig-db": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><ellipse class="ms-soft" cx="39" cy="10" rx="20" ry="6"/><rect class="ms-soft" x="19" y="10" width="40" height="18"/><ellipse class="ms-soft" cx="39" cy="28" rx="20" ry="6"/><path class="ms-line" d="M19 16 Q39 26 59 16"/></svg>`,
  "sig-ppo": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><path class="ms-line anim-drift" d="M8 30 C18 10, 30 36, 40 18 S60 30, 70 12"/><circle class="ms-dot anim-pulse" cx="70" cy="12" r="3"/></svg>`,
  "sig-recon": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><rect class="ms-soft" x="8" y="8" width="22" height="28" rx="3"/><rect class="ms-soft" x="48" y="8" width="22" height="28" rx="3"/><path class="ms-line anim-drift" d="M30 12 L48 12 M30 20 L48 20 M30 28 L48 28"/></svg>`,
  "sig-rerank": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><rect class="ms-soft" x="8" y="9" width="50" height="6" rx="3"/><rect class="ms-soft" x="8" y="19" width="38" height="6" rx="3"/><rect class="ms-soft" x="8" y="29" width="26" height="6" rx="3"/><path class="ms-line anim-pulse" d="M63 8 L70 14 L63 20"/></svg>`,
  "sig-recsys": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><circle class="ms-dot" cx="14" cy="28" r="3"/><circle class="ms-dot" cx="32" cy="14" r="3"/><circle class="ms-dot" cx="48" cy="24" r="3"/><circle class="ms-dot anim-pulse" cx="66" cy="12" r="3"/><path class="ms-line" d="M14 28 L32 14 L48 24 L66 12"/></svg>`,
  "sig-finetune": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><path class="ms-line" d="M8 32 L28 32 L28 12 L48 12 L48 22 L70 22"/><circle class="ms-dot anim-pulse" cx="70" cy="22" r="3"/><rect class="ms-soft" x="8" y="8" width="10" height="10" rx="2"/></svg>`,
  "sig-transformer": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><rect class="ms-soft" x="8" y="10" width="16" height="24" rx="3"/><rect class="ms-soft" x="31" y="10" width="16" height="24" rx="3"/><rect class="ms-soft" x="54" y="10" width="16" height="24" rx="3"/><path class="ms-line anim-drift" d="M24 22 L31 22 M47 22 L54 22"/></svg>`,
  "sig-deepvo": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><path class="ms-line" d="M8 30 L26 26 L44 18 L70 12"/><path class="ms-line anim-drift" d="M8 34 L26 30 L44 22 L70 16"/><circle class="ms-dot" cx="70" cy="12" r="3"/></svg>`,
  "sig-bertops": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><rect class="ms-soft" x="8" y="10" width="14" height="24" rx="3"/><rect class="ms-soft" x="30" y="10" width="14" height="24" rx="3"/><rect class="ms-soft" x="52" y="10" width="18" height="24" rx="3"/><path class="ms-line anim-pulse" d="M22 22 L30 22 M44 22 L52 22"/></svg>`,
  "sig-ner": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><rect class="ms-soft" x="8" y="12" width="62" height="20" rx="4"/><path class="ms-line" d="M14 22 L24 22 M30 22 L40 22 M46 22 L56 22"/><circle class="ms-dot anim-pulse" cx="62" cy="22" r="3"/></svg>`,
  "sig-vit": `<svg class="mini-svg" viewBox="0 0 78 44" aria-hidden="true"><rect class="ms-soft" x="8" y="8" width="62" height="28" rx="3"/><path class="ms-line" d="M8 18 H70 M8 28 H70 M23 8 V36 M39 8 V36 M55 8 V36"/></svg>`
};

document.querySelectorAll(".project-art").forEach((tile) => {
  const key = Object.keys(miniSvgMap).find((cls) => tile.classList.contains(cls));
  if (key && !tile.querySelector(".mini-svg")) {
    tile.insertAdjacentHTML("beforeend", miniSvgMap[key]);
  }
});

const copyEmailButton = document.getElementById("copyEmailBtn");
if (copyEmailButton) {
  copyEmailButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("sarabeshnr@gmail.com");
      copyEmailButton.textContent = "Email Copied";
      setTimeout(() => {
        copyEmailButton.textContent = "Copy Email";
      }, 1300);
    } catch {
      copyEmailButton.textContent = "Copy Failed";
      setTimeout(() => {
        copyEmailButton.textContent = "Copy Email";
      }, 1300);
    }
  });
}

if (!reducedMotion) {
  // Keep motion subtle for recruiter readability.
}

const timelineItems = document.querySelectorAll(".timeline-item");
if (timelineItems.length > 0) {
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-active", entry.isIntersecting);
      });
    },
    { threshold: 0.6 }
  );
  timelineItems.forEach((item) => timelineObserver.observe(item));
}

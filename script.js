const navLinks = Array.from(document.querySelectorAll("nav.side a[data-nav]"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveSection(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((section) => sectionObserver.observe(section));
} else if (sections[0]) {
  setActiveSection(sections[0].id);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveSection(link.hash.slice(1)));
});

const themeToggle = document.getElementById("themeToggle");
const themeKey = "portfolio-theme";
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
let savedTheme = null;
try { savedTheme = localStorage.getItem(themeKey); } catch (e) {}
const initialTheme = savedTheme || preferredTheme;

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  }
}

applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try { localStorage.setItem(themeKey, nextTheme); } catch (e) {}
  });
}

// Refresh star counts from GitHub; the numbers in the HTML are the fallback.
const repoCards = document.querySelectorAll("a.card[data-repo]");
if (repoCards.length && "fetch" in window) {
  fetch("https://api.github.com/users/sarabesh/repos?per_page=100")
    .then((response) => (response.ok ? response.json() : []))
    .then((repos) => {
      const stars = new Map(repos.map((repo) => [repo.name, repo.stargazers_count]));
      repoCards.forEach((card) => {
        const count = stars.get(card.dataset.repo);
        if (!count) return;
        let badge = card.querySelector(".stars");
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "stars";
          badge.innerHTML = "★ <span data-stars></span>";
          card.appendChild(badge);
        }
        badge.querySelector("[data-stars]").textContent = count;
        badge.setAttribute("aria-label", `${count} GitHub stars`);
      });
    })
    .catch(() => {});
}

// GitHub Pages serves Last-Modified from the deploy, so this tracks the last push.
const updated = document.getElementById("year");
if (updated) {
  const modified = new Date(document.lastModified);
  const date = Number.isNaN(modified.getTime()) ? new Date() : modified;
  updated.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reading progress bar.
const progress = document.getElementById("progress");
if (progress) {
  let ticking = false;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();
}

// Count the highlight numbers up from zero, keeping the surrounding text ("+ yrs", "%", "→").
function countUp(element) {
  const template = element.textContent;
  const start = performance.now();
  const duration = 1100;
  const frame = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    element.textContent = template.replace(/\d+/g, (n) => Math.round(Number(n) * eased));
    if (t < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

// Ease sections in as they scroll into view. Classes are added here so content stays visible without JS.
if ("IntersectionObserver" in window && !reduceMotion) {
  const revealTargets = document.querySelectorAll(".stats, .about-copy, main > section");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        if (entry.target.classList.contains("stats")) {
          entry.target.querySelectorAll("dt").forEach(countUp);
        }
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });
}

// Spotlight that follows the cursor across project cards.
document.querySelectorAll("a.card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--y", `${event.clientY - rect.top}px`);
  });
});

// Project filters.
const filterButtons = document.querySelectorAll(".filter[data-filter]");
const filterable = document.querySelectorAll("#projects [data-tags]");
const moreProjects = document.querySelector(".more-projects");
const filterStatus = document.getElementById("filterStatus");
let openedByFilter = false;

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));

    let shown = 0;
    let shownInMore = 0;
    filterable.forEach((item) => {
      const match = filter === "all" || item.dataset.tags.split(" ").includes(filter);
      item.hidden = !match;
      if (match) {
        shown += 1;
        if (moreProjects && moreProjects.contains(item)) shownInMore += 1;
      }
    });

    if (moreProjects) {
      if (filter !== "all" && shownInMore && !moreProjects.open) {
        moreProjects.open = true;
        openedByFilter = true;
      } else if (filter === "all" && openedByFilter) {
        moreProjects.open = false;
        openedByFilter = false;
      }
    }

    if (filterStatus) {
      filterStatus.textContent = filter === "all" ? "" : `Showing ${shown} of ${filterable.length} projects.`;
    }
  });
});

// Copy-to-clipboard buttons.
document.querySelectorAll(".copy[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = "Copied ✓";
      button.classList.add("done");
      setTimeout(() => {
        button.textContent = "Copy";
        button.classList.remove("done");
      }, 1800);
    } catch (e) {
      button.textContent = "Press Ctrl+C";
    }
  });
});

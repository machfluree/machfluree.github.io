const NAME = "this is Machfluree";
const EMAIL = "ailoncollado.dev@gmail.com";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

(function applyStoredTheme() {
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
})();

function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  const isDark = () => document.documentElement.getAttribute("data-theme") === "dark";
  btn.setAttribute("aria-pressed", String(isDark()));

  btn.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    btn.setAttribute("aria-pressed", String(next === "dark"));
  });
}

function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

function typeWhoami() {
  const el = document.getElementById("whoami-name");
  if (prefersReducedMotion) {
    el.textContent = NAME;
    return;
  }
  let i = 0;
  el.innerHTML = '<span class="cursor"></span>';
  const interval = setInterval(() => {
    i++;
    el.innerHTML = NAME.slice(0, i) + '<span class="cursor"></span>';
    if (i >= NAME.length) clearInterval(interval);
  }, 55);
}

function initScrollSpy() {
  const links = document.querySelectorAll(".routes a");
  const sections = [...links].map(link => document.getElementById(link.dataset.route));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.classList.remove("active"));
        const active = document.querySelector(`.routes a[data-route="${entry.target.id}"]`);
        if (active) active.classList.add("active");
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach(section => section && observer.observe(section));
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`
      ${message}\n\n
      Kind regards,\n
      ${name}
      ${email}
    `);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    status.textContent = "Opening your email client…";
    status.classList.add("visible");
  });
}

function initCopyEmail() {
  const btn = document.getElementById("copy-email-btn");

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch (err) {
      const temp = document.createElement("textarea");
      temp.value = EMAIL;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }
    const original = btn.textContent;
    btn.textContent = "Copied";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("copied");
    }, 1800);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  typeWhoami();
  initScrollSpy();
  initContactForm();
  initCopyEmail();
  initThemeToggle();
});

console.log("GET /easter-egg → 200 OK");
console.log("Nothing shady in here, just markup, styles, and a few event listeners.");
console.log(`Say hi: ${EMAIL}`);

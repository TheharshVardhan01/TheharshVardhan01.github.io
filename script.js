// ================= Theme =================
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) root.dataset.theme = savedTheme;
document.getElementById("theme-toggle").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
});

// ================= Mobile menu =================
const menuBtn = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ================= Role typewriter =================
const roles = [
  "computer vision engineer",
  "agentic ai builder",
  "railway ai researcher",
  "gnn explorer @ iit kgp",
  "rag system tinkerer",
];
const roleEl = document.getElementById("role-text");
if (!reduceMotion) {
  let ri = 0, ci = roles[0].length, deleting = true;
  (function typeLoop() {
    const word = roles[ri];
    if (deleting) {
      ci--;
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    } else {
      ci++;
      if (ci === roles[ri].length) {
        deleting = true;
        roleEl.textContent = roles[ri].slice(0, ci);
        setTimeout(typeLoop, 2200);
        return;
      }
    }
    roleEl.textContent = (deleting ? word : roles[ri]).slice(0, ci);
    setTimeout(typeLoop, deleting ? 40 : 75);
  })();
}

// ================= Network canvas (GNN nod) =================
const canvas = document.getElementById("net-canvas");
const ctx = canvas.getContext("2d");
let nodes = [], W, H, rafId;
const mouse = { x: -9999, y: -9999 };

function canvasColors() {
  const dark = root.dataset.theme === "dark";
  return {
    node: dark ? "rgba(34,211,238,0.65)" : "rgba(8,145,178,0.55)",
    edge: dark ? "34,211,238" : "8,145,178",
  };
}
function initCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  W = canvas.width = rect.width * devicePixelRatio;
  H = canvas.height = rect.height * devicePixelRatio;
  const count = Math.min(90, Math.floor(rect.width / 14));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
    vy: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
    r: (Math.random() * 1.6 + 0.8) * devicePixelRatio,
  }));
}
function drawNet() {
  const { node, edge } = canvasColors();
  ctx.clearRect(0, 0, W, H);
  const linkDist = 130 * devicePixelRatio;
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    a.x += a.vx; a.y += a.vy;
    if (a.x < 0 || a.x > W) a.vx *= -1;
    if (a.y < 0 || a.y > H) a.vy *= -1;
    // gentle attraction to mouse
    const dxm = mouse.x - a.x, dym = mouse.y - a.y;
    const dm = Math.hypot(dxm, dym);
    if (dm < 200 * devicePixelRatio && dm > 1) {
      a.x += (dxm / dm) * 0.25;
      a.y += (dym / dm) * 0.25;
    }
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
    ctx.fillStyle = node;
    ctx.fill();
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < linkDist) {
        ctx.strokeStyle = `rgba(${edge},${(1 - d / linkDist) * 0.32})`;
        ctx.lineWidth = devicePixelRatio * 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  rafId = requestAnimationFrame(drawNet);
}
if (!reduceMotion) {
  initCanvas();
  drawNet();
  window.addEventListener("resize", () => { cancelAnimationFrame(rafId); initCanvas(); drawNet(); });
  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * devicePixelRatio;
    mouse.y = (e.clientY - rect.top) * devicePixelRatio;
  });
}

// ================= Scroll progress + train =================
const progressBar = document.getElementById("progress-bar");
const train = document.getElementById("rail-train");
const railTrack = document.querySelector(".rail-track");
function onScroll() {
  const doc = document.documentElement;
  const p = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
  progressBar.style.width = `${p * 100}%`;
  if (train && railTrack) {
    const rect = railTrack.getBoundingClientRect();
    const mid = window.innerHeight * 0.45;
    const t = Math.min(Math.max((mid - rect.top) / rect.height, 0), 0.97);
    train.style.top = `${t * 100}%`;
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ================= Reveal on scroll =================
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); }
  }),
  { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ================= 3D tilt cards =================
if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${py * -6}deg) translateY(-2px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

// ================= Lightbox =================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCap = document.getElementById("lightbox-cap");
document.querySelectorAll(".shot").forEach((fig) => {
  fig.addEventListener("click", () => {
    lightboxImg.src = fig.dataset.full;
    lightboxImg.alt = fig.querySelector("img").alt;
    lightboxCap.textContent = fig.querySelector("figcaption").textContent;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  });
});
function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = "";
  document.body.style.overflow = "";
}
document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });

// ================= Active nav link =================
const sections = [...document.querySelectorAll("section[id]")];
const linkFor = {};
navLinks.querySelectorAll("a").forEach((a) => { linkFor[a.getAttribute("href").slice(1)] = a; });
const navObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      Object.values(linkFor).forEach((a) => a.classList.remove("active"));
      linkFor[e.target.id]?.classList.add("active");
    }
  }),
  { rootMargin: "-35% 0px -55% 0px" }
);
sections.forEach((s) => navObserver.observe(s));

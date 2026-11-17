/* ── Sidebar ── */
function openNav() {
  document.getElementById("mySidebar").style.width = "240px";
  document.getElementById("main").style.marginLeft = "240px";
}
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

/* ── Carrossel centralizado com drag ── */
document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const dots   = Array.from(document.querySelectorAll(".carousel-dot"));
  const total  = slides.length;
  let current  = 0;
  let dragging = false, startX = 0, dragDelta = 0;

  /* Posições relativas ao centro */
  function posClass(idx) {
    const diff = ((idx - current) % total + total) % total;
    if (diff === 0)             return "pos-center";
    if (diff === 1)             return "pos-right";
    if (diff === total - 1)     return "pos-left";
    if (diff === 2)             return "pos-far-right";
    if (diff === total - 2)     return "pos-far-left";
    return "pos-hidden";
  }

  function render() {
    slides.forEach((s, i) => {
      s.className = "carousel-slide " + posClass(i);
    });
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  function goTo(n) {
    current = ((n % total) + total) % total;
    render();
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  document.querySelector(".carousel-btn.next").addEventListener("click", next);
  document.querySelector(".carousel-btn.prev").addEventListener("click", prev);
  dots.forEach((d, i) => d.addEventListener("click", () => goTo(i)));

  /* Clique nas laterais avança/volta */
  slides.forEach((s, i) => {
    s.addEventListener("click", () => {
      if (Math.abs(dragDelta) > 4) return;

      const cls = s.className;

      if (cls.includes("pos-center")) {
        if (s.dataset.link) {
          window.open(s.dataset.link, "_blank", "noopener,noreferrer");
          return;
        }

        const image = s.querySelector("img");

        popupImage.src = image.src;
        popupTitle.textContent = s.dataset.title;
        popupDescription.textContent = s.dataset.description;

        popupOverlay.classList.add("active");
        return;
      }

      if (cls.includes("pos-right") || cls.includes("pos-far-right")) next();
      if (cls.includes("pos-left")  || cls.includes("pos-far-left"))  prev();
    });
  });

  /* ── Drag (mouse + touch) ── */
  const outer = document.querySelector(".carousel-outer");

  function onStart(x) { dragging = true; startX = x; dragDelta = 0; }
  function onMove(x)  { if (!dragging) return; dragDelta = x - startX; }
  function onEnd()    {
    if (!dragging) return;
    dragging = false;
    if (dragDelta < -50)      next();
    else if (dragDelta > 50)  prev();
    dragDelta = 0;
  }

  outer.addEventListener("mousedown",  e => onStart(e.clientX));
  window.addEventListener("mousemove", e => onMove(e.clientX));
  window.addEventListener("mouseup",   onEnd);

  outer.addEventListener("touchstart", e => onStart(e.touches[0].clientX), {passive:true});
  outer.addEventListener("touchmove",  e => onMove(e.touches[0].clientX),  {passive:true});
  outer.addEventListener("touchend",   onEnd);

  render();


/* ── POP-UP DOS PROJETOS ── */
const popupOverlay = document.getElementById("popupOverlay");
const popupImage = document.getElementById("popupImage");
const popupTitle = document.getElementById("popupTitle");
const popupDescription = document.getElementById("popupDescription");
const popupClose = document.getElementById("popupClose");

popupClose.addEventListener("click", () => {
  popupOverlay.classList.remove("active");
});

popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) {
    popupOverlay.classList.remove("active");
  }
});

});

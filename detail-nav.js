(() => {
  if (window.__eminusDetailBackInjected) return;
  window.__eminusDetailBackInjected = true;

  if (!location.pathname.startsWith("/aplicativoEminus/actividad-detalle")) {
    return;
  }

  const btn = document.createElement("button");
  btn.id = "ep-back-home-btn";
  btn.type = "button";
  btn.textContent = "Volver a Eminus";
  btn.addEventListener("click", () => {
    window.location.assign(`${location.origin}/eminus4/page/course/list`);
  });

  document.body.appendChild(btn);

  function showCelebration() {
    if (document.getElementById("ep-celebration-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "ep-celebration-overlay";

    const colors = [
      "#ff2d55", "#ff6b6b", "#ffd93d", "#6bcb77",
      "#4d96ff", "#9b59b6", "#ff8a5c", "#00d2ff",
      "#f8a5c2", "#7bed9f", "#e056fd", "#f0932b"
    ];

    for (let i = 0; i < 120; i++) {
      const piece = document.createElement("div");
      piece.className = "ep-confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.top = -(Math.random() * 20 + 10) + "px";
      piece.style.animationDelay = Math.random() * 2.5 + "s";
      piece.style.animationDuration = (Math.random() * 2 + 3) + "s";

      if (Math.random() > 0.6) {
        piece.className += " ep-confetti-emoji";
        const emojis = ["🎉", "✨", "🌟", "🎊", "💫", "⭐", "🔥", "💯"];
        piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        piece.style.fontSize = (Math.random() * 20 + 16) + "px";
      } else {
        piece.style.width = (Math.random() * 12 + 6) + "px";
        piece.style.height = (Math.random() * 14 + 6) + "px";
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        if (Math.random() > 0.5) {
          piece.style.borderRadius = "2px";
        }
        if (Math.random() > 0.7) {
          piece.style.borderRadius = "50%";
        }
      }

      const animVariation = Math.floor(Math.random() * 4);
      piece.style.animationName = "ep-confetti-fall-" + (animVariation + 1);

      overlay.appendChild(piece);
    }

    document.body.appendChild(overlay);

    const dismiss = () => {
      if (!overlay.parentNode) return;
      overlay.classList.add("ep-celebration-fadeout");
      setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
      }, 600);
    };

    overlay.addEventListener("click", dismiss, { once: true });

    setTimeout(dismiss, 5000);
  }

  const SUBMIT_KEYWORDS = [
    "entregar", "entregar tarea", "entregar actividad", "entregar trabajo",
    "enviar tarea", "enviar actividad", "enviar trabajo", "enviar",
    "subir tarea", "subir actividad", "subir trabajo", "subir",
    "guardar", "guardar tarea", "guardar actividad",
    "submit", "send", "upload"
  ];

  function looksLikeSubmitButton(el) {
    if (!el || el.disabled) return false;
    if (el.offsetParent === null) return false;

    const tag = el.tagName.toLowerCase();
    const type = (el.getAttribute("type") || "").toLowerCase();

    if ((tag === "button" || tag === "input") && type === "submit") return true;

    const text = (el.textContent || el.value || el.getAttribute("aria-label") || "").toLowerCase().trim();
    if (!text) return false;

    return SUBMIT_KEYWORDS.some(k => text.includes(k));
  }

  let celebrationTimeout = null;
  function scheduleCelebration() {
    if (celebrationTimeout) return;
    celebrationTimeout = setTimeout(() => {
      celebrationTimeout = null;
      showCelebration();
    }, 800);
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest('button, input[type="submit"], input[type="button"], a.btn, a.button, [role="button"], .btn');
    if (!btn) return;
    if (!looksLikeSubmitButton(btn)) return;
    scheduleCelebration();
  });

  document.addEventListener("submit", () => {
    scheduleCelebration();
  });

})();

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

    for (let i = 0; i < 200; i++) {
      const piece = document.createElement("div");
      piece.className = "ep-confetti-piece";

      const startX = Math.random() * 100;
      const endX = startX + (Math.random() * 20 - 10);

      piece.style.setProperty('--start-x', startX + 'vw');
      piece.style.setProperty('--end-x', endX + 'vw');
      piece.style.setProperty('--rot-x', (Math.random() * 1440 - 720) + 'deg');
      piece.style.setProperty('--rot-y', (Math.random() * 1440 - 720) + 'deg');
      piece.style.setProperty('--rot-z', (Math.random() * 1440 - 720) + 'deg');
      piece.style.setProperty('--scale', (Math.random() * 0.7 + 0.5).toString());
      piece.style.setProperty('--fall-duration', (Math.random() * 4 + 3) + 's');
      piece.style.setProperty('--fall-delay', (Math.random() * 2) + 's');

      if (Math.random() > 0.8) {
        piece.className += " ep-confetti-emoji";
        const emojis = ["🎉", "✨", "🌟", "🎊", "💫", "⭐", "🔥", "💯", "🎈", "🥳"];
        piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        piece.style.fontSize = (Math.random() * 24 + 14) + "px";
      } else {
        piece.style.width = (Math.random() * 14 + 6) + "px";
        piece.style.height = (Math.random() * 16 + 8) + "px";
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        if (Math.random() > 0.5) {
          piece.style.borderRadius = "3px";
        }
        if (Math.random() > 0.7) {
          piece.style.borderRadius = "50%";
        }
        if (Math.random() > 0.8) {
          piece.style.width = (Math.random() * 4 + 2) + "px";
          piece.style.height = (Math.random() * 20 + 10) + "px";
        }
      }

      overlay.appendChild(piece);
    }

    // Cat ASCII + delivered text
    const catWrap = document.createElement("div");
    catWrap.className = "ep-celebration-cat-wrap";

    const cat = document.createElement("pre");
    cat.className = "ep-celebration-cat";
    cat.textContent = [
      " ▒▒▒ ▒▒▒",
      " ▒▒▒▒ ▒▒▒▒",
      " ▒▒▒▒▒▒▒░░░░░░▒▒▒▒",
      " ▒▒░░░▒▒▒░░▒▒▒░▒▒",
      " ▒▒▓▒▓▒░░░░▒▒▓█▓▒",
      "▒░▒▓▓▓▒▒▒░░░▒▒▓▓▒▒",
      "░▒▒░░░░░░▒▒▒▒▒▒▒▒▒",
      "░░▒▒▒░░░▒▓▓▓▓▓▓▒▒▒",
      "░░░▒░░░░░▒▓▓█▓▒▒▒▒",
      "░░░░░░▒▒▒▒▒▓▓▓▓▓▓▒▒",
      "░░░░░░░▒▒▓▓▓▓▓▓▓▓",
      "░░░░░░▒▒▒▒▓▓▓▓▓▓▓"
    ].join("\n");
    catWrap.appendChild(cat);

    const txt = document.createElement("pre");
    txt.className = "ep-celebration-cat-text";
    txt.textContent = [
      " _____                                 _                            _       ",
      "|_   _|_ _ _ __ ___  __ _    ___ _ __ | |_ _ __ ___  __ _  __ _  __| | __ _ ",
      "  | |/ _` | '__/ _ \\/ _` |  / _ \\ '_ \\| __| '__/ _ \\/ _` |/ _` |/ _` |/ _` |",
      "  | | (_| | | |  __/ (_| | |  __/ | | | |_| | |  __/ (_| | (_| | (_| | (_| |",
      "  |_|\\__,_|_|  \\___|\\__,_|  \\___|_| |_|\\__|_|  \\___|\\__, |\\__,_|\\__,_|\\__,_|",
      "                                                    |___/ "
    ].join("\n");
    catWrap.appendChild(txt);
    overlay.appendChild(catWrap);

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

  function showAbductionAnimation() {
    if (document.getElementById("ep-abduction-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "ep-abduction-overlay";

    // Stars
    for (let i = 0; i < 60; i++) {
      const star = document.createElement("div");
      star.className = "ep-abduction-star";
      const size = Math.random() * 3 + 1;
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.top = Math.random() * 100 + "%";
      star.style.left = Math.random() * 100 + "%";
      star.style.animationDelay = Math.random() * 2 + "s";
      overlay.appendChild(star);
    }

    // Ground
    const ground = document.createElement("div");
    ground.className = "ep-abduction-ground";
    overlay.appendChild(ground);

    // UFO wrap
    const ufoWrap = document.createElement("div");
    ufoWrap.className = "ep-abduction-ufo-wrap";

    const ufo = document.createElement("div");
    ufo.className = "ep-abduction-ufo";
    ufo.innerHTML = `
      <svg width="160" height="80" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.5));">
        <path d="M40 40C40 17.9086 57.9086 0 80 0C102.091 0 120 17.9086 120 40" fill="#A5F3FC" fill-opacity="0.6" stroke="#0891B2" stroke-width="2"/>
        <ellipse cx="80" cy="45" rx="75" ry="25" fill="#94A3B8" stroke="#334155" stroke-width="3"/>
        <ellipse cx="80" cy="45" rx="65" ry="18" fill="#CBD5E1"/>
        <circle cx="20" cy="55" r="4" fill="#FACC15"><animate attributeName="opacity" values="1;0.4;1" dur="0.5s" repeatCount="indefinite"/></circle>
        <circle cx="50" cy="55" r="4" fill="#FACC15"><animate attributeName="opacity" values="1;0.4;1" dur="0.5s" begin="0.1s" repeatCount="indefinite"/></circle>
        <circle cx="80" cy="55" r="4" fill="#FACC15"><animate attributeName="opacity" values="1;0.4;1" dur="0.5s" begin="0.2s" repeatCount="indefinite"/></circle>
        <circle cx="110" cy="55" r="4" fill="#FACC15"><animate attributeName="opacity" values="1;0.4;1" dur="0.5s" begin="0.3s" repeatCount="indefinite"/></circle>
        <circle cx="140" cy="55" r="4" fill="#FACC15"><animate attributeName="opacity" values="1;0.4;1" dur="0.5s" begin="0.4s" repeatCount="indefinite"/></circle>
        <line x1="80" y1="0" x2="80" y2="-10" stroke="#334155" stroke-width="2"/>
        <circle cx="80" cy="-12" r="3" fill="#EF4444"/>
      </svg>
    `;

    // Beam
    const beam = document.createElement("div");
    beam.className = "ep-abduction-beam";
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.className = "ep-abduction-particle";
      p.style.left = (Math.random() * 80 + 10) + "%";
      p.style.animation = `ep-beam-particle-up ${1.5 + Math.random()}s linear infinite`;
      p.style.animationDelay = Math.random() * 1.5 + "s";
      beam.appendChild(p);
    }

    // Cow wrap
    const cowWrap = document.createElement("div");
    cowWrap.className = "ep-abduction-cow-wrap";
    const cow = document.createElement("div");
    cow.className = "ep-abduction-cow";
    cow.innerHTML = `
      <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
        <rect x="15" y="15" width="50" height="30" rx="15" fill="white" stroke="#333" stroke-width="2"/>
        <circle cx="25" cy="25" r="5" fill="#333"/>
        <circle cx="50" cy="35" r="7" fill="#333"/>
        <circle cx="60" cy="20" r="4" fill="#333"/>
        <rect x="55" y="10" width="20" height="25" rx="8" fill="white" stroke="#333" stroke-width="2"/>
        <ellipse cx="55" cy="12" rx="4" ry="6" fill="white" stroke="#333" stroke-width="2" transform="rotate(-20 55 12)"/>
        <ellipse cx="75" cy="12" rx="4" ry="6" fill="white" stroke="#333" stroke-width="2" transform="rotate(20 75 12)"/>
        <ellipse cx="65" cy="28" rx="8" ry="5" fill="#FFC0CB" stroke="#333" stroke-width="2"/>
        <circle cx="62" cy="28" r="1.5" fill="#333"/>
        <circle cx="68" cy="28" r="1.5" fill="#333"/>
        <circle cx="60" cy="20" r="2" fill="#333"/>
        <circle cx="70" cy="20" r="2" fill="#333"/>
        <rect x="25" y="45" width="4" height="10" fill="white" stroke="#333" stroke-width="2"/>
        <rect x="45" y="45" width="4" height="10" fill="white" stroke="#333" stroke-width="2"/>
        <path d="M15 30 Q5 30 5 20" stroke="#333" stroke-width="2" fill="none"/>
      </svg>
    `;
    cowWrap.appendChild(cow);

    ufo.appendChild(beam);
    ufoWrap.appendChild(ufo);
    overlay.appendChild(ufoWrap);
    overlay.appendChild(cowWrap);
    document.body.appendChild(overlay);

    // Cat message at the end
    const catMsg = document.createElement("div");
    catMsg.className = "ep-abduction-cat-msg";

    const catAscii = document.createElement("pre");
    catAscii.className = "ep-abduction-cat-art";
    catAscii.textContent = [
      "  ▒▒▒▒ ▒▒▒▒",
      " ▒▒▒▒▒▒▒░░░░░░▒▒▒▒",
      " ▒▒░░░▒▒▒░░▒▒▒░▒▒",
      " ▒▒▓▒▓▒░░░░▒▒▓█▓▒",
      "▒░▒▓▓▓▒▒▒░░░▒▒▓▓▒▒",
      "░▒▒░░░░░░▒▒▒▒▒▒▒▒▒",
      "░░▒▒▒░░░▒▓▓▓▓▓▓▒▒▒",
      "░░░▒░░░░░▒▓▓█▓▒▒▒▒",
      "░░░░░░▒▒▒▒▒▓▓▓▓▓▓▒▒",
      "░░░░░░░▒▒▓▓▓▓▓▓▓▓",
      "░░░░░░▒▒▒▒▓▓▓▓▓▓▓"
    ].join("\n");
    catMsg.appendChild(catAscii);

    const txtAscii = document.createElement("pre");
    txtAscii.className = "ep-abduction-cat-text";
    txtAscii.textContent = [
      " _____                                 _                            _       ",
      "|_   _|_ _ _ __ ___  __ _    ___ _ __ | |_ _ __ ___  __ _  __ _  __| | __ _ ",
      "  | |/ _` | '__/ _ \\/ _` |  / _ \\ '_ \\| __| '__/ _ \\/ _` |/ _` |/ _` |/ _` |",
      "  | | (_| | | |  __/ (_| | |  __/ | | | |_| | |  __/ (_| | (_| | (_| | (_| |",
      "  |_|\\__,_|_|  \\___|\\__,_|  \\___|_| |_|\\__|_|  \\___|\\__, |\\__,_|\\__,_|\\__,_|",
      "                                                    |___/ "
    ].join("\n");
    catMsg.appendChild(txtAscii);
    overlay.appendChild(catMsg);

    // Animation phases
    setTimeout(() => {
      ufo.classList.add("abducting");
      beam.classList.add("active");
      cow.classList.add("abducting");
    }, 2000);

    setTimeout(() => {
      ufo.classList.remove("abducting");
      ufo.classList.add("leaving");
      beam.classList.remove("active");
      beam.classList.add("leaving");
      cowWrap.style.opacity = "0";
    }, 5000);

    setTimeout(() => {
      catMsg.classList.add("visible");
    }, 5200);

    const dismiss = () => {
      if (!overlay.parentNode) return;
      overlay.classList.add("ep-abduction-fadeout");
      setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
      }, 400);
    };

    overlay.addEventListener("click", dismiss, { once: true });
    setTimeout(dismiss, 7200);
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
      const useAbduction = sessionStorage.getItem("ep_use_abduction") === "1";
      if (useAbduction) {
        showAbductionAnimation();
      } else {
        showCelebration();
      }
      sessionStorage.setItem("ep_use_abduction", useAbduction ? "0" : "1");
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

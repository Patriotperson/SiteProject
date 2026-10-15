console.log("Website loaded.");
(function () {
 const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 1. Ink-draw header letters */
  document.querySelectorAll("header h1").forEach((h1) => {
    if (h1.dataset.inked) return;
    h1.dataset.inked = "1";
    const text = h1.textContent;
    h1.textContent = "";
    [...text].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "ink-letter";
      s.textContent = ch === " " ? "\u00A0" : ch;
      s.style.animationDelay = reduced ? "0s" : `${Math.min(i * 0.035, 1.2)}s`;
      h1.appendChild(s);
    });
  });

/* 3. Chart sea canvas (fixed background) + soundings */
  const canvas = document.createElement("canvas");
  canvas.id = "chart-sea";
  document.body.prepend(canvas);
  const vignette = document.createElement("div");
  vignette.className = "chart-vignette";
  document.body.prepend(vignette);
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, t = 0;
  const soundingsLayer = document.createElement("div");
  soundingsLayer.className = "soundings";
  document.body.appendChild(soundingsLayer);

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

// scattered depth soundings like old charts
  const soundings = Array.from({ length: 26 }, () => ({
    x: Math.random(), y: Math.random(),
    v: [4, 7, 12, 18, 24, 31, 42][Math.floor(Math.random() * 7)],
    s: 0.6 + Math.random() * 0.8
  }));
  function paintSoundings() {
    soundingsLayer.innerHTML = soundings.map(s =>
      `<span style="position:absolute;left:${s.x * 100}%;top:${s.y * 100}%;font-size:${12 * s.s + 8}px">${s.v}</span>`
    ).join("");
  }
  paintSoundings();

  function drawSea() {
    ctx.clearRect(0, 0, W, H);
    t += 0.008;
    // drifting depth contours
    ctx.lineWidth = 1;
    for (let k = 0; k < 7; k++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(21,94,117,${0.10 + k * 0.015})`;
      for (let x = -20; x <= W + 20; x += 14) {
        const y = H * 0.25 + k * 46 + Math.sin(x * 0.008 + t * (1 + k * 0.22) + k * 1.7) * 22 + Math.cos(x * 0.003 - t * 0.7) * 14;
        if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    if (!reduced) requestAnimationFrame(drawSea);
  }
  drawSea();

 /* 6. Tide footer */
  if (!document.querySelector(".tide-footer")) {
    const f = document.createElement("footer");
    f.className = "tide-footer";
    f.innerHTML = `<div class="tide-line"></div><div>⚓ Fair winds & following seas — <strong>David Pollard</strong> · Sea Scout Boatswain · <span id="tide-year"></span></div>`;
    document.body.appendChild(f);
    const yEl = f.querySelector("#tide-year");
    if (yEl) yEl.textContent = new Date().getFullYear();
  }
})();

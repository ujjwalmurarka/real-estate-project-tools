// ============================================================
// Ranchi Tower — floating mini calculator (shared across all pages)
// Plain arithmetic scratchpad, no ties to app data. Injects a floating
// toggle button + popup panel into <body> on load.
// ============================================================

(function () {
  function buildCalculator() {
    const wrap = document.createElement("div");
    wrap.className = "mini-calc-wrap";
    wrap.innerHTML =
      '<button class="mini-calc-toggle" id="mini-calc-toggle" aria-label="Open calculator" aria-expanded="false">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><circle cx="8" cy="11" r="1"></circle><circle cx="12" cy="11" r="1"></circle><circle cx="16" cy="11" r="1"></circle><circle cx="8" cy="15" r="1"></circle><circle cx="12" cy="15" r="1"></circle><circle cx="16" cy="15" r="1"></circle><circle cx="8" cy="19" r="1"></circle><circle cx="12" cy="19" r="1"></circle><circle cx="16" cy="19" r="1"></circle></svg>' +
      '</button>' +
      '<div class="mini-calc-panel" id="mini-calc-panel" hidden>' +
        '<div class="mini-calc-head"><span>Calculator</span><button class="mini-calc-close" id="mini-calc-close" aria-label="Close calculator">&times;</button></div>' +
        '<div class="mini-calc-display" id="mini-calc-display">0</div>' +
        '<div class="mini-calc-grid">' +
          '<button data-act="clear">C</button>' +
          '<button data-act="back">&larr;</button>' +
          '<button data-act="percent">%</button>' +
          '<button data-op="/">&divide;</button>' +
          '<button data-num="7">7</button>' +
          '<button data-num="8">8</button>' +
          '<button data-num="9">9</button>' +
          '<button data-op="*">&times;</button>' +
          '<button data-num="4">4</button>' +
          '<button data-num="5">5</button>' +
          '<button data-num="6">6</button>' +
          '<button data-op="-">&minus;</button>' +
          '<button data-num="1">1</button>' +
          '<button data-num="2">2</button>' +
          '<button data-num="3">3</button>' +
          '<button data-op="+">+</button>' +
          '<button data-num="0" class="mini-calc-zero">0</button>' +
          '<button data-act="dot">.</button>' +
          '<button data-act="equals" class="mini-calc-eq">=</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
    wireCalculator(wrap);
  }

  function wireCalculator(wrap) {
    const toggle = wrap.querySelector("#mini-calc-toggle");
    const panel = wrap.querySelector("#mini-calc-panel");
    const closeBtn = wrap.querySelector("#mini-calc-close");
    const display = wrap.querySelector("#mini-calc-display");

    let current = "0";
    let previous = null;
    let pendingOp = null;
    let justEvaluated = false;

    function render() { display.textContent = current; }

    function trimNumber(n) {
      const rounded = Math.round(n * 1e10) / 1e10;
      return String(rounded);
    }

    function inputDigit(d) {
      if (justEvaluated) { current = "0"; previous = null; pendingOp = null; justEvaluated = false; }
      if (current === "0") current = d;
      else current += d;
      render();
    }

    function inputDot() {
      if (justEvaluated) { current = "0"; previous = null; pendingOp = null; justEvaluated = false; }
      if (!current.includes(".")) current += ".";
      render();
    }

    function backspace() {
      current = current.length > 1 ? current.slice(0, -1) : "0";
      render();
    }

    function clearAll() {
      current = "0"; previous = null; pendingOp = null; justEvaluated = false;
      render();
    }

    function toPercent() {
      current = trimNumber(parseFloat(current) / 100);
      render();
    }

    function applyOp(a, b, op) {
      const x = parseFloat(a), y = parseFloat(b);
      switch (op) {
        case "+": return x + y;
        case "-": return x - y;
        case "*": return x * y;
        case "/": return y === 0 ? NaN : x / y;
        default: return y;
      }
    }

    function chooseOp(op) {
      if (pendingOp && !justEvaluated) {
        previous = trimNumber(applyOp(previous, current, pendingOp));
      } else {
        previous = current;
      }
      pendingOp = op;
      justEvaluated = false;
      current = "0";
    }

    function equals() {
      if (pendingOp == null) return;
      const result = applyOp(previous, current, pendingOp);
      current = Number.isFinite(result) ? trimNumber(result) : "Error";
      previous = null; pendingOp = null; justEvaluated = true;
      render();
    }

    wrap.querySelectorAll("[data-num]").forEach(btn => {
      btn.addEventListener("click", () => inputDigit(btn.getAttribute("data-num")));
    });
    wrap.querySelectorAll("[data-op]").forEach(btn => {
      btn.addEventListener("click", () => chooseOp(btn.getAttribute("data-op")));
    });
    wrap.querySelector('[data-act="dot"]').addEventListener("click", inputDot);
    wrap.querySelector('[data-act="clear"]').addEventListener("click", clearAll);
    wrap.querySelector('[data-act="back"]').addEventListener("click", backspace);
    wrap.querySelector('[data-act="percent"]').addEventListener("click", toPercent);
    wrap.querySelector('[data-act="equals"]').addEventListener("click", equals);

    function openPanel() { panel.hidden = false; toggle.setAttribute("aria-expanded", "true"); }
    function closePanel() { panel.hidden = true; toggle.setAttribute("aria-expanded", "false"); }

    toggle.addEventListener("click", () => { panel.hidden ? openPanel() : closePanel(); });
    closeBtn.addEventListener("click", closePanel);

    document.addEventListener("keydown", (e) => {
      if (panel.hidden) return;
      if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
      else if (e.key === ".") inputDot();
      else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") chooseOp(e.key);
      else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); equals(); }
      else if (e.key === "Backspace") backspace();
      else if (e.key === "Escape") closePanel();
    });

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildCalculator);
  } else {
    buildCalculator();
  }
})();

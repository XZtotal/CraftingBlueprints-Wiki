function renderMath() {
  if (typeof renderMathInElement === "function") {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$",  right: "$$",  display: true },
        { left: "$",   right: "$",   display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false
    });
  }
}

if (typeof document$ !== "undefined") {
  document$.subscribe(() => {
    renderMath();
  });
}

window.addEventListener("load", renderMath);
document.addEventListener("DOMContentLoaded", renderMath);

let mathCheckCount = 0;
const mathInterval = setInterval(() => {
  if (typeof renderMathInElement === "function") {
    renderMath();
    clearInterval(mathInterval);
  }
  mathCheckCount++;
  if (mathCheckCount > 30) {
    clearInterval(mathInterval);
  }
}, 100);

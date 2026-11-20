// Intercept attachShadow to ensure Mermaid SVGs inside shadow root are centered horizontally
(function () {
  const origAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    const shadowRoot = origAttachShadow.call(this, { ...init, mode: "open" });
    
    const applyStyles = () => {
      const svg = shadowRoot.querySelector("svg");
      if (svg) {
        svg.style.setProperty("display", "block", "important");
        svg.style.setProperty("margin-left", "auto", "important");
        svg.style.setProperty("margin-right", "auto", "important");
      }
      if (!shadowRoot.querySelector("style.mermaid-center-style")) {
        const style = document.createElement("style");
        style.className = "mermaid-center-style";
        style.textContent = `
          :host {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
            margin: 1.5rem auto !important;
          }
          svg {
            display: block !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
        `;
        shadowRoot.appendChild(style);
      }
    };

    const observer = new MutationObserver(() => applyStyles());
    observer.observe(shadowRoot, { childList: true, subtree: true });
    return shadowRoot;
  };
})();

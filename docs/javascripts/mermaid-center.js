// Intercept mermaid to set custom flowchart wrappingWidth and center SVGs
(function () {
  // 1. Intercept mermaid.initialize & updateSiteConfig
  function patchMermaid(m) {
    if (!m) return;
    if (m.mermaidAPI && m.mermaidAPI.updateSiteConfig) {
      m.mermaidAPI.updateSiteConfig({
        flowchart: {
          wrappingWidth: 360,
          minNodeWidth: 160
        }
      });
    }
    if (m.initialize && !m._isPatched) {
      const origInit = m.initialize;
      m.initialize = function (config) {
        config = config || {};
        config.flowchart = config.flowchart || {};
        config.flowchart.wrappingWidth = 360;
        config.flowchart.minNodeWidth = 160;
        const res = origInit.call(this, config);
        if (m.mermaidAPI && m.mermaidAPI.updateSiteConfig) {
          m.mermaidAPI.updateSiteConfig({
            flowchart: {
              wrappingWidth: 360,
              minNodeWidth: 160
            }
          });
        }
        return res;
      };
      m._isPatched = true;
    }
  }

  let _mermaid = window.mermaid;
  if (_mermaid) {
    patchMermaid(_mermaid);
  }
  Object.defineProperty(window, "mermaid", {
    get() { return _mermaid; },
    set(val) {
      _mermaid = val;
      patchMermaid(_mermaid);
    },
    configurable: true
  });

  // 2. Intercept attachShadow for horizontal centering
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
          .node rect,
          .node polygon {
            rx: 6px !important;
            ry: 6px !important;
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

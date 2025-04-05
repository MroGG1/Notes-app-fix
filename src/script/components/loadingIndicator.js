class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
    this._container = document.createElement("div");
    this._container.setAttribute("class", "loading-container");
    this._container.innerHTML = `
      <div class="spinner"></div>
      <p>Loading...</p>
      `;
  }

  _updateStyle() {
    this._style.textContent = `
        :host { /* Menargetkan elemen custom element itu sendiri */
           position: fixed; /* Atau absolute, sesuai kebutuhan */
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           display: flex; /* Gunakan flexbox untuk menengahkan */
           justify-content: center;
           align-items: center;
           background-color: rgba(0, 0, 0, 0.3); /* Overlay gelap transparan */
           z-index: 1050;
           /* Defaultnya tersembunyi, diatur oleh display container */
           display: none;
        }
  
        .loading-container {
          background-color: rgba(255, 255, 255, 0.9);
          color: #333;
          padding: 25px 35px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
  
        .spinner {
          border: 5px solid rgba(0, 0, 0, 0.1);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border-left-color: dodgerblue;
          margin: 0 auto 15px auto;
          animation: spin 1s linear infinite;
        }
  
        p {
            margin: 0;
            font-weight: bold;
        }
  
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
  
        /* Style untuk Tema Gelap */
        :host-context(body.dark-theme) .loading-container {
           background-color: rgba(50, 50, 50, 0.9);
           color: #eee;
        }
  
         :host-context(body.dark-theme) .spinner {
            border-color: rgba(255, 255, 255, 0.1);
            border-left-color: lightskyblue;
         }
      `;
  }

  connectedCallback() {
    this._updateStyle();
    this.shadowRoot.append(this._style, this._container);
  }

  show() {
    this.style.display = "flex";
  }

  hide() {
    this.style.display = "none";
  }
}

customElements.define("loading-indicator", LoadingIndicator);

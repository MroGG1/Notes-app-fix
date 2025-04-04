class ThemeSwitcher extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.loadTheme();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .switcher {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .switcher span {
          font-size: 14px;
        }
        .toggle {
          width: 40px;
          height: 20px;
          background-color: #ccc;
          border-radius: 10px;
          position: relative;
          cursor: pointer;
        }
        .toggle::before {
          content: "";
          width: 18px;
          height: 18px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 1px;
          left: 1px;
          transition: all 0.3s;
        }
        .toggle.active {
          background-color: #007bff;
        }
        .toggle.active::before {
          left: 21px;
        }
      </style>
      <div class="switcher">
        <span>🌞</span>
        <div class="toggle" id="themeToggle"></div>
        <span>🌙</span>
      </div>
    `;

    const themeToggle = this.shadowRoot.querySelector("#themeToggle");

    themeToggle.addEventListener("click", () => {
      themeToggle.classList.toggle("active");
      const isDark = themeToggle.classList.contains("active");
      document.body.classList.toggle("dark-theme", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    const themeToggle = this.shadowRoot.querySelector("#themeToggle");

    if (isDark) {
      themeToggle.classList.add("active");
      document.body.classList.add("dark-theme");
    } else {
      themeToggle.classList.remove("active");
      document.body.classList.remove("dark-theme");
    }
  }
}

customElements.define("theme-switcher", ThemeSwitcher);

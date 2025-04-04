class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.debounceTimeout = null;
    this.debounceDelay = 300;
  }

  connectedCallback() {
    this.render();
    this.shadowRoot
      .querySelector("#searchInput")
      .addEventListener("input", this.handleInput.bind(this));
  }

  handleInput(event) {
    clearTimeout(this.debounceTimeout);

    const keyword = event.target.value.trim();

    this.debounceTimeout = setTimeout(() => {
      console.log(`Dispatching search event with keyword: "${keyword}"`);
      this.dispatchEvent(
        new CustomEvent("search", {
          detail: keyword,
          bubbles: true,
          composed: true,
        })
      );
    }, this.debounceDelay);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .search-container {
          display: flex; /* Tetap gunakan flex untuk layout */
          align-items: center;
          padding: 8px 0; /* Beri sedikit padding vertikal */
          margin: 5px 20px; /* Sesuaikan margin agar konsisten */
          max-width: 400px; /* Batasi lebar jika perlu */
        }
        input {
          padding: 10px; /* Buat input lebih besar sedikit */
          border: 1px solid #ccc;
          border-radius: 5px;
          flex: 1; /* Biarkan input mengambil sisa ruang */
          font-size: 1em; /* Sesuaikan ukuran font */
        }
        /* Hapus style untuk button karena button dihapus */

        /* Style tambahan untuk tema gelap jika perlu */
        :host-context(body.dark-theme) input {
            background-color: #333;
            border-color: #555;
            color: #eee;
        }
      </style>
      <div class="search-container">
        <input type="text" id="searchInput" placeholder="Cari catatan..." autocomplete="off" />
        </div>
    `;
  }
}

customElements.define("search-bar", SearchBar);

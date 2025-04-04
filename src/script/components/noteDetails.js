class NoteDetails extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  set noteData(data) {
    this._noteData = data;
    this.render();
  }

  render() {
    if (!this._noteData) return;

    this.shadowRoot.innerHTML = `
      <style>
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          width: 90%;
          max-width: 500px;
        }
        .modal h2 {
          margin: 0 0 10px;
        }
        .modal p {
          margin: 10px 0;
        }
        .modal button {
          margin-top: 20px;
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .modal button:hover {
          background-color: #0056b3;
        }
      </style>
      <div class="overlay"></div>
      <div class="modal">
        <h2>${this._noteData.title}</h2>
        <p>${this._noteData.body}</p>
        <small>Dibuat pada: ${this._noteData.createdAt}</small>
        <br />
        <button id="closeButton">Tutup</button>
      </div>
    `;

    this.shadowRoot
      .querySelector("#closeButton")
      .addEventListener("click", () => {
        this.remove();
      });

    this.shadowRoot.querySelector(".overlay").addEventListener("click", () => {
      this.remove();
    });
  }
}

customElements.define("note-details", NoteDetails);

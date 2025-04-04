import Swal from "sweetalert2";
class AddNoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this._setupListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
      /* === SALIN ATURAN CSS YANG RELEVAN DARI style.css KE SINI === */

      /* Pastikan selector disesuaikan untuk konteks Shadow DOM jika perlu,
         tapi biasanya nama kelas bisa sama */

      .form-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px; /* Sesuaikan jika perlu */
        margin: 20px auto; /* Sesuaikan jika perlu */
        padding: 20px;
        background-color: #fff; /* Default light, akan ditimpa dark theme jika perlu */
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 1px solid #ccc; /* Tambah border agar terlihat jelas */
      }

      /* Target input/textarea/button di dalam host/shadow root */
      input,
      textarea,
      button {
        font-size: 16px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box; /* Pastikan padding tidak menambah ukuran */
        width: 100%; /* Buat full width di dalam container */
      }

      textarea {
          resize: vertical; /* Izinkan resize vertical */
          min-height: 80px; /* Tinggi minimal */
      }

      button {
        background-color: #007bff;
        color: white;
        cursor: pointer;
        border: none; /* Hapus border default button */
      }

      button:hover {
        background-color: #0056b3;
      }

      .error-message {
        color: red;
        font-size: 14px;
        margin-top: -5px; /* Sesuaikan posisi */
        margin-bottom: 5px;
        display: none; /* Defaultnya disembunyikan oleh JS */
      }

       /* Penyesuaian untuk tema gelap (jika ingin styling dalam komponen) */
       /* Atau biarkan style gelap diatur oleh variabel CSS global */
       :host-context(body.dark-theme) .form-container {
           background-color: #1e1e1e;
           border-color: #333;
           color: #eee;
       }
       :host-context(body.dark-theme) input,
       :host-context(body.dark-theme) textarea {
           background-color: #333;
           border-color: #555;
           color: #eee;
       }
       :host-context(body.dark-theme) button {
           background-color: #333333;
           color: #ffffff;
       }
       :host-context(body.dark-theme) button:hover {
           background-color: #444444;
       }
       :host-context(body.dark-theme) .error-message {
          color: #ff8a8a; /* Warna merah terang untuk gelap */
       }

      /* === AKHIR DARI CSS YANG DISALIN === */
    </style>
    <div class="form-container">
      <input type="text" id="title" placeholder="Judul Catatan" required />
      <p id="titleError" class="error-message">Judul tidak boleh kosong!</p>
      <textarea id="body" rows="5" placeholder="Isi Catatan" required></textarea>
      <p id="bodyError" class="error-message">Isi catatan tidak boleh kosong!</p>
      <button id="addNoteButton">Tambah Catatan</button>
    </div>
  `;
  }

  _setupListeners() {
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyInput = this.shadowRoot.querySelector("#body");
    const addNoteButton = this.shadowRoot.querySelector("#addNoteButton");

    if (titleInput) {
      titleInput.addEventListener("input", () => this.validateTitle());
    }
    if (bodyInput) {
      bodyInput.addEventListener("input", () => this.validateBody());
    }
    if (addNoteButton) {
      addNoteButton.addEventListener("click", () => this.addNote());
    }
  }

  validateTitle() {
    const titleInput = this.shadowRoot.querySelector("#title");
    const titleError = this.shadowRoot.querySelector("#titleError");
    if (!titleInput || !titleError) return;

    if (titleInput.value.trim() === "") {
      titleError.style.display = "block";
    } else {
      titleError.style.display = "none";
    }
  }

  validateBody() {
    const bodyInput = this.shadowRoot.querySelector("#body");
    const bodyError = this.shadowRoot.querySelector("#bodyError");
    if (!bodyInput || !bodyError) return;

    if (bodyInput.value.trim() === "") {
      bodyError.style.display = "block";
    } else {
      bodyError.style.display = "none";
    }
  }

  async addNote() {
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyInput = this.shadowRoot.querySelector("#body");
    if (!titleInput || !bodyInput) return;

    this.validateTitle();
    this.validateBody();

    const titleError =
      this.shadowRoot.querySelector("#titleError")?.style.display !== "none";
    const bodyError =
      this.shadowRoot.querySelector("#bodyError")?.style.display !== "none";

    if (
      titleError ||
      bodyError ||
      titleInput.value.trim() === "" ||
      bodyInput.value.trim() === ""
    ) {
      if (typeof Swal !== "undefined") {
        Swal.fire({
          icon: "warning",
          title: "Input Tidak Valid",
          text: "Harap isi judul dan isi catatan dengan benar!",
        });
      } else {
        alert("Harap isi semua text dengan benar!");
      }
      return;
    }

    const newNote = {
      title: titleInput.value.trim(),
      body: bodyInput.value.trim(),
    };

    try {
      document.dispatchEvent(new CustomEvent("add-note", { detail: newNote }));
      titleInput.value = "";
      bodyInput.value = "";
      if (this.shadowRoot.querySelector("#titleError"))
        this.shadowRoot.querySelector("#titleError").style.display = "none";
      if (this.shadowRoot.querySelector("#bodyError"))
        this.shadowRoot.querySelector("#bodyError").style.display = "none";
    } catch (error) {
      console.error("Error dispatching add-note event:", error);
      if (typeof Swal !== "undefined") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat mencoba menambah catatan.",
        });
      } else {
        alert("Gagal menambahkan catatan");
      }
    }
  }
}

customElements.define("add-note-form", AddNoteForm);

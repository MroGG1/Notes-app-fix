class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    const loginFormElement = this.shadowRoot.querySelector("#loginForm");
    if (loginFormElement) {
      loginFormElement.addEventListener("submit", (event) => {
        event.preventDefault();
        this.login();
      });
    } else {
      console.error(
        "Element #loginForm tidak ditemukan di dalam Shadow DOM LoginForm."
      );
    }

    this._loginButton = this.shadowRoot.querySelector("#loginButton");
    this._loadingIndicator = document.getElementById("loading-indicator");
    if (!this._loadingIndicator) {
      console.warn("Elemen #loading-indicator tidak ditemukan di DOM utama.");
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
            .login-container {
                width: 300px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                background: white;
                box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
                border-radius: 8px;
                text-align: center;
            }
            input {
                width: 100%;
                padding: 10px;
                margin: 8px 0;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            button {
                width: 100%;
                padding: 10px;
                background: blue;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            button:hover {
                background: darkblue;
            }
        </style>
      <form id="loginForm"> <div class="login-container">
            <h2>Welcome to Notes</h2>
            <input type="text" name="username" id="username" pattern="^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$" placeholder="Username" required autocomplete="off"/>
            <input type="password" name="password" id="password" placeholder="Password" required/>
            <button type="submit" id="loginButton">Login</button>
            <p id="message"></p>
        </div>
      </form>
        `;
  }

  async login() {
    const usernameInput = this.shadowRoot.querySelector("#username");
    const passwordInput = this.shadowRoot.querySelector("#password");
    const message = this.shadowRoot.querySelector("#message");

    if (this._loginButton) this._loginButton.disabled = true;
    if (this._loadingIndicator) this._loadingIndicator.show();
    else console.warn("Loading indicator not ready for show()");
    message.textContent = "";

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
      if (username === "admin" && password === "1234") {
        message.textContent = "Login Berhasil!";
        message.style.color = "green";
        this.dispatchEvent(
          new CustomEvent("login-success", {
            bubbles: true,
            composed: true,
          })
        );
      } else {
        throw new Error("Username atau Password Salah!");
      }
    } catch (error) {
      message.textContent = error.message || "Login Gagal!";
      message.style.color = "red";
    } finally {
      if (this._loginButton) this._loginButton.disabled = false;
      if (this._loadingIndicator) this._loadingIndicator.hide();
      else console.warn("Loading indicator not ready for hide()");
    }
  }

  resetFields() {
    const usernameInput = this.shadowRoot.querySelector("#username");
    const passwordInput = this.shadowRoot.querySelector("#password");
    const messageElement = this.shadowRoot.querySelector("#message");

    if (usernameInput && passwordInput) {
      usernameInput.value = "";
      passwordInput.value = "";
    }

    if (messageElement) {
      messageElement.textContent = "";
      messageElement.style.color = "";
    }
  }
}

customElements.define("login-form", LoginForm);

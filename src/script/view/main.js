export function createNavbar(
  logoutHandler,
  filterHandler,
  toggleAddNoteFormHandler
) {
  const navbar = document.createElement("nav");
  navbar.classList.add("navbar");

  const logo = document.createElement("div");
  logo.textContent = "Notes App";
  logo.classList.add("navbar-logo");

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("navbar-buttons");

  const filterButton = document.createElement("button");
  filterButton.textContent = "Tampilkan Catatan Diarsipkan";
  filterButton.classList.add("navbar-button");
  filterButton.addEventListener("click", filterHandler);

  const addNoteButton = document.createElement("button");
  addNoteButton.textContent = "Tambah Catatan";
  addNoteButton.classList.add("navbar-button");
  addNoteButton.addEventListener("click", toggleAddNoteFormHandler);

  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logout";
  logoutButton.classList.add("navbar-button");
  logoutButton.style.display = "none";
  logoutButton.addEventListener("click", logoutHandler);

  buttonsContainer.append(filterButton, addNoteButton, logoutButton);

  navbar.append(logo, buttonsContainer);

  document.body.prepend(navbar);

  return { filterButton, addNoteButton, logoutButton };
}

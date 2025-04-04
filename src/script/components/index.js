import Swal from "sweetalert2";

import { createNavbar } from "../view/main.js";
import "../components/login.js";
import "../components/addNoteForm.js";
import "./noteDetails.js";
import "./searchBar.js";
import "./themeSwitcher.js";
import "./loadingIndicator.js";
import { createNote } from "../api.js";
import { updateNotesView } from "../../app.js";

const loginForm = document.querySelector("login-form");
const addNoteForm = document.querySelector("add-note-form");
const searchBar = document.querySelector("search-bar");
const themeSwitcher = document.querySelector("theme-switcher");
const notesListElement = document.querySelector("#notesList");

let showArchived = false;
let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;
let isAddNoteFormVisible = false;
let currentSearchKeyword = "";

export function getCurrentShowArchivedState() {
  return showArchived;
}
export function getCurrentSearchKeywordState() {
  return currentSearchKeyword;
}

let filterButton, addNoteButton, logoutButton;
let navbar;

function handleFilterClick() {
  showArchived = !showArchived;
  if (filterButton) {
    filterButton.textContent = showArchived
      ? "Tampilkan Catatan Aktif"
      : "Tampilkan Catatan Diarsipkan";
  }
  updateNotesView(showArchived, currentSearchKeyword);
}

function toggleAddNoteForm() {
  isAddNoteFormVisible = !isAddNoteFormVisible;
  if (addNoteForm) {
    addNoteForm.style.display = isAddNoteFormVisible ? "block" : "none";
  }
}

function handleLogoutClick() {
  Swal.fire({
    title: "Konfirmasi Logout",
    text: "Apakah Anda yakin ingin keluar?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#aaa",
    confirmButtonText: "Ya, Logout!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      isLoggedIn = false;
      localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
      localStorage.removeItem("accessToken");
      if (navbar) navbar.style.display = "none";
      if (notesListElement) notesListElement.style.display = "none";
      if (addNoteForm) addNoteForm.style.display = "none";
      if (searchBar) searchBar.style.display = "none";
      if (themeSwitcher) themeSwitcher.style.display = "none";
      if (loginForm) {
        loginForm.style.display = "";
        if (typeof loginForm.resetFields === "function") {
          loginForm.resetFields();
        }
      }
      console.log("User logged out.");
    }
  });
}

function initializeNavbar() {
  const navbarElements = createNavbar(
    handleLogoutClick,
    handleFilterClick,
    toggleAddNoteForm
  );
  filterButton = navbarElements.filterButton;
  addNoteButton = navbarElements.addNoteButton;
  logoutButton = navbarElements.logoutButton;
  navbar = document.querySelector(".navbar");
}

document.addEventListener("login-success", (event) => {
  isLoggedIn = true;
  localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));

  if (loginForm) loginForm.style.display = "none";
  if (navbar) navbar.style.display = "flex";
  else initializeNavbar();
  if (notesListElement) notesListElement.style.display = "grid";
  if (logoutButton) logoutButton.style.display = "block";
  if (filterButton) filterButton.style.display = "block";
  if (addNoteButton) addNoteButton.style.display = "block";
  if (searchBar) searchBar.style.display = "block";
  if (themeSwitcher) themeSwitcher.style.display = "block";
  if (addNoteForm) addNoteForm.style.display = "none";
  isAddNoteFormVisible = false;

  updateNotesView(showArchived, currentSearchKeyword);
});

document.addEventListener("add-note", async (event) => {
  const loadingIndicator = document.getElementById("loading-indicator");
  const newNoteData = event.detail;
  if (loadingIndicator) loadingIndicator.show();

  try {
    const result = await createNote(newNoteData);
    console.log("Note created:", result);
    if (addNoteForm) addNoteForm.style.display = "none";
    isAddNoteFormVisible = false;

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Catatan baru telah ditambahkan.",
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });

    showArchived = false;
    if (filterButton) filterButton.textContent = "Tampilkan Catatan Diarsipkan";
    currentSearchKeyword = "";
    const searchInput = searchBar?.shadowRoot?.querySelector("#searchInput");
    if (searchInput) searchInput.value = "";

    await updateNotesView(showArchived, currentSearchKeyword);
  } catch (error) {
    console.error("Error creating note:", error);
    Swal.fire({
      icon: "error",
      title: "Gagal Menambah Catatan",
      text: `Terjadi kesalahan: ${error.message || "Tidak diketahui"}`,
    });
    if (loadingIndicator) loadingIndicator.hide();
  }
});

document.addEventListener("search", (event) => {
  currentSearchKeyword = event.detail;
  updateNotesView(showArchived, currentSearchKeyword);
});

function initializeApp() {
  initializeNavbar();

  if (isLoggedIn) {
    if (loginForm) loginForm.style.display = "none";
    if (navbar) navbar.style.display = "flex";
    if (notesListElement) notesListElement.style.display = "grid";
    if (logoutButton) logoutButton.style.display = "block";
    if (filterButton) filterButton.style.display = "block";
    if (addNoteButton) addNoteButton.style.display = "block";
    if (searchBar) searchBar.style.display = "block";
    if (themeSwitcher) themeSwitcher.style.display = "block";
    if (addNoteForm) addNoteForm.style.display = "none";
    isAddNoteFormVisible = false;

    updateNotesView(showArchived, currentSearchKeyword);
  } else {
    if (loginForm) loginForm.style.display = "";
    if (navbar) navbar.style.display = "none";
    if (notesListElement) notesListElement.style.display = "none";
    if (addNoteForm) addNoteForm.style.display = "none";
    if (searchBar) searchBar.style.display = "none";
    if (themeSwitcher) themeSwitcher.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "index.js: DOM fully loaded and parsed, running initializeApp..."
  );
  initializeApp();
});

import "../style/style.css";
import Swal from "sweetalert2";
import "./script/components/index.js";
import * as api from "./script/api.js";
import { renderNotes } from "./script/view/render.js";
import {
  getCurrentShowArchivedState,
  getCurrentSearchKeywordState,
} from "./script/components/index.js";

let currentNotesData = [];

async function handleDetailClick(noteData) {
  try {
    const noteDetailsElement = document.createElement("note-details");
    noteDetailsElement.noteData = noteData;
    document.body.appendChild(noteDetailsElement);
  } catch (error) {
    console.error("Error showing note details:", error);
    Swal.fire({
      icon: "error",
      title: "Gagal Menampilkan Detail",
      text: `Terjadi kesalahan: ${error.message || "Tidak diketahui"}`,
    });
  }
}

async function handleArchiveToggleClick(noteId, isCurrentlyArchived) {
  const loadingIndicator = document.getElementById("loading-indicator");
  const currentFilterState = getCurrentShowArchivedState();
  const currentSearchState = getCurrentSearchKeywordState();
  let actionVerb = isCurrentlyArchived ? "Mengaktifkan" : "Mengarsipkan";
  let successVerb = isCurrentlyArchived ? "diaktifkan" : "diarsipkan";

  if (loadingIndicator) loadingIndicator.show();

  try {
    if (isCurrentlyArchived) {
      await api.unarchiveNote(noteId);
    } else {
      await api.archiveNote(noteId);
    }
    console.log(`Note ${successVerb}:`, noteId);

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: `Catatan berhasil ${successVerb}.`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });

    await updateNotesView(currentFilterState, currentSearchState);
  } catch (error) {
    console.error(`Error ${actionVerb} note:`, error);
    Swal.fire({
      icon: "error",
      title: `Gagal ${actionVerb}`,
      text: `Terjadi kesalahan: ${error.message || "Tidak diketahui"}`,
    });
    if (loadingIndicator) loadingIndicator.hide();
  }
}

async function handleDeleteClick(noteId) {
  const loadingIndicator = document.getElementById("loading-indicator");
  const currentFilterState = getCurrentShowArchivedState();
  const currentSearchState = getCurrentSearchKeywordState();

  Swal.fire({
    title: "Anda Yakin?",
    text: "Catatan yang dihapus tidak dapat dikembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  }).then(async (result) => {
    if (result.isConfirmed) {
      if (loadingIndicator) loadingIndicator.show();

      try {
        await api.deleteNote(noteId);
        console.log("Note deleted:", noteId);

        Swal.fire({
          title: "Dihapus!",
          text: "Catatan Anda telah dihapus.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });

        await updateNotesView(currentFilterState, currentSearchState);
      } catch (error) {
        console.error("Error deleting note:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text: `Terjadi kesalahan: ${error.message || "Tidak diketahui"}`,
        });
        if (loadingIndicator) loadingIndicator.hide();
      }
    }
  });
}

export async function updateNotesView(showArchived, searchTerm = "") {
  const notesList = document.getElementById("notesList");
  const loadingIndicator = document.getElementById("loading-indicator");

  if (!notesList) {
    console.error("Element #notesList not found in DOM!");
    if (loadingIndicator) loadingIndicator.hide();
    return;
  }

  console.log(
    `Updating view: showArchived=${showArchived}, searchTerm='${searchTerm}'`
  );
  if (loadingIndicator) loadingIndicator.show();

  try {
    let notesToRender;
    if (showArchived) {
      currentNotesData = await api.fetchArchivedNotes();
    } else {
      currentNotesData = await api.fetchNotes();
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      notesToRender = currentNotesData.filter(
        (note) =>
          note.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          note.body.toLowerCase().includes(lowerCaseSearchTerm)
      );
    } else {
      notesToRender = currentNotesData;
    }

    renderNotes(
      notesToRender,
      notesList,
      handleDetailClick,
      handleArchiveToggleClick,
      handleDeleteClick
    );
  } catch (error) {
    console.error("Error fetching or rendering notes:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `Gagal memuat catatan: ${error.message || "Terjadi kesalahan tidak diketahui."}`,
    });
    notesList.innerHTML = `<p style="color: red;">Gagal memuat catatan.</p>`;
  } finally {
    if (loadingIndicator) loadingIndicator.hide();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("app.js loaded, DOM ready.");
});

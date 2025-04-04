import { animate } from "motion";

import { createNoteItemElement } from "../components/notes.js";

export function renderNotes(
  notes,
  notesListElement,
  onDetailClick,
  onArchiveToggleClick,
  onDeleteClick
) {
  notesListElement.innerHTML = "";

  if (notes.length === 0) {
    notesListElement.innerHTML = "<p>Tidak ada catatan untuk ditampilkan.</p>";
    return;
  }

  notes.forEach((note, index) => {
    const noteElement = createNoteItemElement(
      note,
      onDetailClick,
      onArchiveToggleClick,
      onDeleteClick
    );
    notesListElement.appendChild(noteElement);

    try {
      animate(
        noteElement,
        {
          opacity: [0, 1],
          transform: ["translateY(20px) scale(0.95)", "translateY(0) scale(1)"],
        },
        {
          duration: 0.5,
          delay: index * 0.05,
          easing: [0.22, 1, 0.36, 1],
        }
      );
    } catch (e) {
      console.error("Error applying entrance animation:", e);
    }
  });
}

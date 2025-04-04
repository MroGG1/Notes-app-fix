
export function createNoteItemElement(
  { id, title, body, createdAt, archived },
  onDetailClick,
  onArchiveToggleClick,
  onDeleteClick
) {
  const container = document.createElement("div");
  container.setAttribute("data-noteid", id);
  container.classList.add("note-item");

  const titleElement = document.createElement("h3");
  titleElement.textContent = title;
  titleElement.classList.add("note-title");
  titleElement.addEventListener("click", () =>
    onDetailClick({ id, title, body, createdAt, archived })
  );

  const bodyElement = document.createElement("p");
  bodyElement.textContent = body;

  const dateElement = document.createElement("small");
  dateElement.textContent = `Dibuat pada: ${new Date(createdAt).toLocaleString(
    "id-ID"
  )}`; 

  const archivedStatus = document.createElement("p");
  archivedStatus.textContent = archived
    ? "Status: Diarsipkan"
    : "Status: Aktif"; 

  const buttonContainer = document.createElement("div"); 
  buttonContainer.style.marginTop = "10px"; 

  const archiveButton = document.createElement("button");
  archiveButton.textContent = archived ? "Aktifkan" : "Arsipkan"; 
  archiveButton.classList.add("archive-button");
  archiveButton.dataset.id = id; 
  archiveButton.dataset.archived = archived; 
  archiveButton.addEventListener("click", () =>
    onArchiveToggleClick(id, archived)
  );

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus";
  deleteButton.classList.add("delete-button");
  deleteButton.dataset.id = id;
  deleteButton.addEventListener("click", () => onDeleteClick(id));

  buttonContainer.append(archiveButton, deleteButton); 

  container.append(
    titleElement,
    bodyElement,
    dateElement,
    archivedStatus,
    buttonContainer
  );

  return container;
}

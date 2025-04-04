const BASE_URL = "https://notes-api.dicoding.dev/v2";

function getAccessToken() {
  return "your-access-token";
}

function getRequestOptions(method = "GET", data = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return options;
}

async function handleResponse(response) {
  const result = await response.json();
  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Terjadi kesalahan");
  }
  return result.data || result.message;
}

export async function fetchNotes() {
  try {
    const response = await fetch(`${BASE_URL}/notes`, getRequestOptions());
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Gagal mengambil catatan: ${error.message}`);
  }
}

export async function fetchArchivedNotes() {
  try {
    const response = await fetch(
      `${BASE_URL}/notes/archived`,
      getRequestOptions()
    );
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Gagal mengambil catatan arsip: ${error.message}`);
  }
}

export async function fetchNoteById(noteId) {
  try {
    const response = await fetch(
      `${BASE_URL}/notes/${noteId}`,
      getRequestOptions()
    );
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Gagal mengambil catatan: ${error.message}`);
  }
}

export async function createNote(note) {
  try {
    const response = await fetch(
      `${BASE_URL}/notes`,
      getRequestOptions("POST", note)
    );
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Gagal membuat catatan: ${error.message}`);
  }
}

export async function archiveNote(noteId) {
  try {
    const response = await fetch(
      `${BASE_URL}/notes/${noteId}/archive`,
      getRequestOptions("POST")
    );
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Gagal mengarsipkan catatan: ${error.message}`);
  }
}

export async function unarchiveNote(noteId) {
  try {
    const response = await fetch(
      `${BASE_URL}/notes/${noteId}/unarchive`,
      getRequestOptions("POST")
    );
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Gagal membatalkan arsip catatan: ${error.message}`);
  }
}

export async function deleteNote(noteId) {
  try {
    const response = await fetch(
      `${BASE_URL}/notes/${noteId}`,
      getRequestOptions("DELETE")
    );
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Gagal menghapus catatan: ${error.message}`);
  }
}

const BASE_URL = 'https://notes-api.dicoding.dev/v2';
import Swal from 'sweetalert2';

const api = {
  async getNotes() {
    const response = await fetch(`${BASE_URL}/notes`);
    return response.json();
  },
  async createNote(title, body) {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    });
    return response.json();
  },
  async deleteNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
  async archiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: 'POST',
    });
    return response.json();
  },
  async unarchiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: 'POST',
    });
    return response.json();
  },
};

export default api;

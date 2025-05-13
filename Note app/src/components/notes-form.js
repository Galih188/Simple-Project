import api from '../utils/api.js';
import Swal from 'sweetalert2';

class NotesForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
    this.shadowRoot
      .querySelector('form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = this.shadowRoot.querySelector('#title').value.trim();
        const body = this.shadowRoot.querySelector('#body').value.trim();
        if (!title || !body)
          return alert('Judul dan isi catatan tidak boleh kosong!');
        try {
          await api.createNote(title, body);
          document.dispatchEvent(new CustomEvent('note-updated'));
          this.shadowRoot.querySelector('form').reset();
        } catch {
          Swal.fire({
            icon: 'error',
            title: 'Waduh!',
            text: 'Gagal menambahkan cataan!',
          });
        }
      });
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        form { display: flex; flex-direction: column; gap: 10px; }
        input, textarea { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #4CAF50; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; }
        button:hover { border: 1px solid black; }
      </style>
      <form>
        <input id="title" type="text" placeholder="Judul catatan" required />
        <textarea id="body" placeholder="Isi catatan" rows="4" warp="soft" required></textarea>
        <button type="submit">Tambah Catatan</button>
      </form>
    `;
  }
}
customElements.define('notes-form', NotesForm);

import api from '../utils/api.js';
import Swal from 'sweetalert2';

class NotesList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.notes = [];
  }

  connectedCallback() {
    this.loadNotes();
    document.addEventListener('note-updated', () => this.loadNotes());
  }

  async loadNotes() {
    try {
      const response = await api.getNotes();
      this.notes = response.data;
      this.render();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Waduh!',
        text: 'Gagal memuat catatan. Cek koneksi internet Anda!',
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .grid { 
          display: grid; 
          gap: 15px; 
          grid-template-columns: repeat(auto-fill, minmax(250px,1fr)); 
        }
        .note { 
          background: white; 
          border-radius: 8px; 
          padding: 15px; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.1); 
          transition: transform 0.2s ease; 
        }
        .note:hover { transform: scale(1.02); }
        .note button { margin-top: 10px; margin-right: 5px; }
        
        .note p {
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: anywhere;
        }

        .note button.archive {
          background-color: #4CAF50;
          color: white;
          border-radius: 5px;
          font-size: 1rem;
        }
        .note button.archive:hover {
          background-color: #45a049;
          transform: scale(1.05);
        }

        .note button.delete {
          background-color: #f44336;
          color: white;
          border-radius: 5px;
          font-size: 1rem;
        }
        .note button.delete:hover {
          background-color: #c62828;
          transform: scale(1.05);
        }
      </style>

      <div class="grid">
        ${this.notes
          .map(
            (note) => `
            <div class="note" data-id="${note.id}">
                <h3>${note.title}</h3>
                <p>${note.body}</p>
                <button class="archive">${note.archived ? 'Unarchive' : 'Archive'}</button>
                <button class="delete">Delete</button>
            </div>
        `
          )
          .join('')}
      </div>
    `;

    this.shadowRoot.querySelectorAll('.archive').forEach((button) => {
      button.addEventListener('click', async (e) => {
        const id = e.target.closest('.note').dataset.id;

        try {
          const result = await api.getNotes();
          const targetNote = result.data.find((n) => n.id === id);
          if (!targetNote) return;

          const confirmResult = await Swal.fire({
            title: targetNote.archived
              ? 'Unarsipkan Catatan?'
              : 'Arsipkan Catatan?',
            text: targetNote.archived
              ? 'Catatan ini akan dikembalikan ke daftar aktif.'
              : 'Catatan ini akan dipindahkan ke arsip.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: targetNote.archived ? 'Unarchive' : 'Archive',
            cancelButtonText: 'Batal',
          });

          if (confirmResult.isConfirmed) {
            if (targetNote.archived) {
              await api.unarchiveNote(id);
              Swal.fire({
                icon: 'success',
                title: 'Sukses!',
                text: 'Catatan berhasil dipindahkan dari arsip.',
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              await api.archiveNote(id);
              Swal.fire({
                icon: 'success',
                title: 'Sukses!',
                text: 'Catatan berhasil diarsipkan.',
                timer: 1500,
                showConfirmButton: false,
              });
            }

            document.dispatchEvent(new CustomEvent('note-updated'));
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Waduh!',
            text: 'Gagal memproses archive / unarchive catatan.',
          });
        }
      });
    });

    this.shadowRoot.querySelectorAll('.delete').forEach((button) => {
      button.addEventListener('click', async (e) => {
        const id = e.target.closest('.note').dataset.id;

        const result = await Swal.fire({
          title: 'Yakin mau dihapus?',
          text: 'Catatan ini akan dihapus secara permanen!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#4CAF50',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
          try {
            await api.deleteNote(id);
            document.dispatchEvent(new CustomEvent('loading-indicator'));
            document.dispatchEvent(new CustomEvent('note-updated'));

            Swal.fire({
              icon: 'success',
              title: 'Terhapus!',
              text: 'Catatan berhasil dihapus.',
              timer: 1500,
              showConfirmButton: false,
            });
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: 'Terjadi kesalahan saat menghapus catatan.',
            });
          }
        }
      });
    });
  }
}

customElements.define('notes-list', NotesList);

// Event listener di luar class pakai SweetAlert2
document.addEventListener('note-delete', async (e) => {
  const result = await Swal.fire({
    title: 'Yakin mau dihapus?',
    text: 'Catatan ini akan dihapus secara permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4CAF50',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  });

  if (result.isConfirmed) {
    try {
      await api.deleteNote(e.detail);
      document.dispatchEvent(new CustomEvent('note-updated'));

      Swal.fire({
        icon: 'success',
        title: 'Terhapus!',
        text: 'Catatan berhasil dihapus.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menghapus catatan.',
      });
    }
  }
});

document.addEventListener('note-archive', async (e) => {
  const noteId = e.detail;
  try {
    const note = (await api.getNotes()).data.find((n) => n.id === noteId);
    if (!note) return;

    note.archived
      ? await api.unarchiveNote(noteId)
      : await api.archiveNote(noteId);

    document.dispatchEvent(new CustomEvent('note-updated'));
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Waduh!',
      text: 'Gagal mengubah status catatan.',
    });
  }
});

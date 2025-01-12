class ModalManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botão Adicionar
        document.querySelector('.add-button').addEventListener('click', () => {
            this.openModal('addBookModal');
        });

        // Botões Editar
        document.querySelectorAll('.edit-book, .ri-edit-line').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const bookData = this.getBookDataFromRow(row);
                this.openEditModal(bookData);
            });
        });

        // Botões Deletar
        document.querySelectorAll('.delete-book, .ri-delete-bin-line').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const bookData = this.getBookDataFromRow(row);
                this.openDeleteModal(bookData);
            });
        });

        // Botões para fechar modais
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });
    }

    getBookDataFromRow(row) {
        if (!row) return null;
        return {
            id: row.dataset.bookId,
            title: row.querySelector('td:nth-child(1)').textContent.trim(),
            autor: row.querySelector('td:nth-child(2)').textContent.trim(),
            quantity: row.querySelector('td:nth-child(3)').textContent.trim()
        };
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
    }

    closeModal(modal) {
        modal.classList.remove('show');
    }

    openEditModal(bookData) {
        const modal = document.getElementById('editBookModal');
        // Preencher os campos do formulário
        modal.querySelector('#editBookId').value = bookData.id;
        modal.querySelector('#editTitle').value = bookData.title;
        modal.querySelector('#editAutor').value = bookData.autor;
        modal.querySelector('#editQuantity').value = bookData.quantity;
        this.openModal('editBookModal');
    }

    openDeleteModal(bookData) {
        const modal = document.getElementById('deleteBookModal');
        modal.querySelector('#deleteBookId').value = bookData.id;
        modal.querySelector('#deleteBookTitle').textContent = bookData.title;
        this.openModal('deleteBookModal');
    }
}

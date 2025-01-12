class ModalManager {
    constructor() {
        this.activeModal = null;
        this.setupGlobalListeners();
    }

    setupGlobalListeners() {
        // Delegação de eventos global
        document.addEventListener('click', (e) => {
            // Abrir modal
            const opener = e.target.closest('[data-open-modal]');
            if (opener) {
                const modalId = opener.dataset.openModal;
                const modalData = this.getDataFromTrigger(opener);
                this.open(modalId, modalData);
            }

            // Fechar modal
            if (e.target.closest('.close-modal') || e.target.classList.contains('modal')) {
                this.close();
            }

            // Confirmar ações
            const confirmAction = e.target.closest('[data-confirm-action]');
            if (confirmAction) {
                const action = confirmAction.dataset.confirmAction;
                this.handleConfirmAction(action);
            }
        });

        // Manipulador de formulários
        document.addEventListener('submit', (e) => {
            if (e.target.closest('.modal form')) {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });
    }

    getDataFromTrigger(trigger) {
        if (trigger.hasAttribute('data-row')) {
            const row = trigger.closest('tr');
            if (!row) return null;

            const data = {};
            
            // Pegar ID da linha
            if (row.dataset.bookId) {
                data.id = row.dataset.bookId;
            } else if (row.dataset.studentId) {
                data.id = row.dataset.studentId;
            }

            // Pegar dados das células
            row.querySelectorAll('td[data-field]').forEach(cell => {
                const fieldName = cell.dataset.field;
                data[fieldName] = cell.textContent.trim();
            });

            // Se não houver data-field, usar índices
            if (Object.keys(data).length <= 1) {
                row.querySelectorAll('td:not(:last-child)').forEach((cell, index) => {
                    const fields = ['title', 'autor', 'quantity', 'name', 'class'];
                    if (fields[index]) {
                        data[fields[index]] = cell.textContent.trim();
                    }
                });
            }

            return data;
        }
        return null;
    }

    open(modalId, data = null) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Preencher dados do formulário se existirem
        if (data) {
            // Preencher campos com data-field
            modal.querySelectorAll('[data-field]').forEach(element => {
                const field = element.dataset.field;
                if (data[field] !== undefined) {
                    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                        element.value = data[field];
                    } else {
                        element.textContent = data[field];
                    }
                }
            });

            // Preencher campos por ID específico
            for (const [key, value] of Object.entries(data)) {
                const element = modal.querySelector(`#edit${key.charAt(0).toUpperCase() + key.slice(1)}`);
                if (element) {
                    element.value = value;
                }
            }

            // Preencher campos específicos para delete
            if (modalId.includes('delete')) {
                const titleSpan = modal.querySelector(`#delete${modalId.includes('Book') ? 'BookTitle' : 'StudentName'}`);
                if (titleSpan) {
                    titleSpan.textContent = data.title || data.name;
                }
            }
        }

        modal.style.display = 'block';
        modal.classList.add('show');
        this.activeModal = modal;
    }

    close() {
        if (this.activeModal) {
            this.activeModal.style.display = 'none';
            this.activeModal.classList.remove('show');
            
            // Limpar formulários
            const form = this.activeModal.querySelector('form');
            if (form) form.reset();
            
            this.activeModal = null;
        }
    }

    async handleFormSubmit(form) {
        const action = form.getAttribute('data-action');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Aqui você implementaria a lógica de envio dos dados
            console.log('Form submitted:', action, data);
            // Após sucesso, fechar o modal
            this.close();
            // Recarregar a página ou atualizar a tabela
            window.location.reload();
        } catch (error) {
            console.error('Error submitting form:', error);
            // Implementar tratamento de erro aqui
        }
    }

    async handleConfirmAction(action) {
        try {
            // Implementar lógica de confirmação aqui
            console.log('Action confirmed:', action);
            this.close();
            window.location.reload();
        } catch (error) {
            console.error('Error executing action:', error);
        }
    }
}

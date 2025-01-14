// Encapsulando a classe em um módulo IIFE (Immediately Invoked Function Expression)
(function(window) {
    // Verifica se TableManager já existe para evitar redefinição
    if (window.TableManager) {
        return;
    }

    class TableManager {
        constructor(options = {}) {
            // Ajustando o seletor para pegar a tabela correta
            this.tables = $('#booksTable');
            this.currentPage = 1;
            this.itemsPerPage = options.itemsPerPage || 5;
            this.searchInput = options.searchInput || '#searchInput';
            this.paginationContainer = options.paginationContainer || '#pagination';
            this.itemsPerPageSelector = options.itemsPerPageSelector || '#itemsPerPage';
            this.originalData = this.getTableData();
            
            this.initialize();
        }

        getTableData() {
            const data = [];
            this.tables.find('tbody tr').each(function() {
                const rowData = {};
                const cells = $(this).find('td');
                cells.each(function(index) {
                    rowData[index] = $(this).text().trim();
                });
                data.push(rowData);
            });
            return data;
        }

        displayRows(page, itemsPerPage, data) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedData = data.slice(start, end);

            this.tables.find("tbody tr").hide();
            this.tables.find("tbody tr").slice(start, end).show();

            this.displayPagination(data.length, page, itemsPerPage);
        }

        displayPagination(totalItems, currentPage, itemsPerPage) {
            // Se o total de itens for menor ou igual aos itens por página, não mostra paginação
            if (totalItems <= itemsPerPage) {
                $(this.paginationContainer).empty();
                return;
            }

            const totalPages = Math.ceil(totalItems / itemsPerPage);
            let paginationHtml = '';

            if (totalPages > 1) {
                paginationHtml = `
                    <button class="page-btn first-page" ${currentPage === 1 ? 'disabled' : ''}>Primeiro</button>
                    ${currentPage > 2 ? `<button class="page-btn" data-page="1">1</button>` : ''}
                    ${currentPage > 3 ? '<span class="page-dots">...</span>' : ''}
                `;

                for (let i = Math.max(1, currentPage - 1); i <= Math.min(currentPage + 1, totalPages); i++) {
                    paginationHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }

                if (currentPage < totalPages - 1) {
                    paginationHtml += `
                        ${currentPage < totalPages - 2 ? '<span class="page-dots">...</span>' : ''}
                        <button class="page-btn" data-page="${totalPages}">${totalPages}</button>
                    `;
                }

                paginationHtml += `<button class="page-btn last-page" ${currentPage === totalPages ? 'disabled' : ''}>Último</button>`;
            }

            $(this.paginationContainer).html(paginationHtml);
        }

        filterTable(searchTerm) {
            const self = this;
            let visibleRows = [];
            
            this.tables.find('tbody tr').each(function() {
                const row = $(this);
                const text = row.text().toLowerCase();
                if (!searchTerm || text.includes(searchTerm.toLowerCase())) {
                    visibleRows.push(row);
                    row.show();
                } else {
                    row.hide();
                }
            });

            // Se tiver menos linhas visíveis que o itemsPerPage, mostra todas
            if (visibleRows.length <= this.itemsPerPage) {
                visibleRows.forEach(row => row.show());
                this.displayPagination(visibleRows.length, 1, this.itemsPerPage);
                return;
            }

            // Recalcula a paginação apenas para linhas visíveis
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;

            // Esconde todas as linhas visíveis primeiro
            visibleRows.forEach(row => row.hide());
            
            // Mostra apenas as linhas da página atual
            visibleRows.slice(start, end).forEach(row => row.show());

            // Atualiza paginação com o número correto de linhas visíveis
            this.displayPagination(visibleRows.length, this.currentPage, this.itemsPerPage);
        }

        showAllRows() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;

            this.tables.find('tbody tr').hide();
            this.tables.find('tbody tr').slice(start, end).show();
            
            this.displayPagination(this.originalData.length, this.currentPage, this.itemsPerPage);
        }

        initialize() {
            const self = this;
            this.showAllRows();

            $(this.paginationContainer).on("click", ".page-btn", function() {
                if ($(this).hasClass('first-page')) {
                    self.currentPage = 1;
                } else if ($(this).hasClass('last-page')) {
                    const totalRows = self.tables.find('tbody tr:not(:hidden)').length;
                    self.currentPage = Math.ceil(totalRows / self.itemsPerPage);
                } else {
                    self.currentPage = parseInt($(this).data("page"));
                }
                
                const searchTerm = $(self.searchInput).val();
                if (searchTerm) {
                    self.filterTable(searchTerm);
                } else {
                    self.showAllRows();
                }
            });

            $(this.itemsPerPageSelector).on("change", function() {
                self.itemsPerPage = parseInt($(this).val());
                self.currentPage = 1;
                self.displayRows(self.currentPage, self.itemsPerPage, self.originalData);
            });

            $(this.searchInput).on('input', function() {
                self.currentPage = 1; // Reset para primeira página ao buscar
                self.filterTable($(this).val());
            });
        }
    }

    // Expõe a classe TableManager globalmente
    window.TableManager = TableManager;
})(window);

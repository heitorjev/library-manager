class TableManager {
    constructor(tableId, options = {}) {
        this.tableId = tableId;
        this.table = $(`#${tableId}`);
        this.currentPage = 1;
        this.itemsPerPage = options.itemsPerPage || 5;
        this.searchInput = options.searchInput || '#searchInput';
        this.paginationContainer = options.paginationContainer || '#pagination';
        this.itemsPerPageSelector = options.itemsPerPageSelector || '#itemsPerPage';
        this.columns = options.columns || this.detectColumns();
        this.formatters = options.formatters || {};
        this.sortConfig = options.sortConfig || {};
        
        this.initialize();
    }

    detectColumns() {
        const columns = [];
        this.table.find('thead th').each(function() {
            columns.push({
                field: $(this).data('field') || $(this).text().toLowerCase(),
                title: $(this).text()
            });
        });
        return columns;
    }

    getTableData() {
        const data = [];
        const self = this;
        
        this.table.find('tbody tr').each(function() {
            const row = {};
            $(this).find('td').each(function(index) {
                const column = self.columns[index];
                row[column.field] = $(this).text();
            });
            data.push(row);
        });
        return data;
    }

    formatCell(value, field) {
        if (this.formatters[field]) {
            return this.formatters[field](value);
        }
        return value;
    }

    displayRows(page, itemsPerPage, data) {
        const sortedData = this.sortData(data);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedData = sortedData.slice(start, end);

        this.table.find("tbody").empty();
        const self = this;

        paginatedData.forEach(row => {
            const tr = $("<tr>");
            this.columns.forEach(column => {
                if (column.field === 'actions') {
                    tr.append(`
                        <td>
                            <div class="action-buttons">
                                <button class="action-button" title="Editar">
                                    <i class="ri-edit-line"></i>
                                </button>
                                <button class="action-button delete" title="Apagar">
                                    <i class="ri-delete-bin-line"></i>
                                </button>
                            </div>
                        </td>
                    `);
                } else {
                    const value = row[column.field];
                    tr.append(`<td>${this.formatCell(value, column.field)}</td>`);
                }
            });
            this.table.find("tbody").append(tr);
        });

        this.displayPagination(data.length, page, itemsPerPage);
    }

    sortData(data) {
        if (!this.sortConfig.field) return data;
        
        return [...data].sort((a, b) => {
            const valueA = a[this.sortConfig.field] || '';
            const valueB = b[this.sortConfig.field] || '';
            
            // Verifica se os valores são números
            if (!isNaN(valueA) && !isNaN(valueB)) {
                return this.sortConfig.direction === 'asc' ? 
                    Number(valueA) - Number(valueB) : 
                    Number(valueB) - Number(valueA);
            }
            
            // Se não forem números, trata como strings
            return this.sortConfig.direction === 'asc' ? 
                String(valueA).localeCompare(String(valueB)) : 
                String(valueB).localeCompare(String(valueA));
        });
    }

    displayPagination(totalItems, currentPage, itemsPerPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        let paginationHtml = `<button class="page-btn first-page" ${currentPage === 1 ? 'disabled' : ''}>Primeiro</button>`;

        if (currentPage > 2) {
            paginationHtml += `<button class="page-btn" data-page="1">1</button>`;
            if (currentPage > 3) paginationHtml += '<span class="page-dots">...</span>';
        }

        const start = Math.max(1, currentPage - 1);
        const end = Math.min(currentPage + 1, totalPages);
        
        for (let i = start; i <= end; i++) {
            paginationHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        if (currentPage < totalPages - 1) {
            if (currentPage < totalPages - 2) paginationHtml += '<span class="page-dots">...</span>';
            paginationHtml += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        paginationHtml += `<button class="page-btn last-page" ${currentPage === totalPages ? 'disabled' : ''}>Último</button>`;
        $(this.paginationContainer).html(paginationHtml);
    }

    initialize() {
        const initialData = this.getTableData();
        const self = this;

        this.displayRows(this.currentPage, this.itemsPerPage, initialData);

        $(this.paginationContainer).on("click", ".page-btn", function() {
            if ($(this).hasClass('first-page')) {
                self.currentPage = 1;
            } else if ($(this).hasClass('last-page')) {
                self.currentPage = Math.ceil(initialData.length / self.itemsPerPage);
            } else {
                self.currentPage = parseInt($(this).data("page"));
            }
            self.displayRows(self.currentPage, self.itemsPerPage, initialData);
        });

        $(this.itemsPerPageSelector).on("change", function() {
            self.itemsPerPage = parseInt($(this).val());
            self.currentPage = 1;
            self.displayRows(self.currentPage, self.itemsPerPage, initialData);
        });

        $(this.searchInput).on("input", function() {
            const searchTerm = $(this).val().toLowerCase();
            const filteredData = initialData.filter(row => 
                Object.values(row).some(value => 
                    String(value).toLowerCase().includes(searchTerm)
                )
            );
            self.currentPage = 1;
            self.displayRows(self.currentPage, self.itemsPerPage, filteredData);
        });
    }
}

// Exemplo de uso:
// const booksTable = new TableManager('booksTable', {
//     formatters: {
//         status: (value) => `<span class="status-badge ${parseInt(value) === 1 ? 'status-available' : 'status-unavailable'}">
//             ${parseInt(value) === 1 ? 'Disponível' : 'Indisponível'}
//         </span>`
//     },
//     sortConfig: {
//         field: 'status',
//         direction: 'desc'
//     }
// });
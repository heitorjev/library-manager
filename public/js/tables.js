function loadTable(idTable) {
    $(`#${idTable}`).DataTable({
        "paging": true,
        "searching": true,
        "info": true,
        "pageLength": 10,
        "language": {
            "lengthMenu": "Exibir _MENU_ registros por página",
            "zeroRecords": "Nada encontrado",
            "info": "Exibindo _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty": "Nenhum registro disponível",
            "infoFiltered": "(filtrado de _MAX_ registros no total)",
            "search": "Buscar:",
            "paginate": {
                "first": "Primeiro",
                "last": "Último",
                "next": "Próximo",
                "previous": "Anterior"
            }
        },
        // Sobrescreve o campo de pesquisa para adicionar a classe do Bootstrap
        // Sobrescreve o campo de pesquisa para adicionar a classe do Bootstrap
        "initComplete": function() {
            // Adiciona apenas a classe "form-control" ao input de pesquisa e aplica display inline
            $(".dataTables_filter input")
                .removeClass()  // Remove todas as classes existentes
                .addClass("form-control")
                
                .attr("placeholder", "Buscar...");

            // Para o Select Menu (Exibir por página)
            $(".dataTables_length select")
                .removeClass()  // Remove todas as classes existentes
                .addClass("form-select")
                

            // Para a paginação, aplica as classes do Bootstrap
            $(".dataTables_paginate .paginate_button")
                .removeClass()  // Remove todas as classes existentes
                .addClass("btn btn-link");  // Aplica as classes de botão do Bootstrap
        }
    });
}
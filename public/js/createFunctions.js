function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
        ${message}
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="ri-close-line"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);

    // Remove o toast após 5 segundos
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-in-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function returnBook(loan) {
    try {
        document.getElementById('returnBookName').textContent = loan.bookName;
        document.getElementById('returnLoanId').value = loan._id;
        document.getElementById('returnModal').classList.add('show');
    } catch (error) {
        console.error('Erro ao processar dados:', error);
        alert('Erro ao preparar devolução');
    }
}

async function confirmReturn() {
    const loanId = document.getElementById('returnLoanId').value;
    try {
        const response = await fetch('/api/loans/return/' + loanId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            showToast('Livro devolvido com sucesso!', 'success');
            closeModal('returnModal');
            setTimeout(() => window.location.reload(), 2000);
        } else {
            const error = await response.json();
            showToast(error.message || 'Erro ao processar devolução', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao processar devolução', 'error');
    }
}

async function saveLoan() {
    try {
        const formData = {
            bookId: document.getElementById('bookId').value,
            studentId: document.getElementById('studentId').value,
            lendingDate: document.getElementById('lendingDate').value,
            returnDate: document.getElementById('returnDate').value
        };

        const response = await fetch('/api/loans/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showToast('Empréstimo criado com sucesso!', 'success');
            closeModal('newLoanModal');
            setTimeout(() => window.location.reload(), 2000);
        } else {
            const error = await response.json();
            showToast(error.message || 'Erro ao criar empréstimo', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro ao salvar empréstimo', 'error');
    }
}
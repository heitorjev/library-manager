function isTeacher(){
    if(document.getElementById("userType").value == "teacher"){
        document.getElementById('studentClass').style.display = 'none';
        document.getElementById('classLabel').style.display = 'none';
    }else{
        document.getElementById('studentClass').style.display = 'block';
        document.getElementById('classLabel').style.display = 'block';
    }
}


async function addUser(){
    try{
        let classe
        if(document.getElementById('userType').value == 'teacher'){
            classe = "PROF"
        }else{
            classe = document.getElementById('studentClass').value
        }
        const userInfo = {
            name: document.getElementById('studentName').value,
            role: document.getElementById('userType').value,
            class: classe
        }
        if(!userInfo.name){
            showToast('Nome não pode ser vazio');
            return;
        }

        if(userInfo.role == 'student' && !userInfo.class){
            showToast('Turma não pode ser vazia');
            return;
        }

        fetch('/api/students/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        }).then(() => {
            showToast('Usuário adicionado com sucesso');
            closeModal('addStudentModal');
            setTimeout(() => window.location.reload(), 2000);
        })
        

    }catch(error){
        console.error('Erro ao adicionar usuário:', error);
        showToast('Erro ao adicionar usuário');
    }
}

async function editUser(){
    const user = {
        id: document.getElementById('editStudentId').value,
        name: document.getElementById('editStudentName').value,
        class: document.getElementById('editStudentClass').value,
    }

    if(!user.name){
        showToast('Nome não pode ser vazio');
        return;
    }
    if(!user.class){
        showToast('Turma não pode ser vazia');
        return;
    }

    fetch(`/api/students/edit/${user.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(() => {
        showToast('Usuário editado com sucesso');
        closeModal('editStudentModal');
        setTimeout(() => window.location.reload(), 2000);
    })
}

async function deleteUser(){
    try{
    const id = document.getElementById('deleteStudentId').value;
    fetch(`/api/students/delete/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => {
        showToast('Usuário deletado com sucesso');
        closeModal('deleteStudentModal');
        setTimeout(() => window.location.reload(), 2000);
    })
    }catch(error){
        console.error('Erro ao deletar usuário:', error);
        showToast('Erro ao deletar usuário');
    }
}
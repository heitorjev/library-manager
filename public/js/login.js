function fazerLogin(email, password){
    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    }).then(res => {
        if(res.status === 200){
            window.location.href = '/dash'
        } else {
            alert('Usuário ou senha inválidos')
        }
    })
}
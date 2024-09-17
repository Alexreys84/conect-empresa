document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const username = formData.get('username');
    const password = formData.get('password');

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Armazenar o token no localStorage
            localStorage.setItem('authToken', data.token);

            // Redirecionar para a página logado
            window.location.href = '/logado';
        } else {
            alert('Erro no login');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const loginForm = document.getElementById('loginForm');
 
    // Verificar se o formulário de registro existe
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function (e) {
            e.preventDefault();
 
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
 
            if (password !== confirmPassword) {
                document.getElementById('confirmPasswordError').textContent = 'As senhas não coincidem.';
                return;
            }
 
            // Enviar os dados para o servidor
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
 
            // Limpar mensagens de erro anteriores
            document.getElementById('confirmPasswordError').textContent = "";
 
            const result = await response.json();
            if (result.success) {
                // Redirecionar ou realizar outra ação
                window.location.href = '/join.html';
            } else {
                window.location.href = '/login-error';
            }
        });
    }
 
    // Verificar se o formulário de login existe
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evitar o envio padrão do formulário
 
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
 
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirecionar para uma página de sucesso
                    window.location.replace('/index.html')
                } else {
                    // Exibir mensagem de erro
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
        });
    }
});
// Seleciona o ícone do olho e o campo de senha
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');

// Adiciona o evento de clique ao ícone do olho
togglePassword.addEventListener('click', function () {
    // Alterna o tipo do input entre 'password' e 'text'
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Alterna o ícone entre olho aberto e fechado
    this.textContent = type === 'password' ? '👁️‍🗨️' : '🙈';
});

'use strict';

document.getElementById('loginBtn').addEventListener('click', async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Salvar token no localStorage
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = data.message;
        }
    } catch (err) {
        errorMessage.textContent = "Erro de conexão com o servidor.";
        console.error(err);
    }
});
